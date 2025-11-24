"use client";

import { useState, useEffect } from "react";
import { Slider } from "libs/shacdn-ui/src/slider";
import { Label } from "libs/shacdn-ui/src/label";
import { RadioGroup, RadioGroupItem } from "libs/shacdn-ui/src/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "libs/shacdn-ui/src/select";
import { Button } from "libs/shacdn-ui/src/button";
// Đảm bảo import FilterOptions đúng đường dẫn
// import { FilterOptions } from "../types/auction"; 

// Định nghĩa lại type này ở đây hoặc import từ file types nếu bạn đã update nó
export type FilterOptions = {
  type: "ongoing" | "upcoming" | "ended";
  priceRange: number[];
  location: string;
  category: string;
};

type AuctionFilterProps = {
  onFilterChange: (filters: FilterOptions) => void;
  currentType: "ongoing" | "upcoming" | "ended"; 
};

export default function AuctionFilter({ onFilterChange, currentType }: AuctionFilterProps) {
  // Khởi tạo state dựa trên props truyền vào
  const [selectedType, setSelectedType] = useState<"ongoing" | "upcoming" | "ended">(currentType);
  const [priceRange, setPriceRange] = useState([0, 10000000000]);
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");

  // 👉 QUAN TRỌNG: Đồng bộ state khi URL thay đổi (VD: User bấm Back/Forward trình duyệt)
  useEffect(() => {
    setSelectedType(currentType);
  }, [currentType]);

  // Hàm xử lý khi nhấn nút Tìm kiếm
  const handleSearch = () => {
    onFilterChange({
      type: selectedType,
      priceRange: priceRange,
      location: location,
      category: category,
    });
  };

  // Hàm xử lý khi nhấn nút Đặt lại
  const handleReset = () => {
    // Reset về trạng thái hiện tại của URL hoặc về mặc định
    setSelectedType(currentType); 
    setPriceRange([0, 10000000000]);
    setLocation("");
    setCategory("");
    
    // Gửi tín hiệu reset lên cha
    onFilterChange({
      type: currentType,
      priceRange: [0, 10000000000],
      location: "",
      category: "",
    });
  };

  return (
    <div className="bg-white shadow-md rounded-lg px-6 md:px-20 py-10 mb-8 border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Bộ lọc tài sản</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Khoảng giá */}
        <div>
          <Label className="mb-3 block font-semibold">Khoảng giá</Label>
          <Slider
            defaultValue={[0, 10000000000]}
            max={10000000000}
            step={1000000}
            min={0}
            value={priceRange}
            onValueChange={setPriceRange}
            className="py-4"
          />
          <div className="flex justify-between text-sm mt-2 text-gray-600 font-medium">
            <span>{priceRange[0].toLocaleString("vi-VN")} đ</span>
            <span>{priceRange[1].toLocaleString("vi-VN")} đ</span>
          </div>
        </div>

        {/* Thời gian đấu giá */}
        <div>
          <Label className="mb-3 block font-semibold">Thời gian đấu giá</Label>
          <RadioGroup
            value={selectedType}
            onValueChange={(val) => setSelectedType(val as "ongoing" | "upcoming" | "ended")}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ongoing" id="ongoing" />
              <Label htmlFor="ongoing" className="cursor-pointer">Đang diễn ra</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="upcoming" id="upcoming" />
              <Label htmlFor="upcoming" className="cursor-pointer">Sắp diễn ra</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="past" id="past" />
              <Label htmlFor="past" className="cursor-pointer">Đã kết thúc</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Loại tài sản */}
        <div>
          <Label className="mb-3 block font-semibold">Loại tài sản</Label>
          <RadioGroup 
            value={category || "all"} // Nếu rỗng thì chọn 'all'
            onValueChange={(val) => setCategory(val === "all" ? "" : val)}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all" className="cursor-pointer">Tất cả</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Bất động sản" id="land" />
              <Label htmlFor="land" className="cursor-pointer">Quyền sử dụng nhà & đất</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Phương tiện" id="vehicle" />
              <Label htmlFor="vehicle" className="cursor-pointer">Phương tiện giao thông</Label>
            </div>
             {/* Thêm các option khác nếu cần, value phải khớp với logic filter ở cha */}
          </RadioGroup>
        </div>

        {/* Địa điểm */}
        <div>
          <Label className="mb-3 block font-semibold">Địa điểm</Label>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Chọn tỉnh/thành phố" />
            </SelectTrigger>
            <SelectContent> 
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="Hồ Chí Minh">Hồ Chí Minh</SelectItem>
              <SelectItem value="Hà Nội">Hà Nội</SelectItem>
              <SelectItem value="Đà Nẵng">Đà Nẵng</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Nút hành động */}
      <div className="flex gap-4 mt-8 pt-4 border-t border-gray-100">
        <Button 
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-8" 
          onClick={handleSearch}
        >
          Tìm kiếm
        </Button>
        <Button 
          variant="outline" 
          onClick={handleReset}
          className="px-8 border-gray-300"
        >
          Đặt lại
        </Button>
      </div>
    </div>
  );
}