import React from 'react'
import { render, screen } from '@testing-library/react'
import { createFill, useSlots, SlotManager } from '../src/use-slot-fill'

describe('createFill and useSlots', () => {
  it('should render content in designated slots', () => {
    // Create fill components
    const Header = createFill('header')
    const Footer = createFill('footer')

    // Create a layout component that uses slots
    function Layout({ children }: { children: React.ReactNode }) {
      const { header, footer, rest } = useSlots<'header' | 'footer'>(children)
      return (
        <div>
          <header data-testid="header">{header}</header>
          <main data-testid="content">{rest}</main>
          <footer data-testid="footer">{footer}</footer>
        </div>
      )
    }

    // Render the layout with filled slots
    render(
      <Layout>
        <Header>
          <h1>Header Content</h1>
        </Header>
        <div>Main Content</div>
        <Footer>
          <p>Footer Content</p>
        </Footer>
      </Layout>
    )

    // Check that content appears in the right places
    expect(screen.getByTestId('header')).toHaveTextContent('Header Content')
    expect(screen.getByTestId('content')).toHaveTextContent('Main Content')
    expect(screen.getByTestId('footer')).toHaveTextContent('Footer Content')
  })

  it('should handle empty slots', () => {
    // Create fill components
    const _Header = createFill('header')

    // Create a component that uses slots
    function Component({ children }: { children: React.ReactNode }) {
      const { header, rest } = useSlots<'header'>(children)
      return (
        <div>
          <header data-testid="header">{header}</header>
          <main data-testid="content">{rest}</main>
        </div>
      )
    }

    // Render without filling the header slot
    render(
      <Component>
        <div>Main Content</div>
      </Component>
    )

    // Check that the header is empty and content appears
    expect(screen.getByTestId('header')).toBeEmptyDOMElement()
    expect(screen.getByTestId('content')).toHaveTextContent('Main Content')
  })

  it('should handle multiple fill components for the same slot', () => {
    // Create fill components
    const Header = createFill('header')

    // Create a component that uses slots
    function Component({ children }: { children: React.ReactNode }) {
      const { header } = useSlots<'header'>(children)
      return (
        <div>
          <header data-testid="header">{header}</header>
        </div>
      )
    }

    // Render with multiple header fills (first one should win)
    render(
      <Component>
        <Header>First Header</Header>
        <Header>Second Header</Header>
      </Component>
    )

    // Check that only the first header content appears
    expect(screen.getByTestId('header')).toHaveTextContent('First Header')
    expect(screen.getByTestId('header')).not.toHaveTextContent('Second Header')
  })
})

describe('SlotManager', () => {
  it('should create and manage slots correctly', () => {
    // Define slots and create a manager
    const SLOTS = ['header', 'body', 'footer'] as const
    const manager = new SlotManager(SLOTS)

    // Create fill components
    const Header = manager.createFill('header')
    const Body = manager.createFill('body')
    const Footer = manager.createFill('footer')

    // Create a component that uses the slot manager
    function Card({ children }: { children: React.ReactNode }) {
      const { header, body, footer, rest } = manager.useSlots(children)
      return (
        <div>
          <div data-testid="header">{header}</div>
          <div data-testid="body">{body}</div>
          <div data-testid="rest">{rest}</div>
          <div data-testid="footer">{footer}</div>
        </div>
      )
    }

    // Render with filled slots
    render(
      <Card>
        <Header>Card Title</Header>
        <Body>Card Content</Body>
        <div>Extra Content</div>
        <Footer>Card Actions</Footer>
      </Card>
    )

    // Check that content appears in the right places
    expect(screen.getByTestId('header')).toHaveTextContent('Card Title')
    expect(screen.getByTestId('body')).toHaveTextContent('Card Content')
    expect(screen.getByTestId('rest')).toHaveTextContent('Extra Content')
    expect(screen.getByTestId('footer')).toHaveTextContent('Card Actions')
  })

  it('should throw an error when creating a fill for an invalid slot', () => {
    // Define slots and create a manager
    const SLOTS = ['header', 'footer'] as const
    const manager = new SlotManager(SLOTS)

    // Attempt to create a fill for an invalid slot
    expect(() => {
      // @ts-expect-error - Testing runtime error for invalid slot
      manager.createFill('body')
    }).toThrow('Slot "body" does not exist')
  })
})
