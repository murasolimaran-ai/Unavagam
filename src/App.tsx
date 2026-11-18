/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { PlatformProvider } from './context/PlatformContext';
import { CustomerLayout } from './layouts/CustomerLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Customer Pages
import { HomePage } from './pages/customer/HomePage';
import { TurfPage } from './pages/customer/TurfPage';
import { TurfBookingPage } from './pages/customer/TurfBookingPage';
import { ResortPage } from './pages/customer/ResortPage';
import { ResortRoomsPage } from './pages/customer/ResortRoomsPage';
import { ResortBookingPage } from './pages/customer/ResortBookingPage';
import { RestaurantPage } from './pages/customer/RestaurantPage';
import { RestaurantMenuPage } from './pages/customer/RestaurantMenuPage';
import { RestaurantCartPage } from './pages/customer/RestaurantCartPage';
import { RestaurantCheckoutPage } from './pages/customer/RestaurantCheckoutPage';
import { TableBookingPage } from './pages/customer/TableBookingPage';
import { MyBookingsPage } from './pages/customer/MyBookingsPage';
import { ProfilePage } from './pages/customer/ProfilePage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AllBookingsPage } from './pages/admin/AllBookingsPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminPaymentsPage } from './pages/admin/AdminPaymentsPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminCouponsPage } from './pages/admin/AdminCouponsPage';
import { AdminNotificationsPage } from './pages/admin/AdminNotificationsPage';
import { AdminStaffPage } from './pages/admin/AdminStaffPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// Turf Admin
import { AdminTurfOverviewPage } from './pages/admin/turf/AdminTurfOverviewPage';
import { AdminTurfBookingsPage } from './pages/admin/turf/AdminTurfBookingsPage';
import { AdminTurfCalendarPage } from './pages/admin/turf/AdminTurfCalendarPage';
import { AdminTurfPricingPage } from './pages/admin/turf/AdminTurfPricingPage';

// Resort Admin
import { AdminResortOverviewPage } from './pages/admin/resort/AdminResortOverviewPage';
import { AdminResortBookingsPage } from './pages/admin/resort/AdminResortBookingsPage';
import { AdminResortRoomsPage } from './pages/admin/resort/AdminResortRoomsPage';
import { AdminResortAvailabilityPage } from './pages/admin/resort/AdminResortAvailabilityPage';
import { AdminResortCheckInOutPage } from './pages/admin/resort/AdminResortCheckInOutPage';
import { AdminResortPricingPage } from './pages/admin/resort/AdminResortPricingPage';

// Restaurant Admin
import { AdminRestaurantOverviewPage } from './pages/admin/restaurant/AdminRestaurantOverviewPage';
import { AdminFoodOrdersPage } from './pages/admin/restaurant/AdminFoodOrdersPage';
import { AdminKitchenPage } from './pages/admin/restaurant/AdminKitchenPage';
import { AdminMenuManagementPage } from './pages/admin/restaurant/AdminMenuManagementPage';
import { AdminCategoriesPage } from './pages/admin/restaurant/AdminCategoriesPage';
import { AdminTablesPage } from './pages/admin/restaurant/AdminTablesPage';
import { AdminTableReservationsPage } from './pages/admin/restaurant/AdminTableReservationsPage';

export default function App() {
  return (
    <PlatformProvider>
      <BrowserRouter>
        <Routes>
          {/* Customer Website Routes */}
          <Route element={<CustomerLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/turf" element={<TurfPage />} />
            <Route path="/turf/booking" element={<TurfBookingPage />} />
            <Route path="/resort" element={<ResortPage />} />
            <Route path="/resort/rooms" element={<ResortRoomsPage />} />
            <Route path="/resort/booking" element={<ResortBookingPage />} />
            <Route path="/restaurant" element={<RestaurantPage />} />
            <Route path="/restaurant/menu" element={<RestaurantMenuPage />} />
            <Route path="/restaurant/cart" element={<RestaurantCartPage />} />
            <Route path="/restaurant/checkout" element={<RestaurantCheckoutPage />} />
            <Route path="/restaurant/table-booking" element={<TableBookingPage />} />
            <Route path="/my-bookings" element={<MyBookingsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Admin Login */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Unified Admin Dashboard Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />

            {/* Turf Admin */}
            <Route path="turf" element={<AdminTurfOverviewPage />} />
            <Route path="turf/bookings" element={<AdminTurfBookingsPage />} />
            <Route path="turf/calendar" element={<AdminTurfCalendarPage />} />
            <Route path="turf/pricing" element={<AdminTurfPricingPage />} />
            <Route path="turf/offers" element={<AdminTurfPricingPage />} />

            {/* Resort Admin */}
            <Route path="resort" element={<AdminResortOverviewPage />} />
            <Route path="resort/bookings" element={<AdminResortBookingsPage />} />
            <Route path="resort/rooms" element={<AdminResortRoomsPage />} />
            <Route path="resort/availability" element={<AdminResortAvailabilityPage />} />
            <Route path="resort/check-in-out" element={<AdminResortCheckInOutPage />} />
            <Route path="resort/pricing" element={<AdminResortPricingPage />} />

            {/* Restaurant Admin */}
            <Route path="restaurant" element={<AdminRestaurantOverviewPage />} />
            <Route path="restaurant/orders" element={<AdminFoodOrdersPage />} />
            <Route path="restaurant/kitchen" element={<AdminKitchenPage />} />
            <Route path="restaurant/menu" element={<AdminMenuManagementPage />} />
            <Route path="restaurant/categories" element={<AdminCategoriesPage />} />
            <Route path="restaurant/tables" element={<AdminTablesPage />} />
            <Route path="restaurant/reservations" element={<AdminTableReservationsPage />} />

            {/* Common Management */}
            <Route path="bookings" element={<AllBookingsPage />} />
            <Route path="customers" element={<AdminCustomersPage />} />
            <Route path="payments" element={<AdminPaymentsPage />} />
            <Route path="coupons" element={<AdminCouponsPage />} />
            <Route path="notifications" element={<AdminNotificationsPage />} />
            <Route path="reports" element={<AdminReportsPage />} />
            <Route path="staff" element={<AdminStaffPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </PlatformProvider>
  );
}
