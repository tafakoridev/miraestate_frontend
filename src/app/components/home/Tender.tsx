import Image from "next/image";


function Tender({ title, price, select, id }: any) {
    return (
        <div onClick={() => select(id)} className="flex cursor-pointer bg-white w-full md:w-1/3 lg:w-1/6 flex-col overflow-hidden shadow-sm rounded-md border border-gray-300 justify-between">
            <div className='w-full h-2/3 overflow-hidden'>
                <Image 
                    src={`/assets/tender.jpg`}
                    width={200}
                    height={200}
                    alt={title}
                    className='w-full h-full object-cover'
                    />
            </div>

            <div className='p-2 text-center'>
                {title}
            </div>
     
        </div>
    )
}

export default Tender;