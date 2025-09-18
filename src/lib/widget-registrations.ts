import { lazy } from 'react';
import { registerWidget } from './widgetRegistry';

const AccountBalanceWidget = lazy(() => import('../components/widgets/AccountBalanceWidget').then(module => ({ default: module.AccountBalanceWidget })));
const QuickActions = lazy(() => import('../components/QuickActions').then(module => ({ default: module.QuickActions })));

registerWidget({
    id: 'account-balance',
    type: 'AccountBalanceWidget',
    title: 'Account Balance',
    component: AccountBalanceWidget,
    layout: { i: 'account-balance', x: 0, y: 0, w: 1, h: 1 },
});

registerWidget({
    id: 'quick-actions',
    type: 'QuickActions',
    title: 'Quick Actions',
    component: QuickActions,
    layout: { i: 'quick-actions', x: 0, y: 1, w: 4, h: 2 },
});