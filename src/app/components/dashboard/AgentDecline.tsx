// Modal.tsx
import { useState } from 'react';
import { Loading, Notify } from 'notiflix';
import { GetToken } from '@/app/utils/Auth';

interface ModalProps {
  onClose: () => void;
  type: string;
  id: string;
}

const AgentDecline: React.FC<ModalProps> = ({ onClose, type, id }) => {
  const [decline, setdecline] = useState('');
  const handledeclineChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setdecline(e.target.value);
  };

  const handleSubmit = async () => {
    const token = GetToken();
    Loading.pulse();

    try {
      // Send request to /users/agents/desk with decline and token
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/agents/decline`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ decline, type, id }),
      });

      if (response.ok) {
        Loading.remove();
        Notify.init({
          width: '300px',
          position: 'left-bottom',
          });
        Notify.success('درخواست کارشناسی کاربر با موفقیت رد شد');
        onClose(); // Close the modal after successfully sending the decline
      } else {
        console.error('Failed to send decline:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending decline:', error);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4">رد کردن درخواست کارشناسی</h2>
        <div className="mb-4">
          <label className="mb-2 block">شرح دلیل:</label>
          <textarea
            value={decline}
            onChange={handledeclineChange}
            rows={5}
            className="
              block
              p-2.5
              w-full
              text-sm
              text-gray-900
              bg-gray-50
              rounded-lg
              border
              border-gray-300
              focus:ring-blue-500
              focus:border-blue-500
              dark:bg-gray-700
              dark:border-gray-600
              dark:placeholder-gray-400
              dark:text-white
              dark:focus:ring-blue-500
              dark:focus:border-blue-500
              focus:outline-none
            "
            placeholder="توضیحات کارشناس ..."
          />
        </div>
        <div className="flex justify-between">
          <button
            className="my-2 float-left text-white bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-gray-300 dark:focus:ring-gray-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
            onClick={onClose}
          >
            انصراف
          </button>
          <button
            className="my-2 float-left text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
            onClick={handleSubmit}
          >
            ارسال
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentDecline;
