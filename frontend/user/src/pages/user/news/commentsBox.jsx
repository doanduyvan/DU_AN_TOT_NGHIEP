import React, { useState, useEffect } from "react";
import { Rate,Pagination, message, Tag,Popconfirm,Button } from "antd";
import AxiosUser from "/src/utils/axios_user";
import { FullScreenLoader } from "/src/utils/helpersjsx";
import { useUserContext } from "../../../context/user/userContext";
import { formatTime } from "/src/utils/helpers";
import { DeleteOutlined } from "@ant-design/icons";

const urlGetComment = "customer/newsdetail/get-comment/";
const urlAddComment = "customer/newsdetail/add-comment";
const urlDeleteComment = "customer/newsdetail/delete-comment/";
const baseUrlImg = import.meta.env.VITE_URL_IMG;


const CommentBox = ({news_id}) => {

  const { isLoggedIn } = useUserContext();

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5); // Số lượng bình luận trên mỗi trang
  const [totalPages, setTotalPages] = useState(0);
  const [activeReplyId, setActiveReplyId] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const res = await AxiosUser.get(urlGetComment + news_id, { params:{ page: currentPage, per_page: perPage}, useToken: true, tokenNullable: true });
        const commetsRes = res.comments;
        const { data, total } = commetsRes || {};
        setComments(data || []);
        setTotalPages(total || 0);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }finally{
        setLoading(false);
      }
    };

    fetchComments();
  }, [isLoggedIn, news_id,currentPage,perPage]);

  const handleAddComment = async () => {
    if (!isLoggedIn) {
      message.error("Vui lòng đăng nhập để bình luận.");
      return;
    }
    const newComment2 = newComment.trim();
    if (!newComment2) {
      message.error("Vui lòng nhập nội dung bình luận.");
      return;
    }

    // bình luận không được vượt quá 1000 ký tự
    if (newComment2.length > 1000) {
      message.error("Nội dung bình luận không được vượt quá 1000 ký tự.");
      return;
    }

    const dataReq = {
      news_id,
      comment: newComment2,
    }

    try{
      setLoading(true);
      const res = await AxiosUser.post(urlAddComment, dataReq ,{useToken: true});
      const dataRes = res.data;
      dataRes.replies = []; 
      dataRes.is_mycomment = true; 
      setComments((prev) => [dataRes, ...prev]);
      setNewComment(""); // reset nội dung bình luận
      message.success("Gửi bình luận thành công!");
    }catch(err){
      console.error("Error adding comment:", err);
    }finally{
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mt-4">
        <textarea
          className="mt-2 w-full border rounded p-2 mb-2 outline-none"
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

        <div className="mt-6 bg-white p-3">
          {comments.map((cmt, i) => (
            <CommentItem
              key={`cmt${i}`}
              comment={cmt}
              activeReplyId={activeReplyId}
              setActiveReplyId={setActiveReplyId}
              isLoggedIn={isLoggedIn}
              setLoading={setLoading}
              setComments={setComments}
            />
          ))}

          {/* Phân trang */}
          <div className="flex justify-center mt-4 space-x-2">
            <Pagination
              current={currentPage}
              pageSize={perPage}
              total={totalPages}
              onChange={(page, per_page) => { setCurrentPage(page); setPerPage(per_page); }}
              showSizeChanger={true}
              pageSizeOptions={["5", "10", "15", "20"]}
              className="mt-4 text-center"
            />
          </div>
        </div>
      </div>
      <FullScreenLoader
        visible={loading}
        tip="Vui lòng đợi trong giây lát..."
      />
    </>
  );
};

