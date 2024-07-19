export interface Listing {
  id?: number;
  title: string;
  description?: string;
  image?: string;
  price?: number;
  location?: string;
  country?: string;
  created_at?: Date;
  updated_at?: Date;
}
