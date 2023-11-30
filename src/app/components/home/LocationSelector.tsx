// LocationSelector.tsx
import { useState, useEffect } from 'react';
import { Loading, Notify } from 'notiflix';
import { GetToken } from '@/app/utils/Auth';

interface LocationSelectorProps {
  onClose: () => void;
}

interface Province {
  id: number;
  name: string;
}

interface City {
  id: number;
  name: string;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ onClose }) => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [selectedCity, setSelectedCity] = useState<number | null>(null);

  useEffect(() => {
    const fetchProvinces = async () => {
      Loading.pulse();
      const token = GetToken();
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/provinces`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        
        setProvinces(data);
        Loading.remove();
      } catch (error) {
        console.error('Error fetching provinces:', error);
      }
    };

    fetchProvinces();
  }, []);

  const handleProvinceChange = async (provinceId: number) => {
    setSelectedProvince(provinceId);
    Loading.pulse();
    const token = GetToken();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cities/${provinceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setCities(data);
      Loading.remove();
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const handleCityChange = (cityId: number) => {
    setSelectedCity(cityId);
  };

  const handleConfirm = () => {
    if (!selectedProvince || !selectedCity) {
      Notify.warning('لطفاً استان و شهر را انتخاب کنید');
      return;
    }
    const selectedCityName = cities.find(city => {
        return city.id === selectedCity;
      });
    localStorage.setItem('city_id', String(selectedCity))
    localStorage.setItem('city', JSON.stringify(selectedCityName))
    onClose();
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4">انتخاب موقعیت</h2>
        <div className="flex flex-col mb-4">
          <label className="mb-2">انتخاب استان:</label>
          <select
            value={selectedProvince || ''}
            onChange={(e) => handleProvinceChange(Number(e.target.value))}
            className="bg-gray-100 p-2 rounded-md"
          >
            <option value="" disabled>
              انتخاب کنید
            </option>
            {provinces.map((province) => (
              <option key={province.id} value={province.id}>
                {province.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col mb-4">
          <label className="mb-2">انتخاب شهر:</label>
          <select
            value={selectedCity || ''}
            onChange={(e) => handleCityChange(Number(e.target.value))}
            className="bg-gray-100 p-2 rounded-md"
            disabled={!selectedProvince}
          >
            <option value="" disabled>
              انتخاب کنید
            </option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-between">
          <button
            className="my-2 float-left text-white bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-gray-300 dark:focus:ring-gray-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
            onClick={onClose}
          >
            لغو
          </button>
          <button
            className="my-2 float-left text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
            onClick={handleConfirm}
          >
            تایید
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationSelector;