const CommentItem = ({ comment, activeReplyId, setActiveReplyId, isLoggedIn, setLoading, setComments }) => {

  const [replyContent, setReplyContent] = useState("");
  const isActive = activeReplyId === comment.id;

  const toggleReply = () => {
    setActiveReplyId(isActive ? null : comment.id); // nếu đang mở thì đóng, chưa mở thì mở
  };

  const handleReply = async () => {

    if (!isLoggedIn) {
      message.error("Vui lòng đăng nhập để trả lời bình luận.");
      return;
    }
    const replyContentTrimmed = replyContent.trim();
    if (!replyContentTrimmed) {
      message.error("Vui lòng nhập nội dung trả lời.");
      return;
    }

    if (replyContentTrimmed.length > 1000) {
      message.error("Nội dung trả lời không được vượt quá 1000 ký tự.");
      return;
    }

    const replyData = {
      news_id: comment.news_id,
      comment_news_id: comment.id,
      comment: replyContentTrimmed
    };

    try{
      setLoading(true);
      const res = await AxiosUser.post(urlAddComment, replyData ,{useToken: true});
      const dataRes = res.data;
      dataRes.is_mycomment = true; 
      setComments((prev) =>
        prev.map((cmt) =>
          cmt.id === comment.id
            ? {
                ...cmt,
                replies: [...cmt.replies, dataRes],
              }
            : cmt
        )
      );
      setReplyContent(""); // reset nội dung trả lời
      setActiveReplyId(null); // đóng form trả lời
      message.success("Trả lời bình luận thành công!");
    }catch(err){
      console.error("Error adding comment:", err);
    }finally{
      setLoading(false);
    }

  };

  const handleDeleteComment = async (commentId, idCommentParent = null) => {
    if (!isLoggedIn) {
      message.error("Vui lòng đăng nhập để xóa bình luận.");
      return;
    }

    try {
      await AxiosUser.post(urlDeleteComment + commentId, {}, { useToken: true });
      if (idCommentParent === null) {
      setComments((prev) => prev.filter((cmt) => cmt.id !== commentId));
      } else {
        setComments((prev) =>
          prev.map((cmt) => {
            if (cmt.id === idCommentParent) {
              return {
                ...cmt,
                replies: cmt.replies.filter((reply) => reply.id !== commentId),
              };
            }
            return cmt;
          }));
      }
      message.success("Xóa bình luận thành công!");
    } catch (error) {
      const message2 = error.response?.data?.message || "Lỗi không xác định";
      message.error(message2);
      console.error("Error deleting comment:", error);
    }
  }

  return (
    <div className="border-b pb-4 mb-4 last:border-b-0 last:mb-0">
      <div className="flex items-start space-x-3">
        <div>
          {comment.user?.avatar ? (
            <img
              src={baseUrlImg + comment.user.avatar}
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-500 flex justify-center items-center text-white text-2xl">
              {comment.user?.fullname.trim().charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-start flex-wrap">
            <div className="pr-2">
              <p className="font-semibold text-sm">{comment.user?.fullname}</p>
            </div>
            <div>
              {comment.is_admin ? (
                <Tag color="default" className="text-xs font-medium">
                  👤 Admin
                </Tag>
              ) : null}
            </div>
          </div>
          <p className="text-gray-700 text-sm mb-1">{comment.content}</p>
          <p className="text-xs text-gray-400 mb-2">
            {formatTime(comment.created_at)}
          </p>
          <button
            onClick={toggleReply}
            className="text-blue-500 text-xs hover:underline"
          >
            Trả lời
          </button>

          {isActive && (
            <div className="mt-2">
              <textarea
                className="w-full border rounded p-2 mb-2 outline-none"
                rows="2"
                placeholder="Trả lời..."
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
            <div className="mt-4 space-y-3 *:border-b">
              {comment.replies.map((reply, i) => (
                <div
                  key={`cmtrl${i}`}
                  className="flex items-start space-x-3 py-2 last:border-b-0 last:pb-0"
                >
                  <div>
                    {reply.user?.avatar ? (
                      <img
                        src={baseUrlImg + reply.user.avatar}
                        alt="avatar"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-500 flex justify-center items-center text-white text-2xl">
                        {reply.user?.fullname.trim().charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start flex-wrap">
                      <div className="pr-2">
                        <p className="font-semibold text-sm">
                          {reply.user?.fullname}
                        </p>
                      </div>
                      <div>
                        {reply.is_admin && (
                          <Tag color="default" className="text-xs font-medium">
                            👤 Admin
                          </Tag>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm">{reply.content}</p>
                    <p className="text-xs text-gray-400">
                      {formatTime(reply.created_at)}
                    </p>
                  </div>
                  {/* xóa reply */}
                  {reply.is_mycomment && (
                    <div className="">
                      <Popconfirm
                        title="Bạn có chắc muốn xoá bình luận này?"
                        onConfirm={() => handleDeleteComment(reply.id, comment.id)}
                        okText="Xoá"
                        cancelText="Huỷ"
                      >
                        <Button
                          type="text"
                          danger
                          size="small"
                          icon={<DeleteOutlined />}
                        />
                      </Popconfirm>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* xóa cmt */}

        {comment.is_mycomment && (
          <div className="">
            <Popconfirm
              title="Bạn có chắc muốn xoá bình luận này?"
              onConfirm={() => handleDeleteComment(comment.id)}
              okText="Xoá"
              cancelText="Huỷ"
            >
              <Button
                type="text"
                danger
                size="small"
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </div>
        )}
      </div>
    </div>
  );
};



export default CommentBox;
