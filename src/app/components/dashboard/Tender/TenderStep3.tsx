import { useEffect, useState } from "react";
import DatePicker from "persian-react-datepicker";
import moment from "moment-jalaali";

interface Step {
  title: string;
  setItems: Function;
  previousStep: Function;
  nextStep: Function;
  category_id: string;
}

interface City {
  id: number;
  name: string;
}

interface Province {
  id: number;
  name: string;
}

interface Field {
  title: string;
  value: string;
}

interface Category {
  id: number;
  title: string;
  price: string;
  parent_id: string;
}
interface Date {
  start: string;
  end: string;
}

function TenderStep3({
  title,
  setItems,
  previousStep,
  nextStep,
  category_id,
}: Step) {
  const [_title, SetTitle] = useState<string>("");
  const [_price, SetPrice] = useState<string>("");
  const [start, setStart] = useState<string>("1403-01-01 00:00:00");
  const [end, setEnd] = useState<string>("1403-01-01 00:00:00");
  const [_description, SetDescription] = useState<string>("");
  const [disabled, SetDisabled] = useState(true);
  const [fields, setFields] = useState<Field[]>([]);
  function checkConditions() {
    const fieldsAreEmpty = _title === "" || _description === "";
    SetDisabled(fieldsAreEmpty);
  }

  const [category, setCategory] = useState<Category>();

  useEffect(() => {
    const fetchData = async () => {

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories/${category_id}`
        );

        if (response.ok) {
          const data = await response.json();
          setCategory(data.category);

          if (data.category?.fields) {
            setFields(JSON.parse(data.category.fields));
          }
        } else {
          console.error("Failed to fetch category:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching category:", error);
      }
    };

    fetchData();
  }, [category_id]);

  const handleInputChange = (index: number, value: string) => {
    setFields((prevFields) => {
      const newFields = [...prevFields];
      newFields[index] = { title: newFields[index].title, value: value };
      return newFields;
    });
  };

  useEffect(() => {
    checkConditions();
  }, [_title, _description]);

  return (
    <div className="border p-5 rounded-md shadow min-h-[350px] w-full flex justify-between gap-3 flex-col items-center">
      <div className="flex flex-col gap-2 w-full">
        <h2 className="text-center">{title}</h2>

        <input
          type="text"
          value={_title}
          onChange={(e) => SetTitle(e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          placeholder="عنوان"
        />

        <input
          type="text"
          value={_price}
          onChange={(e) => SetPrice(e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          placeholder="قیمت پایه"
        />

        <div className="mb-4 w-full px-3 flex gap-2">
          <div className="w-1/2">
            <label
              htmlFor="fromDate"
              className="block text-sm font-medium text-gray-600"
            >
              از تاریخ
            </label>
            <DatePicker
              className="mt-1 p-2 w-full border rounded-md"
              onChange={(value: any) =>
                setStart(moment(value, "jYYYY/jM/jD HH:mm").format("YYYY-M-D"))
              }
              value={start}
              dateRenge={{ end: "1420", start: "1371" }}
            />
          </div>
          <div className="w-1/2">
            <label
              htmlFor="fromDate"
              className="block text-sm font-medium text-gray-600"
            >
              تا تاریخ
            </label>
            <DatePicker
              className="mt-1 p-2 w-full border rounded-md"
              value={end}
              onChange={(value: any) =>
                setEnd(moment(value, "jYYYY/jM/jD HH:mm").format("YYYY-M-D"))
              }
              dateRenge={{ end: "1420", start: "1371" }}
            />
          </div>
        </div>

        {fields.map((field, index) => (
          <input
            key={index}
            type="text"
            value={field.value ?? ""}
            placeholder={field.title}
            onChange={(e) => handleInputChange(index, e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        ))}

        {/* first */}

        {/* second */}
        <textarea
          className="p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          value={_description}
          onChange={(e) => SetDescription(e.target.value)}
          rows={7}
          placeholder="توضیحات"
        ></textarea>
      </div>
      <div className="flex justify-between w-full">
        <button
          onClick={() => {
            previousStep();
          }}
          className={`cursor-pointer bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-700 hover:to-gray-900 text-white font-bold pt-2 pb-1 mt-1 px-4 rounded`}
        >
          مرحله قبل
        </button>

        <button
          disabled={disabled}
          onClick={() => {
            setItems(_title, _description, _price, {start, end}, fields);
            nextStep();
          }}
          className={`${
            disabled ? "cursor-not-allowed" : "cursor-pointer"
          }  bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-700 hover:to-blue-900 text-white font-bold pt-2 pb-1 mt-1 px-4 rounded`}
        >
          مرحله بعد
        </button>
      </div>
    </div>
  );
}

export default TenderStep3;
