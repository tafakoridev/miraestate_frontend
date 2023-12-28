"use client"
// AuctionCreate.tsx
import React, { useState, useEffect } from 'react';
import { Loading, Notify } from 'notiflix';
import { GetToken, GetUser } from '@/app/utils/Auth';
import DatePicker from "persian-react-datepicker";
import moment from "moment-jalaali";
interface Department {
    id: number;
    title: string;
}

interface User {
    id: number;
    name: string;
    phonenumber: string;
}

interface FormData {
    agent_id: string;
    department_id: string;
    title: string;
    description: string;
    user_id: string;
    start: string;
    end: string;
}

const AuctionCreate: React.FC = () => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [agents, setAgents] = useState<User[]>([]);
    const [formData, setFormData] = useState<FormData>({
        agent_id: '',
        department_id: '',
        title: '',
        description: '',
        user_id: '',
        start: moment().format("jYYYY-jMM-jDD"),
        end: moment().format("jYYYY-jMM-jDD"),
    });

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

        // Fetch agents from /users/agents/list endpoint
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
                console.error('Error fetching agents:', error);
            }
        };

        fetchDepartments();
        fetchAgents();
    }, []); // Empty dependency array to ensure the effect runs only once on mount

    const handleInputDateChange = (name: any, value: any) => {
        setFormData((prevData) => ({ ...prevData, [name]: value }));
      };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = GetToken();
        GetUser().then(async (user) => {
            const formObject = formData;
            formObject.user_id = `${user?.id}`;

            Loading.pulse();
            try {
                // Post new auction with the specified data
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auctions`, {
                    method: 'POST',
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
                    Notify.success('مزایده با موفقیت ایجاد شد');
                } else {
                    console.error('Failed to create auction:', response.statusText);
                }
            } catch (error) {
                console.error('Error creating auction:', error);
            }
        });
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className='flex gap-3'>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="my-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="عنوان مزایده"
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
                    <div className="mb-4 md:w-1/3 w-full px-3">
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-600"
            >
              تاریخ شروع
            </label>
            <DatePicker
              className="mt-1 p-2 w-full border rounded-md"
              onChange={(value: any) =>
                handleInputDateChange(
                  "start",
                  moment(value, "jYYYY/jM/jD HH:mm").format("YYYY-M-D")
                )
              }
              value={formData.start}
              dateRenge={{ end: "1420", start: "1371" }}
            />
          </div>

          <div className="mb-4 md:w-1/3 w-full px-3">
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-600"
            >
              تاریخ پایان
            </label>
            <DatePicker
              className="mt-1 p-2 w-full border rounded-md"
              onChange={(value: any) =>
                handleInputDateChange(
                  "end",
                  moment(value, "jYYYY/jM/jD HH:mm").format("YYYY-M-D")
                )
              }
              value={formData.end}
              dateRenge={{ end: "1420", start: "1371" }}
            />
          </div>
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
                            placeholder="توضیحات مزایده را اینجا وارد کنید..."></textarea>

                    </label>
                </div>
                <div>
                    <button className="my-2 float-left text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2" type="submit">ایجاد مزایده</button>
                </div>
            </form>
        </div>
    );
}

export default AuctionCreate;
