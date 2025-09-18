import { Phone, Receipt, Utensils, Plane } from 'lucide-react';
import { Card } from './Card';

function QuickAction({ icon: Icon, label }: { icon: any; label: string }) {
    return (
      <Card className="text-center hover:bg-gray-700 cursor-pointer">
        <Icon className="mx-auto mb-4" size={32} />
        <p>{label}</p>
      </Card>
    )
  }

export function QuickActions() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <QuickAction icon={Phone} label="Recharge" />
            <QuickAction icon={Receipt} label="Pay Bills" />
            <QuickAction icon={Utensils} label="Food" />
            <QuickAction icon={Plane} label="Travel" />
        </div>
    );
}