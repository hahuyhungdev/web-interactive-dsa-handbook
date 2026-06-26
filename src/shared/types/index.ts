export interface ArrayItem {
  value: number;
  index: number;
  status: "default" | "comparing" | "swapping" | "sorted" | "pivot";
}

export interface NodeItem {
  id: string;
  value: string;
  status: "default" | "active" | "traversing" | "inserted" | "deleted";
}

export interface VisualizerFrame {
  array?: ArrayItem[];
  nodes?: NodeItem[];
  highlightedLine?: number;
  highlightedMarker?: string;
}

export interface Lesson {
  title: string;
  type: "theory" | "visualizer" | "practice";
  duration: string;
}

export interface Chapter {
  id: string;
  number: string;
  title: string;
  description: string;
  lessons: Lesson[];
}
