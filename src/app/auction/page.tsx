
"use client"
// components/Home.tsx
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { GetToken } from '../utils/Auth';
import { Loading } from 'notiflix';
import LocationSelector from '../components/home/LocationSelector';
import Auction from '../components/home/Auction';
import AuctionShow from '../components/home/AuctionShow';
interface Category {
  id: number;
  title: string;
}

const AuctionCMP: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [auctions, setauctions] = useState<any[]>([]);
  const [selectLocation, setSelectLocation] = useState<boolean>(false);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [auction_id, setauction_id] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");
  const handleSearch = async () => {
    if (searchText.trim() === "") {
      // If the input is empty, fetch all commodities
      await fetchauctions();
    } else {
      // Perform the filtering based on the entered text
      const filteredCommodities = auctions.filter((auction) =>
      auction.title.includes(searchText)
      );
      setauctions(filteredCommodities);
    }
  };

  const fetchauctions = async () => {
    Loading.pulse();
    const token = GetToken();
    let city_id = await localStorage.getItem('city_id');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auctions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      setauctions(data.auctions);
      Loading.remove();
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  async function setCityFromStorage() {
    let city = localStorage.getItem('city');
    let selectedCity;
    if (city) {
      selectedCity = JSON.parse(city);
      setSelectedCity(selectedCity.name)
    }
   

    fetchauctions();
  }
  useEffect(() => {
    setCityFromStorage()
    // Replace the URL with your actual API endpoint for categories
    const fetchCategories = async () => {
      Loading.pulse();
      const token = GetToken();
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        setCategories(data.categories);
        Loading.remove();
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

   
    fetchCategories();
    
  }, []);
  const router = useRouter();
  return (
    <div className="flex flex-col min-h-screen h-screen bg-gray-200 overflow-auto overflow-x-hidden">
      {auction_id && <AuctionShow id={auction_id} onClose={() => {setauction_id("")}} key={1}/>}
      {selectLocation && <LocationSelector onClose={() => {setSelectLocation(!selectLocation); setCityFromStorage();}} />}
      {/* Top Gray Bar */}
      <div className="sticky top-0 w-full md:h-[150px] h-[250px] bg-gray-100 flex items-center justify-start gap-2 px-4 ">
        <div className='visible absolute left-1 top-2 md:invisible flex justify-end items-center px-2'>
          <button onClick={() => router.push("/login")} className='bg-white justify-self-start float-left w-[90px] h-[30px] rounded-md border border-gray-300 shadow-sm text-xs'>
            ورود / ثبت نام
          </button>
        </div>

        <div className='visible absolute left-1 bottom-2 flex justify-end items-center px-2'>
          <button onClick={() => setSelectLocation(true)} className='w-[140px] h-[30px] rounded-md text-xs flex justify-center items-center'>
            <Image src={"/assets/icons8-location-40.png"} alt='location' width={24} height={24} />
            {selectedCity}
          </button>
        </div>

        <div className="flex flex-col w-full ">
          <div className="flex w-full justify-center md:items-center flex-col md:flex-row">
            <div className="flex md:w-1/3 w-full md:justify-center items-center flex-col md:flex-row gap-5 md:gap-0">
              {/* Logo Image */}
              <div className="w-2/6 mr-5">
                <Image onClick={() => router.push('/')} src="/assets/mira_logo.png" alt="Logo" width={170} height={50} priority={true} />
              </div>

              <div className="relative md:w-4/6 h-full">
              <input
                  type="text"
                  placeholder=" عنوان مزایده را وارد کنید"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="border border-gray-400 rounded-md pl-8 pr-10 py-3 focus:outline-none focus:border-blue-500 w-full"
                />
                <button
                  className="absolute left-0 top-0 h-full w-[14%] float-left text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none rounded-l-md focus:ring-blue-300 dark:focus:ring-blue-800 font-medium text-center"
                  onClick={handleSearch}
                >
                  <Image src="/assets/icons8-search-144.png" alt="Logo" width={30} height={30} className='mx-auto' />

                </button>
              </div>
            </div>

            <div className='hidden md:flex  justify-end w-2/3 h-full items-center px-3'>
              <button onClick={() => router.push("/login")} className='bg-white justify-self-start float-left w-[120px] h-[50px] rounded-md border border-gray-300 shadow-sm'>
                ورود / ثبت نام
              </button>
            </div>



          </div>


          <div className="flex px-5">
            <ul className="list-none mt-4">
              {categories.map((category: Category, index) => (
                <li className="inline-block mx-2" key={index}>
                  {category.title}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>



      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center gap-10 justify-start p-24">
        <div className="flex w-full gap-5 flex-wrap justify-center overflow-auto">
          {
            auctions.map((el, i) => (
              <Auction id={el.id} select={async(id: any) => setauction_id(id)} key={i} title={el.title} price={el.price} />
            ))
          }

        </div>
      </main>

      {/* Bottom Gray Bar */}
      <div className="w-full md:h-10 h-15 bg-gray-100 flex md:flex-row flex-col gap-2 py-2 md:gap-0 justify-between items-center px-10 text-center">
        <div className="flex justify-start items-center gap-5">
          <a href="" className='text-gray-500 text-sm'>
            راهنمای سایت
          </a>
          <a href="" className='text-gray-500 text-sm'>
            تماس با ما
          </a>
          <a href="" className='text-gray-500 text-sm'>
            درباره ما
          </a>

        </div>
        <div dir='ltr' className='hidden md:block'>
          &copy; 2023 -  Mirimaestae.com
        </div>
        <div className="flex justify-end items-center gap-5">
        <a href="/dashboard" className='text-gray-500 text-sm'>
            پنل کاربری
          </a>
          <a href="/auction" className='text-gray-500 text-sm'>
            مزایده ها
          </a>
          <a href="/tenders" className='text-gray-500 text-sm'>
            مناقصه ها
          </a>
        </div>
      </div>
    </div>
  );
};

export default AuctionCMP;
