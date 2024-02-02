import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import GateWay from "../../home/GateWay";

interface Step {
  title: string;
  previousStep: Function;
  nextStep: Function;
}

interface Option {
  site_share: number;
  registration_fee: number;
  deposit_percentage: number;
}
function AuctionStep5({ title,  previousStep, nextStep }: Step) {
  const [Option, setOption] = useState<Option>();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const router = useRouter();
  const handleCheckboxChange = () => {
    setAgreedToTerms(!agreedToTerms);
  };
  const getOption = async (): Promise<void> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/options/1`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Successful response handling
        const result = await response.json();
        setOption(result.data);
        
        
      } else {
        // Error handling
        console.error("Failed to fetch agents Title:", response.statusText);
      }
    } catch (error) {
      // Catch any unexpected errors
      console.error("Error fetching agents Title:", error);
    }
  };

  const handleNavigate = (e: any) => {
    e.preventDefault();
    // Open the "/rules" page in a new tab
    window.open('/rules', '_blank');
  };



  useEffect(() => {
    getOption();
  }, []);

  
  function formatNumberWithCommas(value: any) {
    if(!value) value = 0;
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

  return (
    <div className="border p-5 rounded-md shadow min-h-[350px] w-full flex justify-between gap-3 flex-col items-center">
      <h2 className="text-center">{title}</h2>
      <div className="flex flex-col gap-2 w-full">
        {/* first */}
    
        <div className="max-w-md mx-auto bg-white p-6 rounded-md shadow-md">
          <label
            htmlFor="fileInput"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
             هزینه  قابل پرداخت:
          </label>
          <div className="flex items-center justify-center text-center w-full">
           {Option && formatNumberWithCommas(Option.registration_fee)} تومان
          </div>
        </div>
      </div>
      
      <GateWay />
      <div className="max-w-md mx-auto bg-white p-6 rounded-md ">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          <input
            type="checkbox"
            id="termsCheckbox"
            checked={agreedToTerms}
            onChange={handleCheckboxChange}
            className="mx-2"
          />
          با <span className="text-blue-500 cursor-pointer" onClick={handleNavigate}>قوانین</span>  سایت موافق هستم
        </label>
      </div>
      <div className="flex justify-between w-full">
        <button
          onClick={() => {
            previousStep();
          }}
          className={`cursor-pointer bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-700 hover:to-gray-900 text-white font-bold pt-2 pb-1 mt-1 px-4 rounded`}
        >
          مرحله قبل
        </button>

        <button
          onClick={() => {
            nextStep();
          }}
          disabled={!agreedToTerms}
          className={`${agreedToTerms ? "from-blue-500 to-blue-700 hover:from-blue-700 hover:to-blue-900" : "from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-200"} cursor-pointer  bg-gradient-to-r  text-white font-bold pt-2 pb-1 mt-1 px-4 rounded`}
        >
          پرداخت
        </button>
      </div>
    </div>
  );
}

export default AuctionStep5;
