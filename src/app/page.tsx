"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GetToken, GetUser, IsLogin } from "./utils/Auth";
import { Loading } from "notiflix";
import Kala from "./components/home/kala";
import LocationSelector from "./components/home/LocationSelector";
import Commodity from "./components/home/Commodity";
import AgentShow from "./components/home/AgentShow";
import SidebarDivar from "./components/home/SidebarDivar";
import AuctionShow from "./components/home/AuctionShow";
import TenderShow from "./components/home/TenderShow";
interface Category {
  id: number;
  title: string;
}

enum StateType {
  Commodity = "commodity",
  Tender = "tender",
  Auction = "auction",
}

interface State {
  selectedOption: StateType | null;
}

interface SideBarProps {
  setOptions: Function;
}

interface Information {
  rate: number;
  profile_photo_url: string;
  is_active: string;
}

interface IUser {
  created_at: string;
  gender: string | null;
  id: number;
  name: string | null;
  national_code: string | null;
  phonenumber: string;
  role: string;
  state: string;
  updated_at: string;
  department_expertises: IAgentExpertise[];
  category_expertises: IAgentExpertise[];
  information: Information;
}

interface Field {
  title: string;
}

interface IAgentExpertise {
  id: number;
  expertiese_id: number;
  field_id: number;
  field_type: string;
  // Add other columns as needed
  created_at: string;
  updated_at: string;
  field: Field;
}

