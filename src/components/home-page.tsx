"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ChevronDown,
  House,
  Heart,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Search,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { demoProperties, type DemoProperty } from "@/lib/demo-properties";
import { phoneHref, whatsappHref } from "@/lib/contact-links";
import ReportListingForm from "@/components/report-listing-form";
import Footer from "@/components/footer";
import { supabase } from "@/lib/supabase";
import { getUnitCounts, unitAvailabilityLabel } from "@/lib/property-units";
import type { Property } from "@/types/database";

type PublicProperty = Pick<
  Property,
  | "id"
  | "title"
  | "property_type"
  | "location"
  | "landmark"
  | "price_per_month"
  | "total_units"
  | "available_units"
  | "bedrooms"
  | "bathrooms"
  | "images"
  | "amenities"
  | "water_source"
  | "water_sources"
  | "meter_type"
  | "is_featured"
  | "landlord_phone"
  | "landlord_whatsapp"
>;

type MarketplaceListing = {
  id: string;
  title: string;
  location: string;
  landmark: string;
  type: string;
  rent: number;
  totalUnits: number;
  availableUnits: number;
  beds: number;
  baths: number;
  art: string;
  accent: string;
  images: string[];
  amenities: string[];
  waterSource: string | null;
  meterType: string | null;
  isFeatured: boolean;
  landlordPhone: string;
  landlordWhatsapp: string;
  isDemo: boolean;
};

function fromDemoProperty(property: DemoProperty): MarketplaceListing {
  return {
    id: String(property.id),
    title: property.title,
    location: property.location,
    landmark: property.landmark,
    type: property.type,
    rent: property.rent,
    totalUnits: 1,
    availableUnits: 1,
    beds: property.beds,
    baths: property.baths,
    art: property.art,
    accent: property.accent,
    images: [],
    amenities: property.amenities,
    waterSource: null,
    meterType: null,
    isFeatured: false,
    landlordPhone: "",
    landlordWhatsapp: "",
    isDemo: true,
  };
}

function fromProperty(property: PublicProperty): MarketplaceListing {
  const units = getUnitCounts(property.available_units, property.total_units);
  return {
    id: property.id,
    title: property.title,
    location: property.location,
    landmark: property.landmark,
    type: property.property_type,
    rent: property.price_per_month,
    totalUnits: units.total,
    availableUnits: units.available,
    beds: property.bedrooms,
    baths: property.bathrooms,
    art: "listing-art-one",
    accent: "bg-[#e1efd3]",
    images: property.images ?? [],
    amenities: property.amenities ?? [],
    waterSource:
      property.water_sources?.join(", ") || property.water_source || null,
    meterType: property.meter_type ?? null,
    isFeatured: property.is_featured,
    landlordPhone: property.landlord_phone,
    landlordWhatsapp: property.landlord_whatsapp,
    isDemo: false,
  };
}

const currency = new Intl.NumberFormat("en-GH", {
  style: "currency",
  currency: "GHS",
  maximumFractionDigits: 0,
});

function formatUtility(value: string): string {
  const labels: Record<string, string> = {
    gwcl: "GWCL",
    borehole: "Borehole",
    polytank: "Polytank",
    personal_prepaid: "Personal prepaid",
    shared_prepaid: "Shared prepaid",
    personal_postpaid: "Personal postpaid",
    shared_postpaid: "Shared postpaid",
  };
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => labels[item.toLowerCase()] ?? item)
    .join(", ");
}

function Brand() {
  return (
    <Link
      aria-label="Sogakope Rentals home"
      className="group flex items-center gap-3"
      href="/"
    >
      <div className="relative size-10 shrink-0 overflow-hidden rounded-full border border-slate-200/80 shadow-sm transition-transform group-hover:scale-[1.03]">
        <Image
          alt="Sogakope Rentals"
          className="object-cover"
          fill
          priority
          sizes="40px"
          src="/logo-round.png"
        />
      </div>
      <div className="flex flex-col">
        <span className="text-base font-extrabold leading-none tracking-tight text-slate-900">
          Sogakope
        </span>
        <span className="mt-1 text-sm font-bold leading-none text-blue-600">
          Rentals
        </span>
      </div>
    </Link>
  );
}

