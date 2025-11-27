export interface Zone {
  id: string;
  name: string;
  type: 'zone' | 'batch';
  description?: string;
  createdAt: string;
}
