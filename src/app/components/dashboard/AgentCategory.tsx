"use client";
// Import the necessary modules and components
import { useEffect, useState } from "react";
import { GetToken, IsLogin } from "@/app/utils/Auth";
import { Loading, Notify } from "notiflix";

// Define the interface for the category data
interface Category {
  id: number;
  title: string;
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
function AgentCategory({ agent_id }: any) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [allcategories, setAllCategories] = useState<Category[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const isLogin = IsLogin();

  useEffect(() => {
    const newSelectedCategories = categories.map(
      (category) => category.field_id
    );
    setSelectedCategories([...selectedCategories, ...newSelectedCategories]);
  }, [categories]);

  function removeDuplicates(arr: any) {
    return Array.from(new Set(arr));
  }

  const handleUpdate = async () => {
    Loading.pulse();
    const token = GetToken();
    const UniqueSelectedCategories = removeDuplicates(selectedCategories);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories/agent/update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ categories: UniqueSelectedCategories, agent_id }),
        }
      );
      const data = await response.json();
      Notify.init({
        position: "left-bottom",
      });
      data.retval && Notify.success("ویرایش دسته بندی ها با موفقیت انجام شد");
      console.log(data);

      Loading.remove();
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    // Fetch categories from /api/categories
    const fetchCategories = async () => {
      Loading.pulse();
      const token = GetToken();
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        setAllCategories(data.categories);
        Loading.remove();
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  async function getAgentCategories() {
    Loading.pulse();
    const token = GetToken();
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/agent/category-expertises/${agent_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/categories/${category.field_id}/update-price`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ price: category.price }),
        }
      );

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

  const toggleCategory = (categoryId: number) => {
    if (selectedCategories.includes(categoryId)) {
      // If category is already selected, remove it
      setSelectedCategories(
        selectedCategories.filter((id) => id !== categoryId)
      );
    } else {
      // If category is not selected, add it
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  return (
    <div>
      <h1 className="text-md font-bold mb-4">دسته بندی های کارشناس</h1>
      <div className="flex flex-col mb-4">
        <label className="mb-2">انتخاب دسته بندی:</label>
        <div className="flex gap-2 my-2 flex-wrap">
          {allcategories.map((category) => (
            <div key={category.id}>
              <button
                className={`px-2 mb-0 mt-1 py-1 rounded-md ${
                  selectedCategories.includes(category.id)
                    ? "border-2 border-blue-800"
                    : "border border-gray-400"
                }`}
                onClick={() => toggleCategory(category.id)}
              >
                {category.title}
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleUpdate}
        className="w-30 my-2 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2 float-left"
      >
        ویرایش
      </button>
    </div>
  );
}

export default AgentCategory;
