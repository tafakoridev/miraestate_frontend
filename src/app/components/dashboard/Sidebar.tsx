"use client";
import { useEffect, useState } from "react";
import Item from "./Item";
import MiraInformation from "./MiraInformation";
import { useRouter } from "next/navigation";
import { IsAdmin, IsAgent } from "@/app/utils/Auth";

function Sidebar({ SetOpen, open }: any) {
    const router = useRouter()
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [isAgent, setIsAgent] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            const adminStatus = await IsAdmin();
            const agentStatus = await IsAgent();
            setIsAdmin(adminStatus);
            setIsAgent(agentStatus);
        };

        fetchData();
    }, []);

    return (
        <aside className={`overflow-y-auto relative bg-gradient-to-l from-blue-100 via-blue-50 to-blue-100  w-full h-full float-right shadow-xl border-l-2 border-gray-300`}>
            <div className="absolute left-0 top-0 w-full h-full z-10">
                <button onClick={() => SetOpen(!open)} className={`absolute left-[10px] top-[10px] text-blue-900 menu w-[30px] h-[30px]`}></button>
                <MiraInformation />
                <Item title={"صفحه اصلی"} path={"/dashboard"}  icon={"/assets/icons8-home-144.png"}  />
                {isAdmin &&
                    <>
                        <Item title={"مدیریت کاربران"} path={"/dashboard/users"}  icon={"/assets/icons8-users-96.png"}/>
                        <Item title={"مدیریت دسته بندی ها"} path={"/dashboard/categories"} icon={"/assets/icons8-opened-folder-96.png"}/>
                        <Item title={"مدیریت دپارتمان ها"} path={"/dashboard/departments"} icon={"/assets/icons8-unit-96.png"}/>
                    </>
                }
                <Item title={"مدیریت کالا و خدمات"} path={"/dashboard/commodities/index"}  icon={"/assets/icons8-commodity-96.png"}/>
                <Item child={true} title={"ایجاد کالا"} path={"/dashboard/commodities/create"} icon={"/assets/icons8-add-file-96.png"}/>

                <Item title={"مدیریت مناقصه ها"} path={"/dashboard/tenders/list"}  icon={"/assets/icons8-currency-96.png"}/>
                <Item child={true} title={"ایجاد مناقصه"} path={"/dashboard/tenders/create"} icon={"/assets/icons8-calendar-plus-96.png"}/>
                <Item title={"مدیریت مزایده ها"} path={"/dashboard/auctions/list"}  icon={"/assets/icons8-auction-96.png"}/>
                <Item child={true} title={"ایجاد مزایده"} path={"/dashboard/auctions/create"} icon={"/assets/icons8-auction-96-add.png"}/>
                {
                    isAgent && <>
                    <Item title={"ارجاعات کارشناسی"} path={"/dashboard/agent"} icon={"/assets/icons8-broker-96.png"} />
                    <Item title={"دسته بندی های من"} path={"/dashboard/agentcategories"} icon={"/assets/icons8-opened-folder-96.png"} />
                    <Item title={"دپارتمان های من"} path={"/dashboard/agentdepartments"} icon={"/assets/icons8-opened-folder-96.png"} />
                    <Item title={"پروفایل من"} path={"/dashboard/profile"} icon={"/assets/icons8-admin-settings-male-96.png"} />
                    </>
                }
                

               
                <div onClick={() => {
                    localStorage.removeItem('api_token')
                    router.push("/login")
                }} className={`text-center w-3/4 mx-[12.5%] my-2 p-2 rounded-lg shadow-lg h-100 bg-white cursor-pointer `}>
                    خروج
                </div>
            </div>
            <div className="sidebar_bg"></div>
        </aside>
    )
}

export default Sidebar;