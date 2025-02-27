import { NavLink } from "react-router-dom";

const Menu = ({isOpen, setIsOpen}) => {

    let classMenuMobile = `fixed top-0 bottom-0 w-full overllay1 lg:hidden ${isOpen ? 'left-0' : 'left-[-100%]'}`;


    console.log(isOpen)
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

        <>
        <div className="flex space-x-4 hidden lg:flex">
        {arrMenu.map(item=> (
            <NavLink
            key={item.name}
            to={item.link}
            className={({ isActive }) =>
            `text-gray-700 hover:text-black px-2 ${
              isActive ? "border-b-2 border-black font-semibold" : ""
            }`
            }
            >
            {item.name}
            </NavLink>
        ))}
        </div>

        <div 
        className={classMenuMobile}
        >
            <div className="absolute top-0 left-0 bottom-0 p-5 bg-p-3 w-1/2">

                <button className="absolute top-2 right-2" onClick={()=> setIsOpen(isOpen=> !isOpen)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </button>
                <div className="flex flex-col gap-4 pt-3">
                    {arrMenu.map(item=> (
                        <NavLink
                        key={item.name}
                        to={item.link}
                        className={({ isActive }) =>
                        `text-gray-700 hover:text-black px-2 border-b-2 ${
                        isActive ? "border-b-2 border-black font-semibold" : ""
                        }`
                        }
                        >
                        {item.name}
                        </NavLink>
                    ))}
                </div>
            </div>
        </div>
        </>
    )
}

export default Menu;