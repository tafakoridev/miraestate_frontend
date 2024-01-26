"use client";
import { useState, useEffect } from "react";
import { Loading, Notify } from "notiflix";
import { GetToken } from "@/app/utils/Auth";
import TenderPurposeList from "@/app/components/dashboard/TenderPurposeList";
import AgentSelect from "@/app/components/dashboard/AgentSelect";
import moment from "moment-jalaali";
interface Agent {
  description: string;
}

interface Purpose {
  id: number;
  description: string;
  user: User;
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
  is_active: boolean;
}

interface Field {
  title: string;
  value: string;
}

function ReadyToPublish() {
  const [tenders, setTenders] = useState<Tender[]>([]);

  const [selectedTenderId, setSelectedTenderId] = useState<number | null>(null);
  const [showTenderPurposeList, setShowTenderPurposeList] = useState(false);
  const [IsAgentSelect, setIsAgentSelect] = useState(false);


  const handleAcceptPurpose = async (tenderId: number) => {
    Loading.pulse();
    const token = GetToken();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tenders/admin/accept/${tenderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      Notify.init({
        width: '300px',
        position: 'left-bottom',
        });
      if(data === 1) {
        Notify.success("با موفقیت تایید شد")
        fetchTenders()
      }
      
      
      Loading.remove();
    } catch (error) {
      console.error("Error fetching tenders:", error);
    }
  };

  const fetchTenders = async () => {
    Loading.pulse();
    const token = GetToken();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tenders/byadmin/list`,
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

  return (
    <div>
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
            <th className="border text-blue-800 bg-slate-300">پیشنهادها</th>
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
                از  &nbsp;<span dir="ltr">{moment(tender.start).format("jYYYY-jM-jD")}</span>
                &nbsp;
                تا 
                &nbsp;
                <span dir="ltr">{moment(tender.end).format("jYYYY-jM-jD")}</span>
              </td>
              <td className="border border-slate-300">{tender.address}</td>
              <td className="border border-slate-300">
              {tender.fields && 
                JSON.parse(tender.fields).map((field: Field, i: number) => (
                  <div key={i} className="flex justify-between border p-1 my-3">
                    <div><b>{field.title}</b></div>
                    <div>{field.value}</div>
                  </div>
                ))
              }
              </td>
              <td className="border border-slate-300">
                <div className="flex justify-evenly">
                  {/* <button className="w-20 my-2 float-left text-white bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2" onClick={() => handleEditTender(tender.id)}>ویرایش</button> */}
                  <button
                    className="w-20 my-2 float-left text-white bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
                    onClick={() => handleDeleteTender(tender.id)}
                  >
                    حذف
                  </button>
                </div>
              </td>
              <td className="border border-slate-300">
                <div className="flex justify-center">
                  <button
                    className="w-30 my-2 text-white bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
                    onClick={() => handleAcceptPurpose(tender.id)}
                  >
                    تایید
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReadyToPublish;
