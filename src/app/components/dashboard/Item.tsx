"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

function Item({ child, title, path, icon, setOpen }: any) {
    const router = useRouter();
    return (
        <div onClick={() => setOpen ? setOpen() : router.push(path)} className={`text-center flex items-center justify-between w-3/4 mx-[12.5%] my-2 p-2 px-4 rounded-lg shadow-lg h-100 bg-white cursor-pointer ${child ? 'w-2/3 mr-[21%] ml[9%]' : 'mx-[12.5%]'}`}>
            {icon && <span>
                <Image src={icon} alt={title} width={32} height={32} />
            </span>}
            <span>{title}</span>
        </div>
    )
}

export default Item;