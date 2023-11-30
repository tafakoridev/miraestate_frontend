"use client";
import { useState, useEffect } from 'react';
import { Loading, Notify } from 'notiflix';
import { GetToken, GetUser } from '@/app/utils/Auth';

interface Department {
  id: number;
  title: string;
}

function TenderEdit(props: any) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [agents, setAgents] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    department_id: '',
    title: '',
    agent_id: '',
    description: '',
    user_id: '',
  });
  const { tender_id } = props.searchParams;

  useEffect(() => {
    if (tender_id) {
        
      // Fetch tender details based on tender_id
      const fetchTenderDetails = async () => {
        Loading.pulse();
        const token = GetToken();
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tenders/${tender_id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          const {tender} = data;

          setFormData({
            department_id: tender.department_id,
            title: tender.title,
            agent_id: tender.agent_id,
            description: tender.description,
            user_id: tender.user_id,
          });

          Loading.remove();
        } catch (error) {
          console.error('Error fetching tender details:', error);
        }
      };

      fetchTenderDetails();
    }
  }, [tender_id]); // Dependency on tender_id to re-fetch data when it changes

  useEffect(() => {
    // Fetch departments from /departments endpoint
    const fetchDepartments = async () => {
      Loading.pulse();
      const token = GetToken();
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/departments`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        setDepartments(data.departments);
        Loading.remove();
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    const fetchAgents = async () => {
        Loading.pulse();
        const token = GetToken();
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/agents/list`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            
            setAgents(data);
            Loading.remove();
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };
    
    fetchDepartments();
    fetchAgents();
  }, []); // Empty dependency array to ensure the effect runs only once on mount

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const token = GetToken();
    GetUser().then(async (user) => {
      const formObject = formData;
      formObject.user_id = `${user?.id}`;

      Loading.pulse();
      try {
        // Update tender with the specified data using the PUT method
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tenders/${tender_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formObject),
        });

        if (response.ok) {
          Loading.remove();
          Notify.init({
            width: '300px',
            position: 'left-bottom',
            });
          Notify.success('مناقصه با موفقیت ویرایش شد');
        } else {
          console.error('Failed to edit tender:', response.statusText);
        }
      } catch (error) {
        console.error('Error editing tender:', error);
      }
    });
  };

  return (
    <div>
      <h1>ویرایش مناقصه</h1>
      <form onSubmit={handleSubmit}>
        <div className='flex gap-3'>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="my-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="عنوان مناقصه"
            required
          />
          <select
            name="department_id"
            value={formData.department_id}
            onChange={handleInputChange}
            className="my-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="" disabled>
              انتخاب دپارتمان
            </option>
            {departments.map((department: Department) => (
              <option key={department.id} value={department.id}>
                {department.title}
              </option>
            ))}
          </select>
          <select
                        name="agent_id"
                        value={formData.agent_id}
                        onChange={handleInputChange}
                        className="my-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                        <option value="" disabled>
                            انتخاب کارشناس
                        </option>
                        {agents.map((agent: User) => (
                            <option key={agent.id} value={agent.id}>
                                {agent.name} - {agent.phonenumber} 
                            </option>
                        ))}
                    </select>
        </div>
        <div>
          <label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={10}
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
              placeholder="توضیحات مناقصه را اینجا وارد کنید..."
            ></textarea>
          </label>
        </div>
        <div>
          <button
            className="my-2 float-left text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
            type="submit"
          >
            ویرایش مناقصه
          </button>
        </div>
      </form>
    </div>
  );
}

export default TenderEdit;
