"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  House,
  ImagePlus,
  MapPin,
  Trash2,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

const propertyTypes = [
  { label: "Single Room", value: "single_room" },
  { label: "Chamber and Hall", value: "chamber_and_hall" },
  { label: "Apartment", value: "apartment" },
  { label: "Self Contain", value: "self_contain" },
  { label: "House", value: "house" },
  { label: "Commercial", value: "commercial" },
];

const locations = [
  "Sogakope Central",
  "Cisneros",
  "Fievie Road",
  "Tefle",
  "Comboni area",
  "Other (enter below)",
];

const waterSourceOptions = [
  { value: "gwcl", label: "🇬🇭 Ghana Water (GWCL) Connection" },
  { value: "borehole", label: "💧 Borehole Water Supply" },
  { value: "polytank", label: "🪣 Polytank / Water Storage" },
];

const meterTypes = [
  {
    value: "personal_prepaid",
    label: "🔌 ECG Personal Prepaid Meter",
    selectedClass: "border-emerald-600 bg-emerald-50 text-emerald-900",
  },
  {
    value: "shared_prepaid",
    label: "⚠️ ECG Shared Prepaid Meter",
    selectedClass: "border-amber-500 bg-amber-50 text-amber-900",
  },
  {
    value: "personal_postpaid",
    label: "📄 ECG Personal Postpaid Meter",
    selectedClass: "border-emerald-600 bg-emerald-50 text-emerald-900",
  },
  {
    value: "shared_postpaid",
    label: "🔗 ECG Shared Postpaid Meter",
    selectedClass: "border-emerald-600 bg-emerald-50 text-emerald-900",
  },
];

const generalAmenities = [
  { value: "Fenced Compound", label: "🚧 Fenced Compound" },
  { value: "Security Services / Gate", label: "🔒 Security Services / Gate" },
  { value: "Ceiling Fan", label: "🌀 Ceiling Fan" },
  { value: "Air Conditioning", label: "❄️ Air Conditioning" },
  { value: "Parking Space", label: "🚗 Parking Space" },
  { value: "Tiled Floors", label: "🧱 Tiled Floors" },
];

const maximumImages = 8;
const maximumImageSize = 5 * 1024 * 1024;

type ImagePreview = {
  file: File;
  url: string;
};

