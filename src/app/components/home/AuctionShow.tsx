// Auction.tsx
import { useState, useEffect } from 'react';
import { Loading, Notify } from 'notiflix';
import { GetToken } from '@/app/utils/Auth';
import Image from 'next/image';
import AuctionPurposeSend from './AuctionPurposeSend';

interface AuctionProps {
  onClose: () => void;
  id: string;
}
interface Agent {
  description: string;
  agent: User;
}


interface AuctionData {
  id: number;
  picture: string;
  title: string;
  price: string;
  description: string;
  phoneNumber: string;
  agent: Agent;
  user: User;
}

const AuctionShow: React.FC<AuctionProps> = ({ onClose, id }) => {
  const [AuctionData, setAuctionData] = useState<AuctionData | null>(null);
  const [showAuctionPurposeSend, setShowAuctionPurposeSend] = useState(false);
  const handleSendPurposeClick = () => {
    setShowAuctionPurposeSend(true);
  };
  useEffect(() => {
    const fetchAuctionData = async () => {
      Loading.pulse();
      const token = GetToken();
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auctions/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        setAuctionData(data.auction);
        Loading.remove();
      } catch (error) {
        console.error('Error fetching Auction data:', error);
      }
    };

    fetchAuctionData();
  }, []);

  const handleCall = () => {
    if (AuctionData?.user?.phonenumber) {
      // Perform the action to initiate a call with the provided phone number
      Notify.success('در حال تماس...');
      location.href = 'tel://' + AuctionData?.user?.phonenumber
    } else {
      Notify.warning('شماره همراه در دسترس نیست');
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="bg-white p-8 rounded-lg md:w-1/3 w-full overflow-x-hidden relative">
        {AuctionData ? (
          <>
            <h2 className="text-2xl font-bold mb-4">{AuctionData.title}</h2>
            <div className="mb-4 h-1/2 overflow-hidden">
              <Image src={`/assets/auction.jpg`} alt={AuctionData.title} className="w-full h-full object-contain rounded-md" width={300} height={300} />
            </div>
            <div className="mb-6 overflow-auto h-3/4">
              <div className="flex justify-between">
                {/* <h3 className="mb-2 text-sm text-gray-500">{AuctionData.city?.province?.name}, {AuctionData.city?.name}</h3> */}
                {/* <h3>{AuctionData.price} تومان</h3> */}
              </div>
              <p className="text-gray-600 my-5">{AuctionData.description}</p>
              {AuctionData.agent && <div className="text-gray-600 bg-green-100 rounded-md p-2">
                <h3 className="font-bold">نظر کارشناس {AuctionData.agent?.agent?.name}</h3>
                {AuctionData.agent?.description}

              </div>
              }
            </div>
            <div className="flex justify-around absolute bottom-0 left-0 w-full">
              <button
                className="my-2 float-left text-white bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-gray-300 dark:focus:ring-gray-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
                onClick={onClose}
              >
                بستن
              </button>
              <button
                className="my-2 float-left text-white bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
                onClick={handleSendPurposeClick}
              >
                ارسال پیشنهاد
              </button>
              <button
                className="my-2 float-left text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
                onClick={handleCall}
              >
                تماس
              </button>
            </div>

            {showAuctionPurposeSend && (
              <AuctionPurposeSend onClose={() => setShowAuctionPurposeSend(false)} auctionId={AuctionData?.id || 0} />
            )}
          </>
        ) : (
          <p>در حال دریافت اطلاعات...</p>
        )}
      </div>
    </div>
  );
};

export default AuctionShow;
