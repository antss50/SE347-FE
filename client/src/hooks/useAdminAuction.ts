import { useState, useEffect, useCallback } from 'react';
import { AuctionService } from '../services/auction.service';
import { AuctionItem } from '../types/auction';

export const useAdminAuctions = () => {
  const [auctions, setAuctions] = useState<AuctionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0); // Biến để trigger reload

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Hàm load dữ liệu
  const fetchAuctions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await AuctionService.getAll({ page: page, limit: 10, sortOrder: 'desc' });
      if (data.success) {
        setAuctions(data.data);

        if (data.meta) {
            setTotalPages(data.meta.totalPages);
            setTotalItems(data.meta.total);
        }
      }
    } catch (error) {
      console.error("Lỗi tải danh sách:", error);
    } finally {
      setLoading(false);
    }
  }, [refreshKey, page]);

  // useEffect chỉ gọi hàm fetch
  useEffect(() => {
    fetchAuctions();
  }, [fetchAuctions]);

  // Hàm Wrapper cho các hành động CRUD
  const deleteAuction = async (id: string) => {
    try {
      await AuctionService.delete(id);
      setRefreshKey(prev => prev + 1); // Reload lại list sau khi xóa
      return true;
    } catch (error) {
      alert('Lỗi khi xóa');
      return false;
    }
  };

  const createAuction = async (data: any) => {
    try {
      await AuctionService.create(data);
      setRefreshKey(prev => prev + 1);
      return true; // Trả về true để component biết mà đóng modal
    } catch (error) {
      alert('Lỗi tạo mới');
      return false;
    }
  };

  const updateAuction = async (id: string, data: any) => {
    try {
      await AuctionService.update(id, data);
      setRefreshKey(prev => prev + 1);
      return true;
    } catch (error) {
      alert('Lỗi cập nhật');
      return false;
    }
  };

  return {
    auctions,
    loading,
    pagination: { page, totalPages, totalItems, setPage },
    deleteAuction,
    createAuction,
    updateAuction,
    refreshData: () => setRefreshKey(prev => prev + 1)
  };
};