export default function SubmitPropertyPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<ImagePreview[]>([]);
  const [gpsAddress, setGpsAddress] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [waterSources, setWaterSources] = useState<string[]>([]);
  const [meterType, setMeterType] = useState("");
  const [kitchenType, setKitchenType] = useState("");
  const [bathroomType, setBathroomType] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setAuthError("Supabase is not configured. Account sign-in is unavailable.");
      setIsAuthLoading(false);
      return;
    }

    const authClient = supabase;
    let active = true;
    const { data: authListener } = authClient.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthError("");
      setIsAuthLoading(false);
    });

    async function checkUser() {
      try {
        const { data, error } = await authClient.auth.getSession();
        if (!active) return;
        if (error) {
          console.error("Unable to check the current user:", error);
          setUser(null);
          setAuthError("We couldn't verify your sign-in. Please try again.");
        } else {
          setUser(data.session?.user ?? null);
        }
      } catch (error) {
        if (!active) return;
        console.error("Unable to check the current user:", error);
        setUser(null);
        setAuthError("We couldn't verify your sign-in. Please try again.");
      } finally {
        if (active) setIsAuthLoading(false);
      }
    }

    void checkUser();
    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const nextPreviews = images.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setPreviews(nextPreviews);

    return () => {
      nextPreviews.forEach(({ url }) => URL.revokeObjectURL(url));
    };
  }, [images]);

  function handleImagesChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.currentTarget.files ?? []);
    event.currentTarget.value = "";

    const invalidFile = selectedFiles.find(
      (file) => !file.type.startsWith("image/") || file.size > maximumImageSize,
    );
    if (invalidFile) {
      setFormError(
        `${invalidFile.name} is not a supported image or is larger than 5 MB.`,
      );
      return;
    }

    if (images.length + selectedFiles.length > maximumImages) {
      setFormError(`You can add up to ${maximumImages} photos.`);
      return;
    }

    setFormError("");
    setImages((current) => [...current, ...selectedFiles]);
  }

  function toggleAmenity(amenity: string) {
    setSelectedAmenities((current) =>
      current.includes(amenity)
        ? current.filter((item) => item !== amenity)
        : [...current, amenity],
    );
  }

  function toggleWaterSource(source: string) {
    setWaterSources((previous) =>
      previous.includes(source)
        ? previous.filter((item) => item !== source)
        : [...previous, source],
    );
  }

  function resetForm() {
    setImages([]);
    setGpsAddress("");
    setSelectedAmenities([]);
    setWaterSources([]);
    setMeterType("");
    setKitchenType("");
    setBathroomType("");
    setIsSubmitted(false);
    setFormError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    if (formError) return;

    if (!supabase) {
      setFormError(
        "Listing submission is unavailable because Supabase is not configured.",
      );
      return;
    }

    let currentUser: User | null;
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      currentUser = data.session?.user ?? null;
    } catch (error) {
      console.error("Unable to verify the listing submitter's session:", error);
      setUser(null);
      setFormError("We couldn't verify your sign-in. Please sign in again.");
      return;
    }
    if (!currentUser) {
      setUser(null);
      setFormError("Please sign in again before submitting your listing.");
      return;
    }

    const formData = new FormData(formElement);
    const propertyType = String(formData.get("propertyType"));
    const selectedPropertyType = propertyTypes.find(
      (option) => option.value === propertyType,
    );
    if (!selectedPropertyType) {
      setFormError("Please select a valid property type.");
      return;
    }

    if (waterSources.length === 0 || !meterType) {
      setFormError("Please select a water supply and electricity meter type.");
      return;
    }

    const advanceYears = Number(formData.get("advance"));
    if (![0.5, 1, 1.5, 2].includes(advanceYears)) {
      setFormError("Please select a valid advance payment duration.");
      return;
    }

    const price = Number(formData.get("monthlyRent"));
    const bedrooms = Number(formData.get("bedrooms"));
    const bathrooms = Number(formData.get("bathrooms"));
    if (
      !Number.isFinite(price) ||
      price <= 0 ||
      !Number.isFinite(bedrooms) ||
      bedrooms < 0 ||
      !Number.isFinite(bathrooms) ||
      bathrooms < 0
    ) {
      setFormError(
        "Enter a valid monthly rent and non-negative bedroom and bathroom counts.",
      );
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    try {
      const uploadedImageUrls: string[] = [];

      for (const file of images) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
        const filePath = `listings/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("property-images")
          .upload(filePath, file);

        if (uploadError) {
          console.error("Image upload failed:", uploadError.message);
          continue;
        }

        const { data } = supabase.storage
          .from("property-images")
          .getPublicUrl(filePath);

        if (data?.publicUrl) {
          uploadedImageUrls.push(data.publicUrl);
        }
      }

      if (uploadedImageUrls.length === 0) {
        uploadedImageUrls.push(
          "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
        );
      }

      const property = {
        title: String(formData.get("title")).trim(),
        description: String(formData.get("description")).trim(),
        property_type: selectedPropertyType.value,
        location: String(formData.get("location")).trim(),
        landmark: String(formData.get("landmark")).trim(),
        ghana_post_gps_address: gpsAddress || null,
        water_sources: waterSources,
        water_source: waterSources.join(", "),
        meter_type: meterType,
        kitchen_type: kitchenType || null,
        bathroom_type: bathroomType || null,
        price_per_month: Number(price),
        advance_years: Number(advanceYears || 1),
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        amenities: selectedAmenities || [],
        images: uploadedImageUrls,
        landlord_name: String(formData.get("contactName")).trim(),
        landlord_phone: String(formData.get("phone")).trim(),
        landlord_whatsapp: String(formData.get("whatsapp")).trim(),
        user_id: currentUser.id,
        status: "pending" as const,
        is_available: true,
        is_featured: false,
      };

      const { error } = await supabase.from("properties").insert([property]);

      if (error) {
        console.error(
          "Property submission failed:",
          error.message,
          error.details,
          error.hint,
          error.code,
        );
        setFormError(error.message || "We couldn't submit your listing. Please try again.");
        return;
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error("Unable to reach the property submission service:", error);
      setFormError(
        "We couldn't reach the listing service. Please try again when your connection is available.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isAuthLoading) {
    return (
      <main className="page-shell py-20 text-center text-sm text-slate-600">
        Checking your sign-in...
      </main>
    );
  }

  if (!user) {
    return (
      <main className="page-shell py-14 sm:py-20">
        <section className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-lg sm:p-10">
          <Link
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
            href="/#homes"
          >
            <ArrowLeft aria-hidden="true" size={15} />
            Back to Browse Homes
          </Link>
          <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <House aria-hidden="true" size={22} />
          </span>
          <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">
            Landlord &amp; Agent Access
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Are you looking to rent a room? You do NOT need an account! Tenants
            can browse listings and contact landlords directly via WhatsApp for
            free. Accounts are only required for property owners posting and
            managing listings.
          </p>
          {authError && (
            <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
              {authError}
            </p>
          )}
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
              href="/auth/login?next=%2Fsubmit"
            >
              Log In
            </Link>
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              href="/auth/signup?next=%2Fsubmit"
            >
              Create an Account
            </Link>
          </div>
        </section>
      </main>
    );
  }

  if (isSubmitted) {
    return (
      <main className="page-shell py-14 sm:py-20">
        <section
          aria-labelledby="submission-confirmation-title"
          className="mx-auto max-w-2xl rounded-[28px] border border-[#dce6d8] bg-white px-6 py-10 text-center shadow-[0_18px_50px_-38px_rgba(23,43,39,0.35)] sm:px-12 sm:py-14"
          role="status"
        >
          <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-[#edf3e8] text-[#176b50]">
            <CheckCircle2 aria-hidden="true" size={32} />
          </span>
          <h1
            className="mt-6 text-3xl font-semibold tracking-[-0.06em] text-[#172b27] sm:text-[40px]"
            id="submission-confirmation-title"
          >
            Thank you for sharing your property.
          </h1>
          <p className="mt-4 text-sm leading-7 text-[#53625d]">
            Your listing has been submitted for review and is pending
            administrator verification.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              className="min-h-12 rounded-full bg-[#176b50] px-6 text-sm font-bold text-white transition hover:bg-[#10533e]"
              onClick={resetForm}
              type="button"
            >
              Submit another property
            </button>
            <Link
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#d7ded4] px-6 text-sm font-bold text-[#176b50] transition hover:bg-[#f2f6ee]"
              href="/#homes"
            >
              Browse homes
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell py-8 sm:py-12">
      <Link
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#53625d] transition hover:text-[#176b50]"
        href="/"
      >
        <ArrowLeft aria-hidden="true" size={16} />
        Back to Sogakope Rentals
      </Link>

      <header className="mx-auto mt-8 max-w-3xl text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#edf3e8] text-[#176b50]">
          <House aria-hidden="true" size={22} />
        </span>
        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.06em] text-[#172b27] sm:text-[44px]">
          List your property
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#687672] sm:text-base">
          Share your rental with people looking for a home in Sogakope and
          across South Tongu.
        </p>
      </header>

      <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-[#eadfbd] bg-[#fffaf0] px-4 py-3 text-sm leading-6 text-[#635b49] sm:mt-10">
        <strong className="font-bold">Review process:</strong> Submissions are
        saved as pending and must be reviewed by an administrator before they
        appear publicly. Selected photos are uploaded with your listing.
      </div>

      <form
        className="mx-auto mt-5 max-w-3xl space-y-5"
        onSubmit={handleSubmit}
      >
        <section className="rounded-[22px] border border-[#e7e9e2] bg-white p-5 sm:p-8">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7b8982]">
              01 · Property details
            </p>
            <h2 className="mt-2 text-xl font-bold tracking-[-0.04em] text-[#172b27]">
              Tell us about the place
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-[#33413b] sm:col-span-2">
              Listing title
              <input
                autoComplete="off"
                className="mt-1.5 min-h-12 w-full rounded-xl border border-[#d9ddcf] bg-white px-3.5 text-sm font-normal outline-none transition focus:border-[#176b50] focus:ring-2 focus:ring-[#176b50]/15"
                maxLength={100}
                name="title"
                placeholder="e.g., Self-Contain near Sogakope Bridge"
                required
              />
            </label>

            <label className="block text-sm font-semibold text-[#33413b]">
              Property type
              <select
                className="mt-1.5 min-h-12 w-full rounded-xl border border-[#d9ddcf] bg-white px-3.5 text-sm font-normal outline-none transition focus:border-[#176b50] focus:ring-2 focus:ring-[#176b50]/15"
                name="propertyType"
                required
                defaultValue=""
              >
                <option disabled value="">
                  Choose property type
                </option>
                {propertyTypes.map((propertyType) => (
                  <option key={propertyType.value} value={propertyType.value}>
                    {propertyType.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-semibold text-[#33413b]">
              Location
              <span className="relative mt-1.5 block">
                <MapPin
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#176b50]"
                  size={17}
                />
                <input
                  autoComplete="address-level2"
                  className="min-h-12 w-full rounded-xl border border-[#d9ddcf] bg-white pl-10 pr-3.5 text-sm font-normal outline-none transition focus:border-[#176b50] focus:ring-2 focus:ring-[#176b50]/15"
                  list="sogakope-locations"
                  maxLength={120}
                  name="location"
                  placeholder="Choose or enter an area"
                  required
                />
              </span>
              <datalist id="sogakope-locations">
                {locations.map((location) => (
                  <option key={location} value={location} />
                ))}
              </datalist>
            </label>

            <label className="block text-sm font-semibold text-[#33413b] sm:col-span-2">
              Landmark / directions
              <input
                className="mt-1.5 min-h-12 w-full rounded-xl border border-[#d9ddcf] bg-white px-3.5 text-sm font-normal outline-none transition focus:border-[#176b50] focus:ring-2 focus:ring-[#176b50]/15"
                maxLength={200}
                name="landmark"
                placeholder="Nearby landmark or directions to find the property"
                required
              />
            </label>

            <div className="sm:col-span-2">
              <label
                className="block text-sm font-semibold text-[#33413b]"
                htmlFor="ghana-post-gps-address"
              >
                GhanaPost GPS Address <span className="font-normal text-[#687672]">(Optional)</span>
                <input
                  className="mt-1.5 min-h-12 w-full rounded-xl border border-[#d9ddcf] bg-white px-3.5 text-sm font-normal uppercase outline-none transition focus:border-[#176b50] focus:ring-2 focus:ring-[#176b50]/15"
                  id="ghana-post-gps-address"
                  maxLength={12}
                  name="ghana_post_gps_address"
                  onChange={(event) =>
                    setGpsAddress(event.target.value.replace(/\s/g, "").toUpperCase())
                  }
                  placeholder="e.g. VT-0123-4567"
                  value={gpsAddress}
                />
              </label>
              <p className="mt-1.5 text-xs font-normal leading-5 text-[#687672]">
                Example: VT-0123-4567 (Found on the GhanaPost GPS app or property blue plate)
              </p>
            </div>

            <label className="block text-sm font-semibold text-[#33413b]">
              Monthly rent (GH₵)
              <input
                className="mt-1.5 min-h-12 w-full rounded-xl border border-[#d9ddcf] bg-white px-3.5 text-sm font-normal outline-none transition focus:border-[#176b50] focus:ring-2 focus:ring-[#176b50]/15"
                min="1"
                name="monthlyRent"
                placeholder="e.g., 1500"
                required
                type="number"
              />
            </label>

            <label className="block text-sm font-semibold text-[#33413b]">
              Advance payment
              <select
                className="mt-1.5 min-h-12 w-full rounded-xl border border-[#d9ddcf] bg-white px-3.5 text-sm font-normal outline-none transition focus:border-[#176b50] focus:ring-2 focus:ring-[#176b50]/15"
                name="advance"
                required
                defaultValue=""
              >
                <option disabled value="">
                  Choose advance requirement
                </option>
                <option value="0.5">6 Months</option>
                <option value="1">1 Year</option>
                <option value="1.5">1.5 Years</option>
                <option value="2">2 Years</option>
              </select>
            </label>

            <label className="block text-sm font-semibold text-[#33413b]">
              Bedrooms
              <input
                className="mt-1.5 min-h-12 w-full rounded-xl border border-[#d9ddcf] bg-white px-3.5 text-sm font-normal outline-none transition focus:border-[#176b50] focus:ring-2 focus:ring-[#176b50]/15"
                min="0"
                name="bedrooms"
                required
                type="number"
                defaultValue="1"
              />
            </label>

            <label className="block text-sm font-semibold text-[#33413b]">
              Bathrooms
              <input
                className="mt-1.5 min-h-12 w-full rounded-xl border border-[#d9ddcf] bg-white px-3.5 text-sm font-normal outline-none transition focus:border-[#176b50] focus:ring-2 focus:ring-[#176b50]/15"
                min="0"
                name="bathrooms"
                required
                type="number"
                defaultValue="1"
              />
            </label>

            <label className="block text-sm font-semibold text-[#33413b] sm:col-span-2">
              Property description
              <textarea
                className="mt-1.5 min-h-32 w-full rounded-xl border border-[#d9ddcf] bg-white px-3.5 py-3 text-sm font-normal leading-6 outline-none transition focus:border-[#176b50] focus:ring-2 focus:ring-[#176b50]/15"
                maxLength={3000}
                name="description"
                placeholder="Describe the space and anything a potential tenant should know."
                required
              />
            </label>
          </div>
        </section>

        <section className="rounded-[22px] border border-[#e7e9e2] bg-white p-5 sm:p-8">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7b8982]">
              02 · AMENITIES &amp; FACILITIES
            </p>
            <h2 className="mt-2 text-xl font-bold tracking-[-0.04em] text-[#172b27]">
              What features and utilities does the property have?
            </h2>
          </div>
          <div className="space-y-7">
            <fieldset>
              <legend className="text-sm font-bold text-[#172b27]">
                ⚡💧 UTILITIES &amp; METERING
                <span className="ml-2 text-xs font-medium text-[#9b443b]">
                  Required
                </span>
              </legend>
              <div className="mt-4">
                <p className="text-xs font-semibold text-[#687672]">
                  Water Supply
                </p>
                <div className="mt-2 grid gap-3 sm:grid-cols-2">
                  {waterSourceOptions.map(({ value, label }) => {
                    const isSelected = waterSources.includes(value);
                    return (
                    <label
                      className={`flex min-h-14 cursor-pointer items-center justify-between gap-3 rounded-xl border p-3 text-sm transition-all focus-within:outline-none focus-within:ring-2 focus-within:ring-emerald-500 ${
                        isSelected
                          ? "border-emerald-600 bg-emerald-50/50 text-emerald-950"
                          : "border-slate-200 text-[#46534e] hover:border-slate-300"
                      }`}
                      key={value}
                    >
                      <input
                        checked={isSelected}
                        className="sr-only"
                        name="water_sources"
                        onChange={() => toggleWaterSource(value)}
                        type="checkbox"
                        value={value}
                      />
                      <span>{label}</span>
                      {isSelected && (
                        <span aria-label="Selected" className="shrink-0 font-bold text-emerald-700">✓</span>
                      )}
                    </label>
                    );
                  })}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs font-semibold text-[#687672]">
                  Electricity Metering
                </p>
                <div className="mt-2 grid gap-3 sm:grid-cols-2">
                  {meterTypes.map(({ value, label, selectedClass }) => (
                    <label
                      className={`flex min-h-14 cursor-pointer items-center justify-between gap-3 rounded-xl border p-3 text-sm transition-all hover:border-emerald-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-emerald-500 ${
                        meterType === value
                          ? selectedClass
                          : "border-slate-200 text-[#46534e]"
                      }`}
                      key={value}
                    >
                      <input
                        checked={meterType === value}
                        className="sr-only"
                        name="meter_type"
                        onChange={() => setMeterType(value)}
                        required
                        type="radio"
                        value={value}
                      />
                      <span>{label}</span>
                      {meterType === value && (
                        <Check aria-hidden="true" className="shrink-0" size={17} />
                      )}
                    </label>
                  ))}
                </div>
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-sm font-bold text-[#172b27]">
                🔑 COMFORTS, FACILITIES &amp; SECURITY
              </legend>
              <p className="mt-1 text-xs text-[#687672]">
                Select all that apply to help renters find your property.
              </p>
              <div className="mt-4 grid gap-5 md:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold text-[#687672]">Kitchen</p>
                  <div className="mt-2 grid gap-2">
                    {[
                      { value: "private", label: "🍳 Private Kitchen" },
                      { value: "shared", label: "👥 Shared Kitchen" },
                    ].map(({ value, label }) => (
                      <label
                        className={`flex min-h-12 cursor-pointer items-center justify-between gap-3 rounded-xl border p-3 text-sm transition-all hover:border-emerald-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-emerald-500 ${
                          kitchenType === value
                            ? "border-emerald-600 bg-emerald-50 text-emerald-900"
                            : "border-slate-200 text-[#46534e]"
                        }`}
                        key={value}
                      >
                        <input
                          checked={kitchenType === value}
                          className="sr-only"
                          name="kitchen_type"
                          onChange={() => setKitchenType(value)}
                          type="radio"
                          value={value}
                        />
                        <span>{label}</span>
                        {kitchenType === value && (
                          <Check aria-hidden="true" size={17} />
                        )}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#687672]">Bathroom</p>
                  <div className="mt-2 grid gap-2">
                    {[
                      { value: "private", label: "🚽 Private Bathroom (Self-Contain)" },
                      { value: "shared", label: "👥 Shared Bathroom" },
                    ].map(({ value, label }) => (
                      <label
                        className={`flex min-h-12 cursor-pointer items-center justify-between gap-3 rounded-xl border p-3 text-sm transition-all hover:border-emerald-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-emerald-500 ${
                          bathroomType === value
                            ? "border-emerald-600 bg-emerald-50 text-emerald-900"
                            : "border-slate-200 text-[#46534e]"
                        }`}
                        key={value}
                      >
                        <input
                          checked={bathroomType === value}
                          className="sr-only"
                          name="bathroom_type"
                          onChange={() => setBathroomType(value)}
                          type="radio"
                          value={value}
                        />
                        <span>{label}</span>
                        {bathroomType === value && (
                          <Check aria-hidden="true" size={17} />
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <p className="text-xs font-semibold text-[#687672]">
                  General Amenities &amp; Security
                </p>
                <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {generalAmenities.map(({ value, label }) => {
                    const isSelected = selectedAmenities.includes(value);
                    return (
                      <label
                        className={`flex min-h-12 cursor-pointer items-center justify-between gap-3 rounded-xl border p-3 text-sm transition-all hover:border-emerald-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-emerald-500 ${
                          isSelected
                            ? "border-emerald-600 bg-emerald-50 text-emerald-900"
                            : "border-slate-200 text-[#46534e]"
                        }`}
                        key={value}
                      >
                        <input
                          checked={isSelected}
                          className="sr-only"
                          name="amenities"
                          onChange={() => toggleAmenity(value)}
                          type="checkbox"
                          value={value}
                        />
                        <span>{label}</span>
                        {isSelected && (
                          <Check aria-hidden="true" className="shrink-0" size={17} />
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            </fieldset>
          </div>
        </section>

        <section className="rounded-[22px] border border-[#e7e9e2] bg-white p-5 sm:p-8">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7b8982]">
              03 · Contact details
            </p>
            <h2 className="mt-2 text-xl font-bold tracking-[-0.04em] text-[#172b27]">
              How can interested tenants reach you?
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-[#33413b] sm:col-span-2">
              Landlord / agent name
              <input
                autoComplete="name"
                className="mt-1.5 min-h-12 w-full rounded-xl border border-[#d9ddcf] bg-white px-3.5 text-sm font-normal outline-none transition focus:border-[#176b50] focus:ring-2 focus:ring-[#176b50]/15"
                maxLength={100}
                name="contactName"
                defaultValue={String(user.user_metadata.full_name ?? "")}
                required
              />
            </label>
            <label className="block text-sm font-semibold text-[#33413b]">
              Phone number
              <input
                autoComplete="tel"
                className="mt-1.5 min-h-12 w-full rounded-xl border border-[#d9ddcf] bg-white px-3.5 text-sm font-normal outline-none transition focus:border-[#176b50] focus:ring-2 focus:ring-[#176b50]/15"
                maxLength={20}
                name="phone"
                defaultValue={String(user.user_metadata.whatsapp_number ?? "")}
                pattern="^[0-9+() \-]{7,20}$"
                placeholder="e.g., 024 123 4567"
                required
                type="tel"
              />
            </label>
            <label className="block text-sm font-semibold text-[#33413b]">
              WhatsApp number
              <input
                autoComplete="tel"
                className="mt-1.5 min-h-12 w-full rounded-xl border border-[#d9ddcf] bg-white px-3.5 text-sm font-normal outline-none transition focus:border-[#176b50] focus:ring-2 focus:ring-[#176b50]/15"
                maxLength={20}
                name="whatsapp"
                defaultValue={String(user.user_metadata.whatsapp_number ?? "")}
                pattern="^[0-9+() \-]{7,20}$"
                placeholder="e.g., 024 123 4567"
                required
                type="tel"
              />
            </label>
          </div>
        </section>

        <section className="rounded-[22px] border border-[#e7e9e2] bg-white p-5 sm:p-8">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7b8982]">
              04 · Photos
            </p>
            <h2 className="mt-2 text-xl font-bold tracking-[-0.04em] text-[#172b27]">
              Help people picture their new home
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#687672]">
              Add up to {maximumImages} photos. Images must be 5 MB or smaller.
              Photos are uploaded with your listing submission.
            </p>
          </div>

          <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#bdcbb8] bg-[#f8faf5] px-5 py-6 text-center transition hover:bg-[#f1f6ed]">
            <ImagePlus aria-hidden="true" className="text-[#176b50]" size={25} />
            <span className="mt-2 text-sm font-bold text-[#176b50]">
              Choose property photos
            </span>
            <span className="mt-1 text-xs text-[#687672]">
              JPG, PNG, or other image format
            </span>
            <input
              accept="image/*"
              className="sr-only"
              multiple
              onChange={handleImagesChange}
              type="file"
            />
          </label>

          {previews.length > 0 && (
            <ul aria-label="Selected photo previews" className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {previews.map(({ file, url }, index) => (
                <li className="relative aspect-square overflow-hidden rounded-xl border border-[#e7e9e2]" key={`${file.name}-${index}`}>
                  <Image
                    alt={`Selected property photo ${index + 1}: ${file.name}`}
                    className="object-cover"
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    src={url}
                    unoptimized
                  />
                  <button
                    aria-label={`Remove ${file.name}`}
                    className="absolute right-2 top-2 flex size-9 items-center justify-center rounded-full bg-white/95 text-[#9b443b] shadow transition hover:bg-white"
                    onClick={() =>
                      setImages((current) =>
                        current.filter((_, imageIndex) => imageIndex !== index),
                      )
                    }
                    type="button"
                  >
                    <Trash2 aria-hidden="true" size={16} />
                  </button>
                  <span className="block truncate px-2 py-1.5 text-xs text-[#53625d]">
                    {file.name}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {formError && (
          <p
            aria-live="assertive"
            className="rounded-xl border border-[#f1ccc4] bg-white px-4 py-3 text-sm text-[#8b332a]"
            role="alert"
          >
            {formError}
          </p>
        )}

        <div className="flex flex-col gap-3 pb-8 sm:flex-row sm:justify-end">
          <Link
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#d7ded4] px-6 text-sm font-bold text-[#53625d] transition hover:bg-white"
            href="/#homes"
          >
            Cancel
          </Link>
          <button
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#176b50] px-7 text-sm font-bold text-white transition hover:bg-[#10533e] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
          >
            <CheckCircle2 aria-hidden="true" size={17} />
            {isSubmitting ? "Submitting listing…" : "Submit listing for review"}
          </button>
        </div>
      </form>
    </main>
  );
}
