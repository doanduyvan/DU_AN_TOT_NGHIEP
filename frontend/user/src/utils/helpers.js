export function formatCurrency(value) {
    if(value == 0) return '0 ₫';
    if (!value) return '';
    return Number(value).toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    });
  }
  
  export function toSlug(str) {
    return str
      .normalize('NFD')                   // tách dấu ra khỏi chữ
      .replace(/[\u0300-\u036f]/g, '')    // xóa các dấu
      .replace(/đ/g, 'd')                 // thay đ -> d
      .replace(/Đ/g, 'D')                 // thay Đ -> D
      .toLowerCase()                     // chuyển về lowercase
      .trim()                             // xóa khoảng trắng đầu cuối
      .replace(/\s+/g, '-')               // thay khoảng trắng bằng -
      .replace(/[^\w\-]+/g, '')           // xóa ký tự không hợp lệ
      .replace(/\-\-+/g, '-');            // thay nhiều dấu - thành một
  }

  export const formatTime = (isoTime) => {
    const commentDate = new Date(isoTime);
    const now = new Date();
    const diff = (now - commentDate) / 1000; // chênh lệch giây
  
    if (diff < 60) return `${Math.floor(diff)} giây trước`;
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  
    // Nếu quá 24 giờ → hiển thị ngày giờ
    return commentDate.toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };