"use client";

import { useEffect, useState } from "react";
import Tree from "./Tree";

enum StateType {
    Commodity = "commodity",
    Tender = "tender",
    Auction = "auction",
  }

interface State {
  selectedOption: StateType | null;
}

interface Category {
  id: number;
  title: string;
  price: string;
  parent_id: number | null;
  recursive_children?: Category[];
}

interface SideBarProps {
    setOptions: Function;
}

function SidebarDivar({setOptions}: SideBarProps) {
  const [Type, setType] = useState<State>({
    selectedOption: null,
  });
  const [selectedCategory, setSelectedCategory] = useState<number>();
  const [categories, setCategories] = useState<Category[]>([]);

  const handleSelectOption = (option: StateType) => {
    setType({
      ...Type,
      selectedOption: option,
    });
  };

  useEffect(() => {
    setOptions(Type, selectedCategory);
  }, [Type, selectedCategory])
  

  const translateOption = (option: StateType): string => {
    switch (option) {
      case StateType.Commodity:
        return "کالا و خدمات";
      case StateType.Tender:
        return "مناقصه";
      case StateType.Auction:
        return "مزایده";
      default:
        return "ناشناخته";
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories/children/get`
      );
      const data = await response.json();
      setCategories(data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleNodeClick = (id: number) => {
    setSelectedCategory(id);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div>
      {/* select type */}
      <div className="flex items-center space-x-2 justify-center">
        {Object.values(StateType).map((option) => (
          <label key={option} className="flex items-center space-x-2">
            <input
              type="radio"
              name="stateOption"
              value={option}
              checked={Type.selectedOption === option}
              onChange={() => handleSelectOption(option)}
              className="form-radio text-blue-500 focus:ring-blue-500 mx-[2px]"
            />
            <span className="text-xs">{translateOption(option)}</span>
          </label>
        ))}
      </div>
      <br />
      <h3 className="text-center">دسته بندی</h3>
      <Tree categories={categories} handleNodeClick={handleNodeClick} />
    </div>
  );
}

export default SidebarDivar;
