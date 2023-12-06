"use client";

import Main  from "../components/dashboard/Main";
import Footer from "../components/dashboard/Footer";
import Navbar from "../components/dashboard/Nav";
import Sidebar from "../components/dashboard/Sidebar";
import { GetUser, IsActiveAgent, IsAgent, IsLogin } from "../utils/Auth";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loading, Notify } from "notiflix";

function ContainerMain() {
    return (
        <div className="flex justify-center items-center h-full w-full">
            <Image src={'/assets/mira_logo.png'} alt="title" width={600} height={600} />
        </div>
    )
}

const DashobardPage = () => {
    const [open, SetOpen] = useState(false);
    const router = useRouter();

    const fetchData = async () => {
        try {
          const isLogin = IsLogin();
          const isAgent = await IsAgent();
          
          if (isAgent) {
            const isActiveAgent = await IsActiveAgent();
            console.log(isActiveAgent);
            
            if (!isActiveAgent) {
                Loading.pulse();
              Notify.init({
                    width: '300px',
                    position: 'left-bottom',
                    });
                Notify.failure("حساب کارشناسی شما هنوز فعال نشده است")
            }
          }
          
          if (!isLogin) {
            router.push('/login');
          }
        } catch (error) {
          // Handle errors here
          console.error(error);
        }
      };
      
      useEffect(() => {
        fetchData();
      }, []);
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