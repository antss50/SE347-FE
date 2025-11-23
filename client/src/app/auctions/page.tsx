/* eslint-disable @nx/enforce-module-boundaries */
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { ApiAuctionItem, AuctionItem } from "../../types/auction";
import Topbar from "../../components/Topbar";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import SectionGrid from "../../components/SectionGrid";
import Link from "next/link";
import { Home } from "lucide-react";
import AuctionFilter from "../../components/AuctionFilter";
import axios from "axios";

// Định nghĩa lại type cho bộ lọc
type FilterState = {
  type: "ongoing" | "upcoming" | "past";
  priceRange: number[];
  location: string;
  category: string;
};

function AuctionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams(); // Lấy tham số từ URL

  // Lấy type từ URL hoặc mặc định là 'ongoing'
  const initialType = (searchParams.get("type") as "ongoing" | "upcoming" | "past") || "ongoing";

  const [filters, setFilters] = useState<FilterState>({
    type: initialType,
    priceRange: [0, 10000000000],
    location: "",
    category: "",
  });

  const [auctions, setAuctions] = useState<AuctionItem[]>([]);

  // Hàm helper random ảnh (tái sử dụng logic)
  const getRandomImage = (id: string) => {
    const images = ["/images/auction-1.jpg", "/images/auction-2.jpg", "/images/placeholder.jpg"];
    return images[id.charCodeAt(id.length - 1) % images.length];
  };

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const res = await axios.get('/api/auctions');
        
        if (res.data && res.data.success) {
          const rawData: ApiAuctionItem[] = res.data.data || [];
          const now = new Date();

          // 1. MAP DỮ LIỆU: Raw -> Processed (Có status, number price)
          const processedData: AuctionItem[] = rawData.map((item) => {
            const startDate = new Date(item.auctionStartAt);
            const oneDay = 24 * 60 * 60 * 1000;
            
            // Logic tính trạng thái để so khớp với bộ lọc
            let status: "ongoing" | "upcoming" | "past" = "past"; // Lưu ý: dùng chữ thường để dễ so sánh
            
            if (startDate > now) {
              status = "upcoming";
            } else if (now.getTime() - startDate.getTime() < oneDay) {
              status = "ongoing";
            }

            return {
              id: item.id,
              name: item.name,
              startingPrice: Number(item.startingPrice), // Quan trọng: Convert String -> Number
              deposit: Number(item.depositAmountRequired),
              time: item.auctionStartAt,
              image: getRandomImage(item.id),
              location: "TP. Hồ Chí Minh", // Fake location
              category: "Bất động sản", // Fake category
              status: status as any, // Ép kiểu tạm để dùng cho logic lọc bên dưới
            };
          });

          // 2. LỌC DỮ LIỆU (Client-side filtering)
          let result = processedData;

          // Lọc theo Type (ongoing, upcoming, past)
          // So sánh: item.status (đã tính toán ở trên) với filters.type
          result = result.filter(item => (item.status as any) === filters.type);

          // Lọc theo giá
          result = result.filter((item) => 
            item.startingPrice >= filters.priceRange[0] && item.startingPrice <= filters.priceRange[1]
          );

          // Lọc theo địa điểm
          if (filters.location) {
            result = result.filter((item) => item.location === filters.location);
          }

          // Lọc theo danh mục
          // if (filters.category && filters.category !== "all") {
          //   result = result.filter((item) => item.category === filters.category);
          // }

          setAuctions(result);
        }
      } catch (err) {
        console.error("Failed to fetch auctions from API", err);
      }
    };

    fetchAuctions();
  }, [filters]); // Chạy lại khi filters thay đổi

  // Hàm xử lý khi thay đổi bộ lọc
  const handleFilterChange = (newFilters: any) => {
    // Lưu ý: AuctionFilter có thể trả về cấu trúc khác, cần đảm bảo mapping đúng
    setFilters((prev) => ({
      ...prev,
      ...newFilters
    }));
    
    if (newFilters.type) {
      router.push(`/auctions?type=${newFilters.type}`);
    }
  };

  return (
    <main className="w-full min-h-screen font-sans">
      <Topbar />
      <Navbar />

      {/* Breadcrumb */}
      <div className="flex px-6 md:px-20 py-6 gap-6 bg-zinc-50 items-center">
        <Link href="/" className="flex items-center hover:text-red-600">
          <Home className="w-5 mx-2" />
          <span>Trang chủ</span>
        </Link>
        <span className="text-gray-400">{">"}</span>
        <span className="font-semibold">Tài sản đấu giá</span>
      </div>
  
      {/* Bộ lọc tài sản */}
      {/* Đảm bảo AuctionFilter nhận props đúng type */}
      <AuctionFilter 
        onFilterChange={handleFilterChange} 
        currentType={filters.type} // Truyền type hiện tại xuống để highlight button
      />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h3 className="text-3xl font-semibold mb-8"> 
          Đấu giá {filters.type === "ongoing" ? "đang diễn ra" 
          : filters.type === "upcoming" ? "sắp diễn ra" 
          : "đã kết thúc"}
        </h3>
        
        {auctions.length > 0 ? (
          <SectionGrid items={auctions} />
        ) : (
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl">Không tìm thấy tài sản nào phù hợp.</p>
          </div>
        )}
      </div>
      
      <Footer />
    </main>
  );
}

// Next.js yêu cầu bọc component dùng useSearchParams trong Suspense
export default function AuctionsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuctionsContent />
    </Suspense>
  );
}