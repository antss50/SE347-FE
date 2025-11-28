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
  const searchParams = useSearchParams(); 

  // Get type from URL query, default to "ongoing"
  const initialType = (searchParams.get("type") as "ongoing" | "upcoming" | "past") || "ongoing";

  const [filters, setFilters] = useState<FilterState>({
    type: initialType,
    priceRange: [0, 10000000000],
    location: "",
    category: "",
  });

  const [auctions, setAuctions] = useState<AuctionItem[]>([]);

  // Helper function to get random image (in process...)
  const getRandomImage = (id: string) => {
    const images = ["/images/auction-logo.jpg", "/images/auction-logo.jpg", "/images/auction-logo.jpg"];
    return images[id.charCodeAt(id.length - 1) % images.length];
  };

  const getAuctionType = (category : string) => {
    if (!category || category === "all") 
      return undefined;
    const map: Record<string, string> = {
      "secured_asset": "secured_asset",
      "land_use_rights": "land_use_rights",
      "administrative_violation_asset": "administrative_violation_asset",
      "state_asset": "state_asset",
      "enforcement_asset": "enforcement_asset",
      "other_asset": "other_asset",
    };
    return map[category] || category;
  }

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        let statusParam = 'now'; // Mặc định
        if (filters.type === 'upcoming') statusParam = 'upcoming';
        if (filters.type === 'past') statusParam = 'completed';

        const params = {
          page: 1,
          limit: 10,
          status: statusParam, 
          auctionType: getAuctionType(filters.category),
          sortBy: 'createdAt', 
          sortOrder: 'desc',
        };
        const resFirstPage = await axios.get('/api/auctions', { params });
        
        if (resFirstPage.data && resFirstPage.data.success) {
          const { totalPages } = resFirstPage.data.meta;
          let allRawData: ApiAuctionItem[] = resFirstPage.data.data || [];

          if (totalPages > 1) {
            for (let page = 2; page <= totalPages; page++) {
              try {
                const resNext = await axios.get('api/auctions', { 
                  params: { ...params, page } 
                });
                
                if (resNext.data?.success) {
                  allRawData = [...allRawData, ...resNext.data.data];
                }
              } catch (e) {
                console.warn(`Lỗi khi tải trang ${page}`, e);
              }
            }
          }

          const processedData: AuctionItem[] = allRawData.map((item) => {
            return {
              id: item.id,
              name: item.name,
              startingPrice: Number(item.startingPrice), 
              deposit: Number(item.depositAmountRequired),
              time: new Date(item.auctionStartAt).toLocaleTimeString("vi-VN", { 
                hour12: false,
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit'
              }),              
              image: getRandomImage(item.id),
              location: "TP. Hồ Chí Minh", 
              category: "Tài sản", 
              status: filters.type as any
            };
          });

          let finalResult = processedData;
          // Lọc giá
          finalResult = finalResult.filter((item) => 
            item.startingPrice >= filters.priceRange[0] && 
            item.startingPrice <= filters.priceRange[1]
          );

          // Lọc địa điểm (nếu có)

          setAuctions(finalResult);
        } else {
          setAuctions([]);
        }
      } catch (err) {
        console.error("Failed to fetch auctions from API", err);
      }
    };

    fetchAuctions();
  }, [filters]); 

  // Hàm xử lý khi thay đổi bộ lọc
  const handleFilterChange = (newFilters: any) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters
    }));
    
    if (newFilters.type && newFilters.type !== filters.type) {
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
        currentType={filters.type} 
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