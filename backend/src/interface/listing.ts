export interface Listing {
  id?: number;
  title: string;
  description?: string;
  images?: string[];
  price?: number;
  location?: string;
  country?: string;
  created_at?: Date;
  updated_at?: Date;
}
