/* eslint-disable @nx/enforce-module-boundaries */
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "libs/shacdn-ui/src/button";
import SectionGrid from "../components/SectionGrid";
import Topbar from "../components/Topbar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AuctionItem, ApiAuctionItem, AuctionResponse } from "../types/auction";
import axios from "axios";

export default function HomePage() {
  const [time, setTime] = useState<string>("");
  const [auctions, setAuctions] = useState<AuctionResponse>({
    ongoing: [],
    upcoming: [],
    past: [],
  });

  const getRandomImage = (id: string) => {
  const images = [
    "/images/auction-1.jpg", 
    "/images/auction-2.jpg",
    "/images/placeholder.jpg"
  ];
  // Logic lấy ảnh cố định theo ID (để không bị đổi ảnh khi re-render)
  return images[id.charCodeAt(id.length - 1) % images.length] || "/images/placeholder.jpg";
};

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        // Gọi API
        const res = await axios.get('/api/auctions'); // Đảm bảo đúng path backend

        if (res.data && res.data.success) {
          const rawData: ApiAuctionItem[] = res.data.data || [];
          const now = new Date();

          const processedData: AuctionItem[] = rawData.map((item) => {
            const startDate = new Date(item.auctionStartAt);
            
            let status: "UPCOMING" | "ONGOING" | "ENDED" = "ENDED";
            const oneDay = 24 * 60 * 60 * 1000;
            
            if (startDate > now) {
              status = "UPCOMING";
            } else if (now.getTime() - startDate.getTime() < oneDay) {
              status = "ONGOING";
            }

            return {
              id: item.id,
              name: item.name,
              startingPrice: Number(item.startingPrice),
              deposit: Number(item.depositAmountRequired),
              time: item.auctionStartAt,
              image: getRandomImage(item.id),
              location: "TP. Hồ Chí Minh", 
              status: status
            };
          });

          setAuctions({
            ongoing: processedData.filter((i) => i.status === "ONGOING"),
            upcoming: processedData.filter((i) => i.status === "UPCOMING"),
            past: processedData.filter((i) => i.status === "ENDED"),
          });
        }
      } catch (err) {
        console.error("Failed to fetch auctions from API", err);
      }
    };

    fetchAuctions();
  }, []);

  // Cập nhật thời gian thực
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString("vi-VN", { hour12: false });
      const formattedDate = now.toLocaleDateString("vi-VN");
      setTime(`${formattedTime} | ${formattedDate}`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="w-full min-h-screen font-sans">
      {/* Topbar */}
      <Topbar />
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center text-center text-white">
        {/* Background */}
        <Image
          src="/images/auction-background.jpg"
          alt="Auction background"
          fill
          className="object-cover -z-10"
          priority
        />
        <div className="absolute inset-0 bg-black/50 -z-10" />

        {/* Content */}
        <div className="max-w-6xl px-6 py-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-snug drop-shadow-lg text-start">
            CÔNG TY ĐẤU GIÁ HỢP DANH THÀNH CÔNG
            <br />
            TRANG THÔNG TIN ĐẤU GIÁ TRỰC TUYẾN
          </h1>
          <p className="mb-6 text-xl drop-shadow text-start">
            Tham gia đấu giá trực tuyến với quy trình minh bạch, an toàn và hiệu
            quả. Chúng tôi kết nối người mua và người bán thông qua nền tảng
            công nghệ hiện đại.
          </p>
          <div className="flex justify-start gap-4">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-8 py-6 rounded-lg shadow-lg cursor-pointer">
              Đăng ký ngay
            </Button>
            <Button
              variant="outline"
              className="bg-gray-200 hover:bg-gray-300 text-black font-semibold px-8 py-6 rounded-lg cursor-pointer"
            >
              Tìm hiểu thêm
            </Button>
          </div>
        </div>
      </section>

      {/* Auction Sections */}
      <div className="max-w-7xl mx-auto px-6">
        {/* Đang diễn ra */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl pt-8 font-bold">⚖️ Đấu giá đang diễn ra</h2>
          <a href="/auctions?type=ongoing" className="mt-8 text-lg">
            <i>
              <u>Xem tất cả</u>
            </i>
          </a>
        </div>
        <SectionGrid items={auctions.ongoing} />

        {/* Sắp diễn ra */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl pt-8 font-bold">⚖️ Đấu giá sắp diễn ra</h2>
          <a href="/auctions?type=upcoming" className="mt-8 text-lg">
            <i>
              <u>Xem tất cả</u>
            </i>
          </a>
        </div>
        <SectionGrid items={auctions.upcoming} />

        {/* Đã diễn ra */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl pt-8 font-bold">⚖️ Đấu giá đã diễn ra</h2>
          <a href="/auctions?type=past" className="mt-8 text-lg">
            <i>
              <u>Xem tất cả</u>
            </i>
          </a>
        </div>
        <SectionGrid items={auctions.past} />
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}