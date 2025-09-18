import { Layout } from 'react-grid-layout';
import { Widget } from './widget';

export interface DashboardConfig {
  version: number;
  grid: {
    cols: number;
    rowHeight: number;
    gutter: number;
  };
  widgets: Widget[];
  layouts: Record<string, Layout[]>;
}