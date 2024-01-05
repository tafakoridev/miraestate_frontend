import { useEffect, useState } from "react";

interface Step {
  title: string;
  setItems: Function;
  previousStep: Function;
  nextStep: Function;
}

interface City {
  id: number;
  name: string;
}

interface Province {
  id: number;
  name: string;
}

function ExpertStep3({ title, setItems, previousStep, nextStep }: Step) {
  const [_title, SetTitle] = useState<string>("");
  const [_price, SetPrice] = useState<string>("");
  const [_description, SetDescription] = useState<string>("");
  const [disabled, SetDisabled] = useState(true);


  function checkConditions() {
    const fieldsAreEmpty = _title === "" || _description === "";
    SetDisabled(fieldsAreEmpty);
  }

  useEffect(() => {
    checkConditions();
  }, [_title, _description]);

  return (
    <div className="border p-5 rounded-md shadow min-h-[350px] w-full flex justify-between gap-3 flex-col items-center">
      <div className="flex flex-col gap-2 w-full">
      <h2 className="text-center">{title}</h2>
        {/* first */}
        <input
          type="text"
          value={_title}
          onChange={e => SetTitle(e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          placeholder="عنوان"
        />
         {/* -price- */}
         <input
          type="text"
          value={_price}
          onChange={e => SetPrice(e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          placeholder="قیمت (تومان)"
        />
        {/* second */}
        <textarea
          className="p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          value={_description}
          onChange={e => SetDescription(e.target.value)}
          rows={7}
          placeholder="توضیحات"
        ></textarea>
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
          disabled={disabled}
          onClick={() => {
            setItems(_title, _description, _price);
            nextStep();
          }}
          className={`${
            disabled ? "cursor-not-allowed" : "cursor-pointer"
          }  bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-700 hover:to-blue-900 text-white font-bold pt-2 pb-1 mt-1 px-4 rounded`}
        >
          مرحله بعد
        </button>
      </div>
    </div>
  );
}

export default ExpertStep3;
