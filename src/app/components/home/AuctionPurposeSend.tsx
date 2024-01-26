// AuctionPurposeSend.tsx
import { useEffect, useState } from 'react';
import { Notify } from 'notiflix';
import { GetToken } from '@/app/utils/Auth';
import { table } from 'console';

interface AuctionPurposeSendProps {
  onClose: () => void;
  AuctionId: number;
  Auction: AuctionData;
}


interface AuctionProps {
  onClose: () => void;
  id: string;
}
interface Agent {
  description: string;
  agent: User;
}

interface City {
  name: string;
  province: Province;
}

interface Province {
  name: string;
}

interface Option {
  site_share: number;
  registration_fee: number;
  deposit_percentage: number;
}

interface Category {
  title: string;
}

interface AuctionData {
  id: number;
  picture: string;
  title: string;
  price: number;
  address: string;
  description: string;
  phoneNumber: string;
  agent: Agent;
  city: City;
  category: Category;
  fields: string;
}

const AuctionPurposeSend: React.FC<AuctionPurposeSendProps> = ({ onClose, AuctionId, Auction }) => {
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<number>();
  const [Option, setOption] = useState<Option>();
  const [paid, setPaid] = useState<boolean>(false);


useEffect(() => {
  Notify.init({
    width: "300px",
    position: "left-bottom",
  });
  getOption();
}, [])
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
          price,
          description,
          id: AuctionId,
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


  const handlePay = async () => {
    const token = GetToken();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auctions/pay/fee`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: AuctionId,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        Notify.success(result.msg);
        
        setPaid(true)
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
        <input
                type="text"
                placeholder="مبلغ پیشنهادی(تومان) "
                minLength={10}
                maxLength={10}
                value={price ?? ""}
                onChange={(e) => setPrice( Number(e.target.value) )}
                className=" p-2 w-full border rounded-md my-1"
              />
        <textarea
          className="w-full h-40 p-2 mb-4 border rounded-md"
          placeholder="توضیحات خود را وارد کنید..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {!paid && 
        <div className="flex flex-col justify-center w-full items-center">
        <p className='text-gray-500'>
           پرداخت فاکتور زیر برای شرکت در مناقصه الزامی است
          </p> 
          {Option &&
        <table className="table-auto border-collapse w-[1000px] text-center md:w-full">
              <thead>
                <tr>
                  <th className="border text-blue-800 bg-slate-300">عنوان</th>
                  <th className="border text-blue-800 bg-slate-300">مبلغ</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border text-blue-800 bg-slate-300">بیعانه مناقصه</td>
                  <td className="border text-blue-800 bg-slate-300">{Number((Option?.deposit_percentage/100) * Auction.price)} تومان </td>
                </tr>
                <tr>
                  <td className="border text-blue-800 bg-slate-300">هزینه ارسال پیشنهاد</td>
                  <td className="border text-blue-800 bg-slate-300">{Option.site_share} تومان</td>
                </tr>
                <tr>
                  <td className="border text-blue-800 bg-slate-300">مجموع</td>
                  <td className="border text-blue-800 bg-slate-300">{Number(Option.site_share) + Number((Option?.deposit_percentage/100) * Auction.price)} تومان</td>
                </tr>
              </tbody>
            </table>
          }
          <button
            className={`cursor-pointer my-2 float-left text-white bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-1.5 text-center mb-2`}
            onClick={handlePay}
          >
            پرداخت
          </button>
        </div>
        }
        <div className="flex justify-between">
          <button
            className="my-2 float-left text-white bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-gray-300 dark:focus:ring-gray-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
            onClick={onClose}
          >
            بستن
          </button>
          <button
            disabled={!paid}
            className={`${!paid ? 'cursor-not-allowed from-gray-500 via-gray-600 to-gray-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-gray-300 dark:focus:ring-gray-800' : 'cursor-pointer from-green-500 via-green-600 to-green-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800'} my-2 float-left text-white bg-gradient-to-r  font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2`}
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
