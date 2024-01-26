// Tender.tsx
import { useState, useEffect } from "react";
import { Loading, Notify } from "notiflix";
import { GetToken } from "@/app/utils/Auth";
import Image from "next/image";
import TenderPurposeSend from "./TenderPurposeSend";

interface TenderProps {
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

interface TenderData {
  id: number;
  picture: string;
  title: string;
  price: number;
  address: string;
  description: string;
  phoneNumber: string;
  agent: Agent;
  city: City;
  category: Category;
  fields: string;
}

const TenderShow: React.FC<TenderProps> = ({ onClose, id }) => {
  const [TenderData, setTenderData] = useState<TenderData | null>(
    null
  );
  const [showTenderPurposeSend, setShowTenderPurposeSend] = useState(false);

  const handleSendPurposeClick = () => {
    setShowTenderPurposeSend(true);
  };
  const [selectedPicture, setSelectedPicture] = useState(null);
  const openModal = (picture: any) => {
    setSelectedPicture(picture);
    document.body.style.overflow = "hidden"; // Prevent scrolling when the modal is open
  };

  const closeModal = () => {
    setSelectedPicture(null);
    document.body.style.overflow = "auto"; // Restore scrolling when the modal is closed
  };

  useEffect(() => {
    const fetchTenderData = async () => {
      Loading.pulse();
      const token = GetToken();
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tenders/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        setTenderData(data.tender);
        

        Loading.remove();
      } catch (error) {
        console.error("Error fetching Tender data:", error);
      }
    };

    fetchTenderData();
  }, []);

  const handleCall = () => {
    if (TenderData?.phoneNumber) {
      // Perform the action to initiate a call with the provided phone number
      Notify.success("Calling...");
    } else {
      Notify.warning("Phone number not available.");
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50" style={{zIndex: 45}}>
      <div className="bg-white p-8 rounded-lg md:w-2/3 w-full h-5/6  overflow-x-hidden relative">
      {TenderData &&
        TenderData.picture &&
        TenderData.picture.length > 0 &&
        JSON.parse(TenderData.picture).map((_picture: string, index: number) => (
          <div key={index} style={{zIndex: 50}}>
            {selectedPicture && (
              <div
                onClick={(e) => e.target === e.currentTarget && closeModal()}
                className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
              >
                <div className="max-w-screen-lg max-h-screen bg-white relative">
                  <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-black text-2xl cursor-pointer"
                  >
                    &times;
                  </button>
                  <img
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${selectedPicture}`}
                    alt={TenderData.title}
                    className="w-full h-screen object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        ))}


        {TenderData ? (
          <>
            <h2 className="text-2xl font-bold mb-4">{TenderData.title}</h2>
            <div className="mb-4 h-1/2 overflow-hidden">
            {TenderData.picture && TenderData.picture.length > 0 ? (
                  JSON.parse(TenderData.picture).map(
                    (_picture: string, index: number) => (
                      <Image
                        key={index}
                        loader={() =>
                          `${process.env.NEXT_PUBLIC_BACKEND_URL}${_picture}`
                        }
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${_picture}`}
                        width={200}
                        height={200}
                        onClick={() => openModal(_picture)}
                        alt={TenderData.title}
                        className="w-full h-full object-cover"
                      />
                    )
                  )
                ) : (
                  <span>No pictures available</span>
                )}
              {/* <Image loader={() => `${process.env.NEXT_PUBLIC_BACKEND_URL}${TenderData.picture}`} src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${TenderData.picture}`} alt={TenderData.title} className="w-full h-full object-contain rounded-md" width={200} height={200} /> */}
            </div>
            <div className="mb-4 overflow-auto h-1/3">
              <div className="flex justify-between">
                <h3 className="mb-2 text-sm text-gray-500">
                  {TenderData.address}
                </h3>
                <h3>{TenderData.category?.title}</h3>
                <h3>قیمت پایه: {TenderData.price} تومان</h3>
              </div>
              <p className="text-gray-600">{TenderData.description}</p>
              {
                TenderData.fields && JSON.parse(TenderData.fields).map((field: any, i: number) => (
                  <div key={i} className="flex justify-between border p-1 my-3">
                    <div><b>{field.title}</b></div>
                    <div>{field.value}</div>
                  </div>
                ))
              }
            </div>
            <div className="flex justify-around absolute bottom-0 left-0 w-full " style={{zIndex: 30}}>
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
            </div>
            {showTenderPurposeSend && (
              <TenderPurposeSend onClose={() => setShowTenderPurposeSend(false)} tender={TenderData} tenderId={TenderData?.id || 0} />
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
