import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  CarFront,
  Check,
  Droplets,
  Home,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Wifi,
  Zap,
} from "lucide-react";
import GpsAddressBadge from "@/components/gps-address-badge";
import PropertyGallery from "@/components/property-gallery";
import ReportListingForm from "@/components/report-listing-form";
import { cleanPhoneNumber, phoneHref, whatsappHref } from "@/lib/contact-links";
import { supabase } from "@/lib/supabase";
import type { Property } from "@/types/database";

type PageProps = {
  params: Promise<{ id: string }>;
};

type PropertyDetails = {
  id: string;
  title: string;
  description: string;
  propertyType: string;
  location: string;
  landmark: string;
  ghanaPostGpsAddress: string | null;
  monthlyRent: number;
  advanceYears: number;
  bedrooms: number;
  bathrooms: number;
  waterSources: string[];
  meterType: string | null;
  bathroomType: string | null;
  kitchenType: string | null;
  amenities: string[];
  images: string[];
  landlordPhone: string | null;
  landlordWhatsapp: string | null;
  isAvailable: boolean | null;
  isOccupied: boolean;
};

const currency = new Intl.NumberFormat("en-GH", {
  style: "currency",
  currency: "GHS",
  maximumFractionDigits: 0,
});

function fromDatabaseProperty(property: Property): PropertyDetails {
  return {
    id: property.id,
    title: property.title,
    description: property.description,
    propertyType: property.property_type,
    location: property.location,
    landmark: property.landmark,
    ghanaPostGpsAddress: property.ghana_post_gps_address ?? null,
    monthlyRent: property.price_per_month,
    advanceYears: property.advance_years,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    waterSources:
      property.water_sources?.length
        ? property.water_sources
        : (property.water_source ?? "")
            .split(",")
            .map((source) => source.trim())
            .filter(Boolean),
    meterType: property.meter_type ?? null,
    bathroomType: property.bathroom_type ?? null,
    kitchenType: property.kitchen_type ?? null,
    amenities: property.amenities,
    images: property.images,
    landlordPhone: property.landlord_phone,
    landlordWhatsapp: property.landlord_whatsapp,
    isAvailable: property.is_available,
    isOccupied:
      property.status === "occupied" ||
      property.is_occupied === true ||
      property.is_available === false,
  };
}

function amenityIcon(amenity: string) {
  const normalized = amenity.toLowerCase();
  if (normalized.includes("water")) return Droplets;
  if (normalized.includes("wifi") || normalized.includes("internet")) return Wifi;
  if (normalized.includes("electric")) return Zap;
  if (normalized.includes("parking")) return CarFront;
  if (normalized.includes("security")) return ShieldCheck;
  return Check;
}

const specificationGroups = [
  {
    title: "Water Supply",
    keywords: ["water", "gwcl", "borehole", "polytank"],
  },
  {
    title: "Electricity & Metering",
    keywords: ["electric", "ecg", "meter", "prepaid", "postpaid"],
  },
  {
    title: "Comforts & Facilities",
    keywords: ["kitchen", "bathroom"],
  },
];

function specificationsFor(amenities: string[], keywords: string[]) {
  return amenities.filter((amenity) => {
    const normalized = amenity.toLowerCase();
    return keywords.some((keyword) => normalized.includes(keyword));
  });
}

function displaySpecification(value: string): string {
  const labels: Record<string, string> = {
    gwcl: "Ghana Water (GWCL) Connection",
    borehole: "Borehole Water Supply",
    polytank: "Polytank / Water Storage",
    personal_prepaid: "ECG Personal Prepaid Meter",
    shared_prepaid: "ECG Shared Prepaid Meter",
    personal_postpaid: "ECG Personal Postpaid Meter",
    shared_postpaid: "ECG Shared Postpaid Meter",
    private: "Private",
    shared: "Shared",
  };
  return labels[value] ?? value;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Property details | Sogakope Rentals",
    description: "View property details, photos, and contact information.",
  };
}

