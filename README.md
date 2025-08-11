# @frsty/slot-fill

[![npm version](https://img.shields.io/npm/v/@frsty/slot-fill.svg)](https://www.npmjs.com/package/@frsty/slot-fill)
[![npm downloads](https://img.shields.io/npm/dm/@frsty/slot-fill.svg)](https://www.npmjs.com/package/@frsty/slot-fill)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A lightweight React component slot-fill system for flexible component composition.

## Installation

```bash
# Using npm
npm install @frsty/slot-fill

# Using yarn
yarn add @frsty/slot-fill

# Using pnpm
pnpm add @frsty/slot-fill
```

## Overview

`@frsty/slot-fill` provides a simple mechanism for creating composable components where content can be distributed to specific "slots" within a parent component. This pattern is particularly useful for building flexible UI components that need to accept different content in different areas.

## Usage

### Basic Usage

```tsx
import { createFill, useSlots } from '@frsty/slot-fill';

// Define your slot names
enum AppSlots {
  Header = 'header',
  Footer = 'footer',
}

// Create fill components for each slot
const Header = createFill(AppSlots.Header);
const Footer = createFill(AppSlots.Footer);

function Layout({ children }) {
  // Extract slot content
  const { header, footer, rest } = useSlots<AppSlots>(children);

  return (
    <div className="layout">
      <header className="header">{header}</header>
      <main className="content">{rest}</main>
      <footer className="footer">{footer}</footer>
    </div>
  );
}

// Usage
function App() {
  return (
    <Layout>
      <Header>
        <h1>My Application</h1>
      </Header>
      <p>This is the main content!</p>
      <Footer>
        <p>© 2023 My Company</p>
      </Footer>
    </Layout>
  );
}
```

### Using SlotManager (Recommended)

For better type safety and validation, use the `SlotManager` class:

```tsx
import { SlotManager } from '@frsty/slot-fill';

// Define your slots as a const array
const CARD_SLOTS = ["header", "body", "footer"] as const;

// Create a slot manager with the predefined slots
const CardSlotManager = new SlotManager(CARD_SLOTS);

// Create fill components for each slot (type-safe)
const Header = CardSlotManager.createFill("header");
const Body = CardSlotManager.createFill("body");
const Footer = CardSlotManager.createFill("footer");

function Card({ children }) {
  // Extract the slot content using the slot manager (type-safe)
  const { header, body, footer, rest } = CardSlotManager.useSlots(children);

  return (
    <div className="card">
      <div className="card-header">{header}</div>
      <div className="card-body">{body}</div>
      {rest && <div className="card-extra">{rest}</div>}
      <div className="card-footer">{footer}</div>
    </div>
  );
}

// Usage
function MyCard() {
  return (
    <Card>
      <Header>
        <h2>Card Title</h2>
      </Header>
      <Body>
        <p>This is the card content</p>
      </Body>
      <span>This will go to "rest"</span>
      <Footer>
        <button>Action</button>
      </Footer>
    </Card>
  );
}
```

## API Reference

### `createFill`

```tsx
function createFill<T extends string>(slotName: T): FillComponent<T>
```

Creates a Fill component for a specific slot name.

### `useSlots`

```tsx
function useSlots<TKey extends string>(children: ReactNode): Record<TKey | 'rest', ReactNode>
```

A hook that processes children to extract content for named slots. Any children that don't match a slot are placed in the "rest" slot.

### `SlotManager`

```tsx
class SlotManager<TKey extends string> {
  constructor(slots: readonly TKey[])
  createFill(slotName: TKey): FillComponent<TKey>
  useSlots(children: ReactNode): Record<TKey | 'rest', ReactNode>
}
```

A class-based helper for managing a predefined set of slots, providing type safety and validation.

## License

MIT
