"use client";

import { useState, useEffect } from "react";
import { Loading, Notify } from "notiflix";
import { GetToken } from "@/app/utils/Auth";
import AgentDesk from "@/app/components/dashboard/AgentDesk";
import AgentDecline from "@/app/components/dashboard/AgentDecline";

interface AgentInResponse {
  tenders: Tender[];
  auctions: Auction[];
  commodities: Commodity[];
}

interface Agent {
  description: string;
}

interface Tender {
  id: number;
  user_id: number;
  department_id: number;
  agent: Agent;
  agent_id: number;
  title: string;
  description: string;
  user: User;
}

interface Auction {
  id: number;
  user_id: number;
  agent: Agent;
  department_id: number;
  agent_id: number;
  title: string;
  description: string;
  user: User;
}
interface Commodity {
  id: number;
  title: string;
  description: string;
  agent: Agent;
  agent_id: number;
  user: User;
}

function AgentIn() {
  const [agentInData, setAgentInData] = useState<AgentInResponse | null>(null);
  const [type, setType] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [is_open, setModal] = useState<boolean>(false);
  const [is_open_decline, setIsDecline] = useState<boolean>(false);
  const fetchAgentInData = async () => {
    Loading.pulse();
    const token = GetToken();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/agents/in`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data: AgentInResponse = await response.json();
      setAgentInData(data);
      Loading.remove();
    } catch (error) {
      console.error("Error fetching agent in data:", error);
    }
  };
  useEffect(() => {


    fetchAgentInData();
  }, []); // Empty dependency array to ensure the effect runs only once on mount

  return (
    <div>
      {is_open && (
        <AgentDesk
          onClose={() => {
            setModal(false);
          }}
          type={type}
          id={id}
        />
      )}

      {is_open_decline && (
        <AgentDecline
          onClose={() => {
            setIsDecline(false);
            setType("");
            setId("");
            fetchAgentInData();
          }}
          type={type}
          id={id}
        />
      )}
      {agentInData ? (
        <div>
          <br />
          <div>
            <table className="table-auto border-collapse w-[1000px] text-center md:w-full">
              <thead>
                <tr>
                  <th className="border text-blue-800 bg-slate-300 h-[40px]">
                    #
                  </th>
                  <th className="border text-blue-800 bg-slate-300 h-[40px]">
                    عنوان
                  </th>
                  <th className="border text-blue-800 bg-slate-300 h-[40px]">
                    توضیحات
                  </th>
                  <th className="border text-blue-800 bg-slate-300 h-[40px]">
                    درخواست کننده
                  </th>
                  <th className="border text-blue-800 bg-slate-300 h-[40px]">
                    کارشناسی
                  </th>
                  <th className="border text-blue-800 bg-slate-300 h-[40px]">
                    عملیات
                  </th>
                  {/* Add more headers as needed */}
                </tr>
              </thead>
              <tbody>
                {agentInData.commodities.map((commodity) => (
                  <tr key={commodity.id}>
                    <td className="border border-slate-300 h-[40px]">
                      {commodity.id}
                    </td>
                    <td className="border border-slate-300 h-[40px]">
                      {commodity.title}
                    </td>
                    <td className="border border-slate-300 h-[40px]">
                      {commodity.description}
                    </td>
                    <td className="border border-slate-300 h-[40px]">
                      {commodity.user.name}
                    </td>
                    <td className="border border-slate-300 h-[40px]">
                      <div className="flex justify-center">
                        {commodity.agent ? (
                          commodity.agent.description
                        ) : (
                          <button
                            onClick={() => {
                              setType("commodity");
                              setId(String(commodity.id));
                              setModal(true);
                            }}
                            className="my-2  float-left text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
                            type="submit"
                          >
                            ارائه کارشناسی
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="border border-slate-300">
                      <div className="flex justify-center">
                        <button
                          className="w-30 my-2 text-white bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
                          onClick={() => {
                            setId(String(commodity.id));
                            setIsDecline(true);
                          }}
                        >
                          رد کردن
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default AgentIn;
