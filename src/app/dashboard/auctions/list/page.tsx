"use client";
import { useState, useEffect } from "react";
import { Loading, Notify } from "notiflix";
import { GetToken } from "@/app/utils/Auth";
import { useRouter } from "next/navigation";
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

interface auction {
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
}

interface Field {
  title: string;
  value: string;
}

function Auctions() {
  const [auctions, setAuctions] = useState<auction[]>([]);
  const router = useRouter();

  const [selectedauctionId, setSelectedauctionId] = useState<number | null>(null);
  const [showauctionPurposeList, setShowauctionPurposeList] = useState(false);
  const [IsAgentSelect, setIsAgentSelect] = useState(false);
  const [auctionPurposeList_, setauctionPurposeList] = useState<Purpose[] | []>(
    []
  );
  const handleShowauctionPurposeList = (auction: auction) => {
    setSelectedauctionId(auction.id);
    setauctionPurposeList(auction.purpose);
    setShowauctionPurposeList(true);
  };

  const handleAcceptPurpose = (purposeId: number) => {
    console.log(purposeId);
  };
  const fetchAuctions = async () => {
    Loading.pulse();
    const token = GetToken();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auctions/byuser/list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setAuctions(data.auctions);
      
      Loading.remove();
    } catch (error) {
      console.error("Error fetching Auctions:", error);
    }
  };
  useEffect(() => {
    fetchAuctions();
  }, []); // Empty dependency array to ensure the effect runs only once on mount

  const handleDeleteauction = async (id: number) => {
    const token = GetToken();
    Loading.pulse();
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auctions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAuctions((prevAuctions) =>
        prevAuctions.filter((auction) => auction.id !== id)
      );
      Loading.remove();
      Notify.init({
        width: "300px",
        position: "left-bottom",
      });
      Notify.success("مزایده با موفقیت حذف شد");
    } catch (error) {
      console.error("Error deleting auction:", error);
    }
  };

  const handleEndauction = async (id: number) => {
    const token = GetToken();
    Loading.pulse();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auctions/client/set/end`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({id }),
      });
      
      if (response.ok) {
        const result = await response.json();
        fetchAuctions();
        Notify.success(result.msg);
      } else {
        const data = await response.json();
        Notify.failure(`خطا: ${data.error}`);
      }
      setAuctions((prevAuctions) =>
        prevAuctions.filter((auction) => auction.id !== id)
      );
      Loading.remove();
      Notify.init({
        width: "300px",
        position: "left-bottom",
      });
      Notify.success("مزایده با موفقیت پایان یافت");
    } catch (error) {
      console.error("Error deleting auction:", error);
    }
  };

  const handleEditauction = (id: number) => {
    // Redirect to the edit page with the auction_id query parameter
    router.push(`/dashboard/Auctions/edit?auction_id=${id}`);
  };

  return (
    <div>
      <h1>لیست مزایدات من</h1>
      {IsAgentSelect && (
        <AgentSelect
          onClose={() => {
            setIsAgentSelect(false);
            setSelectedauctionId(null);
            fetchAuctions();
          }}
          type="auction"
          id={`${selectedauctionId}`}
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
            <tr key={auction.id}>
              <td className="border border-slate-300">{auction.title}</td>
              <td className="border border-slate-300 w-1/3">
                {auction.description}
              </td>
              <td className="border border-slate-300">{auction.price}تومان</td>
              <td className="border border-slate-300">
                از  &nbsp;<span dir="ltr">{moment(auction.start).format("jYYYY-jM-jD")}</span>
                &nbsp;
                تا 
                &nbsp;
                <span dir="ltr">{moment(auction.end).format("jYYYY-jM-jD")}</span>
              </td>
              <td className="border border-slate-300">{auction.address}</td>
              <td className="border border-slate-300">
              {auction.fields && 
                JSON.parse(auction.fields).map((field: Field, i: number) => (
                  <div key={i} className="flex justify-between border p-1 my-3">
                    <div><b>{field.title}</b></div>
                    <div>{field.value}</div>
                  </div>
                ))
              }
              </td>
              <td className="border border-slate-300">
                <div className="flex justify-evenly">
                  {/* <button className="w-20 my-2 float-left text-white bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2" onClick={() => handleEditauction(auction.id)}>ویرایش</button> */}
                  <button
                    className="w-20 my-2 float-left text-white bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
                    onClick={() => handleDeleteauction(auction.id)}
                  >
                    حذف
                  </button>
                  {/* <button className="w-20 my-2 float-left text-white bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2" onClick={() => handleEditauction(auction.id)}>ویرایش</button> */}
                  {
                    auction.is_active !== 3 && <button
                    className="w-30 my-2 float-left text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
                    onClick={() => handleEndauction(auction.id)}
                  >
                    اعلام پایان  
                  </button>
                  }
                </div>
              </td>
              <td className="border border-slate-300">
                <div className="flex justify-center">
                {auction.winner ? (
                    <div className="flex flex-col">
                      <b>برنده</b>
                      <span>{auction.winner.name}</span>
                      <span> {auction.winner.phonenumber}</span>
                    </div>
                  ) : <button
                  className="w-30 my-2 text-white bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
                  onClick={() => handleShowauctionPurposeList(auction)}
                >
                  پیشنهادها
                </button>}
                  
                </div>
              </td>
              <td className="border border-slate-300">
                {auction.is_active === 2 && "تایید شده"}
                {auction.is_active === 1 && "تایید نشده"}
                {auction.is_active === 5 && "در انتظار پایان"}
                {auction.is_active === 3 && "پایان یافته"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showauctionPurposeList && selectedauctionId && auctionPurposeList_ && (
        <AuctionPurposeList
          purposes={auctionPurposeList_}
          onClose={() => setShowauctionPurposeList(false)}
          onAcceptPurpose={handleAcceptPurpose}
        />
      )}
    </div>
  );
}

export default Auctions;
