import React, { useState } from "react";

const formatDate = (date) => {
  return new Date(date).toLocaleString("vi-VN");
};

const CommentItem = ({ comment, onReply }) => {
  const [showReply, setShowReply] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  const handleReply = () => {
    if (replyContent.trim()) {
      onReply(comment.id, replyContent);
      setReplyContent("");
      setShowReply(false);
    }
  };

  return (
    <div className="border-b pb-4 mb-4">
      <div className="flex items-start space-x-3">
        <img src="https://placehold.co/40x40" alt="avatar" className="w-10 h-10 rounded-full" />
        <div className="flex-1">
          <p className="font-semibold text-sm">{comment.name}</p>
          <p className="text-gray-700 text-sm mb-1">{comment.content}</p>
          <p className="text-xs text-gray-400 mb-2">{formatDate(comment.date)}</p>
          <button
            onClick={() => setShowReply(!showReply)}
            className="text-blue-500 text-xs hover:underline"
          >
            Trả lời
          </button>

          {showReply && (
            <div className="mt-2">
              <textarea
                className="w-full border rounded p-2 mb-2"
                rows="2"
                placeholder="Trả lời bình luận..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
              ></textarea>
              <button
                onClick={handleReply}
                className="bg-blue-500 text-white px-3 py-1 text-sm rounded hover:bg-blue-600"
              >
                Gửi trả lời
              </button>
            </div>
          )}

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 ml-6 space-y-3">
              {comment.replies.map((reply) => (
                <div key={reply.id} className="flex items-start space-x-3">
                  <img src="https://placehold.co/32x32" alt="avatar" className="w-8 h-8 rounded-full" />
                  <div>
                    <p className="font-semibold text-sm">{reply.name}</p>
                    <p className="text-gray-700 text-sm">{reply.content}</p>
                    <p className="text-xs text-gray-400">{formatDate(reply.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CommentBox = () => {
  const [comments, setComments] = useState([
    {
      id: 1,
      name: "Nguyễn Văn A",
      content: "Bài viết rất hữu ích!",
      date: new Date(),
      replies: [
        { id: 11, name: "Trả lời 1", content: "Cảm ơn bạn đã chia sẻ!", date: new Date() },
      ],
    },
    {
      id: 2,
      name: "Trần Thị B",
      content: "Cảm ơn bài viết!",
      date: new Date(),
      replies: [],
    },
  ]);

  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (newComment.trim()) {
      const newItem = {
        id: Date.now(),
        name: "Người dùng",
        content: newComment,
        date: new Date(),
        replies: [],
      };
      setComments([newItem, ...comments]);
      setNewComment("");
    }
  };

  const handleReply = (commentId, replyContent) => {
    setComments((prev) =>
      prev.map((cmt) =>
        cmt.id === commentId
          ? {
              ...cmt,
              replies: [
                ...cmt.replies,
                {
                  id: Date.now(),
                  name: "Người dùng",
                  content: replyContent,
                  date: new Date(),
                },
              ],
            }
          : cmt
      )
    );
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Bình luận</h2>
      <textarea
        className="w-full border rounded p-2 mb-2"
        rows="3"
        placeholder="Viết bình luận..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      ></textarea>
      <button
        onClick={handleAddComment}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Gửi bình luận
      </button>

      <div className="mt-6">
        {comments.map((cmt) => (
          <CommentItem key={cmt.id} comment={cmt} onReply={handleReply} />
        ))}
      </div>
    </div>
  );
};

export default CommentBox;