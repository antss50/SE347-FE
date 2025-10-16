/* eslint-disable @nx/enforce-module-boundaries */
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuctionData, AuctionItem, FilterOptions } from "../../types/auction";
import Topbar from "../../components/Topbar";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import SectionGrid from "../../components/SectionGrid";
import Link from "next/link";
import { Home } from "lucide-react";
import AuctionFilter from "../../components/AuctionFilter";

export default function AuctionsPage() {
  const router = useRouter();

  const [filters, setFilters] = useState({
    type: "ongoing" as "ongoing" | "upcoming" | "past",
    priceRange: [0, 10000000000],
    location: "",
    category: "",
  });

  const [auctions, setAuctions] = useState<AuctionItem[]>([]);

  // Fetch dữ liệu mỗi khi type thay đổi
  useEffect(() => {
    fetch("/mockData.json", { cache: "no-store" })
      .then((res) => res.json())
      .then((data: AuctionData) => {
        let result = data[filters.type] || [];

        // Áp dụng bộ lọc giá, địa điểm, loại tài sản
        result = result.filter((item) => 
          item.startingPrice >= filters.priceRange[0] && item.startingPrice <= filters.priceRange[1]
        );

        if (filters.location)
          result = result.filter((item) => item.location === filters.location);

        if (filters.category && filters.category != "all")
          result = result.filter((item) => item.category === filters.category);

        setAuctions(result);
      })
      .catch((err) => console.error("Failed to load mockData.json", err));
  }, [filters]);

  // Hàm xử lý khi thay đổi bộ lọc
const handleFilterChange = (newFilters : FilterOptions) => {
  setFilters(newFilters);
  router.push(`/auctions?type=${newFilters.type}`);
};

  return (
    <>
      <main className="w-full min-h-screen font-sans">
        {/* Topbar */}
        <Topbar />

        {/* Navbar */}
        <Navbar />

        {/* Breadcrumb */}
        <div className="flex px-20 py-6 gap-6 bg-zinc-50">
          <Link href="/" className="flex items-center">
            <Home className="w-5 mx-2" />
            <span>Trang chủ</span>
          </Link>
          <span>{">"} Tài sản đấu giá </span>
        </div>
    
        {/* Bộ lọc tài sản */}
        <AuctionFilter onFilterChange={handleFilterChange} />

        <h3 className="text-3xl font-semibold px-20 py-2"> Đấu giá {filters.type === "ongoing" ? "đang diễn ra" 
          : filters.type === "upcoming" ? "sắp diễn ra" 
          : "đã kết thúc"}
        </h3>
        {/* Danh sách đấu giá */}
        <div className="max-w-7xl mx-auto px-6">
          <SectionGrid items={auctions} />
        </div>
      </main>
      <Footer />
    </>
  );
}