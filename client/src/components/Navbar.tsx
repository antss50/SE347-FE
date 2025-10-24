import Image from "next/image";
import Link from "next/link";
import { Button } from "libs/shacdn-ui/src/button";
import CurrentTime from "../components/CurrentTime";

export default function Navbar() {
  return (
    <nav className="bg-white shadow flex items-center justify-between px-6 py-3 sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <Image src="/images/auction-logo.jpg" alt="Logo" width={60} height={60} />
        <span className="font-bold text-lg">Thanh Cong Auction</span>
      </div>

      {/* Menu */}
      <ul className="flex gap-16 text-sm font-medium">
        <li><Link href="/" className="hover:text-yellow-600">Trang chủ</Link></li>
        <li><Link href="/auctions" className="hover:text-yellow-600">Tài sản đấu giá</Link></li>
        <li><Link href="/guide" className="hover:text-yellow-600">Hướng dẫn</Link></li>
        <li><Link href="/announcements" className="hover:text-yellow-600">Thông báo đấu giá</Link></li>
        <li><Link href="/contacts" className="hover:text-yellow-600">Liên hệ</Link></li>
      </ul>

      {/* Auth + Time */}
      <div className="flex items-center gap-4">
        <CurrentTime />
        <Button variant="outline" className="border-yellow-500 text-yellow-600 hover:bg-yellow-50 cursor-pointer">
          Đăng nhập
        </Button>
        <Button className="bg-yellow-500 hover:bg-yellow-600 text-white cursor-pointer">
          Đăng ký
        </Button>
      </div>
    </nav >
  );
}
