import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export const runtime = "nodejs";

type ApprovedProperty = {
  id: string;
  title: string;
  location: string;
  price_per_month: number;
  status: string;
  subscriber_notification_sent_at: string | null;
};

const subscriberPageSize = 1000;
const resendBatchSize = 100;

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "A valid listing ID is required." }, { status: 400 });
  }

  const id =
    payload && typeof payload === "object" && "id" in payload &&
    typeof payload.id === "string"
      ? payload.id.trim()
      : "";
  if (!id || id.length > 100) {
    return NextResponse.json({ error: "A valid listing ID is required." }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!supabaseUrl || !serviceRoleKey || !resendApiKey) {
    console.error("Listing notification delivery is not configured.");
    return NextResponse.json(
      { error: "Listing notification delivery is temporarily unavailable." },
      { status: 503 },
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  let claimTimestamp: string | null = null;
  try {
    const { data: propertyData, error: propertyError } = await supabase
      .from("properties")
      .select("id, title, location, price_per_month, status, subscriber_notification_sent_at")
      .eq("id", id)
      .maybeSingle();

    if (propertyError) throw propertyError;
    if (!propertyData) {
      return NextResponse.json({ error: "Listing not found." }, { status: 404 });
    }

    const property = propertyData as ApprovedProperty;
    if (property.status !== "approved") {
      return NextResponse.json(
        { error: "Only approved listings can be sent to subscribers." },
        { status: 409 },
      );
    }
    if (property.subscriber_notification_sent_at) {
      return NextResponse.json({ success: true, alreadySent: true });
    }

    claimTimestamp = new Date().toISOString();
    const { data: claimedProperty, error: claimError } = await supabase
      .from("properties")
      .update({ subscriber_notification_sent_at: claimTimestamp })
      .eq("id", id)
      .eq("status", "approved")
      .is("subscriber_notification_sent_at", null)
      .select("id")
      .maybeSingle();

    if (claimError) throw claimError;
    if (!claimedProperty) {
      return NextResponse.json({ success: true, alreadySent: true });
    }

    const subscriberEmails: string[] = [];
    for (let offset = 0; ; offset += subscriberPageSize) {
      const { data, error } = await supabase
        .from("subscribers")
        .select("email")
        .order("email")
        .range(offset, offset + subscriberPageSize - 1);
      if (error) throw error;

      const page = data ?? [];
      subscriberEmails.push(...page.map((subscriber) => subscriber.email));
      if (page.length < subscriberPageSize) break;
    }

    const siteUrl = (
      process.env.NEXT_PUBLIC_SITE_URL || "https://sogakope-rentals.vercel.app"
    ).replace(/\/$/, "");
    const listingUrl = `${siteUrl}/properties/${encodeURIComponent(property.id)}`;
    const price = new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      maximumFractionDigits: 0,
    }).format(property.price_per_month);
    const safeTitle = escapeHtml(property.title);
    const safeLocation = escapeHtml(property.location);
    const resend = new Resend(resendApiKey);

    for (let offset = 0; offset < subscriberEmails.length; offset += resendBatchSize) {
      const batch = subscriberEmails.slice(offset, offset + resendBatchSize);
      const { error } = await resend.batch.send(
        batch.map((email) => ({
          from: "Sogakope Rentals <onboarding@resend.dev>",
          to: email,
          subject: `New rental listing: ${property.title}`,
          text: `A new rental listing is available on Sogakope Rentals.\n\n${property.title}\nLocation: ${property.location}\nPrice: ${price} per month\n\nView this listing: ${listingUrl}`,
          html: `<p>A new rental listing is available on Sogakope Rentals.</p><h2>${safeTitle}</h2><p><strong>Location:</strong> ${safeLocation}<br><strong>Price:</strong> ${escapeHtml(price)} per month</p><p><a href="${escapeHtml(listingUrl)}">View this listing</a></p>`,
        })),
      );
      if (error) throw new Error(error.message);
    }

    return NextResponse.json({ success: true, recipientCount: subscriberEmails.length });
  } catch (error) {
    if (claimTimestamp) {
      const { error: releaseError } = await supabase
        .from("properties")
        .update({ subscriber_notification_sent_at: null })
        .eq("id", id)
        .eq("subscriber_notification_sent_at", claimTimestamp);
      if (releaseError) {
        console.error("Unable to release listing notification claim:", releaseError);
      }
    }
    console.error("Unable to notify subscribers about an approved listing:", error);
    return NextResponse.json(
      { error: "The listing was approved, but subscriber emails could not be sent." },
      { status: 502 },
    );
  }
}
