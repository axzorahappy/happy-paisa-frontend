# Widget Developer Guide

This guide explains how to create new widgets for the dashboard in the `happy-paisa-frontend` application.

## Widget Interface

All widgets must implement the `Widget` interface, which is defined in `src/types/widget.ts`.

```ts
export interface Widget {
  id: string;
  type: string;
  title: string;
  component: React.ComponentType<any>;
  props?: Record<string, any>;
  layout: {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
  };
}
```

## Creating a Widget

To create a new widget, you need to do the following:

1.  Create a new component for your widget.
2.  Register your widget with the `widgetRegistry`.

### Example

Here's an example of how to create a simple widget that displays a message.

```tsx
// src/components/widgets/HelloWorldWidget.tsx

import React from 'react';

export function HelloWorldWidget({ message }: { message: string }) {
  return <div>{message}</div>;
}
```

```ts
// src/pages/Dashboard.tsx

import { registerWidget } from '../lib/widgetRegistry';
import { HelloWorldWidget } from '../components/widgets/HelloWorldWidget';

registerWidget({
  id: 'hello-world',
  type: 'HelloWorldWidget',
  title: 'Hello World',
  component: HelloWorldWidget,
  props: { message: 'Hello, world!' },
  layout: { i: 'hello-world', x: 0, y: 0, w: 1, h: 1 },
});
```
