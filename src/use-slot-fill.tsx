import React, { Children, isValidElement, ReactNode, useMemo } from 'react'

/**
 * FillComponent represents a component that can be used to "fill" a slot.
 * It extends a standard React functional component with a special property
 * that identifies which slot it's meant to fill.
 */
export type FillComponent<T extends string = string> = React.FC<{
  children: ReactNode
}> & {
  __SLOT_FILL__: T
}

/**
 * Creates a Fill component for a specific slot name.
 *
 * @param slotName - The name of the slot this component will fill
 * @returns A React component that renders its children and is tagged with the slot name
 *
 * @example
 * ```tsx
 * const HeaderFill = createFill("header");
 *
 * // Then use it in your component tree
 * <Layout>
 *   <HeaderFill>
 *     <h1>My Title</h1>
 *   </HeaderFill>
 * </Layout>
 * ```
 */
export function createFill<T extends string>(slotName: T): FillComponent<T> {
  const fill: FillComponent<T> = ({ children }) => <>{children}</>
  fill.__SLOT_FILL__ = slotName
  return fill
}

/**
 * A hook that processes children to extract content for named slots.
 *
 * This hook inspects the children passed to a component and organizes them by slot name.
 * It identifies Fill components and extracts their children to the appropriate slot.
 * Any non-Fill components are collected in the "rest" slot.
 *
 * @param children - The children to process
 * @returns An object where each key is a slot name and the value is the corresponding content
 *          The special "rest" key contains any children that weren't assigned to a specific slot
 *
 * @example
 * ```tsx
 * type MySlots = "header" | "footer";
 *
 * function Layout({ children }) {
 *   const slots = useSlots<MySlots>(children);
 *
 *   return (
 *     <div>
 *       <header>{slots.header}</header>
 *       <main>{slots.rest}</main>
 *       <footer>{slots.footer}</footer>
 *     </div>
 *   );
 * }
 * ```
 */
export function useSlots<TKey extends string>(children: ReactNode) {
  type TReturn = Record<TKey | 'rest', ReactNode>

  return useMemo(() => {
    const rest = [] as ReactNode[]
    const slots = {} as TReturn

    if (!Children.count(children)) return slots

    Children.forEach(children, (child) => {
      // Skip if the child isn't a valid Fill component
      if (
        !isValidElement(child) ||
        !(typeof child.type == 'function') ||
        !('__SLOT_FILL__' in child.type)
      )
        return void rest.push(child)

      // Extract the children from the Fill component
      const props = child.props as { children: ReactNode }
      const slotName = child.type.__SLOT_FILL__ as TKey

      // If we already have content for this slot, skip (first one wins)
      if (slotName in slots) return
      slots[slotName] = props.children
    })

    // Add the rest of the children to the "rest" slot
    slots.rest = rest
    return slots
  }, [children])
}

/**
 * A class-based helper for managing a predefined set of slots.
 *
 * The SlotManager class provides a way to create and manage fills for a specific set of slots,
 * ensuring that only valid slots can be filled. This is particularly useful when you want
 * to enforce a fixed set of slots in your component hierarchy.
 *
 * @template TKey - The type of slot names, typically an enum or string literal union
 *
 * @example
 * ```tsx
 *
 * // Create a slotManager with the predefined slots
 * const CARD_SLOTS = ["header", "body", "footer"] as const;
 *
 * // Create a slotManager with the predefined slots
 * const CardSlotManager = new SlotManager(CARD_SLOTS);
 *
 * // Create fill components for each slot
 * const Header = CardSlotManager.createFill("header");
 * const Body = CardSlotManager.createFill("body");
 * const Footer = CardSlotManager.createFill("footer");
 *
 * function Card({ children }) {
 *   // Extract the slot content using the slotManager
 *   const { header, body, footer, rest } = CardSlotManager.useSlots(children);
 *
 *   return (
 *     <div className="card">
 *       <div className="card-header">{header}</div>
 *       <div className="card-body">{body}</div>
 *       <div className="card-footer">{footer}</div>
 *     </div>
 *   );
 * }
 * ```
 */

export class SlotManager<TKey extends string> {
  private slots: Set<TKey>
  /**
   * Creates a new `SlotManager` instance with a predefined set of slots.
   *
   * @param slots - An array of valid slot names
   */
  constructor(slots: readonly TKey[]) {
    this.slots = new Set(slots)
  }

  /**
   * Creates a Fill component for a specific slot name.
   *
   * @param slotName - The name of the slot this component will fill
   * @returns A React component that renders its children and is tagged with the slot name
   * @throws Error if the slot name is not in the predefined set of slots
   */
  createFill(slotName: TKey) {
    if (!this.slots.has(slotName)) {
      throw new Error(`Slot "${slotName}" does not exist`)
    }
    return createFill(slotName)
  }

  /**
   * A hook that processes children to extract content for named slots.
   *
   * This hook inspects the children passed to a component and organizes them by slot name.
   * It identifies Fill components and extracts their children to the appropriate slot.
   * Any non-Fill components are collected in the "rest" slot.
   *
   * @param children - The children to process
   * @returns An object where each key is a slot name and the value is the corresponding content
   *          The special "rest" key contains any children that weren't assigned to a specific slot
   *
   * @example
   * ```tsx
   * type MySlots = "header" | "footer";
   *
   * function Layout({ children }) {
   *   const slots = useSlots<MySlots>(children);
   *
   *   return (
   *     <div>
   *       <header>{slots.header}</header>
   *       <main>{slots.rest}</main>
   *       <footer>{slots.footer}</footer>
   *     </div>
   *   );
   * }
   * ```
   */
  useSlots(children: ReactNode) {
    // We expect this to be called inside a React Component
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useSlots<TKey>(children)
  }
}
