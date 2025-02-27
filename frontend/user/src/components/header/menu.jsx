import { NavLink } from "react-router-dom";

const Menu = () => {

    const arrMenu = [
        {
            name: 'Home',
            link: '/'
        },
        {
            name: 'Brand',
            link: '/brand'
        },
        {
            name: 'Shop',
            link: '/shop'
        },
        {
            name: 'about',
            link: '/about'
        },
        {
            name: 'Community',
            link: '/community'
        }
    ]
    

    return(
        <div className="flex space-x-4 py-4">
        {arrMenu.map(item=> (
            <NavLink
            key={item.name}
            to={item.link}
            className={({ isActive }) =>
            `text-gray-700 hover:text-black px-2 pb-1 ${
              isActive ? "border-b-2 border-black font-semibold" : ""
            }`
            }
            >
            {item.name}
            </NavLink>
        ))}
        </div>

    )
}

export default Menu;