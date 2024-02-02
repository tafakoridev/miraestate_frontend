"use client";
import { useState, useEffect } from "react";
import { Loading, Notify } from "notiflix";
import { GetToken } from "@/app/utils/Auth";
import { useRouter } from "next/navigation";
import TenderPurposeList from "@/app/components/dashboard/TenderPurposeList";
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

interface Tender {
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

function Tenders() {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const router = useRouter();

  const [selectedTenderId, setSelectedTenderId] = useState<number | null>(null);
  const [showTenderPurposeList, setShowTenderPurposeList] = useState(false);
  const [IsAgentSelect, setIsAgentSelect] = useState(false);
  const [TenderPurposeList_, setTenderPurposeList] = useState<Purpose[] | []>(
    []
  );


  function findWinnerPurpose(tender: Tender): Purpose | undefined {
    const winnerUser = tender.winner;
    if (winnerUser) {
      // Find the purpose associated with the winner user
      const winnerPurpose = tender.purpose.find(purpose => purpose.user_id === winnerUser.id);
  
      return winnerPurpose;
    }
  
    return undefined; // Return undefined if no winner user is specified
  }


  const handleShowTenderPurposeList = (Tender: Tender) => {
    setSelectedTenderId(Tender.id);
    setTenderPurposeList(Tender.purpose);
    setShowTenderPurposeList(true);
  };

  const handleAcceptPurpose = (purposeId: number) => {
    console.log(purposeId);
  };
  const fetchTenders = async () => {
    Loading.pulse();
    const token = GetToken();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tenders/byuser/list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setTenders(data.tenders);

      Loading.remove();
    } catch (error) {
      console.error("Error fetching tenders:", error);
    }
  };
  useEffect(() => {
    fetchTenders();
  }, []); // Empty dependency array to ensure the effect runs only once on mount

  const handleDeleteTender = async (id: number) => {
    const token = GetToken();
    Loading.pulse();
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tenders/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTenders((prevTenders) =>
        prevTenders.filter((tender) => tender.id !== id)
      );
      Loading.remove();
      Notify.init({
        width: "300px",
        position: "left-bottom",
      });
      Notify.success("مناقصه با موفقیت حذف شد");
    } catch (error) {
      console.error("Error deleting tender:", error);
    }
  };

  const handleEndTender = async (id: number) => {
    const token = GetToken();
    Loading.pulse();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tenders/client/set/end`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        fetchTenders();
        Notify.success(result.msg);
      } else {
        const data = await response.json();
        Notify.failure(`خطا: ${data.error}`);
      }
      setTenders((prevTenders) =>
        prevTenders.filter((tender) => tender.id !== id)
      );
      Loading.remove();
      Notify.init({
        width: "300px",
        position: "left-bottom",
      });
      Notify.success("مناقصه با موفقیت پایان یافت");
    } catch (error) {
      console.error("Error deleting tender:", error);
    }
  };

  const handleEditTender = (id: number) => {
    // Redirect to the edit page with the tender_id query parameter
    router.push(`/dashboard/tenders/edit?tender_id=${id}`);
  };

  return (
    <div>
      <h1>لیست مناقصات من</h1>
      {IsAgentSelect && (
        <AgentSelect
          onClose={() => {
            setIsAgentSelect(false);
            setSelectedTenderId(null);
            fetchTenders();
          }}
          type="tender"
          id={`${selectedTenderId}`}
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
            <th className="border text-blue-800 bg-slate-300">برنده</th>
            <th className="border text-blue-800 bg-slate-300">وضعیت</th>
          </tr>
        </thead>
        <tbody>
          {tenders.map((tender) => (
            <tr key={tender.id}>
              <td className="border border-slate-300">{tender.title}</td>
              <td className="border border-slate-300 w-1/3">
                {tender.description}
              </td>
              <td className="border border-slate-300">{tender.price}تومان</td>
              <td className="border border-slate-300">
                از &nbsp;
                <span dir="ltr">
                  {moment(tender.start).format("jYYYY-jM-jD")}
                </span>
                &nbsp; تا &nbsp;
                <span dir="ltr">
                  {moment(tender.end).format("jYYYY-jM-jD")}
                </span>
              </td>
              <td className="border border-slate-300">{tender.address}</td>
              <td className="border border-slate-300">
                {tender.fields &&
                  JSON.parse(tender.fields).map((field: Field, i: number) => (
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
                  {/* <button className="w-20 my-2 float-left text-white bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2" onClick={() => handleEditTender(tender.id)}>ویرایش</button> */}
                  <button
                    className="w-20 my-2 float-left text-white bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-xs px-4 py-1.5 text-center mb-2"
                    onClick={() => handleDeleteTender(tender.id)}
                  >
                    حذف
                  </button>
                  {/* <button className="w-20 my-2 float-left text-white bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2" onClick={() => handleEditTender(tender.id)}>ویرایش</button> */}
                  {tender.is_active !== 3 && tender.is_active !== 5 && (
                    <button
                      className="w-30 my-2 float-left text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg px-4 py-1.5 text-center mb-2 text-xs"
                      onClick={() => handleEndTender(tender.id)}
                    >
                      اعلام پایان 
                    </button>
                  )}
                  {/* {tender.is_active !== 3 && (
                    <button
                      className="w-30 my-2 float-left text-white bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-gray-300 dark:focus:ring-gray-800 font-medium rounded-lg text-xs px-4 py-1.5 text-center mb-2"
                      onClick={() => handleEndTender(tender.id)}
                    >
                      اعلام پایان ناموفق
                    </button>
                  )} */}
                </div>
              </td>
              <td className="border border-slate-300">
                <div className="flex justify-center">
                  {tender.winner ? (
                    <div className="flex flex-col">
                      <span>{tender.winner.name}</span>
                      <span> {tender.winner.phonenumber}</span>
                      <hr className="hr"/>
                      <span> {findWinnerPurpose(tender)?.price} تومان</span>
                      <span> {findWinnerPurpose(tender)?.description}</span>
                    </div>
                  ) : <span>-</span>}
                  {/* <button
                  className="w-30 my-2 text-white bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
                  onClick={() => handleShowTenderPurposeList(tender)}
                >
                  پیشنهادها
                </button> */}
                </div>
              </td>
              <td className="border border-slate-300">
                {tender.is_active === 2 && "تایید شده"}
                {tender.is_active === 1 && "تایید نشده"}
                {tender.is_active === 5 && "در انتظار پایان"}
                {tender.is_active === 3 && "پایان یافته"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showTenderPurposeList && selectedTenderId && TenderPurposeList_ && (
        <TenderPurposeList
          purposes={TenderPurposeList_}
          onClose={() => setShowTenderPurposeList(false)}
          onAcceptPurpose={handleAcceptPurpose}
        />
      )}
    </div>
  );
}

export default Tenders;
