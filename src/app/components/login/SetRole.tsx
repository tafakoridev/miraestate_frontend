"use client"
import { useState, useEffect } from 'react';
import { Loading, Notify } from 'notiflix';
import { GetToken } from '@/app/utils/Auth';

interface SetRoleProps {
  onClose: () => void;
}

interface Category {
  id: number;
  title: string;
}

interface Department {
  id: number;
  title: string;
}

interface RequestBody {
  role: string, categories: Number[], departments: Number[],
}

const SetRole: React.FC<SetRoleProps> = ({ onClose }) => {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartments, setSelectedDepartments] =  useState<number[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const toggleCategory = (categoryId: number) => {
    if (selectedCategories.includes(categoryId)) {
      // If category is already selected, remove it
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      // If category is not selected, add it
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const toggleDepartment = (departmentId: number) => {
    if (selectedDepartments.includes(departmentId)) {
      // If category is already selected, remove it
      setSelectedDepartments(selectedDepartments.filter(id => id !== departmentId));
    } else {
      // If category is not selected, add it
      setSelectedDepartments([...selectedDepartments, departmentId]);
    }
  };

  useEffect(() => {
    // Fetch categories from /api/categories
    const fetchCategories = async () => {
      Loading.pulse();
      const token = GetToken();
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        setCategories(data.categories);
        Loading.remove();
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    if (selectedRole === 'agent') {
      // Fetch departments from /api/departments if the role is 'agent'
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

      fetchDepartments();
    }

    fetchCategories();
  }, [selectedRole]);

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    setSelectedCategories([]);
    setSelectedDepartments([]);
  };

  const handleSetRole = async () => {
    if (!selectedRole) {
      Notify.warning('لطفاً نقش کاربر را انتخاب کنید');
      return;
    }

    const token = GetToken();
  

    try {
      const requestBody: RequestBody = { role: selectedRole, categories: [], departments: [] };

      // If the selected role is 'agent', include the selected category and department
      if (selectedRole === 'agent') {
        if (selectedCategories.length == 0) {
          Notify.init({
            position: "left-bottom",
          })
          Notify.warning('لطفاً حداقل یک دسته بندی را انتخاب کنید');
          return;
        }

        if (selectedDepartments.length == 0) {
          Notify.init({
            position: "left-bottom",
          })
          Notify.warning('لطفاً حداقل یک دپارتمان  را انتخاب کنید');
          return;
        }

        requestBody.categories = selectedCategories;
        requestBody.departments = selectedDepartments;
      }
      Loading.pulse();
      // Post method to set user role
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/role/set`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      Loading.remove();
      if (response.ok) {
        Notify.init({
          width: '300px',
          position: 'left-bottom',
        });
        Notify.success('نقش کاربر با موفقیت تنظیم شد');
        onClose(); // Close the modal after successfully setting the role
      } else {
        console.error('Failed to set user role:', response.statusText);
      }
    } catch (error) {
      console.error('Error setting user role:', error);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4"> نقش کاربر</h2>
        <div className="flex flex-col mb-4">
          <label className="mb-2">انتخاب نقش:</label>
          <select
            value={selectedRole}
            onChange={(e) => handleRoleChange(e.target.value)}
            className="bg-gray-100 p-2 rounded-md"
          >
            <option value="" disabled>
              انتخاب کنید
            </option>
            <option value="agent">کارشناس</option>
            <option value="customer">مشتری</option>
          </select>
        </div>

        {selectedRole === 'agent' && (
          <>
            <div className="flex flex-col mb-4">
              <label className="mb-2">انتخاب دسته بندی:</label>


              <div className="flex gap-2 my-2 flex-wrap">
                {categories.map((category) => (
                  <div key={category.id}>
                    <button
                      className={`px-2 mb-0 mt-1 py-1 rounded-md ${selectedCategories.includes(category.id) ? 'border-2 border-blue-800' : 'border border-gray-400'}`}
                      onClick={() => toggleCategory(category.id)}
                    >
                      {category.title}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col mb-4">
              <label className="mb-2">انتخاب دپارتمان:</label>
              <div className="flex gap-2 my-2 flex-wrap">
                {departments.map((department) => (
                  <div key={department.id}>
                    <button
                      className={`px-2 mb-0 mt-1 py-1 rounded-md ${selectedDepartments.includes(department.id) ? 'border-2 border-blue-800' : 'border border-gray-400'}`}
                      onClick={() => toggleDepartment(department.id)}
                    >
                      {department.title}
                    </button>
                    
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="flex justify-between">
          <button
            className="my-2 float-left text-white bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-gray-300 dark:focus:ring-gray-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
            onClick={onClose}
          >
            لغو
          </button>
          <button
            className="my-2 float-left text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
            onClick={handleSetRole}
          >
            تایید
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetRole;
