"use client";
function Main({children, title} : any) {
    return (
        <main className="w-full h-full overflow-auto bg-white-800 flex justify-center items-start bg-gray-200">
            <div className="bg-white shadow-md rounded mx-5 my-5 p-5 w-4/5 h-[90%]">
            <h1 className="text-xl font-bold">{title}</h1>
            <hr className="p-0 m-0 my-3"/>
            <div className="h-[90%] overflow-auto w-full py-4">
            {children}

            </div>
            </div>
        </main>
    )
}

export default Main;