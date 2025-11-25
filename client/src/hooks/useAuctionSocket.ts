// src/hooks/useAuctionSocket.ts
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000'); // Kết nối tới Server

export const useAuctionSocket = (auctionId : string) => {
  const [currentPrice, setCurrentPrice] = useState(0);
  const [bids, setBids] = useState<any[]>([]); // Lịch sử đấu giá

  useEffect(() => {
    // 1. Gửi yêu cầu vào phòng
    socket.emit('join_auction', { auctionId });

    // 2. Lắng nghe server báo giá mới
    socket.on('new_bid_update', (data : { newPrice: number; bidInfo: any }) => {
      setCurrentPrice(data.newPrice);
      setBids(prev => [data.bidInfo, ...prev]); // Thêm bid mới lên đầu
    });

    // Cleanup khi rời trang
    return () => {
      socket.emit('leave_auction', { auctionId });
      socket.off('new_bid_update');
    };
  }, [auctionId]);

  return { socket, currentPrice, bids };
};