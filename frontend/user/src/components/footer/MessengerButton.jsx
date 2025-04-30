import React from "react";
const MessengerButton = () => {
  const openMessenger = () => {
    window.open("https://m.me/593743367163730", "_blank");
  };

  return (
    <button
      onClick={openMessenger}
      className="fixed z-[3] bottom-16 right-4 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all"
      title="Chat với Facebook"
    >
      <img src="/images/png/messenger.png" alt="Messenger" className="size-8 object-contain MessengerButton" />
    </button>
  );
};

export default MessengerButton;
