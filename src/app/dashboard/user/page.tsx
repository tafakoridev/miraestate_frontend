"use client";
import { GetToken, IsLogin } from "@/app/utils/Auth";
import { Loading, Notify } from "notiflix";
import { useEffect, useState } from "react";
import moment from "moment-jalaali";
import DatePicker from "persian-react-datepicker";
import { useRouter } from "next/navigation";

function User(props: any) {
    const { userId } = props.searchParams;
    const [user, setUser] = useState<any>(null);
    const [education_new, setEduNew] = useState<any>({
        "educational_level": null,
        "field_of_study": null,
        "educational_institution": null,
        "from": moment().format("jYYYY-jMM-jDD"),
        "to": moment().format("jYYYY-jMM-jDD"),
        "currently_enrolled": false,
        "user_id": userId,
    });

    const router = useRouter()
    const isLogin = IsLogin();
    const [province_id, setProvince] = useState<any>(null);
    const [provinces, setProvinces] = useState<any>([]);
    const [cities, setCities] = useState<any>([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingUserId, setEditingUserId] = useState(null);
    const [editedName, setEditedName] = useState("");


    const handleEdit = (userId: any) => {
        setIsEditing(true);
        setEditingUserId(userId);
    };

    const handleSave = () => {

        Loading.pulse();

        const token = GetToken();
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${editingUserId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ name: editedName }),
        })
            .then((response) => response.json())
            .then((data) => {
                // Handle successful save
                console.log('User name updated:', data);
            })
            .catch((error) => {
                // Handle error
                console.error('Error updating user name:', error);
            })
            .finally(() => {
                setIsEditing(false);
                setEditingUserId(null);
                getUser();
                Loading.remove();
                Notify.init({
                    width: '300px',
                    position: 'left-bottom',
                    });
                Notify.success("ویرایش کاربر اعمال شد")

            });
    };

    async function getProvinces() {
        Loading.pulse();
        const token = GetToken();
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/provinces`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error(`Failed to fetch data: ${res.status}`);
            }

            const result = await res.json();
            console.log(result);

            setProvinces(result);
            setDataLoaded(true);
            Loading.remove();
        } catch (error) {
            console.error(error);
            // Handle error, set an error state, or show an error message
        }
    }

    async function getCities(id: string) {
        setProvince(id);
        Loading.pulse();
        const token = GetToken();
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cities/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error(`Failed to fetch data: ${res.status}`);
            }

            const result = await res.json();

            setCities(result);
            Loading.remove();
        } catch (error) {
            console.error(error);
            // Handle error, set an error state, or show an error message
        }
    }

    async function getUser() {
        Loading.pulse();
        const token = GetToken();
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error(`Failed to fetch data: ${res.status}`);
            }

            const result = await res.json();
            setProvince(result?.city?.province_id);

            getCities(result?.city?.province_id);
            setUser(result);
            setDataLoaded(true);
            Loading.remove();
        } catch (error) {
            console.error(error);
            // Handle error, set an error state, or show an error message
        }
    }

    async function editUser(field: string, user: any, newField: string) {
        Loading.pulse();
        let updatedUser: UpdateUsers;
        user[field] = newField;
        delete user?.created_at;
        delete user?.city;
        delete user?.education;
        delete user?.updated_at;
        updatedUser = user;


        const token = GetToken();
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${user?.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updatedUser)
            });

            if (!res.ok) {
                throw new Error(`Failed to fetch data: ${res.status}`);
            }

            const result = await res.json();
            result && getUser();
            Loading.remove();
            Notify.init({
                width: '300px',
                position: 'left-bottom',
                });
            result && Notify.success("ویرایش کاربر اعمال شد")

        } catch (error) {
            console.error(error);
            // Handle error, set an error state, or show an error message
        }
    }


    async function saveNewEducation() {
        Loading.pulse();
        const token = GetToken();

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/education`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(education_new)
            });

            if (!res.ok) {
                throw new Error(`Failed to fetch data: ${res.status}`);
            }

            const result = await res.json();
            result && getUser();
            Loading.remove();
            Notify.init({
                width: '300px',
                position: 'left-bottom',
                });
            result && Notify.success("ویرایش تحصیلات کاربر اعمال شد")
            setEduNew({
                "educational_level": null,
                "field_of_study": null,
                "educational_institution": null,
                "from": moment().format("jYYYY-jMM-jDD"),
                "to": moment().format("jYYYY-jMM-jDD"),
                "currently_enrolled": false,
                "user_id": userId,
            })
        } catch (error) {
            console.error(error);
            // Handle error, set an error state, or show an error message
        }
    }



    useEffect(() => {
        if(isLogin === false)
        router.push('/login')
        else if (!dataLoaded) {
            getUser();
            getProvinces();
        }
    }, [dataLoaded]);
    return (
        <div>
            <h2 className="font-bold text-lg">{user?.name}</h2>
            <table className="table-auto border-collapse w-[1000px] text-center md:w-full">
                <thead className=" top-[-20px]">
                    <tr>
                        <th className="border text-blue-800 bg-slate-300 h-[40px]">فیلد</th>
                        <th className="border text-blue-800 bg-slate-300 h-[40px]">عنوان</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td></td>
                        <td></td>
                    </tr>

                    {user &&
                        <>
                            <tr>
                                <td className="border border-slate-300 h-[40px]">نام</td>
                                <td className="border border-slate-300 h-[40px]" onClick={() => handleEdit(user?.id)}>
                                    {isEditing && editingUserId === user?.id ? (
                                        <input
                                            type="text"
                                            value={editedName}
                                            className="text-center bg-gray-200"
                                            onChange={(e) => setEditedName(e.target.value)}
                                            onBlur={handleSave}
                                        />
                                    ) : (
                                        user?.name
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-slate-300 h-[40px]">شماره موبایل</td>
                                <td className="border border-slate-300 h-[40px]">
                                    {user?.phonenumber}
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-slate-300 h-[40px]">نقش</td>
                                <td className="border border-slate-300 h-[40px]">
                                    <select value={user?.role} onChange={e => editUser('role', user, e.target.value)} className="w-[150px]">
                                        <option value="admin">ادمین</option>
                                        <option value="agent">کارشناس</option>
                                        <option value="customer">مشتری</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-slate-300 h-[40px]">
                                    استان
                                </td>
                                <td className="border border-slate-300 h-[40px]">
                                    <select value={province_id} onChange={e => getCities(e.target.value)}>
                                        {
                                            provinces.length > 0 && provinces.map((province: any, j: number) =>

                                                <option key={j} value={province.id}>{province.name}</option>

                                            )}
                                    </select>
                                </td>

                            </tr>
                            <tr>
                                <td className="border border-slate-300 h-[40px]">
                                    شهر
                                </td>
                                <td className="border border-slate-300 h-[40px]">
                                    <select className="w-[150px]" value={user?.city_id} onChange={e => editUser('city_id', user, e.target.value)}>
                                        {
                                            cities.length > 0 && cities.map((city: any, j: number) =>

                                                <option key={j} value={city.id}>{city.name}</option>

                                            )}
                                    </select>
                                </td>

                            </tr>
                  
                            <tr>
                                <td className="border border-slate-300 h-[40px]">
                                    وضعیت
                                </td>
                                <td className="border border-slate-300 h-[40px]">
                                    <select className="w-[150px]" value={user?.state} onChange={e => editUser('state', user, e.target.value)}>
                                        <option value="enabled">فعال</option>
                                        <option value="disabled">غیرفعال</option>
                                    </select>
                                </td>

                            </tr>
                        </>
                    }
                </tbody>
            </table>
            <br />
            <h2 className="font-bold text-lg">تحصیلات</h2>
            <table className="table-auto border-collapse w-[1000px] text-center md:w-full">
                <thead className=" top-[-20px]">

                    <tr>
                        <th className="border text-blue-800 bg-slate-300 h-[40px]">#</th>
                        <th className="border text-blue-800 bg-slate-300 h-[40px]">مدرک تحصیلی</th>
                        <th className="border text-blue-800 bg-slate-300 h-[40px]">رشته تحصیلی</th>
                        <th className="border text-blue-800 bg-slate-300 h-[40px]">دانشگاه محل تحصیل</th>
                        <th className="border text-blue-800 bg-slate-300 h-[40px]">از تاریخ</th>
                        <th className="border text-blue-800 bg-slate-300 h-[40px]">تا تاریخ</th>
                        <th className="border text-blue-800 bg-slate-300 h-[40px]">مشغول تحصیل</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    {user?.education && user.education.map((edu: any, k: any) => (
                        <tr key={k + edu.id}>
                            <td className="border border-slate-300 h-[40px]">{k + 1}</td>
                            <td className="border border-slate-300 h-[40px]">
                                <select disabled value={edu.education_level} onChange={e => editUser('state', user, e.target.value)}>
                                    <option value="under_diploma">زیر دیپلم</option>
                                    <option value="diploma">دیپلم</option>
                                    <option value="over_diploma">فوق دیپلم</option>
                                    <option value="branch">لیسانس</option>
                                    <option value="master">فوق لیسانس</option>
                                    <option value="phd">دکتری</option>
                                </select>
                            </td>
                            <td className="border border-slate-300 h-[40px]">
                                {edu.field_of_study}
                            </td>
                            <td className="border border-slate-300 h-[40px]">
                                {edu.educational_institution}
                            </td>
                            <td className="border border-slate-300 h-[40px]">
                                {moment(edu.from).format('jYYYY-jM-jD')}
                            </td>
                            <td className="border border-slate-300 h-[40px]">
                                {moment(edu.to).format('jYYYY-jM-jD')}
                            </td>
                            <td className="border border-slate-300 h-[40px]">
                                <input type="checkbox" checked={edu.currently_enrolled} />
                            </td>

                        </tr>
                    )
                    )}

                    <tr className="bg-green-50">
                        <td className="border border-slate-300 h-[40px]">جدید</td>
                        <td className="border border-slate-300 h-[40px]">
                            <select value={education_new.educational_level} onChange={e => setEduNew((prevUserData: any) => ({
                                ...prevUserData,
                                educational_level: e.target.value
                            }))}>
                                <option value="under_diploma">زیر دیپلم</option>
                                <option value="diploma">دیپلم</option>
                                <option value="over_diploma">فوق دیپلم</option>
                                <option value="branch">لیسانس</option>
                                <option value="master">فوق لیسانس</option>
                                <option value="phd">دکتری</option>
                            </select>
                        </td>
                        <td className="border border-slate-300 h-[40px]">
                            <input type="text" value={education_new.field_of_study} onChange={e => setEduNew((prevUserData: any) => ({
                                ...prevUserData,
                                field_of_study: e.target.value
                            }))} />
                        </td>
                        <td className="border border-slate-300 h-[40px]">
                            <input type="text" value={education_new.educational_institution} onChange={e => setEduNew((prevUserData: any) => ({
                                ...prevUserData,
                                educational_institution: e.target.value
                            }))} />
                        </td>
                        <td className="border border-slate-300 h-[40px]">
                            <DatePicker onChange={(value: any) => setEduNew((prevUserData: any) => ({
                                ...prevUserData,
                                from: moment(value, 'jYYYY/jM/jD HH:mm').format('YYYY-M-D')
                            }))} value={education_new.from} />
                        </td>
                        <td className="border border-slate-300 h-[40px]">
                            <DatePicker onChange={(value: any) => setEduNew((prevUserData: any) => ({
                                ...prevUserData,
                                to: moment(value, 'jYYYY/jM/jD HH:mm').format('YYYY-M-D')
                            }))} value={education_new.to} />

                        </td>
                        <td className="border border-slate-300 h-[40px]">
                            <input type="checkbox" onChange={(e: any) => setEduNew((prevUserData: any) => ({
                                ...prevUserData,
                                currently_enrolled: e.target.checked
                            }))} checked={education_new.currently_enrolled} />
                        </td>
                        <td className="border border-slate-300 h-[40px]">
                            <button onClick={saveNewEducation} className="bg-blue-400 aspect-square w-10 h-10 m-1 rounded-full text-white font-bold text-2xl shadow border-2 border-gray-300">
                                +
                            </button>
                        </td>

                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default User;