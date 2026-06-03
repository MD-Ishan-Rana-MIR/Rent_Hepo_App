export interface OTPVerifyProps {
  email: string;
}

export interface OTPState {
  code: string[]; // ['1', '2', '3', '4']
  isValid: boolean;
}
export interface PropertyImage {
  path: string;
  name: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatar_url: string;
}

export interface PropertyDetails {
  id: number;
  landlord_id: number;
  title: string;
  description: string;
  purpose: "Sale" | "Rent"; // Based on context
  property_category: string;
  price: string;
  total_area: string;
  availability: "Available" | "Unavailable";
  location: string;
  lat: string;
  long: string;
  amenities: string[];
  property_images: PropertyImage[];
  status: "Approved" | "Pending" | "Rejected";
  admin_display_status: "Show" | "Hide";
  created_at: string;
  updated_at: string;
  landlord: UserProfile;
}

export interface BookingData {
  id: number;
  track_id: string;
  property_id: number;
  tenant_id: number;
  name: string; // Name provided in the booking form
  phone_number: string;
  booking_date: string;
  booking_time: string;
  status: "Pending" | "Approved" | "Cancelled";
  created_at: string;
  updated_at: string;
  property: PropertyDetails;
  tenant: UserProfile;
  booking_track_id: string;
}
type PropertyImageType = {
  path: string;
  name: string;
};

export interface Property {
  id: number;
  landlord_id: number;
  currency_symbol: string;
  currency: string;
  title: string;
  description: string;
  purpose: "Sale" | "Rent";
  property_category: "Residential" | "Commercial" | "Land";
  price: number; // comes as string from API
  total_area: number; // also string
  availability: "Available" | "Unavailable";
  location: string;
  lat: string;
  long: string;
  amenities: string[];
  property_images: PropertyImageType[];
  status: "Approved" | "Pending" | "Rejected";
  admin_display_status: "Show" | "Hide";
  created_at: string;
  updated_at: string;
}

type PropertyDetailsImage = {
  path: string;
  name: string;
};

type Landlord = {
  id: number;
  name: string;
  email: string;
  status: "Active" | "Inactive";
  avatar_url: string;
  phone_number: string;
};

export interface PropertyResponseType {
  currency_symbol: string;
  currency: string;
  id: number;
  landlord_id: number;
  title: string;
  description: string;
  purpose: "Sale" | "Rent";
  property_category: "Residential" | "Commercial" | "Land";
  price: string; // API দেয় string
  total_area: string; // API দেয় string
  availability: "Available" | "Unavailable";
  location: string;
  lat: string;
  long: string;
  amenities: string[];
  property_images: PropertyDetailsImage[];
  status: "Approved" | "Pending" | "Rejected";
  admin_display_status: "Show" | "Hide";
  created_at: string;
  updated_at: string;
  landlord: Landlord;
}

export interface PropertyDetailsBooking {
  id: number;
  landlord_id: number;
  title: string;
  description: string;
  purpose: string;
  property_category: string;
  price: string;
  total_area: string;
  availability: string;
  location: string;
  lat: string;
  long: string;
  amenities: string[];
  property_images: PropertyImage[];
  status: string;
  admin_display_status: string;
  created_at: string;
  updated_at: string;
}

export interface Tenant {
  id: number;
  name: string;
  role: "TENANT" | string;
  email: string;
  email_verified_at: string;
  status: string;
  otp_verified_at: string | null;
  otp: string | null;
  otp_expires_at: string | null;
  phone_number: string | null;
  address: string | null;
  avatar: string | null;
  google_id: string | null;
  login_status: number;
  last_active: string | null;
  created_at: string;
  updated_at: string;
  avatar_url: string;
}

export interface BookingBookingDetails {
  id: number;
  track_id: string;
  property_id: number;
  tenant_id: number;
  name: string;
  phone_number: string;
  booking_date: string;
  booking_time: string;
  status: "Pending" | "Accepted" | "Rejected" | string;
  created_at: string;
  updated_at: string;
  property: PropertyDetailsBooking;
  tenant: Tenant;
  booking_track_id: string;
}

export interface LandlordProperty {
  currency_symbol: string;
  currency: string;
  id: number;
  landlord_id: number;
  title: string;
  description: string;
  purpose: "Sale" | "Rent"; // API রেসপন্স অনুযায়ী নির্দিষ্ট করা হয়েছে
  property_category: "Residential" | "Commercial";
  price: string;
  total_area: string;
  availability: string;
  location: string;
  lat: string;
  long: string;
  amenities: string[];
  property_images: PropertyImage[];
  status: "Pending" | "Accepted" | "Rejected";
  admin_display_status: "Show" | "Hide";
  created_at: string;
  updated_at: string;
}

export interface LandlordInfo {
  id: number;
  name: string;
  email: string;
  status: "Active" | "Inactive";
  avatar_url: string;
}

export interface LandlordPropertyDetails {
  currency_symbol: string;
  currency: string;
  id: number;
  landlord_id: number;
  title: string;
  description: string;
  purpose: "Rent" | "Sale";
  property_category: "Residential" | "Commercial";
  price: string;
  total_area: string;
  availability: "Available" | "Unavailable" | "Sold";
  location: string;
  lat: string;
  long: string;
  amenities: string[];
  property_images: PropertyImage[];
  status: "Pending" | "Accepted" | "Rejected";
  admin_display_status: "Show" | "Hide";
  created_at: string;
  updated_at: string;
  landlord: LandlordInfo;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export interface CurrencyType {
  code: string;
  name: string;
  symbol: string;
}
