"use client";
import { GetToken, IsLogin } from "@/app/utils/Auth";
import { Loading, Notify } from "notiflix";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'

interface Information {
    rate: number;
    profile_photo_url: string;
    is_active: string;
}

interface Agent extends User {
    information: Information;
}
function Agents() {
    const [Agents, setAgents] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingRate, setIsEditingRate] = useState(false);
    const [editingagentId, setEditingagentId] = useState(null);
    const [editedName, setEditedName] = useState("");
    const [editedRate, setEditedRate] = useState("");
    const router = useRouter()
    const isLogin = IsLogin();

    const handleEdit = (agentId: any) => {
        setIsEditing(true);
        setEditingagentId(agentId);
      };
      
    const handleEditRate = (agentId: any) => {
        setIsEditingRate(true);
        setEditingagentId(agentId);
      };

      const handleSaveRate = () => {
        
        Loading.pulse();
     
        const token = GetToken();
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/agents/information/${editingagentId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ rate: editedRate }),
        })
          .then((response) => response.json())
          .then((data) => {
            // Handle successful save
            console.log('agent name updated:', data);
          })
          .catch((error) => {
            // Handle error
            console.error('Error updating agent name:', error);
          })
          .finally(() => {
            setIsEditing(false);
            setEditingagentId(null);
            getAgents();
            Loading.remove();
            Notify.init({
                width: '300px',
                position: 'left-bottom',
                });
            Notify.success("ویرایش کاربر اعمال شد")

          });
      };
      
      const handleSave = () => {
        
        Loading.pulse();
     
        const token = GetToken();
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${editingagentId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ name: editedName }),
        })
          .then((response) => response.json())
          .then((data) => {
            // Handle successful save
            console.log('agent name updated:', data);
          })
          .catch((error) => {
            // Handle error
            console.error('Error updating agent name:', error);
          })
          .finally(() => {
            setIsEditing(false);
            setEditingagentId(null);
            getAgents();
            Loading.remove();
            Notify.init({
                width: '300px',
                position: 'left-bottom',
                });
            Notify.success("ویرایش کاربر اعمال شد")

          });
      };

      
    async function getAgents() {
        Loading.pulse();
        const token = GetToken();
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/agents/list`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error(`Failed to fetch data: ${res.status}`);
            }

            const result = await res.json();
            
            setAgents(result);
            setDataLoaded(true);
            Loading.remove();
        } catch (error) {
            console.error(error);
            // Handle error, set an error state, or show an error message
        }
    }

    async function editagent(field: string, agent: any, newField: string) {
        Loading.pulse();
        let updatedagent: Agent;
        agent[field] = newField;
        delete agent.created_at;
        delete agent.updated_at;
        updatedagent = agent;


        const token = GetToken();
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${agent.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updatedagent)
            });

            if (!res.ok) {
                throw new Error(`Failed to fetch data: ${res.status}`);
            }

            const result = await res.json();
            result && getAgents();
            Loading.remove();
            Notify.init({
                width: '300px',
                position: 'left-bottom',
                });
            result && Notify.success("ویرایش کاربر اعمال شد")

        } catch (error) {
            console.error(error);
            // Handle error, set an error state, or show an error message
        }
    }


    async function editagentinformation(field: string, agent: any, newField: string) {
        Loading.pulse();
        let updatedagent: Agent;
        agent.information[field] = newField;
        delete agent.information.created_at;
        delete agent.information.updated_at;
        updatedagent = agent.information;


        const token = GetToken();
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/agents/information/${agent.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updatedagent)
            });

            if (!res.ok) {
                throw new Error(`Failed to fetch data: ${res.status}`);
            }

            const result = await res.json();
            result && getAgents();
            Loading.remove();
            Notify.init({
                width: '300px',
                position: 'left-bottom',
                });
            result && Notify.success("ویرایش کاربر اعمال شد")

        } catch (error) {
            console.error(error);
            // Handle error, set an error state, or show an error message
        }
    }

    

    useEffect(() => {
        if(isLogin === false)
        router.push('/login')
        else if (!dataLoaded) {
            getAgents();
        }
    }, [dataLoaded]);
    return (
        <div>
            <table className="table-auto border-collapse w-[1000px] text-center md:w-full">
                <thead className=" top-[-20px]">
                    <tr>
                        <th className="border text-blue-800 bg-slate-300">#</th>
                        <th className="border text-blue-800 bg-slate-300">نام</th>
                        <th className="border text-blue-800 bg-slate-300">شماره موبایل</th>
                        <th className="border text-blue-800 bg-slate-300">نقش</th>
                        <th className="border text-blue-800 bg-slate-300">رتبه</th>
                        <th className="border text-blue-800 bg-slate-300">وضعیت</th>
                        <th className="border text-blue-800 bg-slate-300">بیشتر</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>

                    {Agents.length > 0 && Agents.map((agent: Agent, i) => (
                        <tr key={i}>
                            <td className="border border-slate-300">{agent.id}</td>
                            <td className="border border-slate-300 text-center" onClick={() => handleEdit(agent.id)}>
                                {isEditing && editingagentId === agent.id ? (
                                    <input
                                        type="text"
                                        value={editedName}
                                        className="text-center bg-gray-200"
                                        onChange={(e) => setEditedName(e.target.value)}
                                        onBlur={handleSave}
                                    />
                                ) : (
                                    agent.name
                                )}
                            </td>
                            <td className="border border-slate-300" dir="ltr">
                                {agent.phonenumber}
                            </td>
                            <td className="border border-slate-300">
                                <select value={agent.role} onChange={e => editagent('role', agent, e.target.value)}>
                                    <option value="admin">ادمین</option>
                                    <option value="agent">کارشناس</option>
                                    <option value="customer">مشتری</option>
                                </select>
                            </td>
                            <td className="border border-slate-300" onClick={() => handleEditRate(agent.id)}>
                                {isEditingRate && editingagentId === agent.id ? (
                                    <input
                                        type="number"
                                        max={100}
                                        value={editedRate}
                                        className="text-center bg-gray-200"
                                        onChange={(e) => setEditedRate(e.target.value)}
                                        onBlur={handleSaveRate}
                                    />
                                ) : (
                                    <>{agent.information?.rate ?? 0} <span className="text-gray-400">از 100</span></>
                                )}
                               
                            </td>
                            <td className="border border-slate-300">
                                <select value={agent.information.is_active} onChange={e => editagentinformation('is_active', agent, e.target.value)}>
                                    <option value="active">فعال</option>
                                    <option value="deactive">غیرفعال</option>
                                </select>
                            </td>
                            <td className="border border-slate-300">
                                <button onClick={() => router.push(`/dashboard/user?userId=${agent.id}`)} className="bg-blue-400 aspect-square w-10 h-10 m-1 rounded-full text-white font-bold text-2xl shadow border-2 border-gray-300">
                                    +
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>
        </div>
    )
}

export default Agents;