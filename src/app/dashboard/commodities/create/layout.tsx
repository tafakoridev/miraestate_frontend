"use client";
import './category.css'
import Main  from "@/app/components/dashboard/Main";
import Footer from "@/app/components/dashboard/Footer";
import Navbar from "@/app/components/dashboard/Nav";
import Sidebar from "@/app/components/dashboard/Sidebar";
import { GetUser, IsLogin } from "@/app/utils/Auth";
import { useState } from "react";

export default function LoginLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    const isLogin = IsLogin();
    const user = GetUser();
    const [open, SetOpen] = useState(false);
    return <section className={`h-full w-full bg-white`}>
       <div className="w-full h-full flex flex-row">
           <div className={`easy-animation h-full ${open ? 'md:w-1/6 w-full md:static fixed' : ' md:w-0 w-0 '}`}>
            <Sidebar SetOpen={SetOpen} open={open}/>
        </div>
        <div className={`easy-animation md:w-5/6 flex flex-col justify-between w-full ${open ? 'md:w-5/6' : 'md:w-full'}`}>
            <div className="w-full h-[6%] min-h-[50px]">
                <Navbar SetOpen={SetOpen} open={open}/>
            </div>
            <div className="w-full h-[92%]">
                <Main children={children} title={"ایجاد کالا و خدمات"}/> 
            </div>
            <div className="w-full bg-gray-200 h-[2%]">
                <Footer />
            </div>
        </div>
        
     
       </div>
     
      </section>
  }