function ListingCard({ listing }: { listing: MarketplaceListing }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const hasAvailableUnits = listing.availableUnits > 0;
  const whatsappNumber = listing.landlordWhatsapp || listing.landlordPhone;
  const callNumber = listing.landlordPhone || listing.landlordWhatsapp;
  const waterSource =
    listing.waterSource ??
    listing.amenities.find((amenity) =>
      /water|gwcl|borehole|polytank/i.test(amenity),
    ) ??
    "Not specified";
  const meterType =
    listing.meterType ??
    listing.amenities.find((amenity) =>
      /meter|prepaid|postpaid/i.test(amenity),
    ) ??
    "Not specified";
  const propertyType = listing.type
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

  return (
    <article className="group relative overflow-hidden rounded-[20px] border border-slate-200 bg-white transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_48px_-24px_rgba(23,43,39,0.18)]">
      <button
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        aria-pressed={isFavorite}
        className={`absolute right-3 top-3 z-10 flex size-10 items-center justify-center rounded-full bg-white text-slate-500 shadow-md transition hover:text-blue-600 ${
          isFavorite ? "text-blue-600" : ""
        }`}
        onClick={() => setIsFavorite((current) => !current)}
        type="button"
      >
        <Heart aria-hidden="true" fill={isFavorite ? "currentColor" : "none"} size={19} />
      </button>
      <Link
        aria-label={`View details for ${listing.title}`}
        className="block focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-blue-600"
        href={`/properties/${listing.id}`}
      >
        <div
          aria-label={
            listing.images[0]
              ? `Photo of ${listing.title}`
              : "Illustrative house artwork; not a photograph of a listed property"
          }
          className={`listing-art ${listing.art} flex h-[190px] items-center justify-center`}
          role="img"
        >
          {listing.images[0] ? (
            <Image
              alt={`Photo of ${listing.title}`}
              className="object-cover"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              src={listing.images[0]}
              unoptimized
            />
          ) : (
            <>
              <span className="relative flex h-[95px] w-[128px] items-end justify-center rounded-t-[6px] border-[5px] border-white bg-[#f8f4e9] shadow-[10px_10px_0_rgba(23,43,39,0.08)]">
                <span className="absolute -top-[37px] left-[-10px] h-[48px] w-[138px] bg-[#176b50] [clip-path:polygon(50%_0,100%_100%,0_100%)]" />
                <span className="mb-0 h-[45px] w-[24px] rounded-t-full bg-[#d5b47b]" />
                <span className="absolute left-[14px] top-[28px] size-[23px] border-[3px] border-white bg-[#a9d7cd]" />
                <span className="absolute right-[14px] top-[28px] size-[23px] border-[3px] border-white bg-[#a9d7cd]" />
              </span>
              <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#53625d]">
                Illustrative art
              </span>
            </>
          )}
          {listing.isFeatured && (
            <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-blue-600 px-2.5 py-1 text-xs font-bold text-white shadow">
              <Sparkles aria-hidden="true" size={13} />
              Featured
            </span>
          )}
        </div>
        <div className="p-5">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <h3 className="font-bold tracking-[-0.025em] text-slate-900 transition-colors group-hover:text-blue-600">
                {listing.title}
              </h3>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded border px-2 py-0.5 text-xs font-semibold ${
              hasAvailableUnits
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}>
              {unitAvailabilityLabel(listing.availableUnits, listing.totalUnits)}
            </span>
            <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
              {propertyType}
            </span>
            {listing.isDemo && (
              <span className="rounded bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800">
                Demo
              </span>
            )}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
            <span>🛏️ {listing.beds} bed/room</span>
            <span aria-hidden="true" className="text-slate-300">|</span>
            <span className="max-w-full truncate">💧 {formatUtility(waterSource)}</span>
            <span aria-hidden="true" className="text-slate-300">|</span>
            <span className="max-w-full truncate">⚡ {formatUtility(meterType)}</span>
          </div>
          <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
            <MapPin aria-hidden="true" size={13} />
            <span className="truncate">
              {listing.landmark || listing.location}
            </span>
          </p>
          <div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-4">
            <p className="text-[17px] font-extrabold tracking-[-0.04em] text-slate-900">
              {currency.format(listing.rent)}
              <span className="ml-1 text-[11px] font-medium tracking-normal text-slate-500">
                /month
              </span>
            </p>
            <span className="flex items-center gap-1 text-sm font-semibold text-blue-600 transition hover:text-blue-800 group-hover:underline">
              View Details <ArrowRight aria-hidden="true" size={15} />
            </span>
          </div>
        </div>
      </Link>
      {hasAvailableUnits && (whatsappNumber || callNumber) && (
        <div className="flex flex-wrap gap-2 px-5 pb-5">
          {whatsappNumber && (
            <a
              className="inline-flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 text-xs font-bold text-white transition hover:bg-emerald-700"
              href={whatsappHref(
                whatsappNumber,
                listing.title,
                listing.location,
                listing.rent,
              )}
              rel="noopener noreferrer"
              target="_blank"
            >
              <MessageCircle aria-hidden="true" size={15} />
              WhatsApp
            </a>
          )}
          {callNumber && (
            <a
              className="inline-flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#d7ded4] px-3 text-xs font-bold text-[#176b50] transition hover:bg-[#f2f6ee]"
              href={phoneHref(callNumber)}
            >
              <Phone aria-hidden="true" size={15} />
              Call Landlord
            </a>
          )}
        </div>
      )}
      <div className="px-5 pb-3">
        <ReportListingForm propertyId={listing.id} isDemo={listing.isDemo} />
      </div>
    </article>
  );
}

