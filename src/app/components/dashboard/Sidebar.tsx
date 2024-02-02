"use client";
import { useEffect, useState } from "react";
import Item from "./Item";
import MiraInformation from "./MiraInformation";
import { useRouter } from "next/navigation";
import { IsAdmin, IsAgent } from "@/app/utils/Auth";

function Sidebar({ SetOpen, open }: any) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isAgent, setIsAgent] = useState<boolean>(false);
  const [isOpen, setOpen] = useState<string>("");

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
    <aside
      className={`overflow-y-auto relative bg-gradient-to-l from-blue-100 via-blue-50 to-blue-100  w-full h-full float-right shadow-xl border-l-2 border-gray-300`}
    >
      <div className="absolute left-0 top-0 w-full h-full z-10">
        <button
          onClick={() => SetOpen(!open)}
          className={`absolute left-[10px] top-[10px] text-blue-900 menu w-[30px] h-[30px]`}
        ></button>
        <MiraInformation />
        <Item
          title={"صفحه اصلی"}
          path={"/"}
          icon={"/assets/icons8-home-144.png"}
        />

        {isAdmin && (
          <>
            <Item
              title={"مدیریت کاربران"}
              path={"/dashboard/users"}
              icon={"/assets/icons8-users-96.png"}
            />
            <Item
              title={"مدیریت کارشناسان"}
              path={"/dashboard/agents"}
              icon={"/assets/icons8-agent-100.png"}
            />
            <Item
              title={"مدیریت دسته بندی ها"}
              path={"/dashboard/categories"}
              icon={"/assets/icons8-opened-folder-96.png"}
            />
            <Item
              title={"نظرات"}
              path={"/dashboard/comments"}
              icon={"/assets/icons8-comments-64.png"}
            />

            <Item
              title={"کارتابل"}
              icon={"/assets/icons8-plus-48.png"}
              setOpen={() => {
                isOpen == "cartable" ? setOpen("") : setOpen("cartable");
              }}
            />

            {isOpen === "cartable" && (
              <>
                <Item
                  title={"کارتابل کارشناسی "}
                  path={"/dashboard/cartable"}
                  icon={"/assets/icons8-pack-luggage-48.png"}
                  child={true}
                />
                <Item
                  title={"کارتابل مناقصه"}
                  path={"/dashboard/readytopublish"}
                  icon={"/assets/icons8-pack-luggage-48.png"}
                  child={true}
                />
                <Item
                  title={"کارتابل مزایده"}
                  path={"/dashboard/readytopublishauction"}
                  icon={"/assets/icons8-pack-luggage-48.png"}
                  child={true}
                />
              </>
            )}

            <Item
              title={"تنظیمات"}
              path={"/dashboard/options"}
              icon={"/assets/icons8-settings-64.png"}
            />
          </>
        )}

        <Item
          title={"کارشناسی ها"}
          icon={"/assets/icons8-plus-48.png"}
          setOpen={() => {
            isOpen == "expert" ? setOpen("") : setOpen("expert");
          }}
        />
        {isOpen == "expert" && (
          <>
            <Item
              child={true}
              title={"ثبت درخواست"}
              path={"/dashboard/expert"}
              icon={"/assets/icons8-agent-100.png"}
            />
            <Item
              child={true}
              title={"لیست درخواست ها"}
              path={"/dashboard/clientcartable"}
              icon={"/assets/icons8-box-60.png"}
            />
          </>
        )}

        <Item
          title={"کالا و خدمات"}
          icon={"/assets/icons8-plus-48.png"}
          setOpen={() => {
            isOpen == "commodity" ? setOpen("") : setOpen("commodity");
          }}
        />
        {isOpen == "commodity" && (
          <>
            <Item
              child={true}
              title={"مدیریت کالا و خدمات"}
              path={"/dashboard/commodities/index"}
              icon={"/assets/icons8-commodity-96.png"}
            />
            <Item
              child={true}
              title={"ایجاد کالا و خدمات"}
              path={"/dashboard/commodities/create"}
              icon={"/assets/icons8-add-file-96.png"}
            />
          </>
        )}

        <Item
          title={" مناقصه ها"}
          path={"/dashboard/tenders/list"}
          icon={"/assets/icons8-plus-48.png"}
          setOpen={() => {
            isOpen == "tenders" ? setOpen("") : setOpen("tenders");
          }}
        />
        {isOpen == "tenders" && (
          <>
            <Item
              child={true}
              title={"مدیریت مناقصه ها"}
              path={"/dashboard/tenders/list"}
              icon={"/assets/icons8-currency-96.png"}
            />
            <Item
              child={true}
              title={"ایجاد مناقصه"}
              path={"/dashboard/tenders/create"}
              icon={"/assets/icons8-calendar-plus-96.png"}
            />
            <Item
              child={true}
              title={"پیشنهادات من"}
              path={"/dashboard/tenders/purposes"}
              icon={"/assets/icons8-send-48.png"}
            />
          </>
        )}

        <Item
          title={" مزایده ها"}
          path={"/dashboard/tenders/list"}
          icon={"/assets/icons8-plus-48.png"}
          setOpen={() => {
            isOpen == "auctions" ? setOpen("") : setOpen("auctions");
          }}
        />
        {isOpen == "auctions" && (
          <>
            <Item
              child={true}
              title={"مدیریت مزایده ها"}
              path={"/dashboard/auctions/list"}
              icon={"/assets/icons8-auction-96.png"}
            />
            <Item
              child={true}
              title={"ایجاد مزایده"}
              path={"/dashboard/auctions/create"}
              icon={"/assets/icons8-auction-96-add.png"}
            />
            <Item
              child={true}
              title={"پیشنهادات من"}
              path={"/dashboard/auctions/purposes"}
              icon={"/assets/icons8-send-48.png"}
            />
          </>
        )}

        {isAgent && (
          <>
            <Item
              title={"ارجاعات کارشناسی"}
              path={"/dashboard/agent"}
              icon={"/assets/icons8-broker-96.png"}
            />
            <Item
              title={"دسته بندی های من"}
              path={"/dashboard/agentcategories"}
              icon={"/assets/icons8-opened-folder-96.png"}
            />

            <Item
              title={"پروفایل من"}
              path={"/dashboard/profile"}
              icon={"/assets/icons8-admin-settings-male-96.png"}
            />
          </>
        )}

        <div
          onClick={() => {
            localStorage.removeItem("api_token");
            router.push("/login");
          }}
          className={`text-center w-[92%] mx-[4%] my-2 p-2 rounded-lg shadow-lg h-100 bg-white cursor-pointer `}
        >
          خروج
        </div>
      </div>
      <div className="sidebar_bg"></div>
    </aside>
  );
}

export default Sidebar;
