import { Notify } from "notiflix";
import { ChangeEvent, useEffect, useRef, useState } from "react";

interface Step {
  title: string;
  setItems: Function;
  previousStep: Function;
  nextStep: Function;
}

function TenderStep4({ title, setItems, previousStep, nextStep }: Step) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [disabled, setDisabled] = useState(true);
  const inputFileRef = useRef<HTMLInputElement>(null);


  const handleRemoveFile = (index: number) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);

    const updatedPreviews = [...previews];
    updatedPreviews.splice(index, 1);

    setFiles(updatedFiles);
    setPreviews(updatedPreviews);
  };


  function checkConditions() {
    if (previews.length > 0) setDisabled(false);
    else setDisabled(true);
  }

  useEffect(() => {
    checkConditions();
  }, [previews]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (previews.length >= 5) {
      Notify.failure("حداکثر ۵ تصویر می تواند انتخاب شود");
      return;
    }
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;

    const newFiles = Array.from(selectedFiles);
    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);

    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    const updatedPreviews = [...previews, ...newPreviews];
    setPreviews(updatedPreviews);
  };

  return (
    <div className="border p-5 rounded-md shadow min-h-[350px] w-full flex justify-between gap-3 flex-col items-center">
      <h2 className="text-center">{title}</h2>
      <div className="flex flex-col gap-2 w-full flex-wrap">
        {/* Display previews for each selected image */}
        <div className="flex gap-2 flex-wrap">
       {previews.map((preview, index) => (
            <div key={index} className="relative border rounded-md overflow-hidden">
              <img
                src={preview}
                alt={`preview-${index}`}
                width={100}
                className="h-full object-contain"
              />
              <button
                className="absolute top-2  text-xs right-2 w-[20px] h-[20px] bg-red-500 text-white rounded-full p-1 cursor-pointer aspect-square"
                onClick={() => handleRemoveFile(index)}
              >
                X
              </button>
            </div>
          ))}
        </div>
        <div className="max-w-md mx-auto bg-white p-6 rounded-md shadow-md">
          <label
            htmlFor="fileInput"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            انتخاب تصاویر:
          </label>
          <div className="flex items-center justify-between">
            <input
              type="file"
              id="fileInput"
              className="hidden"
              ref={inputFileRef}
              onChange={handleFileChange}
              multiple // Allow multiple file selection
            />
            <button
              onClick={() => inputFileRef.current?.click()}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md cursor-pointer"
            >
              بارگذاری عکس‌ها
            </button>
            <span id="selectedFileName" className="ml-2 text-gray-500">
              {files.length} تصویر انتخاب شده
            </span>
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
            setItems(files); // Send all selected files to the parent component
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

export default TenderStep4;
