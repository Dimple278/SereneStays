export interface IBooking {
  totalPrice: any;
  listingTitle: any;
  listingId: any;
  startDate: string | number | Date;
  endDate: string | number | Date;
  id?: number;
  user_id?: number;
  listing_id?: number;
  start_date?: string;
  end_date?: string;
  total_price?: number;
  userName?: string;
}
