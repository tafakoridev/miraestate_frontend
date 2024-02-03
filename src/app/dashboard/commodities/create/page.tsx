"use client";
import React, { useState, useEffect } from "react";
import { Loading, Notify } from "notiflix";
import { GetToken } from "@/app/utils/Auth";
import ExpertCmpC from "@/app/components/dashboard/ExpertCmpC";

interface Category {
  id: number;
  title: string;
}

interface City {
  id: number;
  name: string;
}

interface FormData {
  category_id: number;
  title: string;
  description: string;
  price: number;
  city_id: number;
  agent_id: number | null;
  picture: File | null;
}

const CommodityCreate: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [agents, setAgents] = useState<User[]>([]);
  const [formData, setFormData] = useState<FormData>({
    category_id: 0,
    title: "",
    description: "",
    price: 0,
    city_id: 0,
    agent_id: null,
    picture: null,
  });

  useEffect(() => {
    const fetchCategoriesAndCities = async () => {
      Loading.pulse();
      const token = GetToken();
      try {
        // Fetch categories from /api/categories endpoint
        const categoriesResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData.categories);

        // Fetch cities from /api/cities endpoint
        const citiesResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cities`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const citiesData = await citiesResponse.json();
        setCities(citiesData);

        Loading.remove();
      } catch (error) {
        console.error("Error fetching categories or cities:", error);
      }
    };

    fetchCategoriesAndCities();
  }, []);

  const fetchAgents = async (category_id: string) => {
    Loading.pulse();
    const token = GetToken();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/agents/list/${category_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      setAgents(data);
      Loading.remove();
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "category_id") fetchAgents(value);
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prevData) => ({ ...prevData, picture: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = GetToken();

    Loading.pulse();
    try {
      const formObject = new FormData();
      formObject.append("category_id", formData.category_id.toString());
      formObject.append("title", formData.title);
      formObject.append("description", formData.description);
      formObject.append("price", formData.price.toString());
      formObject.append("city_id", formData.city_id.toString());
      if (formData.agent_id)
        formObject.append("agent_id", formData.agent_id.toString());
      if (formData.picture) {
        formObject.append("picture", formData.picture);
      }

      // Post new commodity with the specified data
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/commodities`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formObject,
        }
      );

      if (response.ok) {
        Loading.remove();
        Notify.init({
          width: "300px",
          position: "left-bottom",
        });
        Notify.success("کالا با موفقیت ایجاد شد");
      } else {
        console.error("Failed to create commodity:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating commodity:", error);
    }
  };

  return (
    // <div>
    //   <form onSubmit={handleSubmit}>
    //     <div className="flex gap-1 md:flex-row flex-col">
    //       {/* Name input field */}
    //       <input
    //         type="text"
    //         name="title"
    //         value={formData.title}
    //         onChange={handleInputChange}
    //         className="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    //         placeholder="نام کالا یا خدمات"
    //         required
    //       />
    //       {/* Category select box */}
    //       <select
    //         name="category_id"
    //         value={formData.category_id}
    //         onChange={handleInputChange}
    //         className="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    //       >
    //         <option value={0} disabled>
    //           انتخاب دسته بندی
    //         </option>
    //         {categories.map((category) => (
    //           <option key={category.id} value={category.id}>
    //             {category.title}
    //           </option>
    //         ))}
    //       </select>

    //       {/* City select box */}
    //       <select
    //         name="city_id"
    //         value={formData.city_id}
    //         onChange={handleInputChange}
    //         className="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    //       >
    //         <option value={0} disabled>
    //           انتخاب شهر
    //         </option>
    //         {cities.map((city) => (
    //           <option key={city.id} value={city.id}>
    //             {city.name}
    //           </option>
    //         ))}
    //       </select>

    //       {/* <select
    //         name="agent_id"
    //         value={formData.agent_id ?? ""}
    //         onChange={handleInputChange}
    //         className="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    //       >
    //         <option value="">انتخاب کارشناس</option>
    //         {agents.map((agent: User) => (
    //           <option key={agent.id} value={agent.id}>
    //             {agent.name} - {agent.phonenumber}
    //           </option>
    //         ))}
    //       </select> */}

    //       {/* Price input field */}
    //       <input
    //         type="number"
    //         name="price"
    //         value={formData.price > 0 ? formData.price : ""}
    //         onChange={handleInputChange}
    //         className="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    //         placeholder="قیمت"
    //         required
    //       />
    //     </div>

    //     {/* Description input field */}
    //     <textarea
    //       name="description"
    //       value={formData.description}
    //       onChange={handleInputChange}
    //       rows={10}
    //       className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:outline-none"
    //       placeholder="توضیحات کالا یا خدمات را اینجا وارد کنید..."
    //     />
    //     {/* Submit button */}
    //     <button
    //       className="my-2 float-left text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
    //       type="submit"
    //     >
    //       ذخیره
    //     </button>
    //     {/* Picture input field */}
    //     <input
    //       type="file"
    //       name="picture"
    //       onChange={handleFileChange}
    //       className="my-2"
    //       accept="image/*"
    //     />
    //     {formData.picture && (
    //       <img
    //         src={URL.createObjectURL(formData.picture)}
    //         alt="Preview"
    //         className="my-2 max-w-full h-auto"
    //         width={150}
    //         height={150}
    //       />
    //     )}
    //   </form>
    // </div>
    <div className="flex w-full h-full justify-center items-center">
    <ExpertCmpC />
    </div>
  );
};

export default CommodityCreate;
