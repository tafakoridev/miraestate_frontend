import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";

interface Step {
  title: string;
  previousStep: Function;
  nextStep: Function;
  submit: Function;
}

function ExpertStep5({ title,  previousStep, nextStep, submit }: Step) {
  const [local, setLocal] = useState(0);
  const handleCheckboxChange = () => {
    setLocal(local === 0 ? 1 : 0);
  };


  return (
    <div className="border p-5 rounded-md shadow min-h-[350px] w-full flex justify-between gap-3 flex-col items-center">
      <h2 className="text-center">{title}</h2>
      <div className="max-w-md mx-auto bg-white p-6 rounded-md ">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          <input
            type="checkbox"
            id="termsCheckbox"
            checked={local === 0 ? false : true}
            onChange={handleCheckboxChange}
            className="mx-2"
          />
        نیازمند بازدید حضوری کارشناس هستم.
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
            submit(local);
            nextStep();
          }}
          className={`${true ? "from-blue-500 to-blue-700 hover:from-blue-700 hover:to-blue-900" : "from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-200"} cursor-pointer  bg-gradient-to-r  text-white font-bold pt-2 pb-1 mt-1 px-4 rounded`}
        >
          بعدی
        </button>
      </div>
    </div>
  );
}

export default ExpertStep5;
