// User interface (matching backend NguoiDung)
export interface User {
  nguoi_dung_id: number;
  email: string;
  ho_ten: string;
  tuoi?: number;
  anh_dai_dien?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ImageUser {
  nguoi_dung_id: number;
  ho_ten: string;
  anh_dai_dien?: string;
}

export interface Image {
  hinh_id: number;
  ten_hinh?: string;
  duong_dan: string;
  mo_ta?: string;
  created_at: string;
  updated_at?: string;
  nguoi_dung: ImageUser;
  _count?: {
    binh_luan: number;
    luu_anh: number;
  };
  binh_luan?: Comment[];
}

export interface Comment {
  binh_luan_id: number;
  noi_dung: string;
  ngay_binh_luan: string;
  created_at: string;
  updated_at?: string;
  nguoi_dung: {
    nguoi_dung_id: number;
    ho_ten: string;
    anh_dai_dien?: string;
  };
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface PaginatedResponse<T> {
  images: T[];
  pagination: Pagination;
}

export interface AuthResponse {
  status: 'success';
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data?: T;
}
