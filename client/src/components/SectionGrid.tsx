"use client";

import React from "react";
import { AuctionItem } from "@/types/auction";
import Image from "next/image"

type SectionGridProps = {
  items: AuctionItem[]; 
};

const SectionGrid = ({ items }: SectionGridProps) => {

  return (
    <section className="my-8">
      {/* Grid Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-yellow-200 shadow-md rounded-lg overflow-hidden"
          >
            <div className="relative h-40 w-full bg-yellow-100">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            </div>
            
            <div className="bg-yellow-400 p-4 ">
              <h3 className="font-bold mb-2">{item.name}</h3>
              <p className="flex justify-between text-sm font-light">Giá khởi điểm: <span className="font-semibold">{item.startingPrice.toLocaleString("vi-VN")}₫</span></p>
              <p className="flex justify-between text-sm font-light">Tiền đặt trước: <span className="font-semibold">{item.deposit.toLocaleString("vi-VN")}₫</span></p>
              <p className="flex justify-between text-sm font-light">Thời gian tổ chức: <span className="font-semibold">{item.time}</span></p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SectionGrid;
