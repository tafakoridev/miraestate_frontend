// AuctionPurposeSend.tsx
import { useState } from 'react';
import { Notify } from 'notiflix';
import { GetToken } from '@/app/utils/Auth';

interface AuctionPurposeSendProps {
  onClose: () => void;
  auctionId: number;
}

const AuctionPurposeSend: React.FC<AuctionPurposeSendProps> = ({ onClose, auctionId }) => {
  const [description, setDescription] = useState<string>('');

  const handleSendPurpose = async () => {
    const token = GetToken();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auctions/purpose/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          description,
          id: auctionId,
        }),
      });

      if (response.ok) {
        Notify.success('پیشنهاد با موفقیت ارسال شد');
        onClose();
      } else {
        const data = await response.json();
        Notify.failure(`خطا: ${data.error}`);
      }
    } catch (error) {
      console.error('Error sending purpose:', error);
      Notify.failure('خطا در ارسال پیشنهاد');
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg md:w-1/3 w-full overflow-hidden">
        <h2 className="text-2xl font-bold mb-4">ارسال پیشنهاد</h2>
        <textarea
          className="w-full h-40 p-2 mb-4 border rounded-md"
          placeholder="توضیحات خود را وارد کنید..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex justify-between">
          <button
            className="my-2 float-left text-white bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-gray-300 dark:focus:ring-gray-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
            onClick={onClose}
          >
            بستن
          </button>
          <button
            className="my-2 float-left text-white bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
            onClick={handleSendPurpose}
          >
            ارسال
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuctionPurposeSend;
