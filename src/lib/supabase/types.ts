export interface Profile {
  id: string;
  email: string | null;
  display_name: string | null;
  phone_number: string | null;
  phone_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface SavedMedicine {
  id: string;
  user_id: string;
  medicine_name: string;
  generic_name: string | null;
  dosage_form: string | null;
  strength: string | null;
  branded_price: number | null;
  jan_aushadhi_price: number | null;
  savings_percentage: number | null;
  created_at: string;
}

export interface SearchHistoryItem {
  id: string;
  user_id: string;
  query: string;
  input_method: 'manual' | 'voice' | 'photo';
  matched_medicine: string | null;
  created_at: string;
}
