export enum ViewState {
  HOME = 'HOME',
  ROOMS = 'ROOMS',
  BANQUETS = 'BANQUETS',
  DINING = 'DINING',
  TOURS = 'TOURS',
  GALLERY = 'GALLERY',
  GUIDE = 'GUIDE',
  ADMIN_LOGIN = 'ADMIN_LOGIN',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

// Auth Types
export type AdminRole = 'MASTER' | 'ADMIN';

export interface AdminUser {
  id: string; // Login ID
  password: string;
  name: string;
  role: AdminRole;
}

export interface PaymentConfig {
  upiId: string;
  accountName: string;
  gatewayLink: string;
  bankDetails: string;
  qrCode?: string; // Base64 or URL
}

export interface Coupon {
  id: string;
  code: string;
  type: 'FLAT' | 'PERCENT';
  value: number;
}

// Content Types
export interface Room {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  features: string[];
  inventory: number;
}

export interface FeatureIconMapping {
  id: string;
  keyword: string;
  icon: string;
}

export interface TourPackage {
  id: string;
  name: string;
  duration: string;
  price: number;
  description: string;
  image: string;
  shuttle: string;
  places: string[];
  shopping: string[];
  itinerary: { time: string; activity: string }[];
}

export interface VaranasiSpot {
  id: string;
  name: string;
  category: 'Ghats & Temples' | 'Famous Shops' | 'Fleet Destinations';
  description: string;
  image: string;
  location: string;
}

export interface MenuCategory {
  category: string;
  items: MenuItem[];
}

export interface MenuItem {
  name: string;
  price: number;
  desc: string;
  veg: boolean;
}

export interface BanquetVenue {
  id: string;
  name: string;
  capacity: string;
  description: string;
  image: string;
}

export interface DiningPackage {
  id: string;
  name: string;
  location: string;
  basePrice: number;
  image: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  category: string;
  title: string;
}

export interface GeneralInfo {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  logoTitle: string;
  logoSubtitle: string;
}

// Transaction Types
export interface Booking {
  id: string;
  customerName: string;
  date: string;
  type: 'Room' | 'Dining' | 'Tour';
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  amount: number;
  details: string; // e.g. "Deluxe Room, 2 Guests"
  paymentMethod?: string;
  couponUsed?: string;
  month?: number; // 0-11
  year?: number;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'Banquet' | 'General';
  date: string;
  details: string; // e.g. "Wedding for 500 pax"
  status: 'New' | 'Replied';
}