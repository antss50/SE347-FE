"use client";

import { useState } from "react";
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
import { FilterOptions } from "../types/auction";

type AuctionFilterProps = {
  onFilterChange: (filters: FilterOptions) => void;
};

export default function AuctionFilter({ onFilterChange }: AuctionFilterProps) {
  const [selectedType, setSelectedType] = useState<"ongoing" | "upcoming" | "past">("ongoing");
  const [priceRange, setPriceRange] = useState([0, 10000000000]);
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");

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
    setSelectedType("ongoing");
    setPriceRange([0, 10000000000]);
    setLocation("");
    setCategory("");
    onFilterChange({
      type: "ongoing",
      priceRange: [0, 10000000000],
      location: "",
      category: "",
    });
  };

  return (
    <div className="bg-white shadow-md rounded-lg px-20 py-10 mb-8">
      <h2 className="text-2xl font-bold mb-6">Bộ lọc tài sản</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Khoảng giá */}
        <div>
          <Label className="mb-2 block">Khoảng giá</Label>
          <Slider
            defaultValue={[0, 10000000000]}
            max={10000000000}
            step={1000000}
            value={priceRange}
            onValueChange={setPriceRange}
          />
          <div className="flex justify-between text-sm mt-2">
            <span>{priceRange[0].toLocaleString("vi-VN")}</span>
            <span>{priceRange[1].toLocaleString("vi-VN")}</span>
          </div>
        </div>

        {/* Thời gian đấu giá */}
        <div>
          <Label className="mb-2 block">Thời gian đấu giá</Label>
          <RadioGroup
            value={selectedType}
            onValueChange={(val) => setSelectedType(val as "ongoing" | "upcoming" | "past")}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="upcoming" id="upcoming" />
              <Label htmlFor="upcoming">Sắp diễn ra</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ongoing" id="ongoing" />
              <Label htmlFor="ongoing">Đang diễn ra</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="past" id="past" />
              <Label htmlFor="past">Đã kết thúc</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Loại tài sản */}
        <div>
          <Label className="mb-2 block">Loại tài sản</Label>
          <RadioGroup 
            defaultValue="all"
            value={category}
            onValueChange={(val) => setCategory(val)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all">Tất cả</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="land and house" id="land and house" />
              <Label htmlFor="land and house">Quyền sử dụng nhà & đất</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="vehicle" id="vehicle" />
              <Label htmlFor="vehicle">Phương tiện giao thông</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="collectible" id="collectible" />
              <Label htmlFor="collectible">Đồ sưu tầm</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="technology equipment" id="technology equipment" />
              <Label htmlFor="technology equipment">Thiết bị công nghệ</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="other" id="other" />
              <Label htmlFor="other">Khác</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Địa điểm */}
        <div>
          <Label className="mb-2 block">Địa điểm</Label>
          <Select value={location} onValueChange={(val) => setLocation(val)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn tỉnh/thành phố" />
            </SelectTrigger>
            <SelectContent> 
              <SelectItem value="hanoi">Hà Nội</SelectItem>
              <SelectItem value="hcm">Hồ Chí Minh</SelectItem>
              <SelectItem value="danang">Đà Nẵng</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Nút hành động */}
      <div className="flex gap-4 mt-6">
        <Button className="bg-yellow-500 hover:bg-yellow-600 text-white" onClick={handleSearch}>
          Tìm kiếm
        </Button>
        <Button variant="outline" onClick={handleReset}>
          Đặt lại
        </Button>
      </div>
    </div>
  );
}
