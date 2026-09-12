/**
 * Per-restaurant modules (Settings -> Modules in the restaurant admin).
 *
 * The API sends `modules: {code: boolean}`; older payloads may lack it, in
 * which case everything except the opt-in modules counts as on. Use this
 * instead of reading the individual `accepts_*` flags.
 */

export type ModuleCode =
  | 'menu'
  | 'ordering'
  | 'tables'
  | 'reservations'
  | 'kitchen'
  | 'warehouse'
  | 'loyalty'
  | 'reviews'
  | 'payments';

export type RestaurantModules = Record<ModuleCode, boolean>;

const OPT_IN: ModuleCode[] = ['warehouse', 'payments'];
const CODES: ModuleCode[] = [
  'menu',
  'ordering',
  'tables',
  'reservations',
  'kitchen',
  'warehouse',
  'loyalty',
  'reviews',
  'payments',
];

interface WithModules {
  /** The generator types this SerializerMethodField as `string`; it is an object on the wire. */
  modules?: unknown;
  accepts_remote_orders?: boolean;
  accepts_reservations?: boolean;
}

function asRecord(value: unknown): Partial<Record<string, boolean>> | null {
  return value && typeof value === 'object' ? (value as Partial<Record<string, boolean>>) : null;
}

export function restaurantModules(restaurant: WithModules | null | undefined): RestaurantModules {
  const raw = asRecord(restaurant?.modules) ?? {};
  const out = {} as RestaurantModules;
  for (const code of CODES) {
    const value = raw[code];
    out[code] = value === undefined ? !OPT_IN.includes(code) : value === true;
  }
  // Legacy flags still win when `modules` is missing from an old payload.
  if (restaurant && !asRecord(restaurant.modules)) {
    if (restaurant.accepts_remote_orders !== undefined)
      out.ordering = restaurant.accepts_remote_orders === true;
    if (restaurant.accepts_reservations !== undefined)
      out.reservations = restaurant.accepts_reservations === true;
  }
  return out;
}
