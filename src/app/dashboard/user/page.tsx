"use client";
import FileAgentUpload from "@/app/components/dashboard/FileAgentUpload";
import Education from "@/app/interfaces/Education";
import Employee from "@/app/interfaces/Employee";
import { GetToken, GetUser, GetUserById } from "@/app/utils/Auth";
import { Loading, Notify } from "notiflix";
import React, { useState, useEffect } from "react";
import DatePicker from "persian-react-datepicker";
import moment from "moment-jalaali";
import AgentCategory from "@/app/components/dashboard/AgentCategory";

interface IUser extends User {
  city: City;
  educations: Education[];
  employees: Employee[];
}

export type Gender = "male" | "female";

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

const User: React.FC = (props: any) => {
  const { userId } = props.searchParams;

  const [user, setUser] = useState<IUser | null>(null);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [citiesAll, setCitiesAll] = useState<City[]>([]);
  const educationLevelMapping = {
    under_diploma: "زیردیپلم",
    diploma: "دیپلم",
    over_diploma: "فوق دیپلم",
    branch: "لیسانس",
    master: "فوق لیسانس",
    phd: "دکتری",
  } as const;
  const [newEducation, setNewEducation] = useState({
    educational_level: "",
    field_of_study: "",
    educational_institution: "",
    from: moment().format("jYYYY-jMM-jDD"),
    to: moment().format("jYYYY-jMM-jDD"),
    currently_enrolled: false,
    user_id: 0, // Set to the user's ID dynamically
  });

  const [newEmployee, setNewEmployee] = useState({
    company_name: "",
    job_title: "",
    from: moment().format("jYYYY-jMM-jDD"),
    to: moment().format("jYYYY-jMM-jDD"),
    currently_enrolled: false,
    user_id: 0,
  });

  const handleAddEducation = async () => {
    // Validate the form fields before submitting

    Loading.pulse();
    const token = GetToken();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${user?.id}/educations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newEducation),
        }
      );

      if (response.ok) {
        const newEducationData = await response.json();
        // Assuming that the server returns the newly created education data
        // Update the user's educations array with the new data
        setUser((prevUser) => ({
          ...prevUser!,
          educations: [...prevUser!.educations, newEducationData],
        }));

        // Clear the form fields after successful submission
        setNewEducation({
          educational_level: "",
          field_of_study: "",
          educational_institution: "",
          from: moment().format("jYYYY-jMM-jDD"),
          to: moment().format("jYYYY-jMM-jDD"),
          currently_enrolled: false,
          user_id: 0,
        });
        Notify.init({
          width: '300px',
          position: 'left-bottom',
          });
        Notify.success("رکورد تحصیلات جدید با موفقیت افزوده شد");
      } else {
        Notify.init({
          width: '300px',
          position: 'left-bottom',
          });
        Notify.failure("تاریخ شروع و پایان را انتخاب کنید");
        console.error("Failed to add education record:", response.statusText);
      }

      Loading.remove();
    } catch (error) {
      Notify.init({
        width: '300px',
        position: 'left-bottom',
        });
      Notify.failure("تاریخ شروع و پایان را انتخاب کنید");
      console.error("Error adding education record:", error);
      Loading.remove();
    }
  };

  const handleProfileUpdate = async () => {
    Loading.pulse();
    const token = GetToken();

    try {
      const updatedUserBefore = { ...user };

      // Remove the 'information' property if it exists
      if (updatedUserBefore) {
        delete updatedUserBefore.information;
        delete updatedUserBefore.city;
        delete updatedUserBefore.created_at;
        delete updatedUserBefore.updated_at;
        delete updatedUserBefore.educations;
        delete updatedUserBefore.employees;
      }
      if(updatedUserBefore.national_code?.length !== 10)
      {
        Notify.init({
          width: '300px',
          position: 'left-bottom',
          });
        Notify.failure("کد ملی صحیح نمی باشد")
        Loading.remove();
        return 
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/update/${user?.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedUserBefore),
        }
      );

      if (response.ok) {
        const updatedUser = await response.json();
        Notify.init({
          width: '300px',
          position: 'left-bottom',
          });
        Notify.success("پروفایل با موفقیت به روزرسانی شد");
        fetchData();
      } else {
        console.error("Failed to update profile:", response.statusText);
      }

      Loading.remove();
    } catch (error) {
      console.error("Error updating profile:", error);
      Loading.remove();
    }
  };

  const fetchCitiesAll = async () => {
    Loading.pulse();
    const token = GetToken();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cities`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const cityData = await response.json();
      setCitiesAll(cityData);
      Loading.remove();
    } catch (error) {
      console.error("Error fetching all cities:", error);
      Loading.remove();
    }
  };

  const fetchData = async () => {
    Loading.pulse();
    const token = GetToken();
    try {
      // Fetch user data
      const userData = await GetUser();
      if (userId) {
        const userData = await GetUserById(userId);
        userData && setUser(userData)
      } else userData && setUser(userData);

      // Fetch provinces
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/provinces`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const provinceData = await response.json();
      setProvinces(provinceData);

      // Fetch cities for the initial province
      if (userData) fetchCities(userData?.city_id);

      Loading.remove();
    } catch (error) {
      console.error("Error fetching data:", error);
      Loading.remove();
    }
  };

  const handleDeleteEmployee = async (employeeId: any) => {
    const token = GetToken();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${user?.id}/employees/${employeeId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        Notify.success("شغل با موفقیت حذف شد");
        fetchData(); // Assuming fetchData is a function to refetch user data
      } else {
        console.error("Failed to delete employee:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  useEffect(() => {
    fetchCitiesAll();
    fetchData();
  }, []); // Run only on the initial mount

  const fetchCities = async (provinceId: string) => {
    Loading.pulse();
    const token = GetToken();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cities/${provinceId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const cityData = await response.json();
      setCities(cityData);
      Loading.remove();
    } catch (error) {
      console.error("Error fetching cities:", error);
      Loading.remove();
    }
  };

  const handleProvinceChange = (provinceId: string) => {
    setSelectedProvince(provinceId);
    fetchCities(provinceId);
  };

  const handleDeleteEducation = async (educationId: any) => {
    const token = GetToken();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${user?.id}/educations/${educationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        Notify.success(" تحصیلات با موفقیت  حذف شد");
        fetchData();
      } else {
        console.error("Failed to delete education:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting education:", error);
    }
  };

  const handleAddEmployee = async () => {
    // Validate the form fields before submitting

    Loading.pulse();
    const token = GetToken();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${user?.id}/employees`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newEmployee),
        }
      );

      if (response.ok) {
        const newEmployeeData = await response.json();
        // Assuming that the server returns the newly created employee data
        // Update the user's employees array with the new data
        setUser((prevUser) => ({
          ...prevUser!,
          employees: [...prevUser!.employees, newEmployeeData],
        }));

        // Clear the form fields after successful submission
        setNewEmployee({
          company_name: "",
          job_title: "",
          from: "",
          to: "",
          currently_enrolled: false,
          user_id: 0,
        });
        Notify.init({
          width: '300px',
          position: 'left-bottom',
          });
        Notify.success("رکورد شغلی جدید با موفقیت افزوده شد");
      } else {
        Notify.init({
          width: '300px',
          position: 'left-bottom',
          });
        Notify.failure("تاریخ شروع و پایان را انتخاب کنید");
        console.error("Failed to add employee record:", response.statusText);
      }

      Loading.remove();
    } catch (error) {
      Notify.init({
        width: '300px',
        position: 'left-bottom',
        });
      Notify.failure("تاریخ شروع و پایان را انتخاب کنید");
      console.error("Error adding employee record:", error);
      Loading.remove();
    }
  };

  return (
    <div className="p-4">
      {user && (
        <>
          <FileAgentUpload
            image={
              user.information ? `${user?.information.profile_photo_url}` : ""
            }
            onFileChange={(file) => {}}
          />
          <form className="flex flex-row flex-wrap">
            <div className="mb-4  md:w-1/3 w-full px-3">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-600"
              >
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
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-600"
              >
                جنسیت
              </label>
              <select
                id="gender"
                name="gender"
                value={user.gender ?? ""}
                onChange={(e) =>
                  setUser({ ...user, gender: e.target.value as Gender })
                }
                className="mt-1 p-2 w-full border rounded-md"
              >
                <option value="male">آقا</option>
                <option value="female">خانم</option>
              </select>
            </div>

            <div className="mb-4  md:w-1/3 w-full px-3">
              <label
                htmlFor="nationalCode"
                className="block text-sm font-medium text-gray-600"
              >
                کد ملی
              </label>
              <input
                type="text"
                id="nationalCode"
                name="nationalCode"
                value={user.national_code ?? ""}
                onChange={(e) =>
                  setUser({ ...user, national_code: e.target.value })
                }
                className="mt-1 p-2 w-full border rounded-md"
              />
            </div>

            <div className="mb-4  md:w-1/3 w-full px-3">
              <label
                htmlFor="province"
                className="block text-sm font-medium text-gray-600"
              >
                استان
              </label>
              <select
                id="province"
                name="province"
                value={selectedProvince ?? ""}
                onChange={(e) => handleProvinceChange(e.target.value)}
                className="mt-1 p-2 w-full border rounded-md"
              >
                <option value={user.city?.province_id} disabled>
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
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-600"
              >
                شهرستان
              </label>
              <select
                id="city"
                name="city"
                value={user.city_id ?? ""}
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

            <div className="mb-4  md:w-1/3 w-full px-3 flex justify-start items-end">
              <button
                type="button"
                onClick={handleProfileUpdate}
                className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700"
              >
                ذخیره
              </button>
            </div>
          </form>
          <hr />
          <h2 className="p-2 text-xl">تحصیلات</h2>
          <table className="table-auto border-collapse w-[1000px] text-center md:w-full">
            <thead>
              <tr className="border text-blue-800 bg-slate-300">
                <th className="border border-slate-300">شناسه</th>
                <th className="border border-slate-300">سطح تحصیلات</th>
                <th className="border border-slate-300">رشته تحصیلی</th>
                <th className="border border-slate-300">مؤسسه آموزشی</th>
                <th className="border border-slate-300">از تاریخ</th>
                <th className="border border-slate-300">تا تاریخ</th>
                <th className="border border-slate-300">در حال تحصیل</th>
                <th className="border border-slate-300">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {user.educations.map((education) => (
                <tr key={education.id} className="border border-slate-300">
                  <td className="border border-slate-300">{education.id}</td>
                  <td className="border border-slate-300">
                    {
                      educationLevelMapping[
                        education.educational_level as keyof typeof educationLevelMapping
                      ]
                    }
                  </td>
                  <td className="border border-slate-300">
                    {education.field_of_study}
                  </td>
                  <td className="border border-slate-300">
                    {education.educational_institution}
                  </td>
                  <td className="border border-slate-300">
                    {moment(education.from).format("jYYYY-jM-jD")}
                  </td>
                  <td className="border border-slate-300">
                    {moment(education.to).format("jYYYY-jM-jD") ?? "تاکنون"}
                  </td>
                  <td className="border border-slate-300">
                    {education.currently_enrolled ? "بله" : "خیر"}
                  </td>
                  <td className="border border-slate-300">
                    <button
                      onClick={() => handleDeleteEducation(education.id)}
                      className="bg-red-500 text-white p-2 rounded-md hover:bg-red-700"
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">افزودن تحصیلات جدید</h3>
            <form className="flex flex-row flex-wrap">
              {/* Add form fields for new education */}
              <div className="mb-4 md:w-1/3 w-full px-3">
                <label
                  htmlFor="educationalLevel"
                  className="block text-sm font-medium text-gray-600"
                >
                  سطح تحصیلات
                </label>
                <select
                  id="educationalLevel"
                  name="educationalLevel"
                  value={newEducation.educational_level}
                  onChange={(e) =>
                    setNewEducation({
                      ...newEducation,
                      educational_level: e.target.value,
                    })
                  }
                  className="mt-1 p-2 w-full border rounded-md"
                >
                  <option value="">انتخاب سطح تحصیلات</option>
                  {Object.keys(educationLevelMapping).map((level) => (
                    <option key={level} value={level}>
                      {
                        educationLevelMapping[
                          level as keyof typeof educationLevelMapping
                        ]
                      }
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4 md:w-1/3 w-full px-3">
                <label
                  htmlFor="fieldOfStudy"
                  className="block text-sm font-medium text-gray-600"
                >
                  رشته تحصیلی
                </label>
                <input
                  type="text"
                  id="fieldOfStudy"
                  name="fieldOfStudy"
                  value={newEducation.field_of_study}
                  onChange={(e) =>
                    setNewEducation({
                      ...newEducation,
                      field_of_study: e.target.value,
                    })
                  }
                  className="mt-1 p-2 w-full border rounded-md"
                />
              </div>

              <div className="mb-4 md:w-1/3 w-full px-3">
                <label
                  htmlFor="institution"
                  className="block text-sm font-medium text-gray-600"
                >
                  مؤسسه آموزشی
                </label>
                <input
                  type="text"
                  id="institution"
                  name="institution"
                  value={newEducation.educational_institution}
                  onChange={(e) =>
                    setNewEducation({
                      ...newEducation,
                      educational_institution: e.target.value,
                    })
                  }
                  className="mt-1 p-2 w-full border rounded-md"
                />
              </div>

              <div className="mb-4 md:w-1/3 w-full px-3">
                <label
                  htmlFor="fromDate"
                  className="block text-sm font-medium text-gray-600"
                >
                  از تاریخ
                </label>

                <DatePicker
                  className="mt-1 p-2 w-full border rounded-md"
                  onChange={(value: any) =>
                    setNewEducation({
                      ...newEducation,
                      from: moment(value, "jYYYY/jM/jD HH:mm").format(
                        "YYYY-M-D"
                      ),
                    })
                  }
                  value={newEducation.from}
                  dateRenge={{ end: "1420", start: "1371" }}
                />
              </div>

              <div className="mb-4 md:w-1/3 w-full px-3">
                <label
                  htmlFor="toDate"
                  className="block text-sm font-medium text-gray-600"
                >
                  تا تاریخ
                </label>
                <DatePicker
                  className="mt-1 p-2 w-full border rounded-md"
                  onChange={(value: any) =>
                    setNewEducation({
                      ...newEducation,
                      to: moment(value, "jYYYY/jM/jD HH:mm").format("YYYY-M-D"),
                    })
                  }
                  value={newEducation.to}
                  dateRenge={{ end: "1420", start: "1371" }}
                />
              </div>

              <div className="mb-4 md:w-1/3 w-full px-3">
                <label
                  htmlFor="currentlyEnrolled"
                  className="block text-sm font-medium text-gray-600"
                >
                  در حال تحصیل
                </label>
                <select
                  id="currentlyEnrolled"
                  name="currentlyEnrolled"
                  value={newEducation.currently_enrolled ? "true" : "false"}
                  onChange={(e) =>
                    setNewEducation({
                      ...newEducation,
                      currently_enrolled: e.target.value === "true",
                    })
                  }
                  className="mt-1 p-2 w-full border rounded-md"
                >
                  <option value="true">بله</option>
                  <option value="false">خیر</option>
                </select>
              </div>

              <div className="mb-4 md:w-1/3 w-full px-3 flex justify-start items-end">
                <button
                  type="button"
                  onClick={handleAddEducation}
                  className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700"
                >
                  افزودن تحصیلات
                </button>
              </div>
            </form>
          </div>
          <hr />

          <hr />
          <h2 className="p-2 text-xl">سوابق شغلی</h2>
          <table className="table-auto border-collapse w-[1000px] text-center md:w-full">
            <thead>
              <tr className="border text-blue-800 bg-slate-300">
                <th className="border border-slate-300">شناسه</th>
                <th className="border border-slate-300">نام شرکت</th>
                <th className="border border-slate-300">عنوان شغلی</th>
                <th className="border border-slate-300">تاریخ شروع</th>
                <th className="border border-slate-300">تاریخ پایان</th>
                <th className="border border-slate-300">در حال اشتغال</th>
                <th className="border border-slate-300">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {user.employees.map((employee) => (
                <tr key={employee.id} className="border border-slate-300">
                  <td className="border border-slate-300">{employee.id}</td>
                  <td className="border border-slate-300">
                    {employee.company_name}
                  </td>
                  <td className="border border-slate-300">
                    {employee.job_title}
                  </td>
                  <td className="border border-slate-300">
                    {moment(employee.from).format("jYYYY-jM-jD")}
                  </td>
                  <td className="border border-slate-300">
                    {moment(employee.to).format("jYYYY-jM-jD") ?? "تاکنون"}
                  </td>
                  <td className="border border-slate-300">
                    {employee.currently_enrolled ? "بله" : "خیر"}
                  </td>
                  <td className="border border-slate-300">
                    <button
                      onClick={() => handleDeleteEmployee(employee.id)}
                      className="bg-red-500 text-white p-2 rounded-md hover:bg-red-700"
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">افزودن شغل جدید</h3>
            <form className="flex flex-row flex-wrap">
              <div className="mb-4 md:w-1/3 w-full px-3">
                <label
                  htmlFor="companyName"
                  className="block text-sm font-medium text-gray-600"
                >
                  نام شرکت
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={newEmployee.company_name}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      company_name: e.target.value,
                    })
                  }
                  className="mt-1 p-2 w-full border rounded-md"
                />
              </div>

              <div className="mb-4 md:w-1/3 w-full px-3">
                <label
                  htmlFor="jobTitle"
                  className="block text-sm font-medium text-gray-600"
                >
                  عنوان شغلی
                </label>
                <input
                  type="text"
                  id="jobTitle"
                  name="jobTitle"
                  value={newEmployee.job_title}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      job_title: e.target.value,
                    })
                  }
                  className="mt-1 p-2 w-full border rounded-md"
                />
              </div>

              <div className="mb-4 md:w-1/3 w-full px-3">
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-600"
                >
                  تاریخ شروع
                </label>
                <DatePicker
                  className="mt-1 p-2 w-full border rounded-md"
                  onChange={(value: any) =>
                    setNewEmployee({
                      ...newEmployee,
                      from: moment(value, "jYYYY/jM/jD HH:mm").format(
                        "YYYY-M-D"
                      ),
                    })
                  }
                  value={newEmployee.from}
                  dateRenge={{ end: "1420", start: "1371" }}
                />
              </div>

              <div className="mb-4 md:w-1/3 w-full px-3">
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-gray-600"
                >
                  تاریخ پایان
                </label>
                <DatePicker
                  className="mt-1 p-2 w-full border rounded-md"
                  onChange={(value: any) =>
                    setNewEmployee({
                      ...newEmployee,
                      to: moment(value, "jYYYY/jM/jD HH:mm").format("YYYY-M-D"),
                    })
                  }
                  value={newEmployee.to}
                  dateRenge={{ end: "1420", start: "1371" }}
                />
              </div>

              <div className="mb-4 md:w-1/3 w-full px-3">
                <label
                  htmlFor="currentlyEnrolled"
                  className="block text-sm font-medium text-gray-600"
                >
                  در حال اشتغال
                </label>
                <select
                  id="currentlyEnrolled"
                  name="currentlyEnrolled"
                  value={newEmployee.currently_enrolled ? "true" : "false"}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      currently_enrolled: e.target.value === "true",
                    })
                  }
                  className="mt-1 p-2 w-full border rounded-md"
                >
                  <option value="true">بله</option>
                  <option value="false">خیر</option>
                </select>
              </div>

              <div className="mb-4 md:w-1/3 w-full px-3 flex justify-start items-end">
                <button
                  type="button"
                  onClick={handleAddEmployee}
                  className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700"
                >
                  افزودن شغل
                </button>
              </div>
            </form>
          </div>
        </>
      )}
      <AgentCategory agent_id={userId}/>
    </div>
  );
};

export default User;
