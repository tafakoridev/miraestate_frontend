import { ChangeEvent, useEffect, useRef, useState } from "react";

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

function ExpertStep4({ title, setItems, previousStep, nextStep }: Step) {
  const [file, SetFile] = useState<File>();
  const [preview, SetPreview] = useState<string>("");
  const [disabled, SetDisabled] = useState(true);
  const inputFileRef = useRef<HTMLInputElement>(null);

  function checkConditions() {
    if(preview !== "") SetDisabled(false);
  }

  useEffect(() => {
    checkConditions();
  }, [preview]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    SetFile(selectedFile);
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      SetPreview(url);
    }
  };

  return (
    <div className="border p-5 rounded-md shadow min-h-[350px] w-full flex justify-between gap-3 flex-col items-center">
      <h2 className="text-center">{title}</h2>
      <div className="flex flex-col gap-2 w-full">
        {/* first */}
        {preview && <div className="border rounded-md overflow-hidden">
          <img src={preview} alt={"preview"} className="w-full h-auto" />
        </div>}

        <div className="max-w-md mx-auto bg-white p-6 rounded-md shadow-md">
          <label
            htmlFor="fileInput"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            انتخاب تصویر:
          </label>
          <div className="flex items-center justify-between">
            <input
              type="file"
              id="fileInput"
              className="hidden"
              ref={inputFileRef}
              onChange={handleFileChange}
            />
            <button
              onClick={() => inputFileRef.current?.click()}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md cursor-pointer"
            >
              بارگذاری عکس
            </button>
            <span id="selectedFileName" className="ml-2 text-gray-500"></span>
          </div>
        </div>
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
            setItems(file);
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

export default ExpertStep4;
