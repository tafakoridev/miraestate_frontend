import { useEffect, useState } from "react";

interface Step {
  title: string;
  setCityId: Function;
  previousStep: Function;
  nextStep: Function;
  bkp: S2BKP;
  setBKP: Function;
}

interface City {
  id: number;
  name: string;
}

interface S2BKP {
  selectedProvince: string;
  selectedCity: string;
}

interface Province {
  id: number;
  name: string;
}

function ExpertStep2({
  title,
  setCityId,
  previousStep,
  nextStep,
  bkp,
  setBKP,
}: Step) {
  const [cities, SetCities] = useState<City[]>([]);
  const [provinces, SetProvinces] = useState<Province[]>([]);
  const [selectedProvince, SetSelectedProvince] = useState(
    bkp.selectedProvince
  );
  const [selectedCity, SetSelectedCity] = useState(bkp.selectedCity);
  const [disabled, SetDisabled] = useState(true);

  useEffect(() => {
    getProvinces();
  }, []);

  function checkConditions() {
    const cityNotSelected = cities.length > 0 && selectedCity === "0";
    SetDisabled(cityNotSelected);
  }

  useEffect(() => {
    if (selectedProvince !== "0") getCities();
    if (selectedCity !== "0") checkConditions();
  }, [selectedProvince, selectedCity]);

  const getProvinces = async (): Promise<void> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/provinces`,
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
        SetProvinces(data);
      } else {
        // Error handling
        console.error("Failed to fetch agents Title:", response.statusText);
      }
    } catch (error) {
      // Catch any unexpected errors
      console.error("Error fetching agents Title:", error);
    }
  };

  const getCities = async (): Promise<void> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cities/${selectedProvince}`,
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
        SetCities(data);
      } else {
        // Error handling
        console.error("Failed to fetch agents Title:", response.statusText);
      }
    } catch (error) {
      // Catch any unexpected errors
      console.error("Error fetching agents Title:", error);
    }
  };

  return (
    <div className="border p-5 rounded-md shadow min-h-[250px] min-w-[250px] flex justify-between gap-3 flex-col items-center">
      <h2>{title}</h2>
      {/* first */}
      <div className="relative inline-block w-64">
        <select
          value={selectedProvince}
          onChange={(e) => {
            SetSelectedProvince(e.target.value);
          }}
          className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline-blue focus:border-blue-300"
        >
          <option value="0" disabled>
            انتخاب استان{" "}
          </option>
          {provinces.map((province: Province, index) => (
            <option key={index} value={province.id}>
              {province.name}
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
      {/* second */}
      {cities.length > 0 && (
        <div className="relative inline-block w-64">
          <select
            value={selectedCity}
            onChange={(e) => {
              SetSelectedCity(e.target.value);
            }}
            className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline-blue focus:border-blue-300"
          >
            <option value="0" disabled>
              انتخاب شهر{" "}
            </option>
            {cities.map((city: City, index) => (
              <option key={index} value={city.id}>
                {city.name}
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
      {/* third */}

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
            setCityId(selectedCity);
            nextStep();
            setBKP({
              selectedCity,
              selectedProvince,
            });
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

export default ExpertStep2;
