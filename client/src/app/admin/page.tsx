"use client";

import { useState } from 'react';
import { Bell, DollarSign, Gavel, LayoutDashboard, LogOut, Menu, Plus, Search, Settings, Users } from 'lucide-react';
import { useAdminAuctions } from '../../hooks/useAdminAuction'; 
import { AuctionsTable } from '../../components/admin/AuctionTable'; 
import { AuctionFormModal } from '../../components/admin/AuctionModal'; 
import { ConfirmDeleteModal } from '../../components/ConfirmDeleteModal';
import { success } from 'node_modules/zod/v4/classic/external.cjs';

export default function AdminDashboard() {
  // 1. Gọi Hook: Lấy toàn bộ logic và state từ hook
  const { auctions, loading, deleteAuction, createAuction, updateAuction, pagination } = useAdminAuctions();
  
  // 2. State cục bộ cho Modal (UI state)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 3. Handlers cho UI
  const handleCreateClick = () => {
    setEditingItem(null); // Reset item sửa
    setIsModalOpen(true);
  };

  const handleEditClick = (item: any) => {
    setEditingItem(item); // Set item đang sửa
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setItemToDeleteId(id); // Lưu lại ID cần xoá
    setIsDeleteModalOpen(true); // Mở Modal
  };

  const handleConfirmDelete = async () => {
    if (!itemToDeleteId) return;

    setIsDeleting(true); // Bật loading trên nút xoá
    const success = await deleteAuction(itemToDeleteId);
    setIsDeleting(false);

    if (success) {
      setIsDeleteModalOpen(false); // Đóng modal nếu thành công
      setItemToDeleteId(null);
    }
  };

  // Hàm submit chung cho cả Tạo và Sửa
  const handleFormSubmit = async (formData: any) => {
    const success = editingItem ? await updateAuction(editingItem.id, formData) : await createAuction(formData);
    return success;
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-800">
      
      {/* === 1. SIDEBAR (Giống ảnh: Đen + Vàng) === */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#1a1a1a] text-white transition-all duration-300 flex flex-col shadow-xl z-20`}>
        {/* Logo Area */}
        <div className="h-16 flex items-center px-4 bg-[#FFC107] text-black font-bold text-sm tracking-wide">
             {sidebarOpen ? "THANH CONG ADMIN" : "TC"}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 space-y-1 px-3">
            <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" isOpen={sidebarOpen} />
            <NavItem icon={<Gavel size={20} />} label="Quản lý Đấu giá" isOpen={sidebarOpen} active />
            <NavItem icon={<Users size={20} />} label="Người dùng" isOpen={sidebarOpen} />
            <NavItem icon={<Settings size={20} />} label="Cài đặt hệ thống" isOpen={sidebarOpen} />
        </nav>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-gray-800">
            <button className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors w-full">
                <LogOut size={20} /> {sidebarOpen && <span>Đăng xuất</span>}
            </button>
        </div>
      </aside>

      {/* === 2. MAIN CONTENT === */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm">
            <div className="flex items-center gap-4">
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded text-gray-600">
                    <Menu size={20} />
                </button>
                <h1 className="text-xl font-bold text-gray-800">Quản lý Đấu giá</h1>
            </div>
            <div className="flex items-center gap-4">
                {/* Search Bar */}
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input type="text" placeholder="Tìm kiếm..." className="pl-9 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 w-64" />
                </div>
                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"><Bell size={20} /></button>
                <div className="w-8 h-8 rounded-full bg-[#FFC107] flex items-center justify-center font-bold text-xs text-black border border-yellow-600">AD</div>
            </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#F9FAFB]">
            
            <div className="mb-2">
                <h2 className="text-2xl font-bold text-gray-900">Danh sách tài sản</h2>
                <p className="text-sm text-gray-500">Quản lý các phiên đấu giá đang hoạt động</p>
            </div>

            {/* --- SUMMARY CARDS (Giống ảnh) --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-6">
                <SummaryCard 
                    title="Tổng phiên đấu giá" 
                    value={pagination.totalItems.toLocaleString()} 
                    icon={<Gavel size={24} className="text-white" />} 
                    iconBg="bg-blue-500" 
                />
                <SummaryCard 
                    title="Đang diễn ra" 
                    value="56" 
                    icon={<Gavel size={24} className="text-white" />} 
                    iconBg="bg-yellow-500" 
                />
                <SummaryCard 
                    title="Doanh thu tháng" 
                    value="5.2 Tỷ" 
                    icon={<DollarSign size={24} className="text-white" />} 
                    iconBg="bg-red-700" 
                />
            </div>

            {/* Action Bar */}
            <div className="flex justify-end mb-4">
                <button onClick={handleCreateClick} className="flex items-center gap-2 bg-[#FFC107] hover:bg-yellow-500 text-black font-medium px-4 py-2 rounded shadow-sm transition-colors">
                    <Plus size={18} /> Tạo phiên đấu giá
                </button>
            </div>

            {/* --- TABLE & PAGINATION --- */}
            <AuctionsTable 
                auctions={auctions} 
                loading={loading}
                pagination={pagination} // Truyền props phân trang xuống
                onEdit={handleEditClick}
                onDelete={handleDeleteClick} 
            />
            
            {/* Modal Form */}
            <AuctionFormModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleFormSubmit}
                initialData={editingItem}
            />

            <ConfirmDeleteModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                isDeleting={isDeleting}
                title="Xóa phiên đấu giá?"
                message="Bạn có chắc chắn muốn xóa phiên đấu giá này không? Dữ liệu sẽ không thể khôi phục."
            />
        </main>
      </div>
    </div>
  );    
}

const NavItem = ({ icon, label, isOpen, active }: any) => (
    <div className={`flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-colors ${active ? 'bg-[#FFC107] text-black font-semibold' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
        {icon}
        {isOpen && <span className="text-sm">{label}</span>}
    </div>
);

const SummaryCard = ({ title, value, icon, iconBg }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${iconBg}`}>
            {icon}
        </div>
        <div>
            <p className="text-gray-500 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
    </div>
);