"use client";
import { useState, useEffect } from "react";
import { Loading, Notify } from "notiflix";
import { GetToken, GetUser } from "@/app/utils/Auth";
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
  purposeable: Auction;
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
  user: User;
  winner_id: number;
}

function AuctionPurposes() {
  const [purposes, setPurposes] = useState<Purpose[]>([]);
  const [me, setMe] = useState<any>();
  const router = useRouter();
  const fetchPurposes = async () => {
    const me = await GetUser();

    setMe(me);

    Loading.pulse();
    const token = GetToken();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auctions/my/purposes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setPurposes(data);

      Loading.remove();
    } catch (error) {
      console.error("Error fetching Auctions:", error);
    }
  };

  useEffect(() => {
    fetchPurposes();
  }, []); // Empty dependency array to ensure the effect runs only once on mount

  return (
    <div>
      <table className="table-auto border-collapse w-[1000px] text-center md:w-full">
        <thead>
          <tr>
            <th className="border text-blue-800 bg-slate-300">عنوان مزایده</th>
            <th className="border text-blue-800 bg-slate-300">قیمت</th>
            <th className="border text-blue-800 bg-slate-300">توضیحات</th>
            <th className="border text-blue-800 bg-slate-300">وضعیت</th>
            <th className="border text-blue-800 bg-slate-300">اطلاعات </th>
          </tr>
        </thead>
        <tbody>
          {purposes.map((purpose) => (
            <tr key={purpose.id}>
              <td className="border border-slate-300">
                {purpose.purposeable?.title}
              </td>
              <td className="border border-slate-300">{purpose.price}تومان</td>
              <td className="border border-slate-300">{purpose.description}</td>
              <td className="border border-slate-300">
                {purpose.purposeable?.winner?.id === me.id ? (
                  <span className="bg-green-200 rounded-lg text-xs px-2">
                    برنده شدید
                  </span>
                ) : !purpose.purposeable?.winner_id ? (
                  <span className="bg-yellow-200 rounded-lg text-xs px-2">
                    در انتظار ...
                  </span>
                ) : (
                  <span className="bg-red-200 rounded-lg text-xs px-2">
                    برنده نشدید
                  </span>
                )}
              </td>
              <td className="border border-slate-300">
                {purpose.purposeable?.winner?.id === me.id ? (
                  <div className="flex flex-col">
                    <span>{purpose.purposeable?.user.name}</span>
                    <span>{purpose.purposeable?.user.phonenumber}</span>
                  </div>
                ) : !purpose.purposeable?.winner_id ? (
                  <>-</>
                ) : <p>مبلغ بیعانه پرداختی شما به کیف پول شما برگشت خورد</p>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AuctionPurposes;
