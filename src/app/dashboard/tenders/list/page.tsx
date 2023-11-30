"use client"
import { useState, useEffect } from 'react';
import { Loading, Notify } from 'notiflix';
import { GetToken } from '@/app/utils/Auth';
import { useRouter } from 'next/navigation';
import TenderPurposeList from '@/app/components/dashboard/TenderPurposeList';
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
}

function Tenders() {
    const [tenders, setTenders] = useState<Tender[]>([]);
    const router = useRouter();
    const [selectedTenderId, setSelectedTenderId] = useState<number | null>(null);
    const [showTenderPurposeList, setShowTenderPurposeList] = useState(false);
    const [TenderPurposeList_, setTenderPurposeList] = useState<Purpose[] | []>([]);
    const handleShowTenderPurposeList = (Tender: Tender) => {
        setSelectedTenderId(Tender.id);
        setTenderPurposeList(Tender.purpose);
        setShowTenderPurposeList(true);
    };

    const handleAcceptPurpose = (purposeId: number) => {
        console.log(purposeId);
        
    };
    useEffect(() => {
        const fetchTenders = async () => {
            Loading.pulse();
            const token = GetToken();
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tenders`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                setTenders(data.tenders);
                Loading.remove();
            } catch (error) {
                console.error('Error fetching tenders:', error);
            }
        };

        fetchTenders();
    }, []); // Empty dependency array to ensure the effect runs only once on mount

    const handleDeleteTender = async (id: number) => {
        const token = GetToken();
        Loading.pulse();
        try {
            await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tenders/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setTenders((prevTenders) => prevTenders.filter((tender) => tender.id !== id));
            Loading.remove();
            Notify.init({
                width: '300px',
                position: 'left-bottom',
                });
            Notify.success('مناقصه با موفقیت حذف شد');
        } catch (error) {
            console.error('Error deleting tender:', error);
        }
    };

    const handleEditTender = (id: number) => {
        // Redirect to the edit page with the tender_id query parameter
        router.push(`/dashboard/tenders/edit?tender_id=${id}`);
    };

    return (
        <div>
            <h1>لیست مناقصات من</h1>
            <table className="table-auto border-collapse w-[1000px] text-center md:w-full">
                <thead>
                    <tr>
                    <th className="border text-blue-800 bg-slate-300">عنوان</th>
                        <th className="border text-blue-800 bg-slate-300">توضیحات</th>
                        <th className="border text-blue-800 bg-slate-300">کارشناسی</th>
                        <th className="border text-blue-800 bg-slate-300">عملیات</th>
                        <th className="border text-blue-800 bg-slate-300">پیشنهادها</th>
                    </tr>
                </thead>
                <tbody>
                    {tenders.map((tender) => (
                        <tr key={tender.id}>
                            <td className="border border-slate-300">{tender.title}</td>
                            <td className="border border-slate-300 w-1/3">{tender.description}</td>
                            <td className="border border-slate-300 w-1/3">{tender.agent?.description}</td>
                            <td className="border border-slate-300">
                                <div className="flex justify-evenly">
                                    <button className="w-20 my-2 float-left text-white bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2" onClick={() => handleEditTender(tender.id)}>ویرایش</button>
                                    <button className="w-20 my-2 float-left text-white bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2" onClick={() => handleDeleteTender(tender.id)}>حذف</button>

                                </div>
                            </td>
                            <td className="border border-slate-300">
                                <div className="flex justify-center">
                                    <button className="w-30 my-2 text-white bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2" onClick={() => handleShowTenderPurposeList(tender)}>پیشنهادها</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {showTenderPurposeList && selectedTenderId && TenderPurposeList_ &&(
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
