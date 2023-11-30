"use client";

import Main  from "../components/dashboard/Main";
import Footer from "../components/dashboard/Footer";
import Navbar from "../components/dashboard/Nav";
import Sidebar from "../components/dashboard/Sidebar";
import { GetUser, IsLogin } from "../utils/Auth";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

function ContainerMain() {
    return (
        <div className="flex justify-center items-center h-full w-full">
            <Image src={'/assets/mira_logo.png'} alt="title" width={600} height={600} />
        </div>
    )
}

const DashobardPage = () => {
    const isLogin = IsLogin();
    const user = GetUser();
    const [open, SetOpen] = useState(false);
    const router = useRouter();
    useEffect(() => {
        if(isLogin === false)
            router.push('/login')
        
    }, [])
    return (
       <div className="w-full h-full flex flex-row">
           <div className={`easy-animation h-full ${open ? 'md:w-1/6 w-full md:static fixed' : ' md:w-0 w-0 '}`}>
            <Sidebar SetOpen={SetOpen} open={open}/>
        </div>
        <div className={`easy-animation md:w-5/6 flex flex-col justify-between w-full ${open ? 'md:w-5/6' : 'md:w-full'}`}>
            <div className="w-full h-[6%] min-h-[50px]">
                <Navbar SetOpen={SetOpen} open={open}/>
            </div>
            <div className="w-full h-[92%]">
                <Main children={<ContainerMain/>} title={"MirimaEstate.com"}/>
            </div>
            <div className="w-full h-[2%]">
                <Footer />
            </div>
        </div>
        
     
       </div>
    )
}
export default DashobardPage;