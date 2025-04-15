import { Spin } from "antd";
import { useEffect, useState } from "react";
import { forwardRef, useImperativeHandle, useRef } from "react";

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
      className={`fixed inset-0 bg-black/50 bg-opacity-40 flex items-center justify-center transition-opacity duration-[500ms] ${
        visible ? "opacity-100 z-[10000]" : "opacity-0 pointer-events-none"
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


export const FlyToCart = forwardRef(function FlyToCart({ imageSrc, startRef, endId }, ref) {
  const flyingImg = useRef(null);
  const DURATION = 800; // thời gian tổng hiệu ứng (ms)
  const SCALE_DELAY = DURATION * 0.4; // thời điểm bắt đầu thu nhỏ

  const fly = () => {
    const start = startRef.current?.getBoundingClientRect();
    const endEl = document.getElementById(endId);
    const end = endEl?.getBoundingClientRect();
  
    if (!start || !end) return;
  
    const img = flyingImg.current;
    if (!img) return;
  
    const deltaX = end.left - start.left;
    const deltaY = end.top - start.top;
  
    img.src = imageSrc;
    img.style.display = "block";
    img.style.left = `${start.left}px`;
    img.style.top = `${start.top}px`;
    img.style.transform = "translate(0, 0) scale(1)";
    img.style.opacity = 1;
  
    // 🧈 Transition mượt
    img.style.transition = `transform ${DURATION}ms cubic-bezier(0.4, 0, 0.2, 1), opacity ${DURATION}ms ease-in`;
  
    // ✨ Bay về icon + thu nhỏ đồng thời
    requestAnimationFrame(() => {
      img.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.1)`;
      img.style.opacity = 0;
    });
  
    // Reset
    setTimeout(() => {
      img.style.display = "none";
      img.style.transform = "translate(0, 0) scale(1)";
      img.style.opacity = 1;
    }, DURATION + 100);
  };
  

  useImperativeHandle(ref, () => ({ fly }));

  useEffect(() => {
    if (flyingImg.current) {
      flyingImg.current.style.position = "fixed";
      flyingImg.current.style.width = "80px";
      flyingImg.current.style.height = "80px";
      flyingImg.current.style.borderRadius = "8px";
      flyingImg.current.style.pointerEvents = "none";
      flyingImg.current.style.zIndex = 9999;
      flyingImg.current.style.display = "none";
    }
  }, []);

  return <img ref={flyingImg} alt="fly" />;
});

