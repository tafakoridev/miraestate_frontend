import Image from "next/image";

function Kala({ title, price, imageSrc, select, id }: any) {
    return (
        <div onClick={() => select(id)} className="flex cursor-pointer bg-white w-full md:w-1/3 lg:w-1/6 flex-col overflow-hidden shadow-sm rounded-md border border-gray-300 justify-between">
            <div className='w-full h-2/3 overflow-hidden'>
                <Image 
                    loader={() => `${process.env.NEXT_PUBLIC_BACKEND_URL}${imageSrc}`}
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${imageSrc}`}
                    width={200}
                    height={200}
                    alt={title}
                    className='w-full h-full object-cover'
                    />
            </div>

            <div className='p-2 text-center'>
                {title}
            </div>
            <div className={"w-full text-center my-2"}>
                {price} تومان
            </div>
        </div>
    )
}

export default Kala;