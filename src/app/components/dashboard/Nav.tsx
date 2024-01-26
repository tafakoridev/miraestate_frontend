"use client";

import { useEffect, useState } from "react";
import NotificationBox from "./NotificationBox";
import { GetToken, GetUser } from "@/app/utils/Auth";

interface CountsObject {
  tendersCount: number;
  auctionsCount: number;
  commoditiesCount: number;
  tendersCountDecline: number;
  auctionsCountDecline: number;
  commoditiesCountDecline: number;
}

function Navbar({ SetOpen, open }: any) {
  const [showNotifications, setShowNotifications] = useState(false);
  const notifications = ["Notification 1", "Notification 2", "Notification 3"];
  const [user, setUser] = useState<User>();

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  const closeNotifications = () => {
    setShowNotifications(false);
  };

  const [agentsCount, setAgentsCount] = useState<number | null>(null); // Assuming agentsCount is a number, adjust as needed

  function calculateTotalCounts(countsObject: CountsObject) {
    // Extract counts from the object
    const {
      tendersCount = 0,
      auctionsCount = 0,
      commoditiesCount = 0,
      tendersCountDecline = 0,
      auctionsCountDecline = 0,
      commoditiesCountDecline = 0,
    } = countsObject;

    // Calculate the sum
    const total =
      tendersCount +
      auctionsCount +
      commoditiesCount +
      tendersCountDecline +
      auctionsCountDecline +
      commoditiesCountDecline;

    return total;
  }

  const fetchAgentsInCounter = async (): Promise<void> => {
    const token = GetToken();
    const user = await GetUser();
    setUser(user);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/agents/in/counter`,
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
        setAgentsCount(calculateTotalCounts(data));
      } else {
        // Error handling
        console.error("Failed to fetch agents count:", response.statusText);
      }
    } catch (error) {
      // Catch any unexpected errors
      console.error("Error fetching agents count:", error);
    }
  };

  useEffect(() => {
    fetchAgentsInCounter();
  }, []);

  function formatNumberWithCommas(value: any) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

  return (
    <nav
      className={` ${
        open ? "justify-end" : "justify-between"
      } w-full h-full bg-gradient-to-l from-blue-900 via-blue-500 to-blue-900 shadow-md border-b-1 border-gray-100 flex items-center px-8 `}
    >
      {!open && (
        <button
          onClick={() => SetOpen(!open)}
          className={` text-blue-900 menu_white w-[32px] h-[32px]`}
        ></button>
      )}
      <div className="relative">
        <div className="absolute left-32 top-2 text-white">
        <div className="wallet">
            <span className="flex opacity-95 justify-center items-end w-[90px] h-[22px] aspect-square font-semibold leading-none text-white bg-[#3339] rounded-full absolute right-[26px] top-[2px] pb-1 text-[10px]">
              {user && formatNumberWithCommas(user.wallet)} تومان
            </span>
          </div>
        </div>
        <button
          onClick={toggleNotifications}
          className="text-2xl text-gray-600 focus:outline-none"
        >
          {/* You can replace the bell icon with your desired icon */}
          <div className="beller">
            <span className="flex opacity-95 justify-center items-end w-[18px] h-[18px] aspect-square text-xs font-semibold leading-none text-white bg-red-600 rounded-full absolute right-0 bottom-0">
              {agentsCount}
            </span>
          </div>
        </button>
        {showNotifications && (
          <NotificationBox
            count={agentsCount}
            notifications={notifications}
            onClose={closeNotifications}
          />
        )}
      </div>
    </nav>
  );
}

export default Navbar;
