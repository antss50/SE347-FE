export interface AuctionItem {
    id: string;
    name: string;             // Tên tài sản đấu giá
    startingPrice: number;    // Giá khởi điểm
    deposit: number;          // Tiền đặt trước
    time: string;             // Thời gian tổ chức (ISO string)
    image: string;            // Link ảnh
    location?: string;       // Địa điểm
    category?: string;         // Loại tài sản
  };
  
  export interface AuctionData {
    ongoing: AuctionItem[];
    upcoming: AuctionItem[];
    past: AuctionItem[];
  };

  export type FilterOptions = {
    type: "ongoing" | "upcoming" | "past";
    priceRange: number[]; 
    location: string;
    category: string;
  };
  