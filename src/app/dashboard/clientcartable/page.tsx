"use client";
// Commodities.tsx
import { useState, useEffect } from "react";
import { Loading, Notify } from "notiflix";
import { GetToken } from "@/app/utils/Auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import moment from "moment";
import CommentToAgent from "@/app/components/dashboard/CommentToAgent";
import Star from "@/app/components/dashboard/Star";

interface City {
  name: string;
}
interface Category {
  title: string;
}
interface AGENT {
  description: string;
  comment: string;
  rate: number;
  agent: User;
  accepted: number;
}
interface Commodity {
  id: number;
  category_id: number;
  title: string;
  description: string;
  price: number;
  city_id: number;
  local: number;
  picture: string;
  city: City;
  category: Category;
  expired_at: string;
  agent: AGENT;
  accepted: number;
}

function Commodities() {
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [selectedPicture, setSelectedPicture] = useState(null);
  const [openComment, setOpenComment] = useState(0);

  const openModal = (picture: any) => {
    setSelectedPicture(picture);
    document.body.style.overflow = "hidden"; // Prevent scrolling when the modal is open
  };

  const closeModal = () => {
    setSelectedPicture(null);
    document.body.style.overflow = "auto"; // Restore scrolling when the modal is closed
  };
  const [newCommodity, setNewCommodity] = useState({
    category_id: 0,
    title: "",
    description: "",
    price: 0,
    city_id: 0,
    picture: "",
  });

  function remainedDays(expiredAtString: string): number {
    const expiredAt = moment(expiredAtString);

    // Calculate the difference in days
    const daysRemaining = expiredAt.diff(moment(), "days");
    return daysRemaining;
  }

  const router = useRouter();
  const fetchCommodities = async () => {
    Loading.pulse();
    const token = GetToken();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/client/commodities`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      console.log(data.commodities);

      setCommodities(data.commodities);
      Loading.remove();
    } catch (error) {
      console.error("Error fetching commodities:", error);
    }
  };
  useEffect(() => {
    // Fetch commodities from /commodities endpoint

    fetchCommodities();
  }, [openComment]);

  const handleDeleteCommodity = async (id: number) => {
    const token = GetToken();
    Loading.pulse();
    try {
      // Delete commodity with the specified id
      await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/commodities/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update state to reflect the deletion
      setCommodities((prevCommodities) =>
        prevCommodities.filter((commodity) => commodity.id !== id)
      );
      Loading.remove();
      Notify.init({
        width: "300px",
        position: "left-bottom",
      });
      Notify.success("کالا با موفقیت حذف شد");
    } catch (error) {
      console.error("Error deleting commodity:", error);
    }
  };

  const handleEditCommodity = (id: number, field: string, value: any) => {
    // Update commodity locally
    setCommodities((prevCommodities) =>
      prevCommodities.map((commodity) =>
        commodity.id === id ? { ...commodity, [field]: value } : commodity
      )
    );
  };

  const handleEditCommoditySubmit = async (
    id: number,
    updatedCommodity: Commodity
  ) => {
    const token = GetToken();
    Loading.pulse();
    try {
      // Send request to update commodity with the specified id
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/commodities/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedCommodity),
        }
      );

      if (response.ok) {
        Loading.remove();
        Notify.init({
          width: "300px",
          position: "left-bottom",
        });
        Notify.success("کالا با موفقیت ویرایش شد");
      } else {
        console.error("Failed to edit commodity:", response.statusText);
      }
    } catch (error) {
      console.error("Error editing commodity:", error);
    }
  };

  const handleAddCommodity = async (event: React.FormEvent) => {
    event.preventDefault();
    const token = GetToken();
    try {
      // Post new commodity with the specified data
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/commodities`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newCommodity),
        }
      );

      if (response.ok) {
        const newCommodityData = await response.json();
        setCommodities((prevCommodities) => [
          ...prevCommodities,
          newCommodityData.commodity,
        ]);
        setNewCommodity({
          category_id: 0,
          title: "",
          description: "",
          price: 0,
          city_id: 0,
          picture: "",
        }); // Clear the input fields after successful submission
        Notify.init({
          width: "300px",
          position: "left-bottom",
        });
        Notify.success("کالا با موفقیت افزوده شد");
      } else {
        console.error("Failed to add commodity:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding commodity:", error);
    }
  };

  const handleUpdateCommodity = async (commodityId: number) => {
    const token = GetToken();

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/client/commodities/${commodityId}`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const updatedCommodityData = await response.json();
        if (updatedCommodityData.retval) {
          Notify.init({
            width: "300px",
            position: "left-bottom",
          });
          Notify.success(" با موفقیت برای انتشار ارسال شد");
          fetchCommodities();
        }
      } else {
        console.error("Failed to update commodity:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating commodity:", error);
    }
  };

  const handleAgentReview = async (commodityId: number) => {
    const token = GetToken();

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/client/commodities/reviewed`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: commodityId }),
      });

      if (response.ok) {
        const updatedCommodityData = await response.json();
        if (updatedCommodityData.retval) {
          Notify.init({
            width: "300px",
            position: "left-bottom",
          });
          Notify.success("به عنوان بازدید شده ثبت شد");
          fetchCommodities();
        }
      } else {
        console.error("Failed to update commodity:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating commodity:", error);
    }
  };

  return (
    <div>
      {commodities.map((commodity, o) => (
        <div key={o}>
          {openComment == commodity.id && (
            <CommentToAgent
              id={openComment}
              onClose={() => setOpenComment(0)}
            />
          )}
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
                  alt={commodity.title}
                  className="w-full h-screen object-cover"
                />
              </div>
            </div>
          )}
        </div>
      ))}
      <div className="flex justify-center flex-col items-center">
        <table className="table-auto border-collapse w-[1000px] text-center md:w-full">
          <thead>
            <tr>
              <th className="border text-blue-800 bg-slate-300">#</th>
              <th className="border text-blue-800 bg-slate-300">نام</th>
              <th className="border text-blue-800 bg-slate-300">توضیحات</th>
              <th className="border text-blue-800 bg-slate-300">قیمت</th>
              <th className="border text-blue-800 bg-slate-300">شهر</th>
              <th className="border text-blue-800 bg-slate-300">دسته بندی</th>
              <th className="border text-blue-800 bg-slate-300">تصویر</th>
              {/* <th className="border text-blue-800 bg-slate-300">ویرایش</th>
              <th className="border text-blue-800 bg-slate-300">حذف</th>
              <th className="border text-blue-800 bg-slate-300">انقضا</th> */}
              <th className="border text-blue-800 bg-slate-300">
                اطلاعات تماس
              </th>
              <th className="border text-blue-800 bg-slate-300">نظر کارشناس</th>
              <th className="border text-blue-800 bg-slate-300">عملیات</th>
              <th className="border text-blue-800 bg-slate-300">وضعیت</th>
            </tr>
          </thead>
          <tbody>
            {commodities.map((commodity) => (
              <tr key={commodity.id}>
                <td className="border border-slate-300">{commodity.id}</td>
                <td className="border border-slate-300">{commodity.title}</td>
                <td className="border border-slate-300">
                  {commodity.description}
                </td>
                <td className="border border-slate-300 w-1/12">
                  {commodity.price == 0.0 ? "---" : `${commodity.price}تومان `}
                </td>
                <td className="border border-slate-300 w-1/12">
                  {commodity.city?.name}
                </td>
                <td className="border border-slate-300 w-1/12">
                  {commodity.category?.title}
                </td>
                <td className="border border-slate-300 ">
                  <div className="flex justify-center gap-1">
                    {commodity.picture && commodity.picture.length > 0 ? (
                      JSON.parse(commodity.picture).map(
                        (_picture: string, index: number) => (
                          <Image
                            onClick={() => openModal(_picture)}
                            key={index}
                            loader={() =>
                              `${process.env.NEXT_PUBLIC_BACKEND_URL}${_picture}`
                            }
                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${_picture}`}
                            width={150}
                            height={150}
                            alt={commodity.title}
                            className="w-[50px] object-contain"
                          />
                        )
                      )
                    ) : (
                      <span>No pictures available</span>
                    )}
                  </div>
                </td>
                {/* <td className="border border-slate-300 w-1/12">
                  <button
                    className=" text-white bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
                    onClick={() =>
                      router.push(
                        `/dashboard/commodities/edit?commodityId=${commodity.id}`
                      )
                    }
                  >
                    ویرایش
                  </button>
                </td>
                <td className="border border-slate-300 w-1/12">
                  <button
                    className=" text-white bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
                    onClick={() => handleDeleteCommodity(commodity.id)}
                  >
                    حذف
                  </button>
                </td> */}
                {/* <td className="w-1/12 border border-slate-300 ">
                  {remainedDays(commodity.expired_at)} روز دیگر
                </td> */}
                <td className={`border border-slate-300`}>
                  {commodity.agent && (
                    <div className="flex flex-col">
                      <span>{commodity.agent.agent.name}</span>
                      <span>{commodity.agent.agent.phonenumber}</span>
                    </div>
                  )}
                </td>
                <td
                  className={`${
                    commodity.agent ? "w-1/4" : "w-1/12"
                  } border border-slate-300`}
                >
                  {commodity.agent && commodity.agent.accepted === 1 ? (
                    <div className="flex justify-center items-center flex-col gap-3">
                      <b>نظر کارشناس: </b>
                      {commodity.agent ? commodity.agent.description : "ندارد"}
                      {commodity.local == 0 && (
                        <b
                          className={
                            "bg-red-300 p-1 text-xs rounded-md text-red-800"
                          }
                        >
                          بازدید در محل ندارد
                        </b>
                      )}
                      {commodity.local == 1 && (
                        <b
                          className={
                            "bg-yellow-300 p-1 text-xs rounded-md text-yellow-800"
                          }
                        >
                          بازدید در محل دارد
                        </b>
                      )}
                      {commodity.local == 3 && (
                        <b
                          className={
                            "bg-green-300 p-1 text-xs rounded-md text-green-800"
                          }
                        >
                          بازدید در محل انجام شد
                        </b>
                      )}
                      <br />
                      {commodity.agent?.comment ? (
                        <p>
                          <hr />
                          <b>نظر شما: </b>
                          <br />
                          {commodity.agent.comment}
                          <hr />
                          <div className="flex justify-center">
                            <Star count={commodity.agent.rate} />
                          </div>
                        </p>
                      ) : (
                        <button
                          onClick={() => setOpenComment(commodity.id)}
                          className="bg-blue-500 text-white justify-self-start float-left w-[100px] h-[30px] rounded-md border border-gray-300 shadow-sm text-xs"
                        >
                          نظردهی
                        </button>
                      )}
                      {commodity.local && commodity.local !== 3 && (
                        <button
                          onClick={() => handleAgentReview(commodity.id)}
                          className="bg-blue-500 text-white justify-self-start float-left w-[100px] h-[30px] rounded-md border border-gray-300 shadow-sm text-xs"
                        >
                          تایید بازدید
                        </button>
                      )}
                    </div>
                  ) : <span>در انتظار...</span>}
                </td>
                <td className={`border border-slate-300`}>
                  <div className="flex justify-center items-center flex-col gap-3">
                    <button
                      onClick={() => handleUpdateCommodity(commodity.id)}
                      className="bg-blue-500 text-white justify-self-start float-left w-[100px] h-[30px] rounded-md border border-gray-300 shadow-sm text-xs"
                    >
                      انتشار عمومی
                    </button>
                  </div>
                </td>
                <td className={`border border-slate-300`}>
                  {commodity.accepted ? "تایید شده" : "تایید نشده"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Commodities;
