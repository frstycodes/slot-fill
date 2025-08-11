/**
 * @frsty/slot-fill
 * A React component slot-fill system for flexible component composition
 *
 * This library provides a simple mechanism for creating composable components
 * where content can be distributed to specific "slots" within a parent component.
 *
 * @example
 * ```tsx
 * // Using direct createFill and useSlots
 * import { createFill, useSlots } from '@frsty/slot-fill';
 *
 * enum AppSlots {
 *   Header = 'header',
 *   Footer = 'footer',
 * }
 *
 * const Header = createFill(AppSlots.Header);
 * const Footer = createFill(AppSlots.Footer);
 *
 * function Layout({ children }) {
 *   const { header, footer, rest } = useSlots<AppSlots>(children);
 *
 *   return (
 *     <div>
 *       <header>{header}</header>
 *       <main>{rest}</main>
 *       <footer>{footer}</footer>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Using the SlotManager class for better type safety
 * import { SlotManager } from '@frsty/slot-fill';
 *
 * // Define your slots as a const array
 * const CARD_SLOTS = ["header", "body", "footer"] as const;
 *
 * // Create a slotter with the predefined slots
 * const CardSlotManager = new SlotManager(CARD_SLOTS);
 *
 * // Create fill components for each slot
 * const Header = CardSlotManager.createFill("header");
 * const Body = CardSlotManager.createFill("body");
 * const Footer = CardSlotManager.createFill("footer");
 *
 * function Card({ children }) {
 *   // Extract the slot content using the slotter
 *   const { header, body, footer, rest } = CardSlotManager.useSlots(children);
 *
 *   return (
 *     <div className="card">
 *       <div className="card-header">{header}</div>
 *       <div className="card-body">{body}</div>
 *       {rest}
 *       <div className="card-footer">{footer}</div>
 *     </div>
 *   );
 * }
 * ```
 */

export { createFill, useSlots, SlotManager } from "./use-slot-fill";
export type { FillComponent } from "./use-slot-fill";
