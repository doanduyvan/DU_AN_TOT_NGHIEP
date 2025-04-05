export function formatCurrency(value) {
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