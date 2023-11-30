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

const SetRole: React.FC<SetRoleProps> = ({ onClose }) => {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null);

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
    // Reset selectedCategory when the role changes
    setSelectedCategory(null);
  };

  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategory(categoryId);
  };

  const handleDepartmentChange = (departmentId: number) => {
    setSelectedDepartment(departmentId);
  };

  const handleSetRole = async () => {
    if (!selectedRole) {
      Notify.warning('لطفاً نقش کاربر را انتخاب کنید');
      return;
    }

    const token = GetToken();
    Loading.pulse();

    try {
      const requestBody = { role: selectedRole, category_id: "", department_id: "" };

      // If the selected role is 'agent', include the selected category and department
      if (selectedRole === 'agent') {
        if (!selectedCategory) {
          Notify.warning('لطفاً یک دسته بندی را انتخاب کنید');
          return;
        }

        requestBody.category_id = `${selectedCategory}`;
        requestBody.department_id = `${selectedDepartment}`;
      }

      // Post method to set user role
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/role/set`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        Loading.remove();
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
              <select
                value={selectedCategory || ''}
                onChange={(e) => handleCategoryChange(Number(e.target.value))}
                className="bg-gray-100 p-2 rounded-md"
              >
                <option value="" disabled>
                  انتخاب کنید
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col mb-4">
              <label className="mb-2">انتخاب دپارتمان:</label>
              <select
                value={selectedDepartment || ''}
                onChange={(e) => handleDepartmentChange(Number(e.target.value))}
                className="bg-gray-100 p-2 rounded-md"
                disabled={!selectedCategory}
              >
                <option value="" disabled>
                  انتخاب کنید
                </option>
                {departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.title}
                  </option>
                ))}
              </select>
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
