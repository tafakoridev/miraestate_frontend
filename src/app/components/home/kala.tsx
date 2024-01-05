import Image from "next/image";

function Kala({ title, price, imageSrc, select, id, agent, type }: any) {
    console.log(type);
    
    return (
        <div onClick={() => select(id)} className="flex cursor-pointer bg-white w-full md:w-1/3 lg:w-1/6 flex-col overflow-hidden shadow-sm rounded-md border border-gray-300 justify-between">
            <div className='w-full h-2/3 overflow-hidden relative'>
            {agent && <span className="inline-block bg-green-500 text-white px-2 py-1 rounded-full text-sm font-semibold absolute top-1 left-1 z-50">کارشناسی شده</span>}

                <Image 
                    loader={() => `${imageSrc ?? (type === 'tender' ? "/assets/tender.jpg" : "/assets/auction.jpg")}`}
                    src={`${imageSrc ?? (type === 'tender' ? "/assets/tender.jpg" : "/assets/auction.jpg")}`}
                    width={200}
                    height={200}
                    alt={title}
                    className='w-full h-full object-cover'
                    />
            </div>

            <div className='p-2 text-center'>
                {title}
            </div>
            {type === "Commodity" &&
            <div className={"w-full text-center my-2"}>
                {price} تومان
            </div>
            }
        </div>
    )
}

export default Kala;