// AgentShow.tsx
import { useState, useEffect } from 'react';
import { Loading, Notify } from 'notiflix';
import { GetToken } from '@/app/utils/Auth';
import Image from 'next/image';
import Education from '@/app/interfaces/Education';
import Employee from '@/app/interfaces/Employee';
import moment from 'moment-jalaali';

interface AgentShowProps {
  onClose: () => void;
  agentId: string;
}

interface Information {
  rate: number;
  profile_photo_url: string;
  is_active: string;
}

interface IUser {
  created_at: string;
  gender: string | null;
  information: Information;
  education: Education[];
  employees: Employee[];
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


// Import necessary dependencies and interfaces

const AgentShow: React.FC<AgentShowProps> = ({ onClose, agentId }) => {
  const [agentData, setAgentData] = useState<IUser | null>(null);
  const educationLevelMapping = {
    under_diploma: 'زیردیپلم',
    diploma: 'دیپلم',
    over_diploma: 'فوق دیپلم',
    branch: 'لیسانس',
    master: 'فوق لیسانس',
    phd: 'دکتری',
  } as const;
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
        console.log(data);
        
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
              {/* Display agent's image */}
              <div className="mb-4">
                <Image
                  loader={() => `${process.env.NEXT_PUBLIC_BACKEND_URL}${agentData.information.profile_photo_url}`}
                  src={ `${process.env.NEXT_PUBLIC_BACKEND_URL}${agentData.information.profile_photo_url}`}
                  alt={agentData.name ?? "photo"}
                  width={100}
                  height={100}
                  className="rounded-full w-[100px] h-[100px] object-cover"
                />
              </div>

              {/* Display agent's information */}
              <p className="text-gray-600 my-2 whitespace-break-spaces" dir='rtl'>
                <strong>شماره تماس: </strong>{agentData.phonenumber}
              </p>
              <p className="text-gray-600 my-2 whitespace-break-spaces" dir='rtl'>
                <strong>جنسیت: </strong>{agentData.gender === 'male' ? 'آقا' : 'خانم'}
              </p>
              {/* Add more information as needed */}

              {/* Display agent's education */}
              <h3 className="text-lg font-medium mb-2">تحصیلات</h3>
              <ul className="list-disc pl-6">
                {agentData?.education?.map((edu) => (
                  <li key={edu.id} className="text-gray-600 my-2" dir='rtl'>
                    - 
                    
                    {`${educationLevelMapping[edu.educational_level as keyof typeof educationLevelMapping]} در ${edu.field_of_study} - ${edu.educational_institution} (${moment(edu.from).format('jYYYY/jM/jD')} تا ${moment(edu.to).format('jYYYY/jM/jD') ?? 'تاکنون'})`}
                  </li>
                ))}
              </ul>


              {/* Display agent's employees */}
              <h3 className="text-lg font-medium mb-2">شغل‌ها</h3>
              <ul className="list-disc pl-6">
                {agentData.employees.map((employee) => (
                  <li key={employee.id} className="text-gray-600 my-2" dir='rtl'>
                      - 
                    {`${employee.job_title} در ${employee.company_name} (${moment(employee.from).format('jYYYY/jM/jD')} تا ${moment(employee.to).format('jYYYY/jM/jD') ?? 'تاکنون'})`}
                  </li>
                ))}
              </ul>
            </div>

            {/* Display buttons for actions */}
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
