import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  BlockedTurfSlot,
  BusinessSettings,
  CartItem,
  Coupon,
  Customer,
  FoodCategory,
  FoodItem,
  FoodOrder,
  FoodOrderStatus,
  FulfilmentType,
  GeneralBookingStatus,
  PaymentMethod,
  PaymentStatus,
  PaymentTransaction,
  PlatformNotification,
  ResortBooking,
  ResortBookingStatus,
  ResortRoom,
  ResortRoomCategory,
  RestaurantTable,
  RoomStatus,
  ServiceType,
  StaffMember,
  TableReservation,
  TableReservationStatus,
  TableStatus,
  TurfBooking,
  TurfConfig,
  TurfSlotStatus,
} from '../types';
import { buildSeedData } from '../data/seedData';
import {
  addDays,
  datesOverlap,
  diffNights,
  generateId,
  getTodayIST,
  isWeekendDate,
  TURF_SLOTS,
} from '../utils/format';

const STORAGE_KEY = 'kaveri_palms_unified_platform_v1';

interface PersistedState {
  customers: Customer[];
  turfConfig: TurfConfig;
  blockedTurfSlots: BlockedTurfSlot[];
  turfBookings: TurfBooking[];
  roomCategories: ResortRoomCategory[];
  resortRooms: ResortRoom[];
  resortBookings: ResortBooking[];
  foodCategories: FoodCategory[];
  foodItems: FoodItem[];
  foodOrders: FoodOrder[];
  restaurantTables: RestaurantTable[];
  tableReservations: TableReservation[];
  payments: PaymentTransaction[];
  coupons: Coupon[];
  notifications: PlatformNotification[];
  staff: StaffMember[];
  settings: BusinessSettings;
  currentCustomerId: string | null;
  isAdminAuthenticated: boolean;
  cart: CartItem[];
}

function loadInitialState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PersistedState>;
      if (parsed && parsed.turfConfig && parsed.roomCategories && parsed.foodItems) {
        const seed = buildSeedData();
        return {
          customers: parsed.customers || seed.customers,
          turfConfig: parsed.turfConfig || seed.turfConfig,
          blockedTurfSlots: parsed.blockedTurfSlots || seed.blockedTurfSlots,
          turfBookings: parsed.turfBookings || seed.turfBookings,
          roomCategories: parsed.roomCategories || seed.roomCategories,
          resortRooms: parsed.resortRooms || seed.resortRooms,
          resortBookings: parsed.resortBookings || seed.resortBookings,
          foodCategories: parsed.foodCategories || seed.foodCategories,
          foodItems: parsed.foodItems || seed.foodItems,
          foodOrders: parsed.foodOrders || seed.foodOrders,
          restaurantTables: parsed.restaurantTables || seed.restaurantTables,
          tableReservations: parsed.tableReservations || seed.tableReservations,
          payments: parsed.payments || seed.payments,
          coupons: parsed.coupons || seed.coupons,
          notifications: parsed.notifications || seed.notifications,
          staff: parsed.staff || seed.staff,
          settings: parsed.settings || seed.settings,
          currentCustomerId: parsed.currentCustomerId !== undefined ? parsed.currentCustomerId : 'CUST-101',
          isAdminAuthenticated: Boolean(parsed.isAdminAuthenticated),
          cart: parsed.cart || [],
        };
      }
    }
  } catch {
    // Fallback to seed data
  }
  const seed = buildSeedData();
  return {
    ...seed,
    currentCustomerId: 'CUST-101',
    isAdminAuthenticated: false,
    cart: [],
  };
}

interface PlatformContextValue extends PersistedState {
  resortAddons: ReturnType<typeof buildSeedData>['resortAddons'];
  currentCustomer: Customer | null;

  // Auth
  loginCustomer: (emailOrPhone: string) => { ok: boolean; error?: string };
  registerCustomer: (data: { name: string; email: string; phone: string; address?: string }) => Customer;
  logoutCustomer: () => void;
  updateCustomerProfile: (id: string, patch: Partial<Customer>) => void;
  loginAdmin: (email: string, password: string) => { ok: boolean; error?: string };
  logoutAdmin: () => void;

  // Cart
  addToCart: (foodItemId: string, quantity?: number, customization?: string) => void;
  updateCartQty: (foodItemId: string, quantity: number, customization?: string) => void;
  removeFromCart: (foodItemId: string, customization?: string) => void;
  clearCart: () => void;

  // Coupons
  validateCoupon: (
    code: string,
    service: ServiceType,
    subtotal: number
  ) => { valid: boolean; discount: number; coupon?: Coupon; message: string };
  addCoupon: (coupon: Omit<Coupon, 'id'>) => void;
  updateCoupon: (id: string, patch: Partial<Coupon>) => void;
  toggleCouponActive: (id: string) => void;

