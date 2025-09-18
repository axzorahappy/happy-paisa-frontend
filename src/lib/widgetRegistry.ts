import { Widget } from '../types/widget';

const widgetRegistry: Record<string, Widget> = {};

export function registerWidget(widget: Widget) {
  widgetRegistry[widget.type] = widget;
}

export function getWidget(type: string): Widget | undefined {
  return widgetRegistry[type];
}

export function getWidgets(): Widget[] {
  return Object.values(widgetRegistry);
}