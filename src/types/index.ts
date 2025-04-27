export interface ClientRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  company?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type ThemeColor = 'primary' | 'secondary' | 'success' | 'error' | 'warning';

export interface ThemeSettings {
  mode: 'light' | 'dark';
  primaryColor: string;
}

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: keyof ClientRecord;
  direction: SortDirection;
} 