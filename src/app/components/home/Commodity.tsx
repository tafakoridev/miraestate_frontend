// Commodity.tsx
import { useState, useEffect } from 'react';
import { Loading, Notify } from 'notiflix';
import { GetToken } from '@/app/utils/Auth';
import Image from 'next/image';

interface CommodityProps {
  onClose: () => void;
  id: string;
}
interface Agent {
    description: string;
    agent: User;
}

interface City {
    name: string;
    province: Province;
}

interface Province {
    name: string;
}


interface Category {
    title: string;
}


interface CommodityData {
  id: number;
  picture: string;
  title: string;
  price: string;
  description: string;
  phoneNumber: string;
  agent: Agent;
  city: City;
  category: Category;
}

const Commodity: React.FC<CommodityProps> = ({ onClose, id }) => {
  const [commodityData, setCommodityData] = useState<CommodityData | null>(null);

  useEffect(() => {
    const fetchCommodityData = async () => {
      Loading.pulse();
      const token = GetToken();
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/commodities/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log(data);
        
        setCommodityData(data.commodity);
        Loading.remove();
      } catch (error) {
        console.error('Error fetching commodity data:', error);
      }
    };

    fetchCommodityData();
  }, []);

  const handleCall = () => {
    if (commodityData?.phoneNumber) {
      // Perform the action to initiate a call with the provided phone number
      Notify.success('Calling...');
    } else {
      Notify.warning('Phone number not available.');
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg md:w-1/3 w-full h-2/3  overflow-x-hidden relative">
        {commodityData ? (
            <>
            <h2 className="text-2xl font-bold mb-4">{commodityData.title}</h2>
            <div className="mb-4 h-1/2 overflow-hidden">
              <Image loader={() => `${process.env.NEXT_PUBLIC_BACKEND_URL}${commodityData.picture}`} src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${commodityData.picture}`} alt={commodityData.title} className="w-full h-full object-contain rounded-md" width={200} height={200} />
            </div>
            <div className="mb-4 overflow-auto h-1/4">
              <div className="flex justify-between">
              <h3 className="mb-2 text-sm text-gray-500">{commodityData.city?.province?.name}, {commodityData.city?.name}</h3>
              <h3>{commodityData.category?.title}</h3>
              <h3>{commodityData.price} تومان</h3>
              </div>
              <p className="text-gray-600">{commodityData.description}</p>
                {commodityData.agent && <p className="text-gray-600 bg-green-100 rounded-md p-2">
                <h3 className="font-bold">نظر کارشناس {commodityData.agent?.agent?.name}</h3>
                {commodityData.agent?.description}
                
              </p>
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
                className="my-2 float-left text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
                onClick={handleCall}
              >
                تماس
              </button>
            </div>
          </>
        ) : (
          <p>در حال دریافت اطلاعات...</p>
        )}
      </div>
    </div>
  );
};

export default Commodity;
