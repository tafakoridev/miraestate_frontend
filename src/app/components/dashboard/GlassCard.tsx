// src/components/GlassCard.tsx

import React, { useEffect, useState } from "react";

interface GlassCardProps {
  onClose: () => void;
  onSend: (obj: Field[], id: string) => void;
  id: string;
}

interface Category {
    id: number;
    title: string;
    price: string;
    parent_id: string;
  }

interface Field {
  title: string;
  value: string;
}

const GlassCard: React.FC<GlassCardProps> = ({ onClose, onSend, id }) => {
  const [fields, setFields] = useState<Field[]>([{title: "", value: ""}]);
  const [category, setCategory] = useState<Category>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories/${id}`
        );

        if (response.ok) {
          const data = await response.json();
          setCategory(data.category);
          if(data.category.fields) {
            setFields(JSON.parse(data.category.fields))
          }
        } else {
          console.error('Failed to fetch category:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching category:', error);
      }
    };

    fetchData();
  }, [id]);
  const handleAddField = () => {
    setFields((prevFields) => [...prevFields, {title: "", value: ""}]);
  };

  const handleInputChange = (index: number, value: string) => {
    setFields((prevFields) => {
      const newFields = [...prevFields];
      newFields[index] = {title: value, value: ""};
      return newFields;
    });
  };

  return (
    <div className="fixed top-1/2 pb-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2 md:w-1/2 w-11/12 bg-gray-50 border-2 border-black  p-6 rounded-lg shadow-lg">
      <div className="flex justify-start">
        <button className="text-black" onClick={onClose}>
          X
        </button>
      </div>
      <div className="text-black">
        {/* Your card content goes here */}
        <h2 className="text-2xl font-bold mb-4">مدیریت فیلدهای {category?.title}</h2>
        <div className="flex flex-wrap ">
          {fields.map((field, index) => (
            <div key={index} className="mb-2">
              <input
                type="text"
                value={field.title}
                onChange={(e) => handleInputChange(index, e.target.value)}
                className="border-2 border-black p-2 mr-2"
              />
              {index === fields.length - 1 && (
                <button
                  className="bg-green-500 text-white w-10 h-10 aspect-square absolute left-2 top-2 rounded-full text-3xl"
                  onClick={handleAddField}
                >
                  +
                </button>
              )}

              <button
                className="bg-blue-500 text-white w-16 h-8 aspect-square absolute left-2 bottom-2 rounded-md text-sm"
                onClick={() => onSend(fields, id)}
              >
                ذخیره
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GlassCard;
