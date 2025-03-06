const Email = () => {
  return (
    <div className="flex max-w-xs">
      <input
        type="email"
        placeholder="Email address"
        className="py-2 px-3 border border-gray-300 border-r-0 w-full text-sm"
      />
      <button className="bg-black text-white px-3 md:px-4 py-2 text-sm whitespace-nowrap">
        Subscribe
      </button>
    </div>
  );
};

export default Email;
