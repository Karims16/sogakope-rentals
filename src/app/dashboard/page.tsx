"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, House, Pencil, Plus, Trash2 } from "lucide-react";
import { getUnitCounts, unitAvailabilityLabel } from "@/lib/property-units";
import { supabase } from "@/lib/supabase";
import type { Property } from "@/types/database";

type ManagedListing = Pick<
  Property,
  | "id"
  | "title"
  | "location"
  | "landmark"
  | "price_per_month"
  | "status"
  | "is_available"
  | "total_units"
  | "available_units"
  | "created_at"
>;

function statusStyle(status: Property["status"]): string {
  if (status === "approved") return "bg-emerald-50 text-emerald-800";
  if (status === "rejected") return "bg-red-50 text-red-700";
  return "bg-amber-50 text-amber-800";
}

function statusLabel(status: Property["status"]): string {
  if (status === "approved") return "Approved / Live";
  if (status === "rejected") return "Rejected";
  return "Pending Review";
}

export default function LandlordDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [listings, setListings] = useState<ManagedListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [unitActionId, setUnitActionId] = useState<string | null>(null);

  const loadListings = useCallback(async (userId: string) => {
    if (!supabase) return;
    setIsLoading(true);
    setLoadError("");
    const { data, error } = await supabase
      .from("properties")
      .select("id,title,location,landmark,price_per_month,status,is_available,total_units,available_units,created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Unable to load the user's property listings:", error);
      setListings([]);
      setLoadError("We couldn't load your listings. Please try again.");
    } else {
      setListings((data ?? []) as ManagedListing[]);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!supabase) {
      setLoadError("Supabase is not configured, so your listings are unavailable.");
      setIsLoading(false);
      return;
    }

    const authClient = supabase;
    let active = true;
    const { data: authListener } = authClient.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      const nextUser = session?.user ?? null;
      setUser(nextUser);
      if (!nextUser) {
        setListings([]);
        setIsLoading(false);
      }
    });

    async function checkUser() {
      try {
        const { data, error } = await authClient.auth.getSession();
        if (!active) return;
        if (error) {
          console.error("Unable to check the current user:", error);
          setLoadError("We couldn't verify your sign-in. Please sign in again.");
          setUser(null);
          setIsLoading(false);
          return;
        }
        const currentUser = data.session?.user ?? null;
        setUser(currentUser);
        if (!currentUser) setIsLoading(false);
      } catch (error) {
        if (!active) return;
        console.error("Unable to check the current user:", error);
        setLoadError("We couldn't verify your sign-in. Please sign in again.");
        setUser(null);
        setIsLoading(false);
      }
    }

    void checkUser();
    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) void loadListings(user.id);
  }, [loadListings, user]);

  async function toggleAvailability(listing: ManagedListing) {
    if (!supabase || !user) return;
    setActionError("");
    const { available: currentAvailable, total } = getUnitCounts(
      listing.available_units,
      listing.total_units,
    );
    const available = currentAvailable > 0 ? 0 : total;
    const { error } = await supabase
      .from("properties")
      .update({ is_available: available > 0, available_units: available })
      .eq("id", listing.id)
      .eq("user_id", user.id);
    if (error) {
      console.error("Unable to update listing availability:", error);
      setActionError("We couldn't update availability. Please try again.");
      return;
    }
    setListings((current) =>
      current.map((item) =>
        item.id === listing.id
          ? { ...item, is_available: available > 0, available_units: available }
          : item,
      ),
    );
  }

  async function adjustAvailableUnits(listing: ManagedListing, change: -1 | 1) {
    if (!supabase || !user || unitActionId) return;
    const { available, total } = getUnitCounts(
      listing.available_units,
      listing.total_units,
    );
    const nextAvailable = Math.max(0, Math.min(total, available + change));
    if (nextAvailable === available) return;

    setActionError("");
    setUnitActionId(listing.id);
    try {
      let query = supabase
        .from("properties")
        .update({
          available_units: nextAvailable,
          is_available: nextAvailable > 0,
        })
        .eq("id", listing.id)
        .eq("user_id", user.id);
      query =
        listing.available_units == null
          ? query.is("available_units", null)
          : query.eq("available_units", listing.available_units);
      const { data, error } = await query.select("id").maybeSingle();

      if (error) throw error;
      if (!data) {
        setActionError("Availability changed elsewhere. Refresh your listings and try again.");
        return;
      }

      setListings((current) =>
        current.map((item) =>
          item.id === listing.id
            ? {
                ...item,
                available_units: nextAvailable,
                is_available: nextAvailable > 0,
              }
            : item,
        ),
      );
    } catch (error) {
      console.error("Unable to update available unit count:", error);
      setActionError("We couldn't update the available unit count. Please try again.");
    } finally {
      setUnitActionId(null);
    }
  }

  async function saveListing(event: FormEvent<HTMLFormElement>, listingId: string) {
    event.preventDefault();
    if (!supabase || !user) return;
    const formData = new FormData(event.currentTarget);
    const rent = Number(formData.get("rent"));
    const landmark = String(formData.get("landmark")).trim();
    const totalUnits = Number(formData.get("total_units"));
    if (
      !Number.isFinite(rent) ||
      rent <= 0 ||
      !landmark ||
      !Number.isInteger(totalUnits) ||
      totalUnits < 1
    ) {
      setActionError("Enter a valid monthly rent, unit count, and landmark.");
      return;
    }
    const listing = listings.find((item) => item.id === listingId);
    if (!listing) return;
    const currentUnits = getUnitCounts(
      listing.available_units,
      listing.total_units,
    );
    const occupiedUnits = Math.max(0, currentUnits.total - currentUnits.available);
    const availableUnits = Math.max(0, totalUnits - occupiedUnits);

    setActionError("");
    const { error } = await supabase
      .from("properties")
      .update({
        price_per_month: rent,
        landmark,
        total_units: totalUnits,
        available_units: availableUnits,
        is_available: availableUnits > 0,
        status: "pending",
      })
      .eq("id", listingId)
      .eq("user_id", user.id);
    if (error) {
      console.error("Unable to update listing details:", error);
      setActionError("We couldn't save the listing changes. Please try again.");
      return;
    }

    setListings((current) =>
      current.map((listing) =>
        listing.id === listingId
          ? {
              ...listing,
              price_per_month: rent,
              landmark,
              total_units: totalUnits,
              available_units: availableUnits,
              is_available: availableUnits > 0,
              status: "pending",
            }
          : listing,
      ),
    );
    setEditingId(null);
  }

  async function deleteListing(listing: ManagedListing) {
    if (!supabase || !user) return;
    if (!window.confirm("Delete this listing permanently?")) return;
    setActionError("");
    const { error } = await supabase
      .from("properties")
      .delete()
      .eq("id", listing.id)
      .eq("user_id", user.id);
    if (error) {
      console.error("Unable to delete property listing:", error);
      setActionError("We couldn't delete this listing. Please try again.");
      return;
    }
    setListings((current) => current.filter((item) => item.id !== listing.id));
  }

  async function signOut() {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Unable to sign out:", error);
      setActionError("We couldn't sign you out. Please try again.");
      return;
    }
    router.replace("/");
  }

  if (isLoading && !user) {
    return <main className="page-shell py-20 text-center text-sm text-slate-600">Checking your account...</main>;
  }

  if (!user) {
    return (
      <main className="page-shell py-16">
        <section className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-lg">
          <House aria-hidden="true" className="mx-auto text-blue-600" size={28} />
          <h1 className="mt-4 text-2xl font-bold text-slate-900">Sign in to view My Listings</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">Your property management portal is available to signed-in landlords and agents.</p>
          {loadError && <p className="mt-4 text-sm text-red-700" role="alert">{loadError}</p>}
          <div className="mt-6 flex justify-center gap-3">
            <Link className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700" href="/auth/login?next=%2Fdashboard">Sign In</Link>
            <Link className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50" href="/auth/signup?next=%2Fdashboard">Create Account</Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell py-8 sm:py-12">
      <header className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center">
        <div>
          <Link className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600" href="/">
            <ArrowLeft aria-hidden="true" size={15} />
            Marketplace
          </Link>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">My Listings</h1>
          <p className="mt-1 text-sm text-slate-600">Manage your submitted rental properties.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700" href="/submit">
            <Plus aria-hidden="true" size={17} />
            Post New Property
          </Link>
          <button className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50" onClick={() => void signOut()} type="button">
            Log Out
          </button>
        </div>
      </header>

      {(actionError || loadError) && (
        <p className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
          {actionError || loadError}
        </p>
      )}

      {isLoading ? (
        <p className="py-12 text-center text-sm text-slate-600">Loading your listings...</p>
      ) : listings.length === 0 ? (
        <section className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <h2 className="text-lg font-semibold text-slate-900">No listings yet</h2>
          <p className="mt-2 text-sm text-slate-600">Post your first property to get started.</p>
          <Link className="mt-5 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700" href="/submit">Post a Property</Link>
        </section>
      ) : (
        <ul className="mt-7 grid gap-4 lg:grid-cols-2">
          {listings.map((listing) => (
            <li className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" key={listing.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{listing.title}</h2>
                  <p className="mt-1 text-sm text-slate-600">{listing.location} · {listing.landmark}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(listing.status)}`}>
                  {statusLabel(listing.status)}
                </span>
              </div>
              <p className="mt-4 text-xl font-bold text-slate-900">
                GH₵ {listing.price_per_month.toLocaleString("en-GH")}
                <span className="ml-1 text-sm font-normal text-slate-500">/ month</span>
              </p>
              <p className={`mt-2 text-sm font-semibold ${
                getUnitCounts(listing.available_units, listing.total_units).available > 0
                  ? "text-emerald-700"
                  : "text-red-700"
              }`}>
                {unitAvailabilityLabel(listing.available_units, listing.total_units)}
              </p>
              {editingId === listing.id ? (
                <form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={(event) => void saveListing(event, listing.id)}>
                  <p className="text-xs leading-5 text-slate-500 sm:col-span-2">Changes to rent or location are sent back for review.</p>
                  <label className="text-xs font-semibold text-slate-600">
                    Monthly rent (GH₵)
                    <input className="mt-1 min-h-10 w-full rounded-lg border border-slate-300 px-3 text-sm font-normal text-slate-900" defaultValue={listing.price_per_month} min="1" name="rent" required type="number" />
                  </label>
                  <label className="text-xs font-semibold text-slate-600">
                    Landmark
                    <input className="mt-1 min-h-10 w-full rounded-lg border border-slate-300 px-3 text-sm font-normal text-slate-900" defaultValue={listing.landmark} maxLength={200} name="landmark" required />
                  </label>
                  <label className="text-xs font-semibold text-slate-600">
                    Total Units Available
                    <input className="mt-1 min-h-10 w-full rounded-lg border border-slate-300 px-3 text-sm font-normal text-slate-900" defaultValue={getUnitCounts(listing.available_units, listing.total_units).total} min="1" name="total_units" required type="number" />
                  </label>
                  <div className="flex gap-2 sm:col-span-2">
                    <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700" type="submit">Save Changes</button>
                    <button className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" onClick={() => setEditingId(null)} type="button">Cancel</button>
                  </div>
                </form>
              ) : (
                <div className="mt-5 flex flex-wrap gap-2">
                  <button className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50" disabled={unitActionId !== null || getUnitCounts(listing.available_units, listing.total_units).available <= 0} onClick={() => void adjustAvailableUnits(listing, -1)} type="button">
                    -1 Unit Taken
                  </button>
                  <button className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50" disabled={unitActionId !== null || getUnitCounts(listing.available_units, listing.total_units).available >= getUnitCounts(listing.available_units, listing.total_units).total} onClick={() => void adjustAvailableUnits(listing, 1)} type="button">
                    +1 Unit Available
                  </button>
                  <button className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50" onClick={() => void toggleAvailability(listing)} type="button">
                    {getUnitCounts(listing.available_units, listing.total_units).available > 0 ? "Mark as Rented / Unavailable" : "Mark as Available"}
                  </button>
                  <button className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50" onClick={() => setEditingId(listing.id)} type="button">
                    <Pencil aria-hidden="true" size={13} /> Edit Details
                  </button>
                  <button className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50" onClick={() => void deleteListing(listing)} type="button">
                    <Trash2 aria-hidden="true" size={13} /> Delete Listing
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
