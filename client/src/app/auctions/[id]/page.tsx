import fs from "fs/promises";
import path from "path";
import { notFound } from "next/navigation";
import Image from "next/image";
import TimeBox from "client/src/components/TimeBox";
import Topbar from "client/src/components/Topbar";
import Navbar from "client/src/components/Navbar";
import Footer from "client/src/components/Footer";
import AuctionTabs from "client/src/components/AuctionTabs";

type AuctionDetail = {
    id: string;
    name: string;
    code: string;
    image: string;
    startingPrice: number;
    deposit: number;
    bidStep: number;
    participationFee: number;
    registerStart: string;
    registerEnd: string;
    auctionStart: string;
    auctionEnd: string;
    address: string;
    propertyType: string;
    description: string;
    status: string;
    phone: string;
};

/* Dùng fs.readFile() thay vì fetch() */
async function readMockData() {
    const filePath = path.join(process.cwd(), "public", "mockdata.json");
    const file = await fs.readFile(filePath, "utf-8");
    return JSON.parse(file);
}

/* Tạo static params từ mockdata */
export async function generateStaticParams() {
    const data = await readMockData();
    const allAuctions = [...data.ongoing, ...data.upcoming, ...data.past];
    return allAuctions.map((auction: AuctionDetail) => ({
        id: auction.id,
    }));
}

/* Load dữ liệu theo id */
async function getAuctionById(id: string): Promise<AuctionDetail | null> {
    const data = await readMockData();
    const allAuctions = [...data.ongoing, ...data.upcoming, ...data.past];
    return allAuctions.find((item) => item.id === id) || null;
}

export default async function AuctionDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    // 🧩 Vì params trong App Router mới có thể là Promise, nên phải await
    const { id } = await params;

    const auction = await getAuctionById(id);
    if (!auction) return notFound();

    return (
        <main className="min-h-screen font-sans bg-gray-50">

            {/* Topbar */}
            <Topbar />
            {/* Navbar */}
            <Navbar />

            <section className="max-w-7xl mx-auto p-8 bg-white rounded-lg shadow-sm">
                <h1 className="text-2xl font-bold mb-2">Chi tiết tài sản đấu giá</h1>
                <p className="text-yellow-600 text-sm font-medium mb-6">
                    Trạng thái: 🕓 {auction.status}
                </p>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* LEFT COLUMN */}
                    <div className="md:col-span-2">
                        <div className="w-full h-[380px] relative rounded-lg overflow-hidden mb-6">
                            <Image
                                src={auction.image}
                                alt={auction.name}
                                fill
                                className="object-contain bg-gray-100"
                            />
                        </div>

                        <h2 className="text-xl font-semibold mb-2">{auction.name}</h2>
                        <p className="text-sm text-gray-600 mb-4">
                            Mã tài sản: <span className="font-semibold">{auction.code}</span>
                        </p>

                        {/* Thông tin đấu giá */}
                        <div className="grid sm:grid-cols-2 gap-4 text-sm">
                            <InfoCard label="Giá khởi điểm" value={auction.startingPrice} />
                            <InfoCard label="Bước giá" value={auction.bidStep} />
                            <InfoCard label="Tiền đặt trước" value={auction.deposit} />
                            <InfoCard label="Phí tham gia" value={auction.participationFee} />
                            <InfoCard
                                label="Thời gian bắt đầu tiếp nhận hồ sơ"
                                text={auction.registerStart}
                            />
                            <InfoCard
                                label="Thời gian kết thúc tiếp nhận hồ sơ"
                                text={auction.registerEnd}
                            />
                            <InfoCard
                                label="Địa điểm"
                                text={auction.address}
                            />
                            <InfoCard
                                label="Loại tài sản"
                                text={auction.propertyType}
                            />
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <aside className="bg-white border border-gray-200 rounded-lg p-5 h-fit">
                        <h3 className="font-semibold text-lg mb-3 text-center text-gray-800">
                            Thời gian bắt đầu đấu giá
                        </h3>
                        <TimeBox startTime={auction.auctionStart} />

                        <p className="text-center text-sm text-gray-600 mb-2">
                            Thời gian xem tài sản: <br />
                            <span className="font-medium">
                                Từ ngày 07/10/2025 đến ngày 09/10/2025
                            </span>
                        </p>

                        <p className="text-center text-sm text-gray-600 mb-2">
                            Thời gian nộp tiền đặt trước: <br />
                            <span className="font-medium">Đến: 16:00 ngày 17/10/2025</span>
                        </p>

                        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mt-3 mb-4">
                            ⛔ Thời gian nộp hồ sơ đã kết thúc. Không thể đăng ký tham gia đấu giá.
                        </div>

                        <button className="w-full py-2 rounded-lg bg-gray-200 text-gray-600 font-semibold cursor-not-allowed mb-5">
                            Hết thời gian nộp hồ sơ
                        </button>

                        <button className="w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition text-sm">
                            👁️ Theo dõi
                        </button>

                        <hr className="my-5" />

                        <h4 className="font-semibold mb-2 text-gray-800">Chia sẻ thông tin</h4>
                        <div className="flex gap-4 mb-6">
                            <a href="#" className="text-blue-600 font-semibold">Facebook</a>
                            <a href="#" className="text-pink-600 font-semibold">Zalo</a>
                        </div>

                        <h4 className="font-semibold mb-2 text-gray-800">Bạn cần hỗ trợ?</h4>
                        <p className="text-sm text-gray-700">📞 {auction.phone}</p>
                        <button className="mt-2 text-sm text-blue-600 underline">
                            👉 Hướng dẫn
                        </button>
                    </aside>
                </div>

                {/* Tabs */}
                <AuctionTabs description={auction.description} />
            </section>
            <Footer />
        </main>
    );
}

/* --- Components --- */

function InfoCard({
    label,
    value,
    text,
}: {
    label: string;
    value?: number;
    text?: string;
}) {
    return (
        <div className="bg-rose-50 border border-rose-100 rounded-lg p-3">
            <p className="text-gray-600 text-xs mb-1">{label}</p>
            <p className="font-semibold text-gray-800">
                {typeof value === "number"
                    ? `${value.toLocaleString("vi-VN")} đ`
                    : text}
            </p>
        </div>
    );
}

/* Markdown to HTML */
function markdownToHTML(md: string) {
    return md
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\n/g, "<br/>");
}