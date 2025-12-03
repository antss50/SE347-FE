import Link from "next/link";
import Image from "next/image";
import { AuctionItem } from "../types/auction";
import { ApiArticleItem } from "../types/article";
import { Calendar, FileText, User } from "lucide-react";
type SectionGridProps = {
  items: (AuctionItem | ApiArticleItem)[];
};


function isAuctionItem(item: AuctionItem | ApiArticleItem): item is AuctionItem {
  return (item as AuctionItem).startingPrice !== undefined;
}

const SectionGrid = ({ items }: SectionGridProps) => {
  return (
    <section className="my-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => {
          const isAuction= isAuctionItem(item);
          const hrefLink = isAuction ? `/auctions/${item.id}` : `/articles/${item.id}`;
          const title = isAuction ? item.name : (item as ApiArticleItem).title;

          return (
            <Link
            key={item.id}
            href={hrefLink}
            className="bg-yellow-200 shadow-md rounded-lg overflow-hidden block hover:scale-[1.02] transition"
          >
            <div className="relative h-40 w-full bg-yellow-100">
              <Image
                src={item.image}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            </div>

            <div className="bg-yellow-400 p-4">
              <h3 className="font-bold text-gray-800 mb-3 text-base line-clamp-2 min-h-[3rem]"
                  title={title}>
                    {title}
              </h3>
              {(isAuction ? (
                <>
                  <p className="flex justify-between text-sm font-light">
                Giá khởi điểm:{" "}
                <span className="font-semibold">
                  {(item as AuctionItem).startingPrice.toLocaleString("vi-VN")}₫
                </span>
              </p>
              <p className="flex justify-between text-sm font-light">
                Tiền đặt trước:{" "}
                <span className="font-semibold">
                  {(item as AuctionItem).deposit.toLocaleString("vi-VN")}₫
                </span>
              </p>
              <p className="flex justify-between text-sm font-light">
                Thời gian tổ chức:{" "}
                <span className="font-semibold">{(item as AuctionItem).time}</span>
              </p>
                </>
              ) : (
                <>
                      <div className="flex items-center gap-2 text-gray-500 text-xs mb-2">
                         <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded max-w-[50%] truncate" title={(item as ApiArticleItem).author}>
                            <User className="w-3 h-3 flex-shrink-0" /> 
                            <span className="truncate">{(item as ApiArticleItem).author}</span>
                          </span>
                         <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded max-w-[50%] truncate" title={new Date((item as ApiArticleItem).createdAt).toLocaleDateString('vi-VN')}>
                            <Calendar className="w-3 h-3 flex-shrink-0" /> 
                            <span className="truncate">{new Date((item as ApiArticleItem).createdAt).toLocaleDateString('vi-VN')}</span>  
                         </span>
                      </div>
                      
                      <p className="text-gray-600 text-xs line-clamp-3">
                        {(item as ApiArticleItem).description}
                      </p>

                      <div className="flex items-center gap-1 text-blue-600 text-xs font-medium pt-2">
                         <FileText className="w-3 h-3" /> Đọc tiếp
                      </div>
                    </>
              ))}
            </div>
          </Link>
          );
        })}
      </div>
    </section>
  );
};

export default SectionGrid;
