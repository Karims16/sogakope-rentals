export interface DemoProperty {
  id: number;
  title: string;
  location: string;
  type: "House" | "Apartment" | "Room";
  rent: number;
  beds: number;
  baths: number;
  art: string;
  accent: string;
  description: string;
  landmark: string;
  advanceYears: number;
  amenities: string[];
}

export const demoProperties: DemoProperty[] = [
  {
    id: 1,
    title: "Airy family home",
    location: "Sogakope, South Tongu",
    type: "House",
    rent: 1800,
    beds: 3,
    baths: 2,
    art: "listing-art-one",
    accent: "bg-[#e1efd3]",
    description:
      "Illustrative preview content for a family home. This is not a verified rental listing or a description of an available property.",
    landmark: "No verified landmark provided",
    advanceYears: 1,
    amenities: ["Parking", "Water supply", "Outdoor space"],
  },
  {
    id: 2,
    title: "Bright two-bedroom flat",
    location: "Sogakope, South Tongu",
    type: "Apartment",
    rent: 1200,
    beds: 2,
    baths: 1,
    art: "listing-art-two",
    accent: "bg-[#e1e9e7]",
    description:
      "Illustrative preview content for an apartment. This is not a verified rental listing or a description of an available property.",
    landmark: "No verified landmark provided",
    advanceYears: 1,
    amenities: ["Water supply", "Tiled floors"],
  },
  {
    id: 3,
    title: "Private room near town",
    location: "Sogakope, South Tongu",
    type: "Room",
    rent: 500,
    beds: 1,
    baths: 1,
    art: "listing-art-three",
    accent: "bg-[#f1e7d6]",
    description:
      "Illustrative preview content for a room. This is not a verified rental listing or a description of an available property.",
    landmark: "No verified landmark provided",
    advanceYears: 1,
    amenities: ["Shared kitchen", "Water supply"],
  },
];
