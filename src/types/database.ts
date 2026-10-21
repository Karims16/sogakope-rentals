export interface Property {
  id: string;
  title: string;
  description: string;
  property_type: string;
  location: string;
  landmark: string;
  ghana_post_gps_address?: string | null;
  water_source?: string | null;
  water_sources?: string[] | null;
  meter_type?: string | null;
  bathroom_type?: string | null;
  kitchen_type?: string | null;
  price_per_month: number;
  advance_years: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: string[];
  landlord_name: string;
  landlord_phone: string;
  landlord_whatsapp: string;
  user_id?: string | null;
  status: "pending" | "approved" | "rejected";
  is_available: boolean;
  is_featured: boolean;
  created_at: string;
}

export interface PropertyReport {
  id: string;
  property_id: string;
  reason: string;
  details: string;
  contact_email: string;
  reporter_phone?: string | null;
  status?: "pending" | "resolved";
  created_at: string;
}
