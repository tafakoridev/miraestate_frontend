// tender.tsx
import { useState, useEffect } from 'react';
import { Loading, Notify } from 'notiflix';
import { GetToken } from '@/app/utils/Auth';
import Image from 'next/image';
import TenderPurposeSend from './TenderPurposeSend'; // Import the new component


interface tenderProps {
  onClose: () => void;
  id: string;
}
interface Agent {
  description: string;
  agent: User;
}

interface Department {
  title: string;
}


interface tenderData {
  id: number;
  picture: string;
  title: string;
  price: string;
  description: string;
  phoneNumber: string;
  agent: Agent;
  user: User;
  department: Department;
}

const TenderShow: React.FC<tenderProps> = ({ onClose, id }) => {
  const [tenderData, settenderData] = useState<tenderData | null>(null);
  const [showTenderPurposeSend, setShowTenderPurposeSend] = useState(false);

  const handleSendPurposeClick = () => {
    setShowTenderPurposeSend(true);
  };

  useEffect(() => {
    const fetchtenderData = async () => {
      Loading.pulse();
      const token = GetToken();
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tenders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        settenderData(data.tender);
        Loading.remove();
      } catch (error) {
        console.error('Error fetching tender data:', error);
      }
    };

    fetchtenderData();
  }, []);

  const handleCall = () => {
    if (tenderData?.user?.phonenumber) {
      // Perform the action to initiate a call with the provided phone number
      Notify.success('در حال تماس...');
      location.href = 'tel://' + tenderData?.user?.phonenumber
    } else {
      Notify.warning('شماره همراه در دسترس نیست');
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50 overflow-auto">
      <div className="bg-white p-8 rounded-lg md:w-1/3 w-full  overflow-x-hidden relative">
        {tenderData ? (
          <>
            <h2 className="text-2xl font-bold mb-4">{tenderData.title}</h2>
            <div className="mb-4 h-1/2 overflow-hidden">
              <Image src={`/assets/tender.jpg`} alt={tenderData.title} className="w-full h-full object-contain rounded-md" width={200} height={200} />
            </div>
            <div className="mb-6 overflow-auto h-3/4">
              <div className="flex justify-between">
                <h3 className="mb-2 text-sm text-gray-500">{tenderData.department?.title}</h3>
                {/* <h3>{tenderData.price} تومان</h3> */}
              </div>
              <p className="text-gray-600 my-5">{tenderData.description}</p>
              {tenderData.agent && <div className="text-gray-600 bg-green-100 rounded-md p-2">
                <h3 className="font-bold">نظر کارشناس {tenderData.agent?.agent?.name}</h3>
                {tenderData.agent?.description}

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
            {showTenderPurposeSend && (
              <TenderPurposeSend onClose={() => setShowTenderPurposeSend(false)} tenderId={tenderData?.id || 0} />
            )}
          </>
        ) : (
          <p>در حال دریافت اطلاعات...</p>
        )}
      </div>
    </div>
  );
};

export default TenderShow;
