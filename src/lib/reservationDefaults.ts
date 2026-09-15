import axiosInstance from '@/api/axios';

/**
 * Public reservation settings for one restaurant.
 *
 * Served by `GET /api/v1/reservations/settings/`, scoped by the
 * `X-Restaurant` header (the tenant middleware reads it into
 * `request.restaurant`). The endpoint returns sensible defaults rather than
 * 404 when a restaurant has no ReservationSettings row, so callers always
 * get a usable object.
 */
export interface ReservationSettings {
  accepts_reservations: boolean;
  min_party_size: number;
  max_party_size: number;
  advance_booking_days: number;
  /** How far ahead of *now* the earliest bookable slot is. */
  min_advance_hours: number;
  /** Slot granularity, e.g. 30 → :00 and :30. */
  slot_interval_minutes: number;
  cancellation_deadline_hours: number;
}

export const FALLBACK_SETTINGS: ReservationSettings = {
  accepts_reservations: true,
  min_party_size: 1,
  max_party_size: 20,
  advance_booking_days: 30,
  min_advance_hours: 2,
  slot_interval_minutes: 30,
  cancellation_deadline_hours: 24,
};

export async function fetchReservationSettings(slug: string): Promise<ReservationSettings> {
  const res = await axiosInstance.get<ReservationSettings>('/api/v1/reservations/settings/', {
    headers: { 'X-Restaurant': slug },
  });
  return { ...FALLBACK_SETTINGS, ...res.data };
}

/** "HH:MM" → minutes since midnight. Returns NaN for anything malformed. */
function toMinutes(hhmm: string): number {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm.trim());
  if (!m) return NaN;
  return Number(m[1]) * 60 + Number(m[2]);
}

function startOfDay(d: Date): Date {
  const out = new Date(d);
  out.setHours(0, 0, 0, 0);
  return out;
}

export interface DefaultSelection {
  date: Date;
  time: string;
}

/**
 * Pick the date and time the reservation form should open on.
 *
 * The guest is standing in (or looking at) the restaurant now, so the useful
 * default is "today, at the soonest slot they could actually book" — not an
 * empty field. We take `now`, push it out by the restaurant's configured
 * `min_advance_hours`, then snap forward to the first slot the restaurant
 * actually offers. If nothing is left today, roll to tomorrow's first slot.
 *
 * `slots` are the selectable times as rendered in the dropdown, so the value
 * we choose is always one the guest can see selected.
 */
export function defaultDateAndTime(
  settings: Pick<ReservationSettings, 'min_advance_hours' | 'slot_interval_minutes'>,
  slots: string[],
  now: Date = new Date()
): DefaultSelection | null {
  const usable = slots.map(s => ({ label: s, mins: toMinutes(s) })).filter(s => !isNaN(s.mins));
  if (usable.length === 0) return null;
  usable.sort((a, b) => a.mins - b.mins);

  const leadMinutes = Math.max(0, settings.min_advance_hours) * 60;
  const earliest = now.getHours() * 60 + now.getMinutes() + leadMinutes;

  // Round the earliest bookable moment up to the slot grid before comparing,
  // so a 17:20 earliest on a 30-minute grid looks for 17:30 and not 17:20.
  const grid = Math.max(1, settings.slot_interval_minutes);
  const earliestOnGrid = Math.ceil(earliest / grid) * grid;

  const todaySlot = usable.find(s => s.mins >= earliestOnGrid);
  if (todaySlot) return { date: startOfDay(now), time: todaySlot.label };

  const tomorrow = startOfDay(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return { date: tomorrow, time: usable[0].label };
}
