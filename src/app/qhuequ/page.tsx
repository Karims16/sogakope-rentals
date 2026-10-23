"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  CalendarDays,
  Check,
  CircleAlert,
  Clock3,
  LockKeyhole,
  MapPin,
  MessageSquareWarning,
  RefreshCw,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Property, PropertyReport } from "@/types/database";

type ListingStatus = Property["status"];
type DashboardView = "pending" | "approved" | "rejected" | "reports";

type ModerationListing = {
  id: string;
  title: string;
  location: string;
  rent: number;
  landlordName: string;
  landlordPhone: string;
  landlordWhatsapp: string;
  status: string;
  isAvailable: boolean;
  submittedAt: string;
};

type ModerationReport = {
  id: string;
  propertyId: string;
  reason: string;
  details: string;
  contactEmail: string;
  reporterPhone: string | null;
  submittedAt: string;
  status: "pending" | "resolved";
};

const currency = new Intl.NumberFormat("en-GH", {
  style: "currency",
  currency: "GHS",
  maximumFractionDigits: 0,
});

const viewLabels: Record<DashboardView, string> = {
  pending: "Pending Review",
  approved: "Approved / Live",
  rejected: "Rejected / Inactive",
  reports: "Reports",
};

const dateFormatter = new Intl.DateTimeFormat("en-GH", {
  dateStyle: "medium",
  timeStyle: "short",
});

function formatDate(value: string): string {
  return dateFormatter.format(new Date(value));
}

function mapReport(report: PropertyReport): ModerationReport {
  return {
    id: String(report.id),
    propertyId: String(report.property_id),
    reason: report.reason,
    details: report.details,
    contactEmail: report.contact_email,
    reporterPhone: report.contact_phone ?? null,
    submittedAt: report.created_at,
    status: report.status ?? "pending",
  };
}

function MetricCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: typeof Building2;
  tone: string;
}) {
  return (
    <article className="rounded-[20px] border border-[#e7e9e2] bg-white p-5 sm:p-6">
      <span className={`flex size-10 items-center justify-center rounded-xl ${tone}`}>
        <Icon aria-hidden="true" size={19} />
      </span>
      <p className="mt-5 text-3xl font-extrabold tracking-[-0.055em] text-[#172b27]">
        {value}
      </p>
      <h2 className="mt-1 text-sm font-medium text-[#687672]">{label}</h2>
    </article>
  );
}

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessKey, setAccessKey] = useState("");
  const [authError, setAuthError] = useState("");
  const [properties, setProperties] = useState<Property[]>([]);
  const [reports, setReports] = useState<ModerationReport[]>([]);
  const [isLoading, setIsLoading] = useState(Boolean(supabase));
  const [refreshVersion, setRefreshVersion] = useState(0);
  const [loadMessage, setLoadMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<DashboardView>("pending");

  useEffect(() => {
    if (sessionStorage.getItem("admin_authenticated") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    let isCurrent = true;

    async function loadDashboard() {
      setIsLoading(true);
      setActionError("");

      if (!supabase) {
        setProperties([]);
        setReports([]);
        setLoadMessage("Supabase is not configured. Admin data is unavailable.");
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("properties")
          .select("*")
          .order("created_at", { ascending: false });
        const reportsResult = await supabase
          .from("property_reports")
          .select("*")
          .order("created_at", { ascending: false });

        if (!isCurrent) return;

        const messages: string[] = [];
        if (error) {
          console.error("Unable to load admin properties:", error);
          setProperties([]);
          messages.push("Property records could not be loaded.");
        } else {
          setProperties((data as Property[] | null) || []);
        }

        if (reportsResult.error) {
          console.error("Unable to load property reports:", reportsResult.error);
          setReports([]);
          messages.push("Visitor reports could not be loaded.");
        } else {
          setReports(
            ((reportsResult.data as PropertyReport[] | null) || []).map(mapReport),
          );
        }

        setLoadMessage(messages.join(" "));
      } catch (error) {
        if (!isCurrent) return;
        console.error("Unable to reach the admin data service:", error);
        setProperties([]);
        setReports([]);
        setLoadMessage("The admin data service is unavailable.");
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }

    void loadDashboard();
    return () => {
      isCurrent = false;
    };
  }, [isAuthenticated, refreshVersion]);

  function unlockDashboard(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthError("");

    const expectedAccessKey = process.env.NEXT_PUBLIC_ADMIN_ACCESS_KEY;
    if (!expectedAccessKey) {
      setAuthError("Admin access key is not configured.");
      return;
    }

    if (accessKey !== expectedAccessKey) {
      setAuthError("The access key is incorrect. Please try again.");
      return;
    }

    sessionStorage.setItem("admin_authenticated", "true");
    setAccessKey("");
    setIsAuthenticated(true);
  }

  function lockDashboard() {
    sessionStorage.removeItem("admin_authenticated");
    setIsAuthenticated(false);
    setProperties([]);
    setReports([]);
    setLoadMessage("");
    setActionError("");
  }

  const metrics = useMemo(
    () => ({
      total: properties.length,
      pending: properties.filter(
        (property) => property.status?.toLowerCase().trim() === "pending",
      ).length,
      approved: properties.filter(
        (property) => property.status?.toLowerCase().trim() === "approved",
      ).length,
      rejected: properties.filter(
        (property) => property.status?.toLowerCase().trim() === "rejected",
      ).length,
      reported: reports.filter((report) => report.status === "pending").length,
    }),
    [properties, reports],
  );

  const visibleListings = properties.filter((property) => {
    const status = property.status?.toLowerCase().trim();
    if (activeView === "pending") return status === "pending";
    if (activeView === "approved") return status === "approved";
    if (activeView === "rejected") return status === "rejected";
    return false;
  }).map((property) => ({
    id: String(property.id),
    title: property.title,
    location: property.location,
    rent: property.price_per_month,
    landlordName: property.landlord_name,
    landlordPhone: property.landlord_phone,
    landlordWhatsapp: property.landlord_whatsapp,
    status: property.status?.toLowerCase().trim() ?? "",
    isAvailable: property.is_available,
    submittedAt: property.created_at,
  }));

  async function updateListing(
    id: string,
    update: { status?: ListingStatus; is_available?: boolean },
  ) {
    setActionError("");
    if (!supabase) {
      setActionError("Supabase is not configured. The listing could not be updated.");
      return;
    }

    setBusyId(id);
    try {
      const { error } = await supabase
        .from("properties")
        .update(update)
        .eq("id", id);

      if (error) {
        console.error("Property moderation update failed:", error);
        setActionError(
          "The update was denied or could not be saved. Check the administrator session and Supabase RLS policies.",
        );
        return;
      }

      setProperties((current) =>
        current.map((property) =>
          String(property.id) === id ? { ...property, ...update } : property,
        ),
      );

      if (update.status === "approved") {
        try {
          const notificationResponse = await fetch("/api/properties/notify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
          });
          if (!notificationResponse.ok) {
            const result = (await notificationResponse.json()) as { error?: string };
            console.error("Approved listing subscriber notification failed:", result.error);
            setActionError(
              result.error ??
                "The listing was approved, but subscriber emails could not be sent.",
            );
          }
        } catch (error) {
          console.error("Unable to request subscriber notification:", error);
          setActionError(
            "The listing was approved, but subscriber emails could not be sent.",
          );
        }
      }
    } catch (error) {
      console.error("Unable to reach the listing moderation service:", error);
      setActionError("The listing update could not reach Supabase. Try again.");
    } finally {
      setBusyId(null);
    }
  }

  async function approveListing(id: string) {
    await updateListing(id, { status: "approved" });
  }

  async function rejectListing(id: string) {
    await updateListing(id, { status: "rejected" });
  }

  function toggleAvailability(listing: ModerationListing) {
    void updateListing(listing.id, { is_available: !listing.isAvailable });
  }

  async function deleteListing(id: string) {
    if (!window.confirm("Delete this listing permanently?")) return;

    setActionError("");
    if (!supabase) {
      setActionError("Supabase is not configured. The listing could not be deleted.");
      return;
    }

    setBusyId(id);
    try {
      const { error } = await supabase
        .from("properties")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Property deletion failed:", error);
        setActionError(
          "The listing could not be deleted. Check the administrator session and Supabase RLS policies.",
        );
        return;
      }

      setProperties((current) =>
        current.filter((property) => String(property.id) !== id),
      );
    } catch (error) {
      console.error("Unable to reach the listing deletion service:", error);
      setActionError("The listing deletion could not reach Supabase. Try again.");
    } finally {
      setBusyId(null);
    }
  }

  async function resolveReport(id: string) {
    setActionError("");
    if (!supabase) {
      setActionError("Supabase is not configured. The report could not be updated.");
      return;
    }

    setBusyId(`report-${id}`);
    try {
      const { error } = await supabase
        .from("property_reports")
        .update({ status: "resolved" })
        .eq("id", id);

      if (error) {
        console.error("Property report resolution failed:", error);
        setActionError("The report could not be marked resolved. Please try again.");
        return;
      }

      setReports((current) =>
        current.map((report) =>
          report.id === id ? { ...report, status: "resolved" } : report,
        ),
      );
    } catch (error) {
      console.error("Unable to reach the report moderation service:", error);
      setActionError("The report could not reach Supabase. Try again.");
    } finally {
      setBusyId(null);
    }
  }

  const unresolvedReports = reports.filter((report) => report.status === "pending");

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f8f4] px-4 py-12">
        <section className="w-full max-w-md rounded-[24px] border border-[#e7e9e2] bg-white p-6 shadow-[0_18px_50px_-38px_rgba(23,43,39,0.35)] sm:p-8">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#edf3e8] text-[#176b50]">
            <ShieldCheck aria-hidden="true" size={28} />
          </span>
          <h1 className="mt-5 text-center text-2xl font-semibold tracking-[-0.05em] text-[#172b27]">
            Sogakope Rentals Admin Portal
          </h1>
          <p className="mt-2 text-center text-sm leading-6 text-[#687672]">
            Enter the admin access key to manage listings and reports.
          </p>

          <form className="mt-6 space-y-4" onSubmit={unlockDashboard}>
            <label className="block text-sm font-semibold text-[#33413b]">
              Admin access key
              <input
                autoComplete="current-password"
                className="mt-1.5 min-h-12 w-full rounded-xl border border-[#d9ddcf] bg-white px-3.5 text-sm font-normal outline-none transition focus:border-[#176b50] focus:ring-2 focus:ring-[#176b50]/15"
                onChange={(event) => setAccessKey(event.target.value)}
                placeholder="Enter access key..."
                type="password"
                value={accessKey}
              />
            </label>
            {authError && (
              <p
                aria-live="assertive"
                className="rounded-xl border border-[#f1ccc4] bg-white px-4 py-3 text-sm text-[#8b332a]"
                role="alert"
              >
                {authError}
              </p>
            )}
            <button
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#176b50] px-5 text-sm font-bold text-white transition hover:bg-[#10533e]"
              type="submit"
            >
              <LockKeyhole aria-hidden="true" size={17} />
              Unlock Dashboard
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell py-8 sm:py-12">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <Link
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#53625d] transition hover:text-[#176b50]"
            href="/"
          >
            <ArrowLeft aria-hidden="true" size={16} />
            Back to marketplace
          </Link>
          <h1 className="mt-5 text-3xl font-semibold tracking-[-0.06em] text-[#172b27] sm:text-[40px]">
            Admin dashboard
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#687672]">
            Review listing submissions and visitor reports.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            className="inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-full border border-[#d7ded4] px-5 text-sm font-bold text-[#53625d] transition hover:bg-white"
            onClick={lockDashboard}
            type="button"
          >
            <LockKeyhole aria-hidden="true" size={16} />
            Lock / Log Out
          </button>
          <button
            className="inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-full border border-[#d7ded4] px-5 text-sm font-bold text-[#176b50] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isLoading}
            onClick={() => setRefreshVersion((version) => version + 1)}
            type="button"
          >
            <RefreshCw
              aria-hidden="true"
              className={isLoading ? "animate-spin" : ""}
              size={16}
            />
            {isLoading ? "Refreshing…" : "Refresh"}
          </button>
          <Link
            className="inline-flex min-h-11 w-fit items-center justify-center rounded-full border border-[#d7ded4] px-5 text-sm font-bold text-[#176b50] transition hover:bg-white"
            href="/submit"
          >
            Submit a listing
          </Link>
        </div>
      </div>

      {(loadMessage || actionError) && (
        <p
          aria-live="polite"
          className={`mt-4 rounded-xl border px-4 py-3 text-sm leading-6 ${
            actionError
              ? "border-[#f1ccc4] bg-white text-[#8b332a]"
              : "border-[#eadfbd] bg-[#fffaf0] text-[#635b49]"
          }`}
          role={actionError ? "alert" : "status"}
        >
          {actionError || loadMessage}
        </p>
      )}

      <section
        aria-label="Marketplace overview"
        className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
      >
        <MetricCard
          icon={Building2}
          label="Total listings"
          tone="bg-[#edf3e8] text-[#176b50]"
          value={metrics.total}
        />
        <MetricCard
          icon={Clock3}
          label="Pending reviews"
          tone="bg-[#fff3dc] text-[#9b6b1e]"
          value={metrics.pending}
        />
        <MetricCard
          icon={BadgeCheck}
          label="Approved listings"
          tone="bg-[#e7f3e5] text-[#176b50]"
          value={metrics.approved}
        />
        <MetricCard
          icon={X}
          label="Rejected listings"
          tone="bg-[#f6e9e7] text-[#9b443b]"
          value={metrics.rejected}
        />
        <MetricCard
          icon={MessageSquareWarning}
          label="Unresolved reports"
          tone="bg-[#f6e9e7] text-[#9b443b]"
          value={metrics.reported}
        />
      </section>

      <section className="mt-10">
        <div className="flex flex-wrap gap-2 border-b border-[#e7e9e2] pb-3">
          {(Object.keys(viewLabels) as DashboardView[]).map((view) => {
            const count =
              view === "pending"
                ? metrics.pending
                : view === "approved"
                  ? metrics.approved
                  : view === "rejected"
                    ? metrics.rejected
                    : unresolvedReports.length;

            return (
              <button
                aria-pressed={activeView === view}
                className={`inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold transition ${
                  activeView === view
                    ? "bg-[#176b50] text-white"
                    : "bg-white text-[#53625d] hover:bg-[#edf3e8]"
                }`}
                key={view}
                onClick={() => setActiveView(view)}
                type="button"
              >
                {viewLabels[view]}
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] ${
                    activeView === view
                      ? "bg-white/20 text-white"
                      : "bg-[#edf0e9] text-[#53625d]"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {activeView === "reports" ? (
          <div className="mt-5 space-y-4">
            <p className="text-xs text-[#87908a]">
              Reports and their review status are loaded from Supabase.
            </p>
            {unresolvedReports.length > 0 ? (
              unresolvedReports.map((report) => {
                const property = properties.find(
                  (item) => String(item.id) === report.propertyId,
                );
                return (
                  <article
                    className="rounded-[20px] border border-[#e7e9e2] bg-white p-5 sm:p-6"
                    key={report.id}
                  >
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                      <div>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fff3dc] px-3 py-1 text-xs font-bold text-[#8a641f]">
                          <CircleAlert aria-hidden="true" size={14} />
                          {report.reason}
                        </span>
                        <h2 className="mt-3 text-lg font-bold text-[#172b27]">
                          {property?.title ?? "Listing no longer available"}
                        </h2>
                        {property && (
                          <p className="mt-1 flex items-center gap-1.5 text-sm text-[#687672]">
                            <MapPin aria-hidden="true" size={15} />
                            {property.location}
                          </p>
                        )}
                        {report.contactEmail && (
                          <p className="mt-2 text-xs text-[#687672]">
                            Reporter: {report.contactEmail}
                          </p>
                        )}
                        {report.reporterPhone && (
                          <p className="mt-1 text-xs text-[#687672]">
                            Phone: {report.reporterPhone}
                          </p>
                        )}
                        {report.details && (
                          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#53625d]">
                            {report.details}
                          </p>
                        )}
                        <p className="mt-3 flex items-center gap-1.5 text-xs text-[#87908a]">
                          <CalendarDays aria-hidden="true" size={14} />
                          Report received {formatDate(report.submittedAt)}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-wrap gap-2">
                        <button
                          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[#d7ded4] px-4 text-sm font-bold text-[#176b50] transition hover:bg-[#f2f6ee] disabled:cursor-not-allowed disabled:opacity-60"
                          disabled={busyId === `report-${report.id}`}
                          onClick={() => void resolveReport(report.id)}
                          type="button"
                        >
                          <Check aria-hidden="true" size={16} />
                          Mark Resolved / Dismiss
                        </button>
                        <button
                          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[#ebc7c0] px-4 text-sm font-bold text-[#9b443b] transition hover:bg-[#fff5f2] disabled:cursor-not-allowed disabled:opacity-60"
                          disabled={
                            busyId === report.propertyId ||
                            !properties.some(
                              (item) => String(item.id) === report.propertyId,
                            )
                          }
                          onClick={() => void rejectListing(report.propertyId)}
                          type="button"
                        >
                          <X aria-hidden="true" size={16} />
                          Unpublish / Reject Property
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="mt-5 rounded-[20px] border border-dashed border-[#cfd8cd] bg-white px-6 py-12 text-center">
                <Check
                  aria-hidden="true"
                  className="mx-auto text-[#176b50]"
                  size={24}
                />
                <h2 className="mt-3 font-bold text-[#172b27]">
                  {isLoading ? "Loading reports…" : "No reports to review"}
                </h2>
                {!isLoading && (
                  <p className="mt-2 text-sm text-[#687672]">
                    No visitor reports are waiting for review.
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            <p className="text-xs text-[#87908a]">
              Contact information is visible here only when your Supabase Row
              Level Security policy grants this session access.
            </p>
            {visibleListings.length > 0 ? (
              visibleListings.map((listing) => (
                <article
                  className="rounded-[20px] border border-[#e7e9e2] bg-white p-5 sm:p-6"
                  key={listing.id}
                >
                  <div className="flex flex-col justify-between gap-5 lg:flex-row">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            listing.status === "pending"
                              ? "bg-[#fff3dc] text-[#8a641f]"
                              : listing.status === "approved"
                                ? "bg-[#e7f3e5] text-[#176b50]"
                                : "bg-[#f6e9e7] text-[#9b443b]"
                          }`}
                        >
                          {listing.status === "pending"
                            ? "Pending review"
                            : listing.status === "approved"
                              ? "Approved"
                              : "Rejected"}
                        </span>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            listing.isAvailable
                              ? "bg-[#edf3e8] text-[#176b50]"
                              : "bg-[#f1efe8] text-[#746c59]"
                          }`}
                        >
                          {listing.isAvailable ? "Available" : "Rented out"}
                        </span>
                      </div>

                      <h2 className="mt-4 text-xl font-bold tracking-[-0.03em] text-[#172b27]">
                        {listing.title}
                      </h2>
                      <p className="mt-1.5 flex items-center gap-1.5 text-sm text-[#687672]">
                        <MapPin aria-hidden="true" size={15} />
                        {listing.location}
                      </p>
                      <p className="mt-4 text-lg font-extrabold text-[#176b50]">
                        {currency.format(listing.rent)}
                        <span className="ml-1 text-xs font-medium text-[#687672]">
                          / month
                        </span>
                      </p>

                      <div className="mt-4 grid gap-2 text-sm text-[#53625d] sm:grid-cols-2">
                        <p>
                          Landlord / agent:{" "}
                          <span className="font-medium">
                            {listing.landlordName || "Not provided"}
                          </span>
                        </p>
                        <p>
                          Phone / WhatsApp:{" "}
                          <span className="font-medium">
                            {listing.landlordPhone || listing.landlordWhatsapp
                              ? [listing.landlordPhone, listing.landlordWhatsapp]
                                  .filter(Boolean)
                                  .join(" / ")
                              : "Not provided"}
                          </span>
                        </p>
                      </div>
                      <p className="mt-3 flex items-center gap-1.5 text-xs text-[#87908a]">
                        <CalendarDays aria-hidden="true" size={14} />
                        Submitted {formatDate(listing.submittedAt)}
                      </p>
                    </div>

                    <div className="flex flex-wrap content-start gap-2 lg:w-56 lg:justify-end">
                      {listing.status !== "approved" && (
                        <button
                          className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full bg-[#176b50] px-4 text-sm font-bold text-white transition hover:bg-[#10533e] disabled:cursor-not-allowed disabled:opacity-60"
                          disabled={busyId === listing.id}
                          onClick={() => void approveListing(listing.id)}
                          type="button"
                        >
                          <Check aria-hidden="true" size={15} />
                          Approve
                        </button>
                      )}
                      {listing.status !== "rejected" && (
                        <button
                          className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full border border-[#ebc7c0] px-4 text-sm font-bold text-[#9b443b] transition hover:bg-[#fff5f2] disabled:cursor-not-allowed disabled:opacity-60"
                          disabled={busyId === listing.id}
                          onClick={() => void rejectListing(listing.id)}
                          type="button"
                        >
                          <X aria-hidden="true" size={15} />
                          Reject
                        </button>
                      )}
                      <button
                        className="min-h-10 rounded-full border border-[#d7ded4] px-4 text-sm font-bold text-[#53625d] transition hover:bg-[#f2f6ee] disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={busyId === listing.id}
                        onClick={() => toggleAvailability(listing)}
                        type="button"
                      >
                        {listing.isAvailable
                          ? "Mark rented out"
                          : "Mark available"}
                      </button>
                      <button
                        className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full border border-[#ebc7c0] px-4 text-sm font-bold text-[#9b443b] transition hover:bg-[#fff5f2] disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={busyId === listing.id}
                        onClick={() => void deleteListing(listing.id)}
                        type="button"
                      >
                        <Trash2 aria-hidden="true" size={15} />
                        Delete
                      </button>
                    </div>
                  </div>

                </article>
              ))
            ) : (
              <div className="rounded-[20px] border border-dashed border-[#cfd8cd] bg-white px-6 py-12 text-center">
                <Check
                  aria-hidden="true"
                  className="mx-auto text-[#176b50]"
                  size={24}
                />
                <h2 className="mt-3 font-bold text-[#172b27]">
                  {isLoading ? "Loading listings…" : "Nothing in this queue"}
                </h2>
                {!isLoading && (
                  <p className="mt-2 text-sm text-[#687672]">
                    Listings in this view will appear here.
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </section>

      <p className="mt-10 text-center text-xs leading-5 text-[#87908a]">
        Updates to database listings are enforced by Supabase RLS. Report
        review state remains local because the reports table has no review-status
        field.
      </p>
    </main>
  );
}
