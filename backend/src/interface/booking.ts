export interface IBooking {
  id?: number;
  user_id?: number;
  listing_id?: number;
  start_date?: string;
  end_date?: string;
  total_price?: number;
  created_at?: Date;
  updated_at?: Date;
}
