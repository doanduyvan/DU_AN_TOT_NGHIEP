import { Spin } from "antd";
import { useEffect, useState } from "react";

const FullScreenLoader = ({ visible = false, tip = "Đang tải..." }) => {
  const [show, setShow] = useState(visible);

  useEffect(() => {
    if (visible) setShow(true);
    else {
      // Delay để giữ lại hiệu ứng fade-out trước khi ẩn hẳn
      const timeout = setTimeout(() => setShow(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [visible]);

  return show ? (
    <div
      className={`fixed inset-0 bg-black/50 bg-opacity-40 z-50 flex items-center justify-center transition-opacity duration-[500ms] ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="bg-white rounded-md px-6 py-4 shadow-lg flex items-center flex-col gap-2 min-w-[180px]">
        <Spin size="large" />
        <span className="text-black text-sm font-medium">{tip}</span>
      </div>
    </div>
  ) : null;
};

export  {FullScreenLoader};
