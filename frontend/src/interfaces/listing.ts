export interface IListing {
  id: string;
  description?: string;
  title: string;
  images: string[];
  location: string;
  country: string;
  price: number;
  category: string;
}
