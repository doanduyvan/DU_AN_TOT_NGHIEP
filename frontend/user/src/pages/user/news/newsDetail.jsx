import React, { useState } from "react";
import Sidebar from "./sidebar";
import CommentBox from "./commentsBox";

const NewsDetail = () => {
  const [comments, setComments] = useState([
    { id: 1, name: "Nguyễn Văn A", content: "Bài viết rất hữu ích!" },
    { id: 2, name: "Trần Thị B", content: "Cảm ơn bài viết!" },
  ]);

  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (newComment.trim() !== "") {
      const newItem = {
        id: comments.length + 1,
        name: "Người dùng",
        content: newComment,
      };
      setComments([newItem, ...comments]);
      setNewComment("");
    }
  };


  return (
    <>
    <div className="pt-[70px]"></div>
      <div className="swapper mx-auto py-6 px-4 grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="md:col-span-9 bg-white p-6 rounded shadow">
          <img src="https://placehold.co/800x400.png" alt="news" className="w-full rounded mb-4" />
          <h1 className="text-2xl font-bold mb-2">Top 5 sản phẩm dưỡng da hot nhất 2025</h1>
          <p className="text-sm text-gray-500 mb-4">22/03/2025</p>
          <div className="text-gray-700 leading-relaxed mb-6">
            <p>
              Đây là nội dung chi tiết của bài viết. Bạn có thể thay thế đoạn này bằng dữ liệu thật trong hệ thống quản lý nội dung.
            </p>
          </div>

          {/* Comment Section */}
          <div className="mt-8">
            <CommentBox />
          </div>
        </div>
      </div>
    </>
  );
};

export default NewsDetail;