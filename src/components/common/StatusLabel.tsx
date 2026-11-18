import React from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  RefreshCw,
  Truck,
  Utensils,
  Wrench,
  XCircle,
} from 'lucide-react';
import { ServiceType } from '../../types';

interface StatusLabelProps {
  status: string;
}

export const StatusLabel: React.FC<StatusLabelProps> = ({ status }) => {
  const norm = status.toLowerCase();

  let colorClass = 'text-slate-700';
  let Icon = Clock;

  if (
    ['confirmed', 'completed', 'paid', 'available', 'ready', 'seated'].includes(norm)
  ) {
    colorClass = 'text-emerald-700';
    Icon = CheckCircle2;
  } else if (
    ['pending', 'preparing', 'accepted', 'new', 'cleaning', 'reserved'].includes(norm)
  ) {
    colorClass = 'text-amber-700';
    Icon = norm === 'preparing' ? Utensils : Clock;
  } else if (['out for delivery'].includes(norm)) {
    colorClass = 'text-blue-700';
    Icon = Truck;
  } else if (['checked-in', 'occupied', 'booked'].includes(norm)) {
    colorClass = 'text-blue-700';
    Icon = CheckCircle2;
  } else if (['refunded'].includes(norm)) {
    colorClass = 'text-slate-600';
    Icon = RefreshCw;
  } else if (['maintenance', 'blocked'].includes(norm)) {
    colorClass = 'text-slate-600';
    Icon = Wrench;
  } else if (['cancelled', 'failed'].includes(norm)) {
    colorClass = 'text-rose-700';
    Icon = norm === 'failed' ? AlertCircle : XCircle;
  }

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap ${colorClass}`}>
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{status}</span>
    </span>
  );
};

export const ServiceTag: React.FC<{ service: ServiceType }> = ({ service }) => {
  const color =
    service === 'Turf'
      ? 'text-blue-700'
      : service === 'Resort'
      ? 'text-emerald-700'
      : 'text-orange-700';

  return (
    <span className={`text-xs font-semibold tracking-tight whitespace-nowrap ${color}`}>
      {service}
    </span>
  );
};

export const VegMarker: React.FC<{ isVeg: boolean }> = ({ isVeg }) => {
  return (
    <span
      className={`inline-flex items-center justify-center w-4 h-4 border rounded-[3px] shrink-0 ${
        isVeg ? 'border-emerald-700' : 'border-rose-700'
      }`}
      title={isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
      aria-label={isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
    >
      <span
        className={`w-2 h-2 rounded-full ${isVeg ? 'bg-emerald-700' : 'bg-rose-700'}`}
      />
    </span>
  );
};