  // Turf Logic & Operations
  getTurfSlotStatus: (date: string, slot: string) => {
    status: TurfSlotStatus;
    booking?: TurfBooking;
    blockReason?: string;
  };
  getTurfSlotPrice: (date: string, slot: string) => number;
  createTurfBooking: (payload: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    date: string;
    slots: string[];
    teamName?: string;
    playersCount: number;
    couponCode?: string;
    paymentMethod: PaymentMethod;
    simulateFailure?: boolean;
    notes?: string;
  }) => { ok: boolean; booking?: TurfBooking; error?: string };
  updateTurfBookingStatus: (id: string, status: GeneralBookingStatus) => void;
  toggleBlockTurfSlot: (date: string, slot: string, reason?: string) => void;
  updateTurfConfig: (patch: Partial<TurfConfig>) => void;

  // Resort Logic & Operations
  getCategoryAvailableCount: (categoryId: string, checkIn: string, checkOut: string) => number;
  calculateResortQuote: (params: {
    categoryId: string;
    checkIn: string;
    checkOut: string;
    roomCount: number;
    extraBeds: number;
    selectedAddons?: string[];
    couponCode?: string;
  }) => {
    nights: number;
    roomSubtotal: number;
    extraBedTotal: number;
    addonsTotal: number;
    discountAmount: number;
    taxAmount: number;
    totalAmount: number;
  };
  createResortBooking: (payload: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    categoryId: string;
    roomCount: number;
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
    extraBeds: number;
    selectedAddons?: string[];
    couponCode?: string;
    paymentMethod: PaymentMethod;
    simulateFailure?: boolean;
    specialRequests?: string;
  }) => { ok: boolean; booking?: ResortBooking; error?: string };
  updateResortBookingStatus: (id: string, status: ResortBookingStatus) => void;
  assignResortRooms: (bookingId: string, roomNumbers: string[]) => void;
  updateRoomStatus: (roomId: string, status: RoomStatus) => void;
  addResortRoom: (room: Omit<ResortRoom, 'id'>) => void;
  updateResortRoom: (id: string, patch: Partial<ResortRoom>) => void;
  addResortCategory: (cat: Omit<ResortRoomCategory, 'id'>) => void;
  updateResortCategory: (id: string, patch: Partial<ResortRoomCategory>) => void;

  // Restaurant Food Logic & Operations
  createFoodOrder: (payload: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    items: { foodItemId: string; quantity: number; customization?: string }[];
    fulfilmentType: FulfilmentType;
    tableNumber?: string;
    pickupTime?: string;
    deliveryAddress?: string;
    couponCode?: string;
    paymentMethod: PaymentMethod;
    simulateFailure?: boolean;
    notes?: string;
  }) => { ok: boolean; order?: FoodOrder; error?: string };
  updateFoodOrderStatus: (id: string, status: FoodOrderStatus) => void;
  addFoodItem: (item: Omit<FoodItem, 'id'>) => void;
  updateFoodItem: (id: string, patch: Partial<FoodItem>) => void;
  deleteFoodItem: (id: string) => void;
  toggleFoodAvailability: (id: string) => void;
  addFoodCategory: (cat: Omit<FoodCategory, 'id'>) => void;
  updateFoodCategory: (id: string, patch: Partial<FoodCategory>) => void;
  deleteFoodCategory: (id: string) => void;
  reorderFoodCategory: (id: string, direction: 'up' | 'down') => void;

  // Table & Reservation Logic
  isTableAvailableAt: (tableId: string, date: string, timeSlot: string) => boolean;
  createTableReservation: (payload: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    date: string;
    timeSlot: string;
    guests: number;
    tableId: string;
    occasion?: string;
    specialRequests?: string;
  }) => { ok: boolean; reservation?: TableReservation; error?: string };
  updateTableReservationStatus: (id: string, status: TableReservationStatus) => void;
  updateTableStatus: (id: string, status: TableStatus) => void;
  addTable: (table: Omit<RestaurantTable, 'id'>) => void;
  updateTable: (id: string, patch: Partial<RestaurantTable>) => void;

  // Shared Operations
  updatePaymentStatus: (id: string, status: PaymentStatus) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addStaff: (member: Omit<StaffMember, 'id'>) => void;
  updateStaff: (id: string, patch: Partial<StaffMember>) => void;
  updateSettings: (patch: Partial<BusinessSettings>) => void;
  resetDemoData: () => void;
}

const PlatformContext = createContext<PlatformContextValue | null>(null);

