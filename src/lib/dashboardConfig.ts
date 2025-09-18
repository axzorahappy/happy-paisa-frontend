import { DashboardConfig } from '../types/dashboard';

export const dashboardConfig: DashboardConfig = {
  version: 1,
  grid: {
    cols: 4,
    rowHeight: 150,
    gutter: 16,
  },
  widgets: [
    {
      id: 'account-balance',
      type: 'AccountBalanceWidget',
      title: 'Account Balance',
      component: null, // This will be replaced by the actual component in the widget registry
      layout: { i: 'account-balance', x: 0, y: 0, w: 1, h: 1 },
    },
    {
      id: 'quick-actions',
      type: 'QuickActions',
      title: 'Quick Actions',
      component: null, // This will be replaced by the actual component in the widget registry
      layout: { i: 'quick-actions', x: 0, y: 1, w: 4, h: 2 },
    },
  ],
  layouts: {},
};