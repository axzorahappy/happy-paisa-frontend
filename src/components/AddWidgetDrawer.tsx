import { getWidgets } from '../lib/widgetRegistry';

export function AddWidgetDrawer({ isOpen, onClose, onAddWidget }: { isOpen: boolean; onClose: () => void; onAddWidget: (widgetType: string) => void; }) {
  if (!isOpen) {
    return null;
  }

  const widgets = getWidgets();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end" role="dialog" aria-modal="true" aria-labelledby="add-widget-drawer-title">
      <div className="w-96 bg-surface p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 id="add-widget-drawer-title" className="text-xl font-bold">Add a widget</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700" aria-label="Close">
            &times;
          </button>
        </div>
        <ul>
          {widgets.map(widget => (
            <li key={widget.id}>
              <button onClick={() => onAddWidget(widget.type)} className="w-full text-left p-2 hover:bg-gray-700 rounded">
                {widget.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
