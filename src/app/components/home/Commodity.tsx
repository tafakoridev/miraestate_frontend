// Commodity.tsx
import { useState, useEffect } from "react";
import { Loading, Notify } from "notiflix";
import { GetToken } from "@/app/utils/Auth";
import Image from "next/image";

interface CommodityProps {
  onClose: () => void;
  id: string;
  notcall: boolean;
}
interface Agent {
  description: string;
  agent: User;
  fields: string;
  accepted: number;
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
  fields: string;
}

const Commodity: React.FC<CommodityProps> = ({ onClose, id, notcall }) => {
  const [commodityData, setCommodityData] = useState<CommodityData | null>(
    null
  );
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
    const fetchCommodityData = async () => {
      Loading.pulse();
      const token = GetToken();
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/commodities/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        setCommodityData(data.commodity);
        console.log(data.commodity);
        

        Loading.remove();
      } catch (error) {
        console.error("Error fetching commodity data:", error);
      }
    };

    fetchCommodityData();
  }, []);


  const handleAdminAccept = async () => {
    Loading.pulse();
    const token = GetToken();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/commodity/agent/accept`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id }),
        }
      );
      const data = await response.json();
      Notify.init({
        position: "left-bottom",
      });
      data.retval && Notify.success(" تایید کارشناسی با موفقیت انجام شد");
     onClose()

      Loading.remove();
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleCall = () => {
    if (commodityData?.phoneNumber) {
      // Perform the action to initiate a call with the provided phone number
      Notify.success("Calling...");
    } else {
      Notify.warning("Phone number not available.");
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50" style={{zIndex: 45}}>
      <div className="bg-white p-8 rounded-lg md:w-1/3 w-full h-5/6  overflow-x-hidden relative">
      {commodityData &&
        commodityData.picture &&
        commodityData.picture.length > 0 &&
        JSON.parse(commodityData.picture).map((_picture: string, index: number) => (
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
                    alt={commodityData.title}
                    className="w-full h-screen object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        ))}


        {commodityData ? (
          <>
            <h2 className="text-2xl font-bold mb-4">{commodityData.title}</h2>
            <div className="mb-4 h-1/2 overflow-hidden">
            {commodityData.picture && commodityData.picture.length > 0 ? (
                  JSON.parse(commodityData.picture).map(
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
                        alt={commodityData.title}
                        className="w-full h-full object-cover"
                      />
                    )
                  )
                ) : (
                  <span>No pictures available</span>
                )}
              {/* <Image loader={() => `${process.env.NEXT_PUBLIC_BACKEND_URL}${commodityData.picture}`} src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${commodityData.picture}`} alt={commodityData.title} className="w-full h-full object-contain rounded-md" width={200} height={200} /> */}
            </div>
            <div className="mb-4 overflow-auto h-1/3">
              <div className="flex justify-between">
                <h3 className="mb-2 text-sm text-gray-500">
                  {commodityData.city?.province?.name},{" "}
                  {commodityData.city?.name}
                </h3>
                <h3>{commodityData.category?.title}</h3>
                <h3>{commodityData.price} تومان</h3>
              </div>
              <p className="text-gray-600">{commodityData.description}</p>
              {
                notcall ? commodityData.agent?.fields && JSON.parse(commodityData.agent?.fields).map((field: any, i: number) => (
                  <div key={i} className="flex justify-between border p-1 my-3">
                    <div><b>{field.title}</b></div>
                    <div>{field.value}</div>
                  </div>
                )) : commodityData.fields && JSON.parse(commodityData.fields).map((field: any, i: number) => (
                  <div key={i} className="flex justify-between border p-1 my-3">
                    <div><b>{field.title}</b></div>
                    <div>{field.value}</div>
                  </div>
                ))
              }
              {commodityData.agent && (
                <div className="text-gray-600 bg-green-100 rounded-md p-2">
                  <h3 className="font-bold">
                    نظر کارشناس {commodityData.agent?.agent?.name}
                  </h3>
                  {commodityData.agent?.description}
                </div>
              )}
            </div>
            <div className="flex justify-around absolute bottom-0 left-0 w-full " style={{zIndex: 30}}>
              <button
                className="my-2 float-left text-white bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-gray-300 dark:focus:ring-gray-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
                onClick={onClose}
              >
                بستن
              </button>
              {
                !notcall ? <button
                className="my-2 float-left text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
                onClick={handleCall}
              >
                تماس
              </button> : (commodityData.agent && !commodityData.agent.accepted && <button
                className="my-2 float-left text-white bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
                onClick={handleAdminAccept}
              >
                تایید
              </button>)
              }
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
