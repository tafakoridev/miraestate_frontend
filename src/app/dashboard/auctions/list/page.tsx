"use client"
// Auctions.tsx
import React, { useState, useEffect } from 'react';
import { Loading, Notify } from 'notiflix';
import { GetToken } from '@/app/utils/Auth';
import { useRouter } from 'next/navigation';
import AuctionPurposeList from '@/app/components/dashboard/AuctionPurposeList';
import AgentSelect from '@/app/components/dashboard/AgentSelect';

interface Agent {
    description: string;
}

interface Purpose {
    id: number;
    description: string;
    user: User;
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
}

interface Purpose {
    id: number;
    description: string;
    user: User;
  }



function Auctions() {
    const [auctions, setAuctions] = useState<Auction[]>([]);
    const router = useRouter();
    const [selectedAuctionId, setSelectedAuctionId] = useState<number | null>(null);
    const [showAuctionPurposeList, setShowAuctionPurposeList] = useState(false);
    const [AuctionPurposeList_, setAuctionPurposeList] = useState<Purpose[] | []>([]);
    const [selectedTenderId, setSelectedTenderId] = useState<number | null>(null);
    const [IsAgentSelect, setIsAgentSelect] = useState(false);

    const handleShowAuctionPurposeList = (auction: Auction) => {
        setSelectedAuctionId(auction.id);
        setAuctionPurposeList(auction.purpose);
        setShowAuctionPurposeList(true);
    };

    const handleAcceptPurpose = (purposeId: number) => {
        console.log(purposeId);
        // Add logic for handling accepted purpose
    };


    const fetchAuctions = async () => {
        Loading.pulse();
        const token = GetToken();
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auctions`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setAuctions(data.auctions);

            Loading.remove();
        } catch (error) {
            console.error('Error fetching auctions:', error);
        }
    };

    useEffect(() => {
    

        fetchAuctions();
    }, []); // Empty dependency array to ensure the effect runs only once on mount

    const handleDeleteAuction = async (id: number) => {
        const token = GetToken();
        Loading.pulse();
        try {
            await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auctions/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setAuctions((prevAuctions) => prevAuctions.filter((auction) => auction.id !== id));
            Loading.remove();
            Notify.init({
                width: '300px',
                position: 'left-bottom',
            });
            Notify.success('مزایده با موفقیت حذف شد');
        } catch (error) {
            console.error('Error deleting auction:', error);
        }
    };

    const handleEditAuction = (id: number) => {
        // Redirect to the edit page with the auction_id query parameter
        router.push(`/dashboard/auctions/edit?auction_id=${id}`);
    };

    return (
        <div>
            <h1>لیست مزایده‌های من</h1>
            {IsAgentSelect && <AgentSelect onClose={() => {
                setIsAgentSelect(false);
                setSelectedTenderId(null);
                fetchAuctions();

            }} type='tender' id={`${selectedTenderId}`}/>}
            <table className="table-auto border-collapse w-[1000px] text-center md:w-full">
            <thead>
                    <tr>
                        <th className="border text-blue-800 bg-slate-300">عنوان</th>
                        <th className="border text-blue-800 bg-slate-300">توضیحات</th>
                        <th className="border text-blue-800 bg-slate-300">کارشناس</th>
                        <th className="border text-blue-800 bg-slate-300">کارشناسی</th>
                        <th className="border text-blue-800 bg-slate-300">عملیات</th>
                        <th className="border text-blue-800 bg-slate-300">پیشنهادها</th>
                    </tr>
                </thead>
                <tbody>
                    {auctions.map((auction) => (
                        <tr key={auction.id}>
                            <td className="border border-slate-300">{auction.title}</td>
                            <td className="border border-slate-300 w-1/3">
                                {auction.agent?.description}
                            </td>
                           
                            {auction.agent_user 
                            ? <td className="border border-slate-300 w-1/3">{auction.agent_user.name}</td>
                            : <td className="border border-slate-300 w-1/3">
                                 <div className="flex justify-center flex-col items-center">
                                    <p className='text-center'>
                                        رد شده به دلیل:
                                        <br />
                                        {auction.decline}
                                    </p>
                                    <button  className="my-2 float-left text-white bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2" onClick={() => {
                                        setSelectedTenderId(auction.id);
                                        setIsAgentSelect(true);
                                    }}>ارجاع به کارشناس دیگر</button>
                                </div>
                                </td>}
                       
                            <td className="border border-slate-300 w-1/2">{auction.agent?.description}</td>
                            <td className="border border-slate-300">
                                <div className="flex justify-evenly">
                                    <button className="w-20 my-2 float-left text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2" onClick={() => handleEditAuction(auction.id)}>ویرایش</button>
                                    <button className="w-20 my-2 float-left text-white bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2" onClick={() => handleDeleteAuction(auction.id)}>حذف</button>
                                </div>
                            </td>
                            <td className="border border-slate-300">
                                <div className="flex justify-center">
                                    <button className="w-30 my-2 text-white bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2" onClick={() => handleShowAuctionPurposeList(auction)}>پیشنهادها</button>
                                </div>
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

export default Auctions;




