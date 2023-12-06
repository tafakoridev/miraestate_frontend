"use client"
import FileAgentUpload from '@/app/components/dashboard/FileAgentUpload';
import { GetToken, GetUser } from '@/app/utils/Auth';
import { Loading } from 'notiflix';
// Import necessary modules and styles
import React, { useState, useEffect } from 'react';
interface IUser extends User {
    city: City;
  }

export type Gender = 'male' | 'female';



interface Province {
  // Define your province interface
  id: number;
  name: string;
}

interface City {
  // Define your city interface
  id: number;
  name: string;
  province_id: string;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [citiesAll, setCitiesAll] = useState<City[]>([]);
  const fetchCitiesAll = async () => {
    Loading.pulse();
    const token = GetToken();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cities`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const cityData = await response.json();
      setCitiesAll(cityData);
      Loading.remove();
    } catch (error) {
      console.error('Error fetching all cities:', error);
      Loading.remove();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      Loading.pulse();
      const token = GetToken();
      try {
        // Fetch user data
        const userData = await GetUser();
        console.log(userData);
        
        if(userData)
        setUser(userData);

        // Fetch provinces
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/provinces`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const provinceData = await response.json();
        setProvinces(provinceData);

        // Fetch cities for the initial province
        if(userData)
        fetchCities(userData?.city_id);

        Loading.remove();
      } catch (error) {
        console.error('Error fetching data:', error);
        Loading.remove();
      }
    };
    fetchCitiesAll();
    fetchData();
  }, []); // Run only on the initial mount

  const fetchCities = async (provinceId: string) => {
    Loading.pulse();
    const token = GetToken();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cities/${provinceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const cityData = await response.json();
      setCities(cityData);
      Loading.remove();
    } catch (error) {
      console.error('Error fetching cities:', error);
      Loading.remove();
    }
  };

  const handleProvinceChange = (provinceId: string) => {
    setSelectedProvince(provinceId);
    fetchCities(provinceId);
  };
console.log();

  return (
    <div className="p-4">
        
      {user && (
        <>
         <FileAgentUpload image={`${user?.information.profile_photo_url}`} onFileChange={(file) => {console.log(file);
        }}/>
        <form className='flex flex-row flex-wrap'>
           
          <div className="mb-4  md:w-1/3 w-full px-3">
            <label htmlFor="name" className="block text-sm font-medium text-gray-600">
              نام
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={user?.name ?? ""}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>

          <div className="mb-4  md:w-1/3 w-full px-3">
            <label htmlFor="gender" className="block text-sm font-medium text-gray-600">
              جنسیت
            </label>
            <select
              id="gender"
              name="gender"
              value={user.gender ?? ""}
              onChange={(e) => setUser({ ...user, gender: e.target.value as Gender })}
              className="mt-1 p-2 w-full border rounded-md"
            >
              <option value="male">آقا</option>
              <option value="female">خانم</option>
            </select>
          </div>

          <div className="mb-4  md:w-1/3 w-full px-3">
            <label htmlFor="nationalCode" className="block text-sm font-medium text-gray-600">
              کد ملی
            </label>
            <input
              type="text"
              id="nationalCode"
              name="nationalCode"
              value={user.national_code ?? ""}
              onChange={(e) => setUser({ ...user, national_code: e.target.value })}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>

          <div className="mb-4  md:w-1/3 w-full px-3">
            <label htmlFor="province" className="block text-sm font-medium text-gray-600">
              استان
            </label>
            <select
              id="province"
              name="province"
              value={selectedProvince || ''}
              onChange={(e) => handleProvinceChange(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md"
            >
              <option value={user.city.province_id} disabled>
                انتخاب استان
              </option>
              {provinces.map((province) => (
                <option key={province.id} value={province.id}>
                  {province.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4  md:w-1/3 w-full px-3">
            <label htmlFor="city" className="block text-sm font-medium text-gray-600">
               شهرستان
            </label>
            <select
              id="city"
              name="city"
              value={user.city_id}
              onChange={(e) => setUser({ ...user, city_id: e.target.value })}
              className="mt-1 p-2 w-full border rounded-md"
            >
              <option value="" disabled>
                انتخاب شهرستان
              </option>
              {citiesAll.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          {/* Add any additional fields or customization as needed */}
        </form>
        </>
      )}
    </div>
  );
};

export default Profile;
