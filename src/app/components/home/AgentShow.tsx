// AgentShow.tsx
import { useState, useEffect } from 'react';
import { Loading, Notify } from 'notiflix';
import { GetToken } from '@/app/utils/Auth';
import Image from 'next/image';

interface AgentShowProps {
  onClose: () => void;
  agentId: string;
}


interface IUser {
  created_at: string;
  gender: string | null;
  id: number;
  name: string | null;
  national_code: string | null;
  phonenumber: string;
  role: string;
  state: string;
  updated_at: string;
  department_expertises: IAgentExpertise[];
  category_expertises: IAgentExpertise[];
  description: string;
}

interface Field {
  title: string;
}

interface IAgentExpertise {
  id: number;
  expertiese_id: number;
  field_id: number;
  field_type: string;
  // Add other columns as needed
  created_at: string;
  updated_at: string;
  field: Field;
}


const AgentShow: React.FC<AgentShowProps> = ({ onClose, agentId }) => {
  const [agentData, setAgentData] = useState<IUser | null>(null);

  useEffect(() => {
    const fetchAgentData = async () => {
      Loading.pulse();
      const token = GetToken();
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${agentId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        setAgentData(data);
        Loading.remove();
      } catch (error) {
        console.error('Error fetching agent data:', error);
      }
    };

    fetchAgentData();
  }, [agentId]);

  const handleCall = () => {
    if (agentData?.phonenumber) {
      // Perform the action to initiate a call with the provided phone number
      Notify.success('در حال تماس...');
      location.href = 'tel://' + agentData?.phonenumber;
    } else {
      Notify.warning('شماره همراه در دسترس نیست');
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50 overflow-auto">
      <div className="bg-white p-8 rounded-lg md:w-1/3 w-full  overflow-x-hidden relative">
        {agentData ? (
          <>
            <h2 className="text-2xl font-bold mb-4">{agentData.name}</h2>
            <div className="mb-6 overflow-auto h-3/4">
              <p className="text-gray-600 my-5 whitespace-break-spaces" dir='rtl'>
              تجربه حرفه‌ای:

[نام شرکت یا سازمان] (تاریخ شروع - تاریخ پایان): در اینجا مسئولیت‌های [شرح مختصری از وظایف و فعالیت‌ها] را بر عهده داشتم.
[نام شرکت یا سازمان] (تاریخ شروع - تاریخ پایان): [شرح مختصری از وظایف و فعالیت‌ها]
<br /><br />
تحصیلات:
<br />
<br />
[مدرک تحصیلی]، [رشته تحصیلی] - [نام دانشگاه]، [سال فارغ‌التحصیلی]<br /><br />
مهارت‌ها:
<br />
<br />
[لیست مهارت‌های تخصصی شما]
[لیست مهارت‌های فردی و بینشی]<br /><br />
انگیزه:
<br />
<br />
توانمندی در [توضیحاتی در مورد انگیزه و هدف شخصی شما]
پروژه‌های برجسته:
<br />
<br />
[نام پروژه] - [تاریخ انجام]، [شرح مختصری از پروژه و نقش شما در آن]<br /><br />
گواهینامه‌ها:
<br />
<br />
[نام گواهینامه] - [نام مؤسسه‌ای که گواهینامه را صادر کرده]، [تاریخ دریافت]
              </p>
              {/* Display other agent information here */}
            </div>
            <div className="flex justify-around absolute bottom-0 left-0 w-full">
              <button
                className="my-2 float-left text-white bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-gray-300 dark:focus:ring-gray-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
                onClick={onClose}
              >
                بستن
              </button>
              <button
                className="my-2 float-left text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
                onClick={handleCall}
              >
                تماس
              </button>
            </div>
          </>
        ) : (
          <p>در حال دریافت اطلاعات...</p>
        )}
      </div>
    </div>
  );
};

export default AgentShow;
