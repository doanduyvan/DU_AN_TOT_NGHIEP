
function Sidebar() {

  const categories = ["Chăm sóc da", "Trang điểm", "Dưỡng tóc", "Sức khỏe"];


    return (
        <>
        <aside className="md:col-span-3 bg-white p-4 rounded shadow h-fit">
          <h2 className="text-lg font-semibold mb-4">Danh mục tin</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            {categories.map((cat, index) => (
              <li key={index} className="hover:text-blue-500 cursor-pointer">{cat}</li>
            ))}
          </ul>
        </aside>
        </>
    )
}

export default Sidebar;