"use client";
import Image from "next/image";

function MiraInformation() {
    return (
        <div className="w-full h-[150px] flex flex-col justify-center items-center">
            <Image src="/assets/mira_logo.png" alt="mirima logo" width={318} height={647} className="w-1/2" />
            <h1 className="text-blue-800">MirmaEstate</h1>
        </div>
    )
}

export default MiraInformation;