const Home: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [commodities, setCommodities] = useState<any[]>([]);
  const [selectLocation, setSelectLocation] = useState<boolean>(false);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedCityId, setSelectedCityId] = useState<number>(0);
  const [commodity_id, setCommodity_id] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");
  const [users, setUsers] = useState<IUser[]>([]);
  const [isLogin, setIsLogin] = useState<boolean | null>(null);
  const [user, setUser] = useState<User | undefined>(undefined);
  const [agent_id, setAgentId] = useState<string>("");
  const [category_id, setCategoryId] = useState<number | null>(0);
  const [type, setType] = useState<string | null>("");
  const router = useRouter();

  useEffect(() => {
    if (type !== "" || category_id !== 0) fetchCommodities(type, category_id);
  }, [category_id, type]);

  const handleSearch = async () => {
    if (searchText.trim() === "") {
      // If the input is empty, fetch all commodities
      await fetchCommodities(type, category_id);
    } else {
      // Perform the filtering based on the entered text
      const filteredCommodities = commodities.filter((commodity: any) =>
        commodity.title.includes(searchText)
      );
      setCommodities(filteredCommodities);
    }
  };

  const fetchCommodities = async (
    type: string | null,
    categoryId: number | null
  ) => {
    Loading.pulse();

    const token = GetToken();
    let city_id = await localStorage.getItem("city_id");
    let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/commodities/bycity/list/${city_id}`;
    if (type)
      url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/commodities/bycity/list/${city_id}/${type}`;
    if (categoryId)
      url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/commodities/bycity/list/${city_id}/${type}/${categoryId}`;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      setCommodities(data.commodities);
      Loading.remove();
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  function setOptions(type: State, id: number) {
    setType(type.selectedOption);
    setCategoryId(id);
  }

  async function setCityFromStorage() {
    let city = localStorage.getItem("city");
    let selectedCity;
    if (city) {
      selectedCity = JSON.parse(city);
      setSelectedCity(selectedCity.name);
      setSelectedCityId(selectedCity.id);
    }

    fetchCommodities(type, category_id);
  }

  useEffect(() => {
    // ... (existing code)

    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/agents/0/list`
        );
        const data = await response.json();

        setUsers(data);

        Loading.remove();
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const checkIsLoggedIn = async () => {
      setUser(await GetUser());
      const isLoggedIn = await IsLogin();
      setIsLogin(isLoggedIn);
    };

    setCityFromStorage();
    // Replace the URL with your actual API endpoint for categories
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

        setCategories(data.categories);
        Loading.remove();
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    if (isLogin === null) {
      checkIsLoggedIn();
    }
    fetchCategories();
  }, []);

  return (
    <div className="flex flex-col min-h-screen h-screen bg-gray-200 overflow-auto overflow-x-hidden">
      {agent_id && (
        <AgentShow agentId={agent_id} onClose={() => setAgentId("")} />
      )}
      {commodity_id && (type === "commodity" || !type) && (
        <Commodity
          id={commodity_id}
          notcall={false}
          onClose={() => {
            setCommodity_id("");
          }}
          key={1}
        />
      )}
      {commodity_id && type === "auction" && (
        <AuctionShow
          id={commodity_id}
          onClose={() => {
            setCommodity_id("");
          }}
          key={1}
        />
      )}
      {commodity_id && type === "tender" && (
        <TenderShow
          id={commodity_id}
          onClose={() => {
            setCommodity_id("");
          }}
          key={1}
        />
      )}
      {selectLocation && (
        <LocationSelector
          onClose={() => {
            setSelectLocation(!selectLocation);
            setCityFromStorage();
          }}
        />
      )}
      {/* Top Gray Bar */}
      <div className="sticky top-0 z-40 w-full md:h-[150px] h-[250px] bg-gray-100 flex items-center justify-start gap-2 px-4 ">
        <div className="visible absolute left-1 top-2 md:invisible flex justify-end items-center px-2">
          {isLogin ? (
            <>
            <a href="/dashboard">
              <button  className="bg-white text-center justify-self-start float-left w-[100px] h-[30px] rounded-md border border-gray-300 shadow-sm text-xs">
                پنل کاربری
              </button>
              </a>
              <button
                className="bg-white justify-self-start float-left w-[100px] h-[30px] rounded-md border border-gray-300 shadow-sm text-xs mx-1"
                onClick={() => {
                  localStorage.removeItem("api_token");
                  router.push("/login");
                }}
              >
                خروج
              </button>
            </>
          ) : (
            <button
              onClick={() => router.push("/login")}
              className="bg-white justify-self-start float-left w-[90px] h-[30px] rounded-md border border-gray-300 shadow-sm text-xs"
            >
              ورود / ثبت نام
            </button>
          )}
        </div>

        <div className="visible absolute left-1 bottom-2 flex justify-end items-center px-2">
          <button
            onClick={() => setSelectLocation(true)}
            className="w-[140px] h-[30px] rounded-md text-xs flex justify-center items-center"
          >
            <Image
              src={"/assets/icons8-location-40.png"}
              alt="location"
              width={24}
              height={24}
            />
            {selectedCity}
          </button>
        </div>

        <div className="flex flex-col w-full pb-4">
          <div className="flex w-full justify-center md:items-center flex-col md:flex-row">
            <div className="flex md:w-1/3 w-full md:justify-center items-center flex-col md:flex-row gap-5 md:gap-0">
              {/* Logo Image */}
              <div className="w-2/6 ml-auto ">
                <Image
                  onClick={() => router.push("/")}
                  src="/assets/mira_logo.png"
                  alt="Logo"
                  width={170}
                  height={50}
                  priority={true}
                />
              </div>

              <div className="relative md:w-4/6 h-full ml-auto">
                <input
                  type="text"
                  placeholder="نام کالا را وارد کنید"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="border border-gray-400 rounded-md pl-8 pr-10 py-3 focus:outline-none focus:border-blue-500 w-full"
                />
                <button
                  className="absolute left-0 top-0 h-full w-[14%] float-left text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none rounded-l-md focus:ring-blue-300 dark:focus:ring-blue-800 font-medium text-center"
                  onClick={handleSearch}
                >
                  <Image
                    src="/assets/icons8-search-144.png"
                    alt="Logo"
                    width={30}
                    height={30}
                    className="mx-auto"
                  />
                </button>
              </div>
            </div>

            <div className="hidden md:flex  justify-end w-2/3 h-full items-center px-3">
              {isLogin ? (
                <>
                 <a href="/dashboard">
                   <button  className="bg-white justify-self-start float-left w-[100px] h-[30px] rounded-md border border-gray-300 shadow-sm text-xs">
                پنل کاربری
              </button></a>
                  <button
                    className="bg-white justify-self-start float-left w-[100px] h-[30px] rounded-md border border-gray-300 shadow-sm text-xs mx-1"
                    onClick={() => {
                      localStorage.removeItem("api_token");
                      router.push("/login");
                    }}
                  >
                    خروج
                  </button>
                </>
              ) : (
                <button
                  onClick={() => router.push("/login")}
                  className="bg-white justify-self-start float-left w-[120px] h-[50px] rounded-md border border-gray-300 shadow-sm"
                >
                  ورود / ثبت نام
                </button>
              )}
            </div>
          </div>
          {/* 
          <div className="flex px-5">
            <ul className="list-none mt-4">
              {categories.map((category: Category, index) => (
                <li className="inline-block mx-2" key={index}>
                  {category.title}
                </li>
              ))}
            </ul>
          </div> */}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow flex items-start gap-10 justify-start p-24 md:flex-nowrap flex-wrap">
        {/* <h2 className="text-lg">جدیدترین ها</h2> */}
        <div className="nicescroll bg-white md:w-1/6 w-full sticky md:top-[100px] top-[160px] z-40 h-[200px] md:h-[600px] rounded-lg shadow-md border-2 p-3 overflow-auto">
          <SidebarDivar setOptions={setOptions} />
        </div>
        <div className="flex gap-5 flex-wrap justify-center overflow-auto md:w-5/6 w-full">
          
          {commodities.map((el: any, i: any) => (
            <Kala
              id={el.id}
              select={async (id: any) => setCommodity_id(id)}
              key={i}
              title={el.title}
              price={el.price}
              type={type}
              imageSrc={type !== 'Commodity' ? `http://87.107.146.142:8089${JSON.parse(el.picture)[0]}` : `http://87.107.146.142:8089${JSON.parse(el.picture)[0]}`}
              agent={el.agent ? true : false}
            />
          ))}
        </div>
      </main>

      {/* Bottom Gray Bar */}
      <div className="w-full md:h-10 h-15 bg-gray-100 flex md:flex-row flex-col gap-2 py-2 md:gap-0 justify-between items-center px-10 text-center">
        <div className="w-full md:h-10 h-15 bg-gray-100 flex md:flex-row flex-col gap-2 py-2 md:gap-0 justify-between items-center px-10 text-center">
          <div className="flex justify-start items-center gap-5">
            <a href="" className="text-gray-500 text-sm">
              راهنمای سایت
            </a>
            <a href="" className="text-gray-500 text-sm">
              تماس با ما
            </a>
            <a href="" className="text-gray-500 text-sm">
              درباره ما
            </a>
          </div>
          <div dir="ltr" className="hidden md:block">
            &copy; 2023 - Mirimaestae.com
          </div>
          <div className="flex justify-end items-center gap-5">
            <a href="/dashboard" className="text-gray-500 text-sm">
              پنل کاربری
            </a>
            {/* <a href="/auction" className="text-gray-500 text-sm">
              مزایده ها
            </a>
            <a href="/tenders" className="text-gray-500 text-sm">
              مناقصه ها
            </a> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
