"use client";
// comments.tsx
import { useState, useEffect } from "react";
import { Loading, Notify } from "notiflix";
import { GetToken } from "@/app/utils/Auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import moment from "moment";
import Star from "@/app/components/dashboard/Star";

interface OptionData {
  site_share: number;
  registration_fee: number;
  deposit_percentage: number;
}

function OPTIONS() {
  const [newValues, setNewValues] = useState<OptionData>({
    site_share: 0,
    registration_fee: 0,
    deposit_percentage: 0,
  });

  useEffect(() => {
    // Fetch comments from /comments endpoint
    const fetchOptions = async () => {
      Loading.pulse();
      const token = GetToken();
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/options/1`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const result = await response.json();

        setNewValues(result.data);
        Loading.remove();
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchOptions();
  }, []);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setNewValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    Loading.pulse();
    const token = GetToken(); // Assuming GetToken function is defined elsewhere to retrieve the token

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/options/1`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // Assuming the content type is JSON
          },
          body: JSON.stringify(newValues),
        }
      );

      if (response.ok) {
        // Optionally, you can refetch the data to update the UI with the new values
        // await fetchOptions();
        Notify.init({
          width: '300px',
          position: 'left-bottom',
        });
        Notify.success(' با موفقیت ویرایش شد');
        Loading.remove();
      } else {
        console.error("Error updating options:", response.statusText);
        Loading.remove();
      }
    } catch (error) {
      console.error("Error updating options:", error);
      Loading.remove();
    }
  };

  return (
    <div>
      <div className="flex justify-center flex-col items-center">
        <h2>تنظیمات مناقصه و مزایده</h2>
        <br />
        {newValues && (
          <div className="flex flex-col items-center space-y-4">
            <label htmlFor="site_share">سهم سایت (تومان)</label>
            <input
              type="text"
              id="site_share"
              name="site_share"
              value={newValues.site_share}
              onChange={handleInputChange}
              placeholder="Site Share"
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />

            <label htmlFor="registration_fee">حق ثبت   مزایده  یا مناقصه (تومان)</label>
            <input
              type="text"
              id="registration_fee"
              name="registration_fee"
              value={newValues.registration_fee}
              onChange={handleInputChange}
              placeholder="Registration Fee"
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />

            <label htmlFor="deposit_percentage">بیعانه مناقصه یا مزایده ( درصد از مبلغ پایه )</label>
            <input
              type="text"
              id="deposit_percentage"
              name="deposit_percentage"
              value={newValues.deposit_percentage}
              onChange={handleInputChange}
              placeholder="Deposit Percentage"
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />

            <button
              onClick={handleUpdate}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue"
            >
              ذخیره
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default OPTIONS;
