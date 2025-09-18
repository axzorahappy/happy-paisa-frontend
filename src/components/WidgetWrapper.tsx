import React, { Suspense } from 'react';
import { Card } from './Card';
import { Widget } from '../types/widget';

interface WidgetWrapperProps {
  widget: Widget;
}

export function WidgetWrapper({ widget }: WidgetWrapperProps) {
  const WidgetComponent = widget.component;

  return (
    <Card>
      <h2 className="text-xl font-bold mb-4">{widget.title}</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <WidgetComponent {...widget.props} />
      </Suspense>
    </Card>
  );
}