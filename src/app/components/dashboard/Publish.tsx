import { GetToken } from "@/app/utils/Auth";
import { Notify } from "notiflix";
import React, { useState } from "react";

interface CommentToAgentProps {
  onClose: () => void;
  id: number;
}

const Publish: React.FC<CommentToAgentProps> = ({ onClose, id }) => {
  // State to store the price
  const [price, setPrice] = useState<number>(0);

  // Function to handle price change
  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(Number(event.target.value));
  };

  const handleUpdateCommodity = async () => {
    const token = GetToken();

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/commodities/${id}`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({price})
      });

      if (response.ok) {
        const updatedCommodityData = await response.json();
        if (updatedCommodityData.retval) {
          Notify.init({
            width: "300px",
            position: "left-bottom",
          });
          Notify.success(" با موفقیت برای منتشر شد");
        }
        onClose();
      } else {
        console.error("Failed to update commodity:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating commodity:", error);
    }
  };
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      onClick={(e) => e.currentTarget === e.target && onClose()}
    >
      <div className="bg-white p-4 rounded-md md:w-1/3 w-full">
        <label htmlFor="price">قیمت:</label>
        {/* Input for price with onChange handler */}
        <input
        id={"price"}
          type="number"
          value={price}
          onChange={handlePriceChange}
          className="border border-gray-300 p-2 rounded-md w-full mb-4"
          placeholder="Enter price"
        />

        {/* Button to send the price */}
        <button
          onClick={handleUpdateCommodity}
          className="bg-blue-500 text-white px-4 py-2 rounded-md float-left"
        >
          انتشار
        </button>
      </div>
    </div>
  );
};

export default Publish;
