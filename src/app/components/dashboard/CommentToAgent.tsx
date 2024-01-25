// components/CommentToAgent.tsx

import React, { useState } from "react";
import Image from "next/image";
import Star from "./Star";
import { Loading, Notify } from "notiflix";
import { GetToken } from "@/app/utils/Auth";

interface CommentToAgentProps {
  onClose: () => void;
  id: number;
}

const CommentToAgent: React.FC<CommentToAgentProps> = ({ onClose, id }) => {
    const [rate, setRate] = useState(1);
    const [comment, setComment] = useState("");
    const handleSubmit = async () => {
        const token = GetToken();
        Loading.pulse();
      
        try {
          // Send request to /client/rateagent with rate and token
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/client/rateagent`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ id, rate, comment }), // Assuming rate, type, and id are variables you want to send
          });
      
          if (response.ok) {
            Loading.remove();
            Notify.init({
              width: '300px',
              position: 'left-bottom',
            });
            Notify.success('نظر شما با موفقیت ثبت شد');
            onClose(); // Close the modal after successfully submitting the rating
          } else {
            const errorText = await response.text();
            console.error('Failed to submit rating:', errorText);
          }
        } catch (error) {
          console.error('Error submitting rating:', error);
        }
      };
      
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      onClick={(e) => e.currentTarget === e.target && onClose()}
    >
      <div className="bg-white p-4 rounded-md md:w-1/3 w-full">
        <div className="flex justify-end"></div>
        <div className="mt-4">
          {/* Your content goes here */}
          <h2 className="text-xl font-bold mb-4">نظردهی درباره کارشناسی</h2>
          <div className="flex flex-col justify-between gap-5 items-end">
            <textarea
              rows={10}
              placeholder="متن نظر..."
              onChange={e => setComment(e.target.value)}
              className="resize-none
                appearance-none
                border
                rounded
                w-full
                py-2
                px-3
                leading-tight
                focus:outline-none
                focus:shadow-outline"
            ></textarea>
            <div className="flex items-center justify-around w-full">
              <div className="flex">
                <input type="radio" checked={rate === 1} id="star1" name="rating" value="1" onChange={() => setRate(1)}/>
                <label htmlFor="star1" className="cursor-pointer">
                  <Star count={1} />
                </label>
              </div>

              <div className="flex">
                <input type="radio" id="star2" checked={rate === 2} name="rating" value="2" onChange={() => setRate(2)}/>
                <label htmlFor="star2" className="cursor-pointer">
                  <Star count={2} />
                </label>
              </div>
              <div className="flex">
                <input type="radio" id="star3" checked={rate === 3} name="rating" value="2" onChange={() => setRate(3)}/>
                <label htmlFor="star3" className="cursor-pointer">
                  <Star count={3} />
                </label>
              </div>
              <div className="flex">
                <input type="radio" id="star4" checked={rate === 4} name="rating" value="2" onChange={() => setRate(4)}/>
                <label htmlFor="star4" className="cursor-pointer">
                  <Star count={4} />
                </label>
              </div>
              <div className="flex">
                <input type="radio" id="star5" checked={rate === 5} name="rating" value="2" onChange={() => setRate(5)}/>
                <label htmlFor="star5" className="cursor-pointer">
                  <Star count={5} />
                </label>
              </div>
            </div>

            <button
              className={`
                bg-gradient-to-r
                from-blue-500
                to-blue-700
                hover:from-blue-600
                hover:to-blue-800
                text-white
                font-bold
                py-2
                px-4
                rounded-md
                w-[80px]
            `}
            onClick={handleSubmit}
            >
              ثبت
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentToAgent;
