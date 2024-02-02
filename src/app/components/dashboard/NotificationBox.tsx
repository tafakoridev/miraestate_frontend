import { GetToken } from "@/app/utils/Auth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface NotificationBoxProps {
  notifications: string[];
  onClose: () => void;
  count: number | null;
}

interface Item {
  id: number;
  title: string;
  text: string;
}

interface ItemDecline {
  id: number;
  decline: string;
  title: string;
}

interface ApiResponse {
  tenders: Item[];
  auctions: Item[];
  commodities: Item[];
  notifications: Item[];
  tendersDecline: ItemDecline[];
  auctionsDecline: ItemDecline[];
  commoditiesDecline: ItemDecline[];
}

const NotificationBox: React.FC<NotificationBoxProps> = ({
  notifications,
  onClose,
  count,
}) => {
  const [agentsTitle, setAgentsTitle] = useState<
    | ApiResponse
    | {
        tenders: Item[];
        notifications: Item[];
        auctions: Item[];
        commodities: Item[];
        tendersDecline: ItemDecline[];
        auctionsDecline: ItemDecline[];
        commoditiesDecline: ItemDecline[];
      }
  >({
    tenders: [],
    auctions: [],
    commodities: [],
    tendersDecline: [],
    notifications: [],
    auctionsDecline: [],
    commoditiesDecline: [],
  }); // Assuming agentsTitle is a number, adjust as needed

  const fetchAgentsInTitleer = async (): Promise<void> => {
    const token = GetToken();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/agents/in/title`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Successful response handling
        const data = await response.json();
        setAgentsTitle(data);
      } else {
        // Error handling
        console.error("Failed to fetch agents Title:", response.statusText);
      }
    } catch (error) {
      // Catch any unexpected errors
      console.error("Error fetching agents Title:", error);
    }
  };

  useEffect(() => {
    fetchAgentsInTitleer();
  }, []);
  const router = useRouter();

  const handleClick = () => {
    router.push("/dashboard/agent");
  };
  return (
    <div className="fixed top-5 left-5 p-4 m-4 bg-white border border-gray-300 shadow-lg max-w-xs rounded-md">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">اعلان ها</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          {count}
        </button>
      </div>
      <div className="cursor-pointer w-[150px]" dir="rtl">
        <ul>
          {agentsTitle.tenders.map((tender) => (
            <li
              onClick={handleClick}
              className="py-2 border-b-2"
              dir="rtl"
              key={tender.id}
            >
              درخواست کارشناسی {tender.title.substring(0, 22)}...
            </li>
          ))}
          {agentsTitle.auctions.map((auction) => (
            <li
              onClick={handleClick}
              className="py-2 border-b-2"
              dir="rtl"
              key={auction.id}
            >
              درخواست کارشناسی {auction.title.substring(0, 22)}...
            </li>
          ))}

          {agentsTitle.commodities.map((commodity) => (
            <li
              onClick={handleClick}
              className="py-2 border-b-2"
              dir="rtl"
              key={commodity.id}
            >
              درخواست کارشناسی {commodity.title.substring(0, 22)}...
            </li>
          ))}
          {agentsTitle.tendersDecline.map((tenderDecline) => (
            <li
              onClick={() =>
                router.push(
                  `/dashboard/commodities/edit?commodityId=${tenderDecline.id}`
                )
              }
              className="py-2 border-b-2"
              dir="rtl"
              key={tenderDecline.id}
            >
              رد کارشناسی {tenderDecline.title.substring(0, 22)}... به دلیل{" "}
              {tenderDecline.decline.substring(0, 22)}
            </li>
          ))}
          {agentsTitle.notifications.map((notification) => (
            <li
              onClick={() =>
                router.push(
                  `/dashboard/clientcartable`
                )
              }
              className="py-2 border-b-2"
              dir="rtl"
              key={notification.id}
            >
              {notification.text}
            </li>
          ))}
          {agentsTitle.auctionsDecline.map((auctionDecline) => (
            <li
              onClick={() =>
                router.push(
                  `/dashboard/commodities/edit?commodityId=${auctionDecline.id}`
                )
              }
              className="py-2 border-b-2"
              dir="rtl"
              key={auctionDecline.id}
            >
              رد کارشناسی {auctionDecline.title.substring(0, 22)}... به دلیل{" "}
              {auctionDecline.decline.substring(0, 22)}
            </li>
          ))}

          {agentsTitle.commoditiesDecline.map((commodityDecline) => (
            <li
              onClick={() =>
                router.push(
                  `/dashboard/commodities/edit?commodityId=${commodityDecline.id}`
                )
              }
              className="py-2 border-b-2"
              dir="rtl"
              key={commodityDecline.id}
            >
              رد کارشناسی {commodityDecline.title.substring(0, 22)}... به دلیل{" "}
              {commodityDecline.decline.substring(0, 22)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NotificationBox;
