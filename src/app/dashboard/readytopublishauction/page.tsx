"use client";
import { useState, useEffect } from "react";
import { Loading, Notify } from "notiflix";
import { GetToken } from "@/app/utils/Auth";
import AuctionPurposeList from "@/app/components/dashboard/AuctionPurposeList";
import AgentSelect from "@/app/components/dashboard/AgentSelect";
import moment from "moment-jalaali";
interface Agent {
  description: string;
}

interface Purpose {
  id: number;
  description: string;
  price: number;
  user: User;
  user_id: number;
  purposeable_id: number;
}

interface Auction {
  id: number;
  department_id: number;
  title: string;
  description: string;
  purpose: Purpose[];
  agent: Agent;
  agent_user: User;
  decline: string;
  address: string;
  price: string;
  start: string;
  end: string;
  fields: string;
  is_active: number;
  winner: User;
  user_id: number;
}

interface Field {
  title: string;
  value: string;
}

function ReadyToPublish() {
  const [auctions, setauctions] = useState<Auction[]>([]);

  const [selectedAuctionId, setSelectedAuctionId] = useState<number | null>(
    null
  );
  const [showAuctionPurposeList, setShowAuctionPurposeList] = useState(false);
  const [IsAgentSelect, setIsAgentSelect] = useState(false);
  const [AuctionPurposeList_, setAuctionPurposeList] = useState<Purpose[] | []>(
    []
  );

  const handleAcceptPurpose = async (AuctionId: number) => {
    Loading.pulse();
    const token = GetToken();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auctions/admin/accept/${AuctionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      Notify.init({
        width: "300px",
        position: "left-bottom",
      });
      if (data === 1) {
        Notify.success("با موفقیت تایید شد");
        fetchauctions();
      }

      Loading.remove();
    } catch (error) {
      console.error("Error fetching auctions:", error);
    }
  };

  const fetchauctions = async () => {
    Loading.pulse();
    const token = GetToken();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auctions/byadmin/list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setauctions(data.auctions);

      Loading.remove();
    } catch (error) {
      console.error("Error fetching auctions:", error);
    }
  };
  useEffect(() => {
    fetchauctions();
  }, []); // Empty dependency array to ensure the effect runs only once on mount

  const handleShowauctionPurposeList = (Auction: Auction) => {
    setSelectedAuctionId(Auction.id);
    setAuctionPurposeList(Auction.purpose);
    setShowAuctionPurposeList(true);
  };

  const handleDeleteAuction = async (id: number) => {
    const token = GetToken();
    Loading.pulse();
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auctions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setauctions((prevauctions) =>
        prevauctions.filter((Auction) => Auction.id !== id)
      );
      Loading.remove();
      Notify.init({
        width: "300px",
        position: "left-bottom",
      });
      Notify.success("مزایده با موفقیت حذف شد");
    } catch (error) {
      console.error("Error deleting Auction:", error);
    }
  };

  const handleEndAuction = async (id: number, user_id: number) => {
    const token = GetToken();
    Loading.pulse();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auctions/admin/set/end`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id, user_id }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        fetchauctions();
        Notify.success(result.msg);
      } else {
        const data = await response.json();
        Notify.failure(`خطا: ${data.error}`);
      }
      setauctions((prevauctions) =>
        prevauctions.filter((auction) => auction.id !== id)
      );
      Loading.remove();
      Notify.init({
        width: "300px",
        position: "left-bottom",
      });
      Notify.success("مناقصه با موفقیت پایان یافت");
    } catch (error) {
      console.error("Error deleting auction:", error);
    }
  };

  return (
    <div>
      {IsAgentSelect && (
        <AgentSelect
          onClose={() => {
            setIsAgentSelect(false);
            setSelectedAuctionId(null);
            fetchauctions();
          }}
          type="Auction"
          id={`${selectedAuctionId}`}
        />
      )}
      <table className="table-auto border-collapse w-[1000px] text-center md:w-full">
        <thead>
          <tr>
            <th className="border text-blue-800 bg-slate-300">عنوان</th>
            <th className="border text-blue-800 bg-slate-300">توضیحات</th>
            <th className="border text-blue-800 bg-slate-300">قیمت پایه</th>
            <th className="border text-blue-800 bg-slate-300">بازه زمانی</th>
            <th className="border text-blue-800 bg-slate-300">آدرس</th>
            <th className="border text-blue-800 bg-slate-300">فیلدها</th>
            <th className="border text-blue-800 bg-slate-300">عملیات</th>
            <th className="border text-blue-800 bg-slate-300">پیشنهادها</th>
            <th className="border text-blue-800 bg-slate-300">وضعیت</th>
          </tr>
        </thead>
        <tbody>
          {auctions.map((auction) => (
            <tr
              key={auction.id}
              className={auction.is_active ? `bg-green-50` : `bg-red-50`}
            >
              <td className="border border-slate-300">{auction.title}</td>
              <td className="border border-slate-300 w-1/3">
                {auction.description}
              </td>
              <td className="border border-slate-300">{auction.price}تومان</td>
              <td className="border border-slate-300">
                از &nbsp;
                <span dir="ltr">
                  {moment(auction.start).format("jYYYY-jM-jD")}
                </span>
                &nbsp; تا &nbsp;
                <span dir="ltr">
                  {moment(auction.end).format("jYYYY-jM-jD")}
                </span>
              </td>
              <td className="border border-slate-300">{auction.address}</td>
              <td className="border border-slate-300">
                {auction.fields &&
                  JSON.parse(auction.fields).map((field: Field, i: number) => (
                    <div
                      key={i}
                      className="flex justify-between border p-1 my-3"
                    >
                      <div>
                        <b>{field.title}</b>
                      </div>
                      <div>{field.value}</div>
                    </div>
                  ))}
              </td>
              <td className="border border-slate-300">
                <div className="flex justify-evenly">
                  {/* <button className="w-20 my-2 float-left text-white bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2" onClick={() => handleEditAuction(Auction.id)}>ویرایش</button> */}
                  <button
                    className="w-30 my-2 float-left text-white bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
                    onClick={() => handleDeleteAuction(auction.id)}
                  >
                    حذف
                  </button>
                </div>
                {!auction.is_active && (
                  <div className="flex justify-center">
                    <button
                      className="w-30 my-2 text-white bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
                      onClick={() => handleAcceptPurpose(auction.id)}
                    >
                      تایید{" "}
                    </button>
                  </div>
                )}

                {auction.is_active === 5 && (
                  <div className="flex justify-center">
                    <button
                      className="w-30 my-2 text-white bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
                      onClick={() => handleEndAuction(auction.id, auction.user_id)}
                    >
                      تایید پایان
                    </button>
                  </div>
                )}
              </td>
              <td className="border border-slate-300">
                <div className="flex justify-center">
                  {auction.winner ? (
                    <div className="flex flex-col">
                      <b>برنده</b>
                      <span>{auction.winner.name}</span>
                      <span> {auction.winner.phonenumber}</span>
                    </div>
                  ) : (
                    <button
                      className="w-30 my-2 text-white bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
                      onClick={() => handleShowauctionPurposeList(auction)}
                    >
                      پیشنهادها
                    </button>
                  )}
                </div>
              </td>

              <td className="border border-slate-300">
                {auction.is_active === 2 && "تایید شده"}
                {auction.is_active === 1 && "در انتظار تایید"}
                {auction.is_active === 5 && "در انتظار پایان"}
                {auction.is_active === 3 && "پایان یافته"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showAuctionPurposeList && selectedAuctionId && AuctionPurposeList_ && (
        <AuctionPurposeList
          purposes={AuctionPurposeList_}
          onClose={() => setShowAuctionPurposeList(false)}
          onAcceptPurpose={handleAcceptPurpose}
        />
      )}
    </div>
  );
}

export default ReadyToPublish;
