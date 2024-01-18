// Modal.tsx
import { useEffect, useState } from "react";
import { Loading, Notify } from "notiflix";
import { GetToken } from "@/app/utils/Auth";
import Slider from "react-slick";
import Image from "next/image";
interface ModalProps {
  onClose: () => void;
  type: string;
  id: string;
}

interface City {
  name: string;
}
interface Category {
  title: string;
}

interface Commodity {
  id: number;
  category_id: number;
  title: string;
  description: string;
  price: number;
  city_id: number;
  picture: string;
  city: City;
  category: Category;
  expired_at: string;
}

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};

const AgentDesk: React.FC<ModalProps> = ({ onClose, type, id }) => {
  const [description, setDescription] = useState("");
  const [Commodity, setCommodity] = useState<Commodity>();
  const [selectedPicture, setSelectedPicture] = useState(null);

  const openModal = (picture: any) => {
    setSelectedPicture(picture);
    document.body.style.overflow = "hidden"; // Prevent scrolling when the modal is open
  };

  const closeModal = () => {
    setSelectedPicture(null);
    document.body.style.overflow = "auto"; // Restore scrolling when the modal is closed
  };

  async function getComodity() {
    const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/commodities/${id}`;
    const token = GetToken();
    const res = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.status === 401) {
      localStorage.removeItem("api_token");
    }
    const result = await res.json();
    setCommodity(result.commodity);
  }
  useEffect(() => {
    getComodity(); // Call the function in the useEffect body
  }, [id]); // Include 'id' as a dependency

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async () => {
    const token = GetToken();
    Loading.pulse();

    try {
      // Send request to /users/agents/desk with description and token
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/agents/desk`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ description, type, id }),
        }
      );

      if (response.ok) {
        Loading.remove();
        Notify.init({
          width: "300px",
          position: "left-bottom",
        });
        Notify.success(" کارشناسی شما با موفقیت ارسال گردید");
        onClose(); // Close the modal after successfully sending the description
      } else {
        console.error("Failed to send description:", response.statusText);
      }
    } catch (error) {
      console.error("Error sending description:", error);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
      {Commodity &&
        Commodity.picture &&
        Commodity.picture.length > 0 &&
        JSON.parse(Commodity.picture).map((_picture: string, index: number) => (
          <div key={index} className="z-50">
            {selectedPicture && (
              <div
                onClick={(e) => e.target === e.currentTarget && closeModal()}
                className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
              >
                <div className="max-w-screen-lg max-h-screen bg-white relative">
                  <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-black text-2xl cursor-pointer"
                  >
                    &times;
                  </button>
                  <img
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${selectedPicture}`}
                    alt={Commodity.title}
                    className="w-full h-screen object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      <div className="bg-white p-8 rounded-lg md:w-1/2 w-full">
        <h2 className="text-2xl font-bold mb-4">ارائه کارشناسی</h2>
        <div className="mb-4">
          {Commodity && (
            <div>
              <h2>{Commodity.title}</h2>
            
              <Slider {...settings}>
                {Commodity.picture && Commodity.picture.length > 0 ? (
                  JSON.parse(Commodity.picture).map(
                    (_picture: string, index: number) => (
                      <Image
                        key={index}
                        loader={() =>
                          `${process.env.NEXT_PUBLIC_BACKEND_URL}${_picture}`
                        }
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${_picture}`}
                        width={150}
                        height={150}
                        onClick={() => openModal(_picture)}
                        alt={Commodity.title}
                        className="w-[50px] object-contain h-[300px]"
                      />
                    )
                  )
                ) : (
                  <span>No pictures available</span>
                )}
              </Slider>
              <p className="w-full border-2 flex flex-col mt-10 mb-1 justify-between px-5 py-2 rounded"><span>شرح:</span>{Commodity.description}</p>
          {Commodity.price && 
              <p className="w-full border-2 my-2 flex justify-between px-5 py-2 rounded"><b>قیمت</b><span>{Commodity.price} تومان</span></p>
            }
            </div>
          )}
          <textarea
            value={description}
            onChange={handleDescriptionChange}
            rows={5}
            className="
              block
              p-2.5
              w-full
              text-sm
              text-gray-900
              bg-gray-50
              rounded-lg
              border
              border-gray-300
              focus:ring-blue-500
              focus:border-blue-500
              dark:bg-gray-700
              dark:border-gray-600
              dark:placeholder-gray-400
              dark:text-white
              dark:focus:ring-blue-500
              dark:focus:border-blue-500
              focus:outline-none
            "
            placeholder="توضیحات کارشناس ..."
          />
        </div>
        <div className="flex justify-between">
          <button
            className="my-2 float-left text-white bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-gray-300 dark:focus:ring-gray-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
            onClick={onClose}
          >
            انصراف
          </button>
          <button
            className="my-2 float-left text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
            onClick={handleSubmit}
          >
            ارسال
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentDesk;