export default function HomePage() {
  const [listings, setListings] = useState<MarketplaceListing[]>(() =>
    demoProperties.map(fromDemoProperty),
  );
  const [usingDemoListings, setUsingDemoListings] = useState(true);
  const [loadMessage, setLoadMessage] = useState("");
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedPropertyType, setSelectedPropertyType] = useState("All");
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(false);
  const [maxRent, setMaxRent] = useState("");
  const [waterPreference, setWaterPreference] = useState("All");
  const [meterPreference, setMeterPreference] = useState("All");
  const [minimumPrice, setMinimumPrice] = useState("");
  const [minimumBedrooms, setMinimumBedrooms] = useState("");

  useEffect(() => {
    if (!supabase) return;
    const authClient = supabase;
    let active = true;
    const { data: authListener } = authClient.auth.onAuthStateChange((_event, session) => {
      setAuthUser(session?.user ?? null);
      setAuthError("");
    });

    async function checkUser() {
      try {
        const { data, error } = await authClient.auth.getSession();
        if (!active) return;
        if (error) {
          console.error("Unable to check navigation authentication:", error);
          setAuthError("Account information is temporarily unavailable.");
          setAuthUser(null);
          return;
        }
        setAuthUser(data.session?.user ?? null);
      } catch (error) {
        if (!active) return;
        console.error("Unable to check navigation authentication:", error);
        setAuthError("Account information is temporarily unavailable.");
        setAuthUser(null);
      }
    }

    void checkUser();
    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadApprovedProperties() {
      if (!supabase) {
        setLoadMessage("Showing clearly labeled illustrative demo listings.");
        return;
      }

      try {
        const { data, error } = await supabase
          .from("properties")
          .select(
            "id,title,property_type,location,landmark,price_per_month,total_units,available_units,bedrooms,bathrooms,images,amenities,water_source,water_sources,meter_type,is_featured,landlord_phone,landlord_whatsapp",
          )
          .eq("status", "approved");

        if (error) {
          console.error("Unable to load approved properties:", error);
          if (!cancelled) {
            setListings(demoProperties.map(fromDemoProperty));
            setUsingDemoListings(true);
            setLoadMessage(
              "Live listings are temporarily unavailable. Showing illustrative demo listings.",
            );
          }
          return;
        }

        if (!cancelled && data && data.length > 0) {
          setListings(data.map((property) => fromProperty(property)));
          setUsingDemoListings(false);
          setLoadMessage("");
        } else if (!cancelled) {
          setListings(demoProperties.map(fromDemoProperty));
          setUsingDemoListings(true);
          setLoadMessage(
            "No live listings are available yet. Showing illustrative demo listings.",
          );
        }
      } catch (error) {
        console.error("Unable to reach approved properties:", error);
        if (!cancelled) {
          setListings(demoProperties.map(fromDemoProperty));
          setUsingDemoListings(true);
          setLoadMessage(
            "Live listings are temporarily unavailable. Showing illustrative demo listings.",
          );
        }
      }
    }

    void loadApprovedProperties();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredListings = useMemo(() => {
    const minPrice = minimumPrice === "" ? 0 : Number(minimumPrice);
    const rentLimit = maxRent === "" ? Infinity : Number(maxRent);
    const minBeds = minimumBedrooms === "" ? 0 : Number(minimumBedrooms);

    return listings.filter((listing) => {
      const searchableLocation =
        `${listing.location} ${listing.landmark}`.toLowerCase();
      const matchesLocation =
        selectedLocation === "All" ||
        searchableLocation.includes(selectedLocation.toLowerCase());
      const normalizeType = (value: string) =>
        value
          .toLowerCase()
          .replace(/[_-]/g, " ")
          .replace(/&/g, "and")
          .replace(/\s+/g, " ")
          .trim();
      const normalizedType = normalizeType(listing.type);
      const requestedType = normalizeType(selectedPropertyType);
      const matchesType =
        selectedPropertyType === "All" ||
        normalizedType === requestedType ||
        (requestedType === "room" && normalizedType.includes("room"));
      const normalizedAmenities = listing.amenities.map((amenity) =>
        amenity.toLowerCase(),
      );
      const matchesWater =
        waterPreference === "All" ||
        (listing.waterSource ?? "")
          .toLowerCase()
          .includes(waterPreference.toLowerCase()) ||
        normalizedAmenities.some((amenity) =>
          amenity.includes(waterPreference.toLowerCase()),
        );
      const matchesMeter =
        meterPreference === "All" ||
        (listing.meterType ?? "")
          .toLowerCase()
          .includes(meterPreference.toLowerCase()) ||
        normalizedAmenities.some((amenity) =>
          amenity.includes(meterPreference.toLowerCase()),
        );

      return (
        matchesLocation &&
        matchesType &&
        listing.rent >= minPrice &&
        listing.rent <= rentLimit &&
        listing.beds >= minBeds &&
        matchesWater &&
        matchesMeter
      );
    });
  }, [
    listings,
    maxRent,
    minimumBedrooms,
    minimumPrice,
    meterPreference,
    selectedLocation,
    selectedPropertyType,
    waterPreference,
  ]);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    document.getElementById("homes")?.scrollIntoView({ behavior: "smooth" });
  }

  function clearAllFilters() {
    setSelectedLocation("All");
    setSelectedPropertyType("All");
    setMaxRent("");
    setWaterPreference("All");
    setMeterPreference("All");
    setMinimumPrice("");
    setMinimumBedrooms("");
  }

  const closeMenu = () => setMenuOpen(false);

  async function handleSignOut() {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Unable to sign out from navigation:", error);
      setAuthError("Unable to sign out. Please try again.");
      return;
    }
    setAuthUser(null);
    setMenuOpen(false);
  }

  const accountName =
    String(authUser?.user_metadata.full_name ?? "").trim() ||
    authUser?.email?.split("@")[0] ||
    "Account";

  return (
    <main id="top">
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Brand />
          <nav aria-label="Main navigation" className="hidden items-center gap-7 md:flex">
            <Link
              aria-current="page"
              className="border-b-2 border-blue-600 py-2 text-sm font-medium text-blue-600 transition-colors"
              href="/"
            >
              Home
            </Link>
            <a className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600" href="#homes">
              Browse Rentals
            </a>
            <Link className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600" href="/how-it-works">
              How It Works
            </Link>
            <Link className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600" href="/about">
              About
            </Link>
            <Link className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600" href="/faqs">
              FAQs
            </Link>
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            {authUser ? (
              <details className="group relative">
                <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-blue-200 hover:text-blue-700">
                  <span className="flex size-7 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <UserRound aria-hidden="true" size={15} />
                  </span>
                  <span className="max-w-32 truncate">{accountName}</span>
                </summary>
                <div className="absolute right-0 top-full z-50 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                  <Link className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700" href="/dashboard">My Listings</Link>
                  <Link className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700" href="/submit">Post a Property</Link>
                  <button className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50" onClick={() => void handleSignOut()} type="button">Log Out</button>
                </div>
              </details>
            ) : null}
            <Link className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow" href="/submit">
              <span>+ List Property</span>
              <span className="text-xs text-blue-200">↗</span>
            </Link>
          </div>
          <div className="flex items-center gap-2 md:hidden">
            <button
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              className="flex size-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700"
              onClick={() => setMenuOpen(!menuOpen)}
              type="button"
            >
              {menuOpen ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav aria-label="Mobile navigation" className="border-t border-slate-100 bg-white px-4 py-4 md:hidden">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-1 sm:px-2">
              <Link className="rounded-lg px-3 py-3 text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600" href="/" onClick={closeMenu}>
                Home
              </Link>
              <a className="rounded-lg px-3 py-3 text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600" href="#homes" onClick={closeMenu}>
                Browse Rentals
              </a>
              <Link className="rounded-lg px-3 py-3 text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600" href="/how-it-works" onClick={closeMenu}>
                How It Works
              </Link>
              <Link className="rounded-lg px-3 py-3 text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600" href="/about" onClick={closeMenu}>
                About
              </Link>
              <Link className="rounded-lg px-3 py-3 text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600" href="/faqs" onClick={closeMenu}>
                FAQs
              </Link>
              {authUser ? (
                <>
                  <Link className="rounded-lg px-3 py-3 text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600" href="/dashboard" onClick={closeMenu}>
                    My Listings
                  </Link>
                  <button className="rounded-lg px-3 py-3 text-left text-sm font-medium text-slate-600 hover:bg-slate-50" onClick={() => void handleSignOut()} type="button">
                    Log Out
                  </button>
                </>
              ) : null}
              <Link className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700" href="/submit" onClick={closeMenu}>
                <span>+ List Property</span>
                <span className="text-xs text-blue-200">↗</span>
              </Link>
            </div>
          </nav>
        )}
        {authError && (
          <p className="absolute right-4 top-full z-50 mt-1 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900 shadow" role="status">
            {authError}
          </p>
        )}
      </header>

      <section className="mx-auto my-4 max-w-6xl">
        <div className="relative grid items-center justify-between gap-6 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-sky-950 px-6 py-6 text-white shadow-xl md:grid-cols-[1.05fr_0.95fr] md:px-8">
          <div className="relative z-10">
            <h1 className="max-w-[620px] text-2xl font-extrabold leading-tight tracking-tight text-white md:text-3xl">
              Find Verified Properties in Sogakope
            </h1>
            <p className="mt-2 mb-4 max-w-md text-xs leading-relaxed text-blue-100/90 md:text-sm">
              Verified rooms, chamber &amp; halls, self-contain units, and
              apartments across South Tongu. Zero middleman markups.
            </p>
            <form
              aria-label="Search approved properties"
              className="flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2.5 text-sm text-slate-800 shadow-lg"
              onSubmit={handleSearch}
            >
              <Search aria-hidden="true" className="shrink-0 text-blue-600" size={18} />
              <input
                aria-label="Search location, landmark, or property type"
                className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-500"
                list="south-tongu-locations"
                onChange={(event) =>
                  setSelectedLocation(event.target.value || "All")
                }
                placeholder="Search location, landmark (e.g. Comboni, Beach Resort), or property type..."
                value={selectedLocation === "All" ? "" : selectedLocation}
              />
              <datalist id="south-tongu-locations">
                <option value="Sogakope" />
                <option value="Dabala" />
                <option value="Sokpoe" />
                <option value="Tefle" />
                <option value="Vume" />
                <option value="Comboni" />
                <option value="Beach Resort" />
              </datalist>
              <button
                aria-label="Search properties"
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs text-white transition hover:bg-blue-700"
                type="submit"
              >
                <ArrowRight aria-hidden="true" size={15} />
              </button>
            </form>
            {loadMessage && (
              <p aria-live="polite" className="mt-3 text-xs text-blue-100">
                {loadMessage}
              </p>
            )}
          </div>

          <div className="hidden md:block">
            <div className="relative mx-auto h-[200px] w-full max-w-[340px] overflow-hidden rounded-xl shadow-md md:h-[220px]">
              <Image
                alt="Contemporary tropical home surrounded by greenery"
                className="h-full w-full object-cover"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 340px"
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                unoptimized
              />
              <div className="absolute left-4 top-4 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold text-blue-950 shadow-md">
                ✓ 100% Verified Listings
              </div>
              <div className="absolute bottom-4 right-4 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold text-blue-950 shadow-md">
                ⭐ Trusted by Sogakope Tenants
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Property categories and filters" className="page-shell pb-8">
        <div className="flex flex-nowrap items-center gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-visible sm:pb-0" role="group" aria-label="Filter by property type">
          {[
            "All",
            "Single Room",
            "Chamber and Hall",
            "Self Contain",
            "Apartment",
            "House",
            "Commercial",
          ].map((category) => (
            <button
              aria-pressed={selectedPropertyType === category}
              className={`shrink-0 cursor-pointer whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                selectedPropertyType === category
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700"
              }`}
              key={category}
              onClick={() => setSelectedPropertyType(category)}
              type="button"
            >
              {category}
            </button>
          ))}
        </div>
        <button
          aria-controls="property-more-filters"
          aria-expanded={moreFiltersOpen}
          className="mt-3 flex min-h-11 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 sm:hidden"
          onClick={() => setMoreFiltersOpen((isOpen) => !isOpen)}
          type="button"
        >
          More Filters
          <ChevronDown
            aria-hidden="true"
            className={`transition-transform ${moreFiltersOpen ? "rotate-180" : ""}`}
            size={18}
          />
        </button>
        <div
          className={`mt-3 gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:mt-4 sm:grid sm:grid-cols-2 lg:grid-cols-5 ${
            moreFiltersOpen ? "grid" : "hidden"
          }`}
          id="property-more-filters"
        >
          <label className="text-xs font-semibold text-slate-600">
            Minimum rent (GH₵)
            <input
              className="mt-1.5 min-h-10 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal text-slate-800 outline-none focus:border-blue-500"
              min="0"
              onChange={(event) => setMinimumPrice(event.target.value)}
              placeholder="No minimum"
              type="number"
              value={minimumPrice}
            />
          </label>
          <label className="text-xs font-semibold text-slate-600">
            Maximum rent (GH₵)
            <input
              className="mt-1.5 min-h-10 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal text-slate-800 outline-none focus:border-blue-500"
              min="0"
              onChange={(event) => setMaxRent(event.target.value)}
              placeholder="No maximum"
              type="number"
              value={maxRent}
            />
          </label>
          <label className="text-xs font-semibold text-slate-600">
            Water supply
            <select
              className="mt-1.5 min-h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal text-slate-800 outline-none focus:border-blue-500"
              onChange={(event) => setWaterPreference(event.target.value)}
              value={waterPreference}
            >
              <option>All</option>
              <option>GWCL</option>
              <option>Borehole</option>
            </select>
          </label>
          <label className="text-xs font-semibold text-slate-600">
            Electricity meter
            <select
              className="mt-1.5 min-h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal text-slate-800 outline-none focus:border-blue-500"
              onChange={(event) => setMeterPreference(event.target.value)}
              value={meterPreference}
            >
              <option>All</option>
              <option>Prepaid</option>
              <option>Postpaid</option>
            </select>
          </label>
          <label className="text-xs font-semibold text-slate-600">
            Minimum bedrooms
            <select
              className="mt-1.5 min-h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal text-slate-800 outline-none focus:border-blue-500"
              onChange={(event) => setMinimumBedrooms(event.target.value)}
              value={minimumBedrooms}
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
          </label>
        </div>
      </section>

      <section className="page-shell py-10 sm:py-12" id="homes">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:mb-10 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#7b8982]">
              A first look
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.06em] text-[#172b27] sm:text-[40px]">
              Make yourself at home.
            </h2>
            <p className="mt-3 max-w-[510px] text-sm leading-6 text-[#687672]">
              {usingDemoListings
                ? "A preview of the kinds of homes you can discover here. These sample listings are not real rental offers."
                : "Browse approved homes shared by landlords and agents in the area."}
            </p>
          </div>
        </div>

        {usingDemoListings && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-[#eadfbd] bg-[#fffaf0] px-4 py-3.5 text-sm leading-6 text-[#635b49]">
            <Sparkles aria-hidden="true" className="mt-1 shrink-0 text-[#a17b31]" size={17} />
            <p>
              <strong className="font-bold">Preview content:</strong> Every home and price below is illustrative demo data, not a real rental offer or confirmed availability.
            </p>
          </div>
        )}

        {filteredListings.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="rounded-[20px] border border-dashed border-[#cfd8cd] bg-white px-6 py-14 text-center">
            <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#edf3e8] text-[#176b50]">
              <Search aria-hidden="true" size={21} />
            </span>
            <h3 className="mt-4 font-bold text-[#172b27]">
              No listings match your search criteria.
            </h3>
            <p className="mt-2 text-sm text-[#687672]">
              Try adjusting your filters or clear them to see all listings.
            </p>
            <button
              className="mt-5 rounded-full border border-[#d7ded4] px-4 py-2 text-sm font-bold text-[#176b50] hover:bg-[#f2f6ee]"
              onClick={clearAllFilters}
              type="button"
            >
              Clear all filters
            </button>
          </div>
        )}
        <p aria-live="polite" className="mt-5 text-center text-xs text-[#87908a]">
          Showing {filteredListings.length} available{" "}
          {filteredListings.length === 1 ? "property" : "properties"} in South
          Tongu
        </p>

        <section className="my-12 flex flex-col items-center justify-between gap-6 rounded-3xl bg-slate-900 p-8 text-white shadow-lg md:flex-row md:p-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-400">
              FOR PROPERTY OWNERS &amp; AGENTS
            </p>
            <h2 className="mt-3 text-2xl font-bold md:text-3xl">
              Have a room or apartment to rent in Sogakope?
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Connect directly with verified tenants across South Tongu. No
              middleman agent cuts.
            </p>
          </div>
          <Link
            className="inline-flex whitespace-nowrap rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-blue-500"
            href="/submit"
          >
            List Your Property Free <ArrowRight aria-hidden="true" size={17} />
          </Link>
        </section>
      </section>

      <Footer />
    </main>
  );
}