export default async function PropertyDetailsPage({ params }: PageProps) {
  const { id } = await params;
  let property: PropertyDetails | null = null;
  let loadError = false;
  let listingUnavailable = !supabase;

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error("Unable to load property details:", error);
        loadError = true;
      } else if (data?.status === "approved" || data?.status === "occupied") {
        property = fromDatabaseProperty(data as Property);
      } else {
        listingUnavailable = true;
      }
    } catch (error) {
      console.error("Unable to reach the property details service:", error);
      loadError = true;
    }
  }

  if (!property && loadError) {
    return (
      <main className="page-shell py-16 sm:py-24">
        <p className="rounded-2xl border border-[#f1ccc4] bg-white p-6 text-sm leading-6 text-[#8b332a]" role="alert">
          We couldn’t load this property right now. Please try again later.
        </p>
        <Link className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#176b50]" href="/">
          <ArrowLeft aria-hidden="true" size={16} /> Back to homes
        </Link>
      </main>
    );
  }

  if (!property && listingUnavailable) {
    return (
      <main className="page-shell py-16 sm:py-24">
        <section className="rounded-2xl border border-[#e7e9e2] bg-white p-6 sm:p-8">
          <h1 className="text-2xl font-semibold tracking-[-0.04em] text-[#172b27]">
            Listing not found or pending approval
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#687672]">
            This listing may have been removed or is not available publicly yet.
          </p>
          <Link
            className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#176b50]"
            href="/"
          >
            <ArrowLeft aria-hidden="true" size={16} />
            Back to homes
          </Link>
        </section>
      </main>
    );
  }

  if (!property) {
    return (
      <main className="page-shell py-16 sm:py-24">
        <p className="rounded-2xl border border-[#f1ccc4] bg-white p-6 text-sm leading-6 text-[#8b332a]" role="alert">
          We couldn’t load this property right now. Please try again later.
        </p>
        <Link className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#176b50]" href="/">
          <ArrowLeft aria-hidden="true" size={16} /> Back to homes
        </Link>
      </main>
    );
  }

  const whatsappNumber = cleanPhoneNumber(
    property.landlordWhatsapp || property.landlordPhone || "",
  );
  const callNumber = property.landlordPhone || property.landlordWhatsapp;
  const specificationKeywords = specificationGroups.flatMap(
    ({ keywords }) => keywords,
  );
  const otherAmenities = property.amenities.filter((amenity) => {
    const normalized = amenity.toLowerCase();
    return !specificationKeywords.some((keyword) =>
      normalized.includes(keyword),
    );
  });

  return (
    <main className="min-h-screen pb-16">
      <div className="page-shell">
        <nav aria-label="Breadcrumb" className="py-6">
          <Link
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#53625d] transition hover:text-[#176b50]"
            href="/#homes"
          >
            <ArrowLeft aria-hidden="true" size={16} />
            Back to homes
          </Link>
        </nav>

        <div className="grid items-start gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          <div className="space-y-6">
            <PropertyGallery
              images={property.images}
              title={property.title}
            />

            <section className="rounded-[20px] border border-[#e7e9e2] bg-white p-5 sm:p-7">
              <h2 className="text-xl font-bold tracking-[-0.04em] text-[#172b27]">
                About this place
              </h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[#53625d]">
                {property.description}
              </p>
            </section>

            <section className="rounded-[20px] border border-[#e7e9e2] bg-white p-5 sm:p-7">
              <h2 className="text-xl font-bold tracking-[-0.04em] text-[#172b27]">
                Key Features & Specifications
              </h2>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {specificationGroups.map(({ title, keywords }) => {
                  const storedSpecification =
                    title === "Electricity & Metering"
                      ? property.meterType
                      : null;
                  const features = [
                    ...(title === "Water Supply"
                      ? property.waterSources.map(displaySpecification)
                      : storedSpecification
                        ? [displaySpecification(storedSpecification)]
                        : []),
                    ...specificationsFor(property.amenities, keywords),
                  ];
                  return (
                    <li
                      className="rounded-2xl bg-[#f7f8f4] p-4"
                      key={title}
                    >
                      <h3 className="text-sm font-bold text-[#172b27]">
                        {title}
                      </h3>
                      {features.length > 0 ? (
                        <ul className="mt-2 space-y-1 text-sm text-[#53625d]">
                          {features.map((feature) => (
                            <li key={feature}>{feature}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-2 text-sm text-[#87908a]">
                          Not specified
                        </p>
                      )}
                    </li>
                  );
                })}
                <li className="rounded-2xl bg-[#f7f8f4] p-4">
                  <h3 className="text-sm font-bold text-[#172b27]">
                    Comforts & Facilities
                  </h3>
                  <p className="mt-2 text-sm text-[#53625d]">
                    {property.kitchenType
                      ? `${displaySpecification(property.kitchenType)} kitchen`
                      : "Kitchen not specified"}
                    {" · "}
                    {property.bathroomType
                      ? `${displaySpecification(property.bathroomType)} bathroom`
                      : "Bathroom not specified"}
                  </p>
                  <p className="mt-1 text-sm text-[#53625d]">
                    {property.bedrooms} bedrooms · {property.bathrooms} bathrooms
                  </p>
                </li>
              </ul>

              <h3 className="mt-6 text-sm font-bold text-[#172b27]">
                Other amenities
              </h3>
              {otherAmenities.length > 0 ? (
                <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                  {otherAmenities.map((amenity) => {
                    const Icon = amenityIcon(amenity);
                    return (
                      <li className="flex items-center gap-3 text-sm text-[#53625d]" key={amenity}>
                        <span className="flex size-9 items-center justify-center rounded-xl bg-[#edf3e8] text-[#176b50]">
                          <Icon aria-hidden="true" size={17} />
                        </span>
                        {amenity}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-[#687672]">No amenities listed.</p>
              )}
            </section>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-6">
            <section className="rounded-[24px] border border-[#e7e9e2] bg-white p-5 shadow-[0_18px_50px_-38px_rgba(23,43,39,0.35)] sm:p-7">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#edf3e8] px-3 py-1.5 text-xs font-bold text-[#176b50]">
                  {property.propertyType}
                </span>
                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                    property.isOccupied
                      ? "bg-slate-100 text-slate-600"
                      : property.isAvailable === true
                      ? "bg-[#e7f3e5] text-[#176b50]"
                      : property.isAvailable === false
                        ? "bg-[#f5e9e7] text-[#9b443b]"
                        : "bg-[#f1efe8] text-[#746c59]"
                  }`}
                >
                  {property.isOccupied
                    ? "Occupied"
                    : property.isAvailable === true
                    ? "Available"
                    : property.isAvailable === false
                      ? "Not available"
                      : "Availability unverified"}
                </span>
              </div>

              <h1 className="mt-5 text-3xl font-semibold leading-tight tracking-[-0.06em] text-[#172b27]">
                {property.title}
              </h1>
              <p className="mt-3 flex items-start gap-2 text-sm leading-6 text-[#687672]">
                <MapPin aria-hidden="true" className="mt-0.5 shrink-0 text-[#176b50]" size={17} />
                <span>
                  {property.location}
                  {property.landmark && (
                    <span className="block text-xs text-[#87908a]">
                      Landmark: {property.landmark}
                    </span>
                  )}
                </span>
              </p>
              {property.ghanaPostGpsAddress && (
                <GpsAddressBadge address={property.ghanaPostGpsAddress} />
              )}

              <div className="mt-6 border-y border-[#edf0e9] py-5">
                <p className="text-3xl font-extrabold tracking-[-0.055em] text-[#176b50]">
                  {currency.format(property.monthlyRent)}
                  <span className="ml-1.5 text-sm font-medium tracking-normal text-[#687672]">
                    / month
                  </span>
                </p>
                <p className="mt-2 text-sm text-[#53625d]">
                  Advance payment:{" "}
                  <strong className="font-bold text-[#172b27]">
                    {property.advanceYears === 0.5
                      ? "6 months advance"
                      : `${property.advanceYears} ${
                          property.advanceYears === 1 ? "year" : "years"
                        } advance`}
                  </strong>
                </p>
              </div>

              <ul aria-label="Property details" className="mt-5 flex flex-wrap gap-3">
                <li className="inline-flex items-center gap-2 rounded-xl bg-[#f5f6f1] px-3 py-2 text-sm font-semibold text-[#46534e]">
                  <BedDouble aria-hidden="true" className="text-[#176b50]" size={17} />
                  {property.bedrooms} bedrooms
                </li>
                <li className="inline-flex items-center gap-2 rounded-xl bg-[#f5f6f1] px-3 py-2 text-sm font-semibold text-[#46534e]">
                  <Bath aria-hidden="true" className="text-[#176b50]" size={17} />
                  {property.bathrooms} bathrooms
                </li>
                <li className="inline-flex items-center gap-2 rounded-xl bg-[#f5f6f1] px-3 py-2 text-sm font-semibold text-[#46534e]">
                  <Home aria-hidden="true" className="text-[#176b50]" size={17} />
                  {property.propertyType}
                </li>
              </ul>

              {property.isOccupied ? (
                <p className="mt-6 rounded-xl bg-slate-100 px-4 py-3 text-center text-sm font-semibold text-slate-600">
                  This property is occupied. Contact actions are unavailable.
                </p>
              ) : callNumber ? (
                <a
                  className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#d7ded4] px-5 text-sm font-bold text-[#176b50] transition hover:bg-[#f2f6ee]"
                  href={phoneHref(callNumber)}
                >
                  <Phone aria-hidden="true" size={17} />
                  Call Landlord / Agent
                </a>
              ) : (
                <p className="mt-6 rounded-xl bg-[#f5f6f1] px-4 py-3 text-center text-sm text-[#687672]">
                  Landlord / agent phone number not available for this listing.
                </p>
              )}

              {!property.isOccupied && whatsappNumber ? (
                <a
                  className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white transition hover:bg-emerald-700"
                  href={whatsappHref(
                    whatsappNumber,
                    property.title,
                    property.location,
                    property.monthlyRent,
                  )}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <MessageCircle aria-hidden="true" size={17} />
                  Chat on WhatsApp
                </a>
              ) : !property.isOccupied ? (
                <p className="mt-3 text-center text-xs text-[#87908a]">
                  WhatsApp contact is not provided.
                </p>
              ) : null}

            </section>

            <ReportListingForm
              isDemo={false}
              propertyId={property.id}
            />
          </aside>
        </div>
      </div>
    </main>
  );
}
