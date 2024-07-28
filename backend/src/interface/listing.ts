export interface Listing {
  ownerId?: number;
  id?: number;
  owner_id?: number;
  title?: string;
  description?: string;
  images?: string[];
  price?: number;
  location?: string;
  country?: string;
  category?: string;
  created_at?: Date;
  updated_at?: Date;
}
