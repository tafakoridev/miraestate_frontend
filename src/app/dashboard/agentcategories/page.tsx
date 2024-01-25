"use client"
// Import the necessary modules and components
import { useEffect, useState } from "react";
import { GetToken, IsLogin } from "@/app/utils/Auth";
import { Loading, Notify } from "notiflix";

// Define the interface for the category data
interface Category {
  id: number;
  field_id: number;
  field: {
    title: string;
    price: string;
    // Add other properties if needed
  };
  price: number;
  // Add other properties if needed
}

// Define the functional component
function AgentCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const isLogin = IsLogin();

  async function getAgentCategories() {
    Loading.pulse();
    const token = GetToken();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/agent/category-expertises`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch agent categories: ${res.status}`);
      }

      const result = await res.json();
      setCategories(result.category_expertises);
      setDataLoaded(true);
      Loading.remove();
    } catch (error) {
      console.error(error);
      // Handle error, set an error state, or show an error message
    }
  }

  const handlePriceChange = (index: number, newPrice: number) => {
    setCategories((prevCategories) => {
      const updatedCategories = [...prevCategories];
      updatedCategories[index].price = newPrice;
      return updatedCategories;
    });
  };

  const handleSavePrice = async (category: Category) => {
    // Make a PUT request to update the category price
    
    const token = GetToken();
    Loading.pulse();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/categories/${category.field_id}/update-price`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ price: category.price }),
      });

      if (!res.ok) {
        throw new Error(`Failed to update category price: ${res.status}`);
      }

      // Handle success, e.g., show a notification
      Notify.success("دستمزد دسته بندی با موفقیت به‌روزرسانی شد");
    } catch (error) {
      console.error(error);
      // Handle error, e.g., show an error notification
      Notify.failure("خطا در به‌روزرسانی دستمزد دسته بندی");
    } finally {
      Loading.remove();
    }
  };

  useEffect(() => {
    if (isLogin === false) {
      // Redirect to login page or handle unauthorized access
    } else if (!dataLoaded) {
      getAgentCategories();
    }
  }, [dataLoaded]);

  return (
    <div>
      <h1 className="text-md font-bold mb-4">دسته بندی های کارشناس</h1>
      {categories.length > 0 ? (
        <table className="table-auto border-collapse w-[1000px] text-center md:w-full">
          <thead>
            <tr>
              <th className="border text-blue-800 bg-slate-300">#</th>
              <th className="border text-blue-800 bg-slate-300">عنوان</th>
              <th className="border text-blue-800 bg-slate-300">حق کارشناسی</th>
              {/* <th className="border text-blue-800 bg-slate-300">عملیات</th> */}
              {/* Add more table headers if needed */}
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr key={index}>
                <td className="border border-slate-300 w-1/12">{index + 1}</td>
                <td className="border border-slate-300 w-1/4">{category.field.title}</td>
                <td className="border border-slate-300 w-1/4">{category.field.price} تومان</td>
                {/* <td className="border border-slate-300 w-1/4">
                  <input
                    type="number"
                    value={category.price}
                    className="w-1/3"
                    onChange={(e) => handlePriceChange(index, parseFloat(e.target.value))}
                  />
                  تومان
                </td> */}
                {/* <td className="border border-slate-300 w-1/4">
                  <button  className="my-2 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mx mb-2" onClick={() => handleSavePrice(category)}>ذخیره</button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>برای این کارشناس هیچ دسته بندی موجود نیست.</p>
      )}
    </div>
  );
}

export default AgentCategories;
