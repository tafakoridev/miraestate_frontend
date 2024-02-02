import { useEffect, useState } from "react";
import SelectSearch from "react-select-search";

interface Step {
  title: string;
  setCategoryId: Function;
  nextStep: Function;
  bkp: S1BKP;
  setBKP: Function;
}

interface S1BKP {
  selected: string;
  selected2: string;
  selected3: string;
}

interface Category {
  id: number;
  title: string;
  price: string;
  parent_id: string;
  recursive_children: Category[];
}

interface Option {
  value: string;
  name: string;
}

function ExpertStep1({ title, setCategoryId, nextStep, bkp, setBKP }: Step) {
  const [categories, SetCategories] = useState<Category[]>([]);
  const [categories2, SetCategories2] = useState<Category[]>([]);
  const [categories3, SetCategories3] = useState<Category[]>([]);
  const [selected, SetSelected] = useState(bkp.selected);
  const [selected2, SetSelected2] = useState(bkp.selected2);
  const [selected3, SetSelected3] = useState(bkp.selected3);
  const [disabled, SetDisabled] = useState(true);
  const [options, setOptions] = useState<Option[]>([]);
  const [options2, setOptions2] = useState<Option[]>([]);
  useEffect(() => {
    getCategories();
    checkConditions();
  }, []);
  useEffect(() => {
    findStepOne();
  }, [selected]);

  useEffect(() => {
    findStepBKP();
  }, [categories]);
  function getLastSelected() {
    const values = [selected, selected2, selected3];

    for (let i = values.length - 1; i >= 0; i--) {
      if (values[i] !== "0") {
        return values[i];
      }
    }

    return "0";
  }

  function checkConditions() {
    const hasMemberInCategories2 = categories2.length > 0 && selected2 === "0";
    const hasMemberInCategories3 = categories3.length > 0 && selected3 === "0";

    SetDisabled(!selected || hasMemberInCategories2 || hasMemberInCategories3);
  }

  useEffect(() => {
    if (selected !== "0") checkConditions();
  }, [selected2, selected3]);

  function findStepOne() {
    if (selected !== "0") {
      checkConditions();

      SetCategories2([]);
      SetCategories3([]);
      getCategory(Number(selected), 1);
    }
  }

  function findStepBKP() {
    console.log(selected, selected2);

    getCategory(Number(selected), 1);
    getCategory(Number(selected2), 2);
  }

  function getCategory(id: number, step: number): void {
    if (step === 1) {
      const foundCategory = categories.find((category) => category.id === id);
      console.log(foundCategory);

      if (foundCategory && foundCategory.recursive_children.length > 0)
        SetCategories2(foundCategory.recursive_children);
    } else if (step === 2) {
      const foundCategory = categories2.find((category) => category.id === id);
      if (foundCategory && foundCategory.recursive_children.length > 0)
        SetCategories3(foundCategory.recursive_children);
    }
  }

  const getCategories = async (): Promise<void> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories/children/get`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Successful response handling
        const data = await response.json();
        SetCategories(data.categories);
      } else {
        // Error handling
        console.error("Failed to fetch agents Title:", response.statusText);
      }
    } catch (error) {
      // Catch any unexpected errors
      console.error("Error fetching agents Title:", error);
    }
  };

  useEffect(() => {
    // Use a functional update to ensure correct state updates
    setOptions((prevOptions) =>
      categories.map((category) => ({
        value: String(category.id),
        name: category.title,
      }))
    );

    // Log options after setting the state
    console.log(options);
  }, [categories]);

  useEffect(() => {
    // Use a functional update to ensure correct state updates
    setOptions2((prevOptions) =>
    categories2.map((category) => ({
        value: String(category.id),
        name: category.title,
      }))
    );

  }, [categories2]);


  return (
    <div className="border p-5 rounded-md shadow min-h-[250px] min-w-[250px] flex justify-between gap-3 flex-col items-center">
      <h2>{title}</h2>
      {/* first */}
      <div className="relative inline-block w-64">
      {options.length > 0 && (
          <SelectSearch
            value={selected}
            onChange={(value) => {
              SetSelected(String(value));
              getCategory(Number(value), 1);

              SetSelected2("0");
              SetSelected3("0");
            }}
            search={true}
            options={options}
            placeholder="انتخاب دسته بندی"
          />
        )}
        {/* <select
          value={selected}
          onChange={(e) => {
            SetSelected(e.target.value);
            getCategory(Number(e.target.value), 1);

            SetSelected2("0");
            SetSelected3("0");
          }}
          className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline-blue focus:border-blue-300"
        >
          <option value="" disabled>
            انتخاب دسته بندی{" "}
          </option>
          {categories.map((category: Category, index) => (
            <option key={index} value={category.id}>
              {category.title}
            </option>
          ))}
        </select> */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg
            className="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>
      {/* second */}
      {options2.length > 0 && (
        <div className="relative inline-block w-[15.5rem] mr-2">
          {options2.length > 0 && (
          <SelectSearch
            value={selected2}
            onChange={(value) => {
              SetSelected2(String(value));
              getCategory(Number(value), 2);
            }}
            search={true}
            options={options2}
            placeholder="انتخاب دسته بندی"
          />
        )}
          {/* <select
            value={selected2}
            onChange={(e) => {
              SetSelected2(e.target.value);
              getCategory(Number(e.target.value), 2);
            }}
            className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline-blue focus:border-blue-300"
          >
            <option value="0" disabled>
              انتخاب دسته بندی{" "}
            </option>
            {categories2.map((category: Category, index) => (
              <option key={index} value={category.id}>
                {category.title}
              </option>
            ))}
          </select> */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      )}
      {/* third */}
      {categories3.length > 0 && (
        <div className="relative inline-block w-[15rem] mr-4">
          <select
            value={selected3}
            onChange={(e) => {
              SetSelected3(e.target.value);
              getCategory(Number(e.target.value), 1);
            }}
            className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline-blue focus:border-blue-300"
          >
            <option value="0" disabled>
              انتخاب دسته بندی{" "}
            </option>
            {categories3.map((category: Category, index) => (
              <option key={index} value={category.id}>
                {category.title}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      )}
      <button
        disabled={disabled}
        onClick={() => {
          setCategoryId(getLastSelected());
          nextStep();
          setBKP({
            selected,
            selected2,
            selected3,
          });
        }}
        className={`${
          disabled ? "cursor-not-allowed" : "cursor-pointer"
        }  bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-700 hover:to-blue-900 text-white font-bold pt-2 pb-1 mt-1 px-4 rounded`}
      >
        مرحله بعد
      </button>
    </div>
  );
}

export default ExpertStep1;
