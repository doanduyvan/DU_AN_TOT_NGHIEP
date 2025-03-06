import Navbar from "./Nav";
function Header(){

    return(
        <>
            <header className="fixed w-full z-10">
                <div className="swapper p-3">
                    <div className="border-[1px] border-[#141313]">
                        {/* <nav></nav> */}
                        <Navbar/>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header;


