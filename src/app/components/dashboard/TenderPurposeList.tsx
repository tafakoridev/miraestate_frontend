// TenderPurposeList.tsx
import React, { useState } from "react";
import { Notify } from "notiflix";

interface Purpose {
  id: number;
  description: string;
  price: number;
  user: User;
}

interface TenderPurposeListProps {
  purposes: Purpose[];
  onClose: () => void;
  onAcceptPurpose: (purposeId: number) => void;
}

const TenderPurposeList: React.FC<TenderPurposeListProps> = ({
  purposes,
  onClose,
  onAcceptPurpose,
}) => {
  const [accepted, setAccepted] = useState<User>();
  const handleAcceptPurpose = (purposeId: number) => {
    onAcceptPurpose(purposeId);
    Notify.success("پیشنهاد با موفقیت پذیرفته شد");
  };

  const handleCall = () => {
    if (accepted?.phonenumber) {
      Notify.success("در حال تماس...");
      location.href = "tel://" + accepted?.phonenumber;
    } else {
      Notify.warning("شماره همراه در دسترس نیست");
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50 overflow-auto">
      <div className="bg-white p-8 rounded-lg md:w-1/2 w-full overflow-hidden">
        <h2 className="text-2xl font-bold mb-4">لیست پیشنهادات</h2>
        <table className="table-auto border-collapse w-full text-center">
          <thead>
            <tr>
              <th className="border text-blue-800 bg-slate-300">
                قیمت پیشنهادی
              </th>
              <th className="border text-blue-800 bg-slate-300">توضیحات</th>
              <th className="border text-blue-800 bg-slate-300">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {purposes.map((purpose) => (
              <tr key={purpose.id}>
                <td className="border border-slate-300">
                  {purpose.price} تومان
                </td>
                <td className="border border-slate-300">
                  {purpose.description}
                </td>
                <td className="border border-slate-300">
                  {(accepted && accepted.id) === purpose.user.id ? (
                    <button
                      className="w-30 my-2 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
                      onClick={handleCall}
                    >
                      تماس
                    </button>
                  ) : (
                    <button
                      className="w-30 my-2 text-white bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
                      onClick={() => {
                        handleAcceptPurpose(purpose.id);
                        setAccepted(purpose.user);
                      }}
                    >
                      پذیرفتن
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center mt-4">
          <button
            className="my-2 float-left text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
            onClick={onClose}
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};

export default TenderPurposeList;
