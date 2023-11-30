"use client";
function Navbar({ SetOpen, open }: any) {
    return (
        <nav className="w-full h-full bg-gradient-to-l from-blue-900 via-blue-500 to-blue-900 shadow-md border-b-1 border-gray-100 flex items-center px-4">
            {!open && <button onClick={() => SetOpen(!open)} className={` text-blue-900 menu_white w-[30px] h-[30px]`}></button>}
        </nav>
    )
}

export default Navbar;