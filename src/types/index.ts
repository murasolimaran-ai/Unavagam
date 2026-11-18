export type ServiceType = 'Turf' | 'Resort' | 'Restaurant';

export type BookingType = 'Slot Booking' | 'Room Booking' | 'Food Order' | 'Table Reservation';

export type PaymentMethod = 'UPI' | 'Card' | 'Cash';

export type PaymentStatus = 'Paid' | 'Pending' | 'Failed' | 'Refunded';

export type GeneralBookingStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

export type TurfSlotStatus = 'Available' | 'Booked' | 'Blocked';

export interface TurfConfig {
  id: string;
  name: string;
  tagline: string;
  description: string;
  dimensions: string;
  surface: string;
  capacity: string;
  lighting: string;
  operatingHours: string;
  baseHourlyPrice: number;
  weekdayPrice: number;
  weekendPrice: number;
  peakHourPrice: number;
  peakSlots: string[];
  specialOfferText: string;
  image: string;
  amenities: string[];
}

export interface TurfBooking {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  date: string; // YYYY-MM-DD
  slots: string[]; // 1 or 2 consecutive slots
  durationHours: number;
  teamName?: string;
  playersCount: number;
  baseAmount: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  couponCode?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  bookingStatus: GeneralBookingStatus;
  notes?: string;
  createdAt: string;
}

export interface BlockedTurfSlot {
  date: string;
  slot: string;
  reason: string;
}

export type RoomStatus = 'Available' | 'Occupied' | 'Reserved' | 'Cleaning' | 'Maintenance';

export interface ResortRoomCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  maxAdults: number;
  maxChildren: number;
  bedType: string;
  sizeSqFt: number;
  weekdayPrice: number;
  weekendPrice: number;
  seasonalMultiplier: number; // e.g., 1.15
  extraBedPrice: number;
  amenities: string[];
  image: string;
  specialOffer?: string;
}

export interface ResortRoom {
  id: string;
  roomNumber: string;
  categoryId: string;
  floor: string;
  status: RoomStatus;
  notes?: string;
}

export interface ResortAddon {
  id: string;
  name: string;
  price: number;
  unit: 'per stay' | 'per night';
}

export type ResortBookingStatus = 'Pending' | 'Confirmed' | 'Checked-in' | 'Completed' | 'Cancelled';

export interface ResortBooking {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  categoryId: string;
  categoryName: string;
  roomCount: number;
  assignedRoomNumbers: string[];
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  nights: number;
  adults: number;
  children: number;
  extraBeds: number;
  selectedAddons: string[];
  roomSubtotal: number;
  extraBedTotal: number;
  addonsTotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  couponCode?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  bookingStatus: ResortBookingStatus;
  specialRequests?: string;
  createdAt: string;
}

export interface FoodCategory {
  id: string;
  name: string;
  description: string;
  sortOrder: number;
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  price: number;
  isVeg: boolean;
  available: boolean;
  featured: boolean;
  prepTimeMins: number;
  image: string;
  customizations: string[];
}

export type FulfilmentType = 'Dine-in' | 'Takeaway' | 'Home Delivery';

export type FoodOrderStatus =
  | 'New'
  | 'Accepted'
  | 'Preparing'
  | 'Ready'
  | 'Out for Delivery'
  | 'Completed'
  | 'Cancelled';

export interface FoodOrderItem {
  foodItemId: string;
  name: string;
  price: number;
  quantity: number;
  isVeg: boolean;
  customization?: string;
}

export interface FoodOrder {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  items: FoodOrderItem[];
  fulfilmentType: FulfilmentType;
  tableNumber?: string;
  pickupTime?: string;
  deliveryAddress?: string;
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  couponCode?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: FoodOrderStatus;
  notes?: string;
  createdAt: string;
}

export type TableStatus = 'Available' | 'Reserved' | 'Occupied' | 'Maintenance';

export interface RestaurantTable {
  id: string;
  tableNumber: string;
  seats: number;
  zone: 'Indoor Hall' | 'Garden Courtyard' | 'Private Alcove';
  status: TableStatus;
}

export type TableReservationStatus = 'Pending' | 'Confirmed' | 'Seated' | 'Completed' | 'Cancelled';

export interface TableReservation {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  date: string;
  timeSlot: string;
  guests: number;
  tableId: string;
  tableNumber: string;
  occasion?: string;
  specialRequests?: string;
  status: TableReservationStatus;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  savedAddresses: string[];
  registrationDate: string;
  notes?: string;
}

export interface PaymentTransaction {
  id: string;
  bookingId: string;
  bookingType: BookingType;
  customerId: string;
  customerName: string;
  service: ServiceType;
  method: PaymentMethod;
  amount: number;
  date: string;
  status: PaymentStatus;
}

export interface Coupon {
  id: string;
  code: string;
  title: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  maxDiscount: number;
  validFrom: string;
  validUntil: string;
  applicableService: 'All' | ServiceType;
  active: boolean;
}

export interface PlatformNotification {
  id: string;
  type:
    | 'New Turf Booking'
    | 'New Resort Booking'
    | 'New Food Order'
    | 'New Table Reservation'
    | 'Payment Success'
    | 'Booking Cancellation';
  service: ServiceType;
  title: string;
  message: string;
  relatedBookingId: string;
  createdAt: string;
  read: boolean;
}

export type StaffRole =
  | 'Super Admin'
  | 'Turf Manager'
  | 'Resort Manager'
  | 'Restaurant Manager'
  | 'Reception Staff'
  | 'Kitchen Staff';

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  active: boolean;
  joinedDate: string;
}

export interface BusinessSettings {
  businessName: string;
  tagline: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  website: string;
  gstNumber: string;
  turfHours: string;
  resortCheckInTime: string;
  resortCheckOutTime: string;
  restaurantHours: string;
  gstRatePercent: number;
  deliveryFee: number;
  turfCancellationHours: number;
  resortCancellationHours: number;
  enableUPI: boolean;
  enableCard: boolean;
  enableCash: boolean;
  seasonalPricingActive: boolean;
}

export interface CartItem {
  foodItemId: string;
  quantity: number;
  customization?: string;
}
