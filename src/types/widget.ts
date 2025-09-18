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