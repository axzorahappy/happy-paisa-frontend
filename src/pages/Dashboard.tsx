import React, { useEffect, useState, lazy, Suspense } from 'react';
import { ThemeSwitcher } from '../components/ThemeSwitcher';
import RGL, { WidthProvider } from 'react-grid-layout';
import { getWidgets, getWidget } from '../lib/widgetRegistry';
import '../lib/widget-registrations';
import { WidgetWrapper } from '../components/WidgetWrapper';
import { dataStore } from '../lib/dataStore';
import { dashboardConfig as defaultConfig } from '../lib/dashboardConfig';
import { AddWidgetDrawer } from '../components/AddWidgetDrawer';

const ReactGridLayout = WidthProvider(RGL);

export default function Dashboard() {
  const [isEditable, setIsEditable] = useState(false);
  const [isAddWidgetDrawerOpen, setIsAddWidgetDrawerOpen] = useState(false);
  const [dashboardConfig, setDashboardConfig] = useState(defaultConfig);

  useEffect(() => {
    dataStore.fetchData();
    const savedConfig = localStorage.getItem('dashboardConfig');
    if (savedConfig) {
      setDashboardConfig(JSON.parse(savedConfig));
    }
  }, []);

  const widgets = dashboardConfig.widgets.map(widget => {
      const registeredWidget = getWidgets().find(w => w.type === widget.type);
      if (registeredWidget) {
          return { ...widget, component: registeredWidget.component };
      }
      return widget;
  });
  const layout = widgets.map(w => w.layout);

  const handleAddWidget = (widgetType: string) => {
    const widget = getWidget(widgetType);
    if (widget) {
        const newWidget = { ...widget, layout: { ...widget.layout, i: new Date().getTime().toString() } };
        setDashboardConfig(prevConfig => ({
            ...prevConfig,
            widgets: [...prevConfig.widgets, newWidget],
        }));
    }
  }

  const handleLayoutChange = (newLayout: RGL.Layout[]) => {
    setDashboardConfig(prevConfig => ({
        ...prevConfig,
        layouts: { lg: newLayout },
    }));
  }

  const handleSave = () => {
    localStorage.setItem('dashboardConfig', JSON.stringify(dashboardConfig));
    setIsEditable(false);
  }

  return (
    <div className="bg-background text-text p-4" role="main">
      <div className="flex justify-end mb-4">
        {isEditable && (
            <button onClick={() => setIsAddWidgetDrawerOpen(true)} className="p-2 bg-surface rounded mr-2" aria-label="Add widget">
                Add Widget
            </button>
        )}
        <button onClick={isEditable ? handleSave : () => setIsEditable(true)} className="p-2 bg-surface rounded mr-2" aria-label={isEditable ? 'Save layout' : 'Edit layout'}>
            {isEditable ? 'Save' : 'Edit'}
        </button>
        <ThemeSwitcher />
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <ReactGridLayout 
          layouts={dashboardConfig.layouts}
          onLayoutChange={handleLayoutChange}
          cols={dashboardConfig.grid.cols} 
          rowHeight={dashboardConfig.grid.rowHeight}
          isDraggable={isEditable}
          isResizable={isEditable}
          aria-label="Dashboard grid"
        >
          {widgets.map(widget => (
            <div key={widget.layout.i} aria-label={widget.title}>
              <WidgetWrapper widget={widget} />
            </div>
          ))}
        </ReactGridLayout>
      </Suspense>
      <AddWidgetDrawer 
        isOpen={isAddWidgetDrawerOpen} 
        onClose={() => setIsAddWidgetDrawerOpen(false)} 
        onAddWidget={handleAddWidget} 
      />
    </div>
  )
}