export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PersistedState>(() => loadInitialState());
  const seedRef = buildSeedData();

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota warnings
    }
  }, [state]);

  const currentCustomer =
    state.customers.find((c) => c.id === state.currentCustomerId) || null;

  const upsertCustomerFromContact = (
    customersList: Customer[],
    info: { name: string; phone: string; email: string; address?: string }
  ): { customer: Customer; updatedList: Customer[] } => {
    const cleanEmail = info.email.trim().toLowerCase();
    const cleanPhone = info.phone.trim();
    const existing = customersList.find(
      (c) =>
        (cleanEmail && c.email.toLowerCase() === cleanEmail) ||
        (cleanPhone && c.phone.replace(/\s+/g, '') === cleanPhone.replace(/\s+/g, ''))
    );
    if (existing) {
      const addresses =
        info.address && !existing.savedAddresses.includes(info.address)
          ? [...existing.savedAddresses, info.address]
          : existing.savedAddresses;
      const updated = { ...existing, name: info.name || existing.name, savedAddresses: addresses };
      return {
        customer: updated,
        updatedList: customersList.map((c) => (c.id === existing.id ? updated : c)),
      };
    }
    const created: Customer = {
      id: generateId('CUST'),
      name: info.name.trim(),
      phone: cleanPhone,
      email: info.email.trim(),
      savedAddresses: info.address ? [info.address] : [],
      registrationDate: getTodayIST(),
    };
    return { customer: created, updatedList: [created, ...customersList] };
  };

  // Auth
  const loginCustomer = (emailOrPhone: string) => {
    const q = emailOrPhone.trim().toLowerCase();
    const match = state.customers.find(
      (c) =>
        c.email.toLowerCase() === q ||
        c.phone.replace(/\s+/g, '').includes(q.replace(/\s+/g, ''))
    );
    if (!match) {
      return { ok: false, error: 'No customer account found with that email or phone.' };
    }
    setState((prev) => ({ ...prev, currentCustomerId: match.id }));
    return { ok: true };
  };

  const registerCustomer = (data: {
    name: string;
    email: string;
    phone: string;
    address?: string;
  }) => {
    const newCust: Customer = {
      id: generateId('CUST'),
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      savedAddresses: data.address ? [data.address.trim()] : [],
      registrationDate: getTodayIST(),
    };
    setState((prev) => ({
      ...prev,
      customers: [newCust, ...prev.customers],
      currentCustomerId: newCust.id,
    }));
    return newCust;
  };

  const logoutCustomer = () => {
    setState((prev) => ({ ...prev, currentCustomerId: null }));
  };

  const updateCustomerProfile = (id: string, patch: Partial<Customer>) => {
    setState((prev) => ({
      ...prev,
      customers: prev.customers.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }));
  };

  const loginAdmin = (email: string, password: string) => {
    if (
      email.trim().toLowerCase() === 'admin@kaveripalms.in' &&
      password === 'admin123'
    ) {
      setState((prev) => ({ ...prev, isAdminAuthenticated: true }));
      return { ok: true };
    }
    return { ok: false, error: 'Invalid Super Admin credentials. Use demo credentials provided.' };
  };

  const logoutAdmin = () => {
    setState((prev) => ({ ...prev, isAdminAuthenticated: false }));
  };

  // Cart
  const addToCart = (foodItemId: string, quantity = 1, customization?: string) => {
    setState((prev) => {
      const idx = prev.cart.findIndex(
        (i) => i.foodItemId === foodItemId && (i.customization || '') === (customization || '')
      );
      if (idx >= 0) {
        const next = [...prev.cart];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
        return { ...prev, cart: next };
      }
      return { ...prev, cart: [...prev.cart, { foodItemId, quantity, customization }] };
    });
  };

  const updateCartQty = (foodItemId: string, quantity: number, customization?: string) => {
    setState((prev) => {
      if (quantity <= 0) {
        return {
          ...prev,
          cart: prev.cart.filter(
            (i) => !(i.foodItemId === foodItemId && (i.customization || '') === (customization || ''))
          ),
        };
      }
      return {
        ...prev,
        cart: prev.cart.map((i) =>
          i.foodItemId === foodItemId && (i.customization || '') === (customization || '')
            ? { ...i, quantity }
            : i
        ),
      };
    });
  };

  const removeFromCart = (foodItemId: string, customization?: string) => {
    setState((prev) => ({
      ...prev,
      cart: prev.cart.filter(
        (i) => !(i.foodItemId === foodItemId && (i.customization || '') === (customization || ''))
      ),
    }));
  };

  const clearCart = () => setState((prev) => ({ ...prev, cart: [] }));

  // Coupons
  const validateCoupon = (code: string, service: ServiceType, subtotal: number) => {
    const clean = code.trim().toUpperCase();
    if (!clean) return { valid: false, discount: 0, message: 'Enter a coupon code.' };
    const coupon = state.coupons.find((c) => c.code.toUpperCase() === clean);
    if (!coupon) return { valid: false, discount: 0, message: 'Coupon code not recognized.' };
    if (!coupon.active) return { valid: false, discount: 0, message: 'This coupon is currently inactive.' };
    const today = getTodayIST();
    if (today < coupon.validFrom || today > coupon.validUntil) {
      return { valid: false, discount: 0, message: 'This coupon has expired.' };
    }
    if (coupon.applicableService !== 'All' && coupon.applicableService !== service) {
      return {
        valid: false,
        discount: 0,
        message: `Valid only on ${coupon.applicableService} bookings.`,
      };
    }
    if (subtotal < coupon.minOrderAmount) {
      return {
        valid: false,
        discount: 0,
        message: `Minimum order ₹${coupon.minOrderAmount} required.`,
      };
    }
    const rawDiscount =
      coupon.discountType === 'percentage'
        ? Math.round((subtotal * coupon.discountValue) / 100)
        : coupon.discountValue;
    const discount = Math.min(rawDiscount, coupon.maxDiscount, subtotal);
    return {
      valid: true,
      discount,
      coupon,
      message: `${coupon.title} applied (-₹${discount})`,
    };
  };

  const addCoupon = (coupon: Omit<Coupon, 'id'>) => {
    setState((prev) => ({
      ...prev,
      coupons: [{ ...coupon, id: generateId('CPN') }, ...prev.coupons],
    }));
  };

  const updateCoupon = (id: string, patch: Partial<Coupon>) => {
    setState((prev) => ({
      ...prev,
      coupons: prev.coupons.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }));
  };

  const toggleCouponActive = (id: string) => {
    setState((prev) => ({
      ...prev,
      coupons: prev.coupons.map((c) => (c.id === id ? { ...c, active: !c.active } : c)),
    }));
  };

  // Turf Logic
  const getTurfSlotStatus = (date: string, slot: string) => {
    const blocked = state.blockedTurfSlots.find((b) => b.date === date && b.slot === slot);
    if (blocked) {
      return { status: 'Blocked' as TurfSlotStatus, blockReason: blocked.reason };
    }
    const booking = state.turfBookings.find(
      (b) => b.date === date && b.bookingStatus !== 'Cancelled' && b.slots.includes(slot)
    );
    if (booking) {
      return { status: 'Booked' as TurfSlotStatus, booking };
    }
    return { status: 'Available' as TurfSlotStatus };
  };

  const getTurfSlotPrice = (date: string, slot: string) => {
    const isPeak = state.turfConfig.peakSlots.includes(slot);
    if (isPeak) return state.turfConfig.peakHourPrice;
    if (isWeekendDate(date)) return state.turfConfig.weekendPrice;
    return state.turfConfig.weekdayPrice;
  };

  const createTurfBooking = (payload: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    date: string;
    slots: string[];
    teamName?: string;
    playersCount: number;
    couponCode?: string;
    paymentMethod: PaymentMethod;
    simulateFailure?: boolean;
    notes?: string;
  }) => {
    if (!payload.slots.length) {
      return { ok: false, error: 'Please select at least one time slot.' };
    }
    // Check conflicts
    for (const slot of payload.slots) {
      const check = getTurfSlotStatus(payload.date, slot);
      if (check.status !== 'Available') {
        return {
          ok: false,
          error: `Slot ${slot} is already ${check.status.toLowerCase()}. Please choose another slot.`,
        };
      }
    }
    if (payload.simulateFailure) {
      return { ok: false, error: 'Payment authorization declined by bank simulator. Please retry.' };
    }

    const baseAmount = payload.slots.reduce(
      (sum, slot) => sum + getTurfSlotPrice(payload.date, slot),
      0
    );
    let discountAmount = 0;
    if (payload.couponCode) {
      const res = validateCoupon(payload.couponCode, 'Turf', baseAmount);
      if (res.valid) discountAmount = res.discount;
    }
    const taxable = Math.max(0, baseAmount - discountAmount);
    const taxAmount = Math.round((taxable * state.settings.gstRatePercent) / 100);
    const totalAmount = taxable + taxAmount;

    const paymentStatus: PaymentStatus = payload.paymentMethod === 'Cash' ? 'Pending' : 'Paid';
    const bookingStatus: GeneralBookingStatus =
      payload.paymentMethod === 'Cash' ? 'Pending' : 'Confirmed';

    const { customer, updatedList } = upsertCustomerFromContact(state.customers, {
      name: payload.customerName,
      phone: payload.customerPhone,
      email: payload.customerEmail,
    });

    const booking: TurfBooking = {
      id: generateId('TRF'),
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerEmail: customer.email,
      date: payload.date,
      slots: payload.slots,
      durationHours: payload.slots.length,
      teamName: payload.teamName,
      playersCount: payload.playersCount,
      baseAmount,
      discountAmount,
      taxAmount,
      totalAmount,
      couponCode: discountAmount > 0 ? payload.couponCode?.toUpperCase() : undefined,
      paymentMethod: payload.paymentMethod,
      paymentStatus,
      bookingStatus,
      notes: payload.notes,
      createdAt: new Date().toISOString(),
    };

    const txn: PaymentTransaction = {
      id: generateId('TXN'),
      bookingId: booking.id,
      bookingType: 'Slot Booking',
      customerId: customer.id,
      customerName: customer.name,
      service: 'Turf',
      method: payload.paymentMethod,
      amount: totalAmount,
      date: booking.createdAt,
      status: paymentStatus,
    };

    const notif: PlatformNotification = {
      id: generateId('NTF'),
      type: 'New Turf Booking',
      service: 'Turf',
      title: `New Turf Booking #${booking.id}`,
      message: `${customer.name} booked ${booking.slots.join(', ')} on ${booking.date} (₹${totalAmount}).`,
      relatedBookingId: booking.id,
      createdAt: booking.createdAt,
      read: false,
    };

    setState((prev) => ({
      ...prev,
      customers: updatedList,
      turfBookings: [booking, ...prev.turfBookings],
      payments: [txn, ...prev.payments],
      notifications: [notif, ...prev.notifications],
    }));

    return { ok: true, booking };
  };

  const updateTurfBookingStatus = (id: string, status: GeneralBookingStatus) => {
    setState((prev) => {
      const target = prev.turfBookings.find((b) => b.id === id);
      if (!target) return prev;
      const nextBookings = prev.turfBookings.map((b) =>
        b.id === id
          ? {
              ...b,
              bookingStatus: status,
              paymentStatus:
                status === 'Cancelled' && b.paymentStatus === 'Paid'
                  ? ('Refunded' as PaymentStatus)
                  : status === 'Confirmed' && b.paymentStatus === 'Pending'
                  ? ('Paid' as PaymentStatus)
                  : b.paymentStatus,
            }
          : b
      );
      const nextPayments = prev.payments.map((p) => {
        if (p.bookingId !== id) return p;
        if (status === 'Cancelled' && p.status === 'Paid') return { ...p, status: 'Refunded' as PaymentStatus };
        if (status === 'Confirmed' && p.status === 'Pending') return { ...p, status: 'Paid' as PaymentStatus };
        return p;
      });
      const extraNotif: PlatformNotification[] =
        status === 'Cancelled'
          ? [
              {
                id: generateId('NTF'),
                type: 'Booking Cancellation',
                service: 'Turf',
                title: `Turf Booking Cancelled #${id}`,
                message: `Slot ${target.slots.join(', ')} on ${target.date} released back to inventory.`,
                relatedBookingId: id,
                createdAt: new Date().toISOString(),
                read: false,
              },
            ]
          : [];
      return {
        ...prev,
        turfBookings: nextBookings,
        payments: nextPayments,
        notifications: [...extraNotif, ...prev.notifications],
      };
    });
  };

  const toggleBlockTurfSlot = (date: string, slot: string, reason = 'Admin hold') => {
    setState((prev) => {
      const exists = prev.blockedTurfSlots.some((b) => b.date === date && b.slot === slot);
      if (exists) {
        return {
          ...prev,
          blockedTurfSlots: prev.blockedTurfSlots.filter(
            (b) => !(b.date === date && b.slot === slot)
          ),
        };
      }
      return {
        ...prev,
        blockedTurfSlots: [...prev.blockedTurfSlots, { date, slot, reason }],
      };
    });
  };

  const updateTurfConfig = (patch: Partial<TurfConfig>) => {
    setState((prev) => ({
      ...prev,
      turfConfig: { ...prev.turfConfig, ...patch },
    }));
  };

  // Resort Logic
  const getCategoryAvailableCount = (categoryId: string, checkIn: string, checkOut: string) => {
    const categoryRooms = state.resortRooms.filter(
      (r) => r.categoryId === categoryId && r.status !== 'Maintenance'
    );
    if (!checkIn || !checkOut || checkIn >= checkOut) return categoryRooms.length;

    const bookedCount = state.resortBookings
      .filter(
        (b) =>
          b.categoryId === categoryId &&
          b.bookingStatus !== 'Cancelled' &&
          b.bookingStatus !== 'Completed' &&
          datesOverlap(b.checkIn, b.checkOut, checkIn, checkOut)
      )
      .reduce((sum, b) => sum + b.roomCount, 0);

    return Math.max(0, categoryRooms.length - bookedCount);
  };

  const calculateResortQuote = (params: {
    categoryId: string;
    checkIn: string;
    checkOut: string;
    roomCount: number;
    extraBeds: number;
    selectedAddons?: string[];
    couponCode?: string;
  }) => {
    const cat = state.roomCategories.find((c) => c.id === params.categoryId);
    const nights = Math.max(1, diffNights(params.checkIn, params.checkOut));
    if (!cat) {
      return {
        nights,
        roomSubtotal: 0,
        extraBedTotal: 0,
        addonsTotal: 0,
        discountAmount: 0,
        taxAmount: 0,
        totalAmount: 0,
      };
    }

    let nightlySum = 0;
    for (let i = 0; i < nights; i++) {
      const dt = addDays(params.checkIn, i);
      const baseRate = isWeekendDate(dt) ? cat.weekendPrice : cat.weekdayPrice;
      const finalNight = state.settings.seasonalPricingActive
        ? Math.round(baseRate * cat.seasonalMultiplier)
        : baseRate;
      nightlySum += finalNight;
    }

    const roomSubtotal = nightlySum * params.roomCount;
    const extraBedTotal = params.extraBeds * cat.extraBedPrice * nights;
    const addonsTotal = 0;

    const gross = roomSubtotal + extraBedTotal;
    let discountAmount = 0;
    if (params.couponCode) {
      const res = validateCoupon(params.couponCode, 'Resort', gross);
      if (res.valid) discountAmount = res.discount;
    }
    const taxable = Math.max(0, gross - discountAmount);
    // Hospitality GST 12%
    const taxAmount = Math.round(taxable * 0.12);
    const totalAmount = taxable + taxAmount;

    return {
      nights,
      roomSubtotal,
      extraBedTotal,
      addonsTotal,
      discountAmount,
      taxAmount,
      totalAmount,
    };
  };

  const createResortBooking = (payload: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    categoryId: string;
    roomCount: number;
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
    extraBeds: number;
    selectedAddons?: string[];
    couponCode?: string;
    paymentMethod: PaymentMethod;
    simulateFailure?: boolean;
    specialRequests?: string;
  }) => {
    const cat = state.roomCategories.find((c) => c.id === payload.categoryId);
    if (!cat) return { ok: false, error: 'Room category not found.' };
    if (payload.checkIn >= payload.checkOut) {
      return { ok: false, error: 'Check-out date must be after check-in date.' };
    }
    const availableCount = getCategoryAvailableCount(
      payload.categoryId,
      payload.checkIn,
      payload.checkOut
    );
    if (availableCount < payload.roomCount) {
      return {
        ok: false,
        error: `Only ${availableCount} ${cat.name}(s) available for the selected dates.`,
      };
    }
    if (payload.simulateFailure) {
      return { ok: false, error: 'Payment authorization failed in demo simulator.' };
    }

    // Find specific non-overlapping room numbers
    const overlappingRooms = new Set<string>();
    state.resortBookings
      .filter(
        (b) =>
          b.categoryId === payload.categoryId &&
          b.bookingStatus !== 'Cancelled' &&
          b.bookingStatus !== 'Completed' &&
          datesOverlap(b.checkIn, b.checkOut, payload.checkIn, payload.checkOut)
      )
      .forEach((b) => b.assignedRoomNumbers.forEach((rn) => overlappingRooms.add(rn)));

    const candidateRooms = state.resortRooms
      .filter(
        (r) =>
          r.categoryId === payload.categoryId &&
          r.status !== 'Maintenance' &&
          !overlappingRooms.has(r.roomNumber)
      )
      .slice(0, payload.roomCount)
      .map((r) => r.roomNumber);

    const quote = calculateResortQuote({
      categoryId: payload.categoryId,
      checkIn: payload.checkIn,
      checkOut: payload.checkOut,
      roomCount: payload.roomCount,
      extraBeds: payload.extraBeds,
      couponCode: payload.couponCode,
    });

    const paymentStatus: PaymentStatus = payload.paymentMethod === 'Cash' ? 'Pending' : 'Paid';
    const bookingStatus: ResortBookingStatus =
      payload.paymentMethod === 'Cash' ? 'Pending' : 'Confirmed';

    const { customer, updatedList } = upsertCustomerFromContact(state.customers, {
      name: payload.customerName,
      phone: payload.customerPhone,
      email: payload.customerEmail,
    });

    const booking: ResortBooking = {
      id: generateId('RES'),
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerEmail: customer.email,
      categoryId: cat.id,
      categoryName: cat.name,
      roomCount: payload.roomCount,
      assignedRoomNumbers: candidateRooms,
      checkIn: payload.checkIn,
      checkOut: payload.checkOut,
      nights: quote.nights,
      adults: payload.adults,
      children: payload.children,
      extraBeds: payload.extraBeds,
      selectedAddons: [],
      roomSubtotal: quote.roomSubtotal,
      extraBedTotal: quote.extraBedTotal,
      addonsTotal: 0,
      discountAmount: quote.discountAmount,
      taxAmount: quote.taxAmount,
      totalAmount: quote.totalAmount,
      couponCode: quote.discountAmount > 0 ? payload.couponCode?.toUpperCase() : undefined,
      paymentMethod: payload.paymentMethod,
      paymentStatus,
      bookingStatus,
      specialRequests: payload.specialRequests,
      createdAt: new Date().toISOString(),
    };

    const txn: PaymentTransaction = {
      id: generateId('TXN'),
      bookingId: booking.id,
      bookingType: 'Room Booking',
      customerId: customer.id,
      customerName: customer.name,
      service: 'Resort',
      method: payload.paymentMethod,
      amount: quote.totalAmount,
      date: booking.createdAt,
      status: paymentStatus,
    };

    const notif: PlatformNotification = {
      id: generateId('NTF'),
      type: 'New Resort Booking',
      service: 'Resort',
      title: `New Room Reservation #${booking.id}`,
      message: `${customer.name} reserved ${booking.roomCount} × ${cat.name} (${booking.nights}N, ₹${quote.totalAmount}).`,
      relatedBookingId: booking.id,
      createdAt: booking.createdAt,
      read: false,
    };

    // Mark rooms Reserved if checking in today or soon and room was Available
    const nextRooms = state.resortRooms.map((r) =>
      candidateRooms.includes(r.roomNumber) && r.status === 'Available'
        ? { ...r, status: 'Reserved' as RoomStatus }
        : r
    );

    setState((prev) => ({
      ...prev,
      customers: updatedList,
      resortBookings: [booking, ...prev.resortBookings],
      resortRooms: nextRooms,
      payments: [txn, ...prev.payments],
      notifications: [notif, ...prev.notifications],
    }));

    return { ok: true, booking };
  };

  const updateResortBookingStatus = (id: string, status: ResortBookingStatus) => {
    setState((prev) => {
      const target = prev.resortBookings.find((b) => b.id === id);
      if (!target) return prev;

      const nextBookings = prev.resortBookings.map((b) => {
        if (b.id !== id) return b;
        const nextPay =
          status === 'Cancelled' && b.paymentStatus === 'Paid'
            ? ('Refunded' as PaymentStatus)
            : (status === 'Confirmed' || status === 'Checked-in') && b.paymentStatus === 'Pending'
            ? ('Paid' as PaymentStatus)
            : b.paymentStatus;
        return { ...b, bookingStatus: status, paymentStatus: nextPay };
      });

      const nextRooms = prev.resortRooms.map((r) => {
        if (!target.assignedRoomNumbers.includes(r.roomNumber)) return r;
        if (status === 'Checked-in') return { ...r, status: 'Occupied' as RoomStatus };
        if (status === 'Completed') return { ...r, status: 'Cleaning' as RoomStatus };
        if (status === 'Cancelled') return { ...r, status: 'Available' as RoomStatus };
        if (status === 'Confirmed' && r.status === 'Available')
          return { ...r, status: 'Reserved' as RoomStatus };
        return r;
      });

      const nextPayments = prev.payments.map((p) => {
        if (p.bookingId !== id) return p;
        if (status === 'Cancelled' && p.status === 'Paid') return { ...p, status: 'Refunded' as PaymentStatus };
        if ((status === 'Confirmed' || status === 'Checked-in') && p.status === 'Pending')
          return { ...p, status: 'Paid' as PaymentStatus };
        return p;
      });

      return {
        ...prev,
        resortBookings: nextBookings,
        resortRooms: nextRooms,
        payments: nextPayments,
      };
    });
  };

  const assignResortRooms = (bookingId: string, roomNumbers: string[]) => {
    setState((prev) => ({
      ...prev,
      resortBookings: prev.resortBookings.map((b) =>
        b.id === bookingId ? { ...b, assignedRoomNumbers: roomNumbers } : b
      ),
    }));
  };

  const updateRoomStatus = (roomId: string, status: RoomStatus) => {
    setState((prev) => ({
      ...prev,
      resortRooms: prev.resortRooms.map((r) => (r.id === roomId ? { ...r, status } : r)),
    }));
  };

  const addResortRoom = (room: Omit<ResortRoom, 'id'>) => {
    setState((prev) => ({
      ...prev,
      resortRooms: [...prev.resortRooms, { ...room, id: generateId('RM') }],
    }));
  };

  const updateResortRoom = (id: string, patch: Partial<ResortRoom>) => {
    setState((prev) => ({
      ...prev,
      resortRooms: prev.resortRooms.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    }));
  };

  const addResortCategory = (cat: Omit<ResortRoomCategory, 'id'>) => {
    setState((prev) => ({
      ...prev,
      roomCategories: [...prev.roomCategories, { ...cat, id: generateId('CAT') }],
    }));
  };

  const updateResortCategory = (id: string, patch: Partial<ResortRoomCategory>) => {
    setState((prev) => ({
      ...prev,
      roomCategories: prev.roomCategories.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }));
  };

  // Restaurant Food Logic
  const createFoodOrder = (payload: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    items: { foodItemId: string; quantity: number; customization?: string }[];
    fulfilmentType: FulfilmentType;
    tableNumber?: string;
    pickupTime?: string;
    deliveryAddress?: string;
    couponCode?: string;
    paymentMethod: PaymentMethod;
    simulateFailure?: boolean;
    notes?: string;
  }) => {
    if (!payload.items.length) {
      return { ok: false, error: 'Your cart is empty.' };
    }
    if (payload.simulateFailure) {
      return { ok: false, error: 'Payment declined by simulator. Please try another method.' };
    }

    const resolvedItems = [];
    for (const ci of payload.items) {
      const fi = state.foodItems.find((f) => f.id === ci.foodItemId);
      if (!fi || !fi.available) {
        return {
          ok: false,
          error: `${fi ? fi.name : 'An item'} is currently unavailable.`,
        };
      }
      resolvedItems.push({
        foodItemId: fi.id,
        name: fi.name,
        price: fi.price,
        quantity: Math.max(1, ci.quantity),
        isVeg: fi.isVeg,
        customization: ci.customization,
      });
    }

    const subtotal = resolvedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee =
      payload.fulfilmentType === 'Home Delivery' ? state.settings.deliveryFee : 0;

    let discountAmount = 0;
    if (payload.couponCode) {
      const res = validateCoupon(payload.couponCode, 'Restaurant', subtotal);
      if (res.valid) discountAmount = res.discount;
    }

    const taxable = Math.max(0, subtotal - discountAmount);
    const taxAmount = Math.round((taxable * state.settings.gstRatePercent) / 100);
    const totalAmount = taxable + taxAmount + deliveryFee;

    const paymentStatus: PaymentStatus = payload.paymentMethod === 'Cash' ? 'Pending' : 'Paid';

    const { customer, updatedList } = upsertCustomerFromContact(state.customers, {
      name: payload.customerName,
      phone: payload.customerPhone,
      email: payload.customerEmail,
      address: payload.deliveryAddress,
    });

    const order: FoodOrder = {
      id: generateId('ORD'),
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerEmail: customer.email,
      items: resolvedItems,
      fulfilmentType: payload.fulfilmentType,
      tableNumber: payload.tableNumber,
      pickupTime: payload.pickupTime,
      deliveryAddress: payload.deliveryAddress,
      subtotal,
      deliveryFee,
      discountAmount,
      taxAmount,
      totalAmount,
      couponCode: discountAmount > 0 ? payload.couponCode?.toUpperCase() : undefined,
      paymentMethod: payload.paymentMethod,
      paymentStatus,
      orderStatus: 'New',
      notes: payload.notes,
      createdAt: new Date().toISOString(),
    };

    const txn: PaymentTransaction = {
      id: generateId('TXN'),
      bookingId: order.id,
      bookingType: 'Food Order',
      customerId: customer.id,
      customerName: customer.name,
      service: 'Restaurant',
      method: payload.paymentMethod,
      amount: totalAmount,
      date: order.createdAt,
      status: paymentStatus,
    };

    const notif: PlatformNotification = {
      id: generateId('NTF'),
      type: 'New Food Order',
      service: 'Restaurant',
      title: `New ${order.fulfilmentType} Order #${order.id}`,
      message: `${customer.name} placed a ${order.items.length}-item order (₹${totalAmount}).`,
      relatedBookingId: order.id,
      createdAt: order.createdAt,
      read: false,
    };

    setState((prev) => ({
      ...prev,
      customers: updatedList,
      foodOrders: [order, ...prev.foodOrders],
      payments: [txn, ...prev.payments],
      notifications: [notif, ...prev.notifications],
      cart: [],
    }));

    return { ok: true, order };
  };

  const updateFoodOrderStatus = (id: string, status: FoodOrderStatus) => {
    setState((prev) => {
      const nextOrders = prev.foodOrders.map((o) => {
        if (o.id !== id) return o;
        const nextPay =
          status === 'Cancelled' && o.paymentStatus === 'Paid'
            ? ('Refunded' as PaymentStatus)
            : status === 'Completed' && o.paymentStatus === 'Pending'
            ? ('Paid' as PaymentStatus)
            : o.paymentStatus;
        return { ...o, orderStatus: status, paymentStatus: nextPay };
      });
      const nextPayments = prev.payments.map((p) => {
        if (p.bookingId !== id) return p;
        if (status === 'Cancelled' && p.status === 'Paid') return { ...p, status: 'Refunded' as PaymentStatus };
        if (status === 'Completed' && p.status === 'Pending') return { ...p, status: 'Paid' as PaymentStatus };
        return p;
      });
      return { ...prev, foodOrders: nextOrders, payments: nextPayments };
    });
  };

  const addFoodItem = (item: Omit<FoodItem, 'id'>) => {
    setState((prev) => ({
      ...prev,
      foodItems: [{ ...item, id: generateId('FOOD') }, ...prev.foodItems],
    }));
  };

  const updateFoodItem = (id: string, patch: Partial<FoodItem>) => {
    setState((prev) => ({
      ...prev,
      foodItems: prev.foodItems.map((f) => (f.id === id ? { ...f, ...patch } : f)),
    }));
  };

  const deleteFoodItem = (id: string) => {
    setState((prev) => ({
      ...prev,
      foodItems: prev.foodItems.filter((f) => f.id !== id),
    }));
  };

  const toggleFoodAvailability = (id: string) => {
    setState((prev) => ({
      ...prev,
      foodItems: prev.foodItems.map((f) =>
        f.id === id ? { ...f, available: !f.available } : f
      ),
    }));
  };

  const addFoodCategory = (cat: Omit<FoodCategory, 'id'>) => {
    setState((prev) => ({
      ...prev,
      foodCategories: [...prev.foodCategories, { ...cat, id: generateId('FC') }],
    }));
  };

  const updateFoodCategory = (id: string, patch: Partial<FoodCategory>) => {
    setState((prev) => ({
      ...prev,
      foodCategories: prev.foodCategories.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }));
  };

  const deleteFoodCategory = (id: string) => {
    setState((prev) => ({
      ...prev,
      foodCategories: prev.foodCategories.filter((c) => c.id !== id),
    }));
  };

  const reorderFoodCategory = (id: string, direction: 'up' | 'down') => {
    setState((prev) => {
      const sorted = [...prev.foodCategories].sort((a, b) => a.sortOrder - b.sortOrder);
      const idx = sorted.findIndex((c) => c.id === id);
      if (idx < 0) return prev;
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= sorted.length) return prev;
      const temp = sorted[idx].sortOrder;
      sorted[idx] = { ...sorted[idx], sortOrder: sorted[swapIdx].sortOrder };
      sorted[swapIdx] = { ...sorted[swapIdx], sortOrder: temp };
      return { ...prev, foodCategories: sorted };
    });
  };

  // Table & Reservations
  const isTableAvailableAt = (tableId: string, date: string, timeSlot: string) => {
    const tbl = state.restaurantTables.find((t) => t.id === tableId);
    if (!tbl || tbl.status === 'Maintenance') return false;
    const conflict = state.tableReservations.some(
      (r) =>
        r.tableId === tableId &&
        r.date === date &&
        r.timeSlot === timeSlot &&
        r.status !== 'Cancelled' &&
        r.status !== 'Completed'
    );
    return !conflict;
  };

  const createTableReservation = (payload: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    date: string;
    timeSlot: string;
    guests: number;
    tableId: string;
    occasion?: string;
    specialRequests?: string;
  }) => {
    const table = state.restaurantTables.find((t) => t.id === payload.tableId);
    if (!table) return { ok: false, error: 'Selected table not found.' };
    if (table.status === 'Maintenance') {
      return { ok: false, error: `${table.tableNumber} is currently under maintenance.` };
    }
    if (!isTableAvailableAt(payload.tableId, payload.date, payload.timeSlot)) {
      return {
        ok: false,
        error: `${table.tableNumber} is already reserved at ${payload.timeSlot} on ${payload.date}.`,
      };
    }

    const { customer, updatedList } = upsertCustomerFromContact(state.customers, {
      name: payload.customerName,
      phone: payload.customerPhone,
      email: payload.customerEmail,
    });

    const reservation: TableReservation = {
      id: generateId('TRES'),
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerEmail: customer.email,
      date: payload.date,
      timeSlot: payload.timeSlot,
      guests: payload.guests,
      tableId: table.id,
      tableNumber: table.tableNumber,
      occasion: payload.occasion,
      specialRequests: payload.specialRequests,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
    };

    const notif: PlatformNotification = {
      id: generateId('NTF'),
      type: 'New Table Reservation',
      service: 'Restaurant',
      title: `Table Reserved: ${table.tableNumber} (#${reservation.id})`,
      message: `${customer.name} reserved ${table.tableNumber} for ${payload.guests} guests on ${payload.date} at ${payload.timeSlot}.`,
      relatedBookingId: reservation.id,
      createdAt: reservation.createdAt,
      read: false,
    };

    setState((prev) => ({
      ...prev,
      customers: updatedList,
      tableReservations: [reservation, ...prev.tableReservations],
      notifications: [notif, ...prev.notifications],
    }));

    return { ok: true, reservation };
  };

  const updateTableReservationStatus = (id: string, status: TableReservationStatus) => {
    setState((prev) => {
      const target = prev.tableReservations.find((r) => r.id === id);
      if (!target) return prev;
      const nextRes = prev.tableReservations.map((r) =>
        r.id === id ? { ...r, status } : r
      );
      const nextTables = prev.restaurantTables.map((t) => {
        if (t.id !== target.tableId) return t;
        if (status === 'Seated') return { ...t, status: 'Occupied' as TableStatus };
        if (status === 'Completed' || status === 'Cancelled')
          return { ...t, status: 'Available' as TableStatus };
        if (status === 'Confirmed') return { ...t, status: 'Reserved' as TableStatus };
        return t;
      });
      return { ...prev, tableReservations: nextRes, restaurantTables: nextTables };
    });
  };

  const updateTableStatus = (id: string, status: TableStatus) => {
    setState((prev) => ({
      ...prev,
      restaurantTables: prev.restaurantTables.map((t) => (t.id === id ? { ...t, status } : t)),
    }));
  };

  const addTable = (table: Omit<RestaurantTable, 'id'>) => {
    setState((prev) => ({
      ...prev,
      restaurantTables: [...prev.restaurantTables, { ...table, id: generateId('TBL') }],
    }));
  };

  const updateTable = (id: string, patch: Partial<RestaurantTable>) => {
    setState((prev) => ({
      ...prev,
      restaurantTables: prev.restaurantTables.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    }));
  };

  // Shared
  const updatePaymentStatus = (id: string, status: PaymentStatus) => {
    setState((prev) => ({
      ...prev,
      payments: prev.payments.map((p) => (p.id === id ? { ...p, status } : p)),
    }));
  };

  const markNotificationRead = (id: string) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
  };

  const markAllNotificationsRead = () => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, read: true })),
    }));
  };

  const addStaff = (member: Omit<StaffMember, 'id'>) => {
    setState((prev) => ({
      ...prev,
      staff: [...prev.staff, { ...member, id: generateId('STF') }],
    }));
  };

  const updateStaff = (id: string, patch: Partial<StaffMember>) => {
    setState((prev) => ({
      ...prev,
      staff: prev.staff.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    }));
  };

  const updateSettings = (patch: Partial<BusinessSettings>) => {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...patch },
    }));
  };

  const resetDemoData = () => {
    const fresh = buildSeedData();
    setState({
      ...fresh,
      currentCustomerId: 'CUST-101',
      isAdminAuthenticated: state.isAdminAuthenticated,
      cart: [],
    });
  };

  return (
    <PlatformContext.Provider
      value={{
        ...state,
        resortAddons: seedRef.resortAddons,
        currentCustomer,
        loginCustomer,
        registerCustomer,
        logoutCustomer,
        updateCustomerProfile,
        loginAdmin,
        logoutAdmin,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        validateCoupon,
        addCoupon,
        updateCoupon,
        toggleCouponActive,
        getTurfSlotStatus,
        getTurfSlotPrice,
        createTurfBooking,
        updateTurfBookingStatus,
        toggleBlockTurfSlot,
        updateTurfConfig,
        getCategoryAvailableCount,
        calculateResortQuote,
        createResortBooking,
        updateResortBookingStatus,
        assignResortRooms,
        updateRoomStatus,
        addResortRoom,
        updateResortRoom,
        addResortCategory,
        updateResortCategory,
        createFoodOrder,
        updateFoodOrderStatus,
        addFoodItem,
        updateFoodItem,
        deleteFoodItem,
        toggleFoodAvailability,
        addFoodCategory,
        updateFoodCategory,
        deleteFoodCategory,
        reorderFoodCategory,
        isTableAvailableAt,
        createTableReservation,
        updateTableReservationStatus,
        updateTableStatus,
        addTable,
        updateTable,
        updatePaymentStatus,
        markNotificationRead,
        markAllNotificationsRead,
        addStaff,
        updateStaff,
        updateSettings,
        resetDemoData,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
};

export function usePlatform(): PlatformContextValue {
  const ctx = useContext(PlatformContext);
  if (!ctx) throw new Error('usePlatform must be used within PlatformProvider');
  return ctx;
}

export { TURF_SLOTS };
