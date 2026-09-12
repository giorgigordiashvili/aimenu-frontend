import type { ModifierGroupDashboard } from '@/api/generated/interfaces';

/**
 * Public modifier group as nested in a menu item's `modifier_groups`.
 * The generator only emits the dashboard variant (which adds the staff-only
 * `internal_name`); the customer payload is the same shape without it.
 */
export type ModifierGroup = Omit<ModifierGroupDashboard, 'internal_name'>;
