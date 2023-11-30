"use client";
// Department.tsx
import { useState, useEffect } from 'react';
import { Loading, Notify } from 'notiflix';
import { GetToken } from '@/app/utils/Auth';

interface Department {
  id: number;
  title: string;
}

function Departments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [newDepartmentName, setNewDepartmentName] = useState('');

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

    fetchDepartments();
  }, []); // Empty dependency array to ensure the effect runs only once on mount

  const handleDeleteDepartment = async (id: number) => {
    const token = GetToken();
    Loading.pulse();
    try {
      // Delete department with the specified id
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/departments/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update state to reflect the deletion
      setDepartments((prevDepartments) =>
        prevDepartments.filter((department) => department.id !== id)
      );
      Loading.remove();
      Notify.init({
        width: '300px',
        position: 'left-bottom',
        });
      Notify.success('دپارتمان با موفقیت حذف شد');
    } catch (error) {
      console.error('Error deleting department:', error);
    }
  };

  const handleEditDepartment = (id: number, newName: string) => {
    // Update department name locally
    setDepartments((prevDepartments) =>
      prevDepartments.map((department) =>
        department.id === id ? { ...department, title: newName } : department
      )
    );
  };

  const handleEditDepartmentSubmit = async (id: number, newName: string) => {
    const token = GetToken();
    Loading.pulse();
    try {
      // Send request to update department name with the specified id
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/departments/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title: newName }),
        }
      );

      if (response.ok) {
        Loading.remove();
        Notify.init({
          width: '300px',
          position: 'left-bottom',
          });
        Notify.success('دپارتمان با موفقیت ویرایش شد');
      } else {
        console.error('Failed to edit department:', response.statusText);
      }
    } catch (error) {
      console.error('Error editing department:', error);
    }
  };

  const handleAddDepartment = async (event: React.FormEvent) => {
    event.preventDefault();
    const token = GetToken();
    try {
      // Post new department with the specified name
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/departments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newDepartmentName }),
      });

      if (response.ok) {
        const newDepartment = await response.json();
        setDepartments((prevDepartments) => [...prevDepartments, newDepartment.department]);
        setNewDepartmentName(''); // Clear the input field after successful submission
        Notify.init({
          width: '300px',
          position: 'left-bottom',
          });
        Notify.success('دپارتمان با موفقیت افزوده شد');
      } else {
        console.error('Failed to add department:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding department:', error);
    }
  };

  return (
    <div>
      <div>
        {/* Form to add new department */}
        <form onSubmit={handleAddDepartment}>
          <label>
            <input
              type="text"
              value={newDepartmentName}
              placeholder="نام دپارتمان"
              className="bg-gray-100 rounded-lg p-2"
              onChange={(e) => setNewDepartmentName(e.target.value)}
            />
          </label>
          <button
            type="submit"
            className="bg-blue-800 aspect-square w-20 h-9 m-1 rounded-md text-white font-bold text-sm shadow border-2 border-gray-300"
          >
            افزودن
          </button>
        </form>
      </div>
      <br />
      <br />
      <h1>مدیریت دپارتمان‌ها</h1>
      <div className='flex justify-center flex-col items-center'>
        <table className="table-auto border-collapse w-[1000px] text-center md:w-1/2">
          <thead>
            <tr>
              <th className="border text-blue-800 bg-slate-300 h-[40px]">#</th>
              <th className="border text-blue-800 bg-slate-300 h-[40px]">نام</th>
              <th className="border text-blue-800 bg-slate-300 h-[40px]">ویرایش</th>
              <th className="border text-blue-800 bg-slate-300 h-[40px]">حذف</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((department) => (
              <tr key={department.id}>
                <td className="border border-slate-300 h-[40px]">{department.id}</td>
                <td className="border border-slate-300 h-[40px]">
                  <input
                    type="text"
                    value={department.title}
                    onChange={(e) => handleEditDepartment(department.id, e.target.value)}
                    className="bg-gray-100 rounded-lg p-2"
                  />
                </td>
                <td className="border border-slate-300 h-[40px]">
                  <button
                    className="bg-green-500 aspect-square w-14 h-7 m-1 rounded-md text-white font-bold text-sm shadow border-2 border-gray-300"
                    onClick={() => handleEditDepartmentSubmit(department.id, department.title)}
                  >
                    ویرایش
                  </button>
                </td>
                <td className="border border-slate-300 h-[40px]">
                  <button
                    className="bg-red-500 aspect-square w-14 h-7 m-1 rounded-md text-white font-bold text-sm shadow border-2 border-gray-300"
                    onClick={() => handleDeleteDepartment(department.id)}
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Departments;
