"use client";

import { useState, useEffect } from 'react';
import { Loading, Notify } from 'notiflix';
import { GetToken } from '@/app/utils/Auth';

interface Category {
  id: number;
  title: string;
}

function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryTitle, setNewCategoryTitle] = useState('');
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    // Fetch categories from /categories endpoint
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

    fetchCategories();
  }, []); // Empty dependency array to ensure the effect runs only once on mount

  const handleDeleteCategory = async (id: number) => {
    const token = GetToken();
    Loading.pulse();
    try {
      // Delete category with the specified id
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update state to reflect the deletion
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.id !== id)
      );
      Loading.remove();
      Notify.init({
        width: '300px',
        position: 'left-bottom',
        });
      Notify.success('دسته بندی با موفقیت حذف شد');
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleEditCategory = (id: number, newTitle: string) => {
    // Update category title locally
    setCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.id === id ? { ...category, title: newTitle } : category
      )
    );
  };

  const handleEditCategorySubmit = async (id: number, newTitle: string) => {
    const token = GetToken();
    Loading.pulse();
    try {
      // Send request to update category title with the specified id
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title: newTitle }),
        }
      );

      if (response.ok) {
        Loading.remove();
        Notify.init({
          width: '300px',
          position: 'left-bottom',
          });
        Notify.success('دسته بندی با موفقیت ویرایش شد');
      } else {
        console.error('Failed to edit category:', response.statusText);
      }
    } catch (error) {
      console.error('Error editing category:', error);
    }
  };

  const handleAddCategory = async (event: React.FormEvent) => {
    event.preventDefault();
    const token = GetToken();
    try {
      // Post new category with the specified title
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newCategoryTitle }),
      });

      if (response.ok) {
        const newCategory = await response.json();
        setCategories((prevCategories) => [...prevCategories, newCategory.category]);
        setNewCategoryTitle(''); // Clear the input field after successful submission
        Notify.init({
          width: '300px',
          position: 'left-bottom',
          });
        Notify.success('دسته بندی با موفقیت افزوده شد');
      } else {
        console.error('Failed to add category:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  return (
    <div>
      <div>
        {/* Form to add new category */}
        <form onSubmit={handleAddCategory}>
          <label>
            <input
              type="text"
              value={newCategoryTitle}
              placeholder="عنوان دسته بندی"
              className="bg-gray-100 rounded-lg p-2"
              onChange={(e) => setNewCategoryTitle(e.target.value)}
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
      <h1 >مدیریت دسته بندی ها</h1>
      <div  className='flex justify-center flex-col items-center'>
      <table className="table-auto border-collapse w-[1000px] text-center md:w-1/2">
        <thead>
          <tr>
            <th className="border text-blue-800 bg-slate-300 h-[40px]">#</th>
            <th className="border text-blue-800 bg-slate-300 h-[40px]">عنوان</th>
            <th className="border text-blue-800 bg-slate-300 h-[40px]">ویرایش</th>
            <th className="border text-blue-800 bg-slate-300 h-[40px]">حذف</th>
          </tr>
        </thead>
        <tbody>
        {categories.map((category) => (
            <tr key={category.id}>
              <td className="border border-slate-300 h-[40px]">{category.id}</td>
              <td className="border border-slate-300 h-[40px]">
                <input
                  type="text"
                  value={category.title}
                  onChange={(e) => handleEditCategory(category.id, e.target.value)}
                  className="bg-gray-100 rounded-lg p-2"
                />
              </td>
              <td className="border border-slate-300 h-[40px]">
                <button
                  className="bg-green-500 aspect-square w-14 h-7 m-1 rounded-md text-white font-bold text-sm shadow border-2 border-gray-300"
                  onClick={() => handleEditCategorySubmit(category.id, category.title)}
                >
                  ویرایش
                </button>
              </td>
              <td className="border border-slate-300 h-[40px]">
                <button
                  className="bg-red-500 aspect-square w-14 h-7 m-1 rounded-md text-white font-bold text-sm shadow border-2 border-gray-300"
                  onClick={() => handleDeleteCategory(category.id)}
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

export default Categories;
