"use client";

import { useState } from "react";

export default function AuctionTabs({ description }: { description: string }) {
    const [activeTab, setActiveTab] = useState("details");

    return (
        <div className="mt-10 border-t">
            {/* Tabs header */}
            <div className="flex space-x-8 text-sm font-medium mt-4 border-b">
                {[
                    { id: "details", label: "Thông tin chi tiết" },
                    { id: "file", label: "Hồ sơ mời đấu giá" },
                    { id: "invalid", label: "Danh sách KH không đủ điều kiện" },
                    { id: "org", label: "Đơn vị tổ chức" },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-2 transition-colors ${activeTab === tab.id
                            ? "border-b-2 border-red-600 text-red-600"
                            : "text-gray-500 hover:text-red-600"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Nội dung tab */}
            <div className="p-6 text-gray-800 leading-relaxed">
                {activeTab === "details" && (
                    <div
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{
                            __html: markdownToHTML(description || "Chưa có mô tả."),
                        }}
                    />
                )}

                {activeTab === "file" && (
                    <p>📄 Hồ sơ mời đấu giá sẽ được hiển thị ở đây.</p>
                )}

                {activeTab === "invalid" && (
                    <p>❌ Danh sách khách hàng không đủ điều kiện sẽ hiển thị ở đây.</p>
                )}

                {activeTab === "org" && (
                    <p>🏢 Thông tin đơn vị tổ chức sẽ hiển thị ở đây.</p>
                )}
            </div>
        </div>
    );
}

/* Markdown to HTML helper */
function markdownToHTML(md: string) {
    return md.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br/>");
}
