"use client";
import { GetToken, IsLogin } from "@/app/utils/Auth";
import { Loading, Notify } from "notiflix";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'
function Users() {
    const [users, setUsers] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingUserId, setEditingUserId] = useState(null);
    const [editedName, setEditedName] = useState("");
    const router = useRouter()
    const isLogin = IsLogin();

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
            getUsers();
            Loading.remove();
            Notify.init({
                width: '300px',
                position: 'left-bottom',
                });
            Notify.success("ویرایش کاربر اعمال شد")

          });
      };

      
    async function getUsers() {
        Loading.pulse();
        const token = GetToken();
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`, {
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
            setUsers(result);
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
        delete user.created_at;
        delete user.updated_at;
        updatedUser = user;


        const token = GetToken();
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${user.id}`, {
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
            result && getUsers();
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

    

    useEffect(() => {
        if(isLogin === false)
        router.push('/login')
        else if (!dataLoaded) {
            getUsers();
        }
    }, [dataLoaded]);
    return (
        <div>
            <table className="table-auto border-collapse w-[1000px] text-center md:w-full">
                <thead className=" top-[-20px]">
                    <tr>
                        <th className="border text-blue-800 bg-slate-300">#</th>
                        <th className="border text-blue-800 bg-slate-300">نام</th>
                        <th className="border text-blue-800 bg-slate-300"></th>
                        <th className="border text-blue-800 bg-slate-300">نقش</th>
                        <th className="border text-blue-800 bg-slate-300">وضعیت</th>
                        <th className="border text-blue-800 bg-slate-300">بیشتر</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>

                    {users.length > 0 && users.map((user: User, i) => (
                        <tr key={i}>
                            <td className="border border-slate-300">{user.id}</td>
                            <td className="border border-slate-300 text-center" onClick={() => handleEdit(user.id)}>
                                {isEditing && editingUserId === user.id ? (
                                    <input
                                        type="text"
                                        value={editedName}
                                        className="text-center bg-gray-200"
                                        onChange={(e) => setEditedName(e.target.value)}
                                        onBlur={handleSave}
                                    />
                                ) : (
                                    user.name
                                )}
                            </td>
                            <td className="border border-slate-300">
                                {user.phonenumber}
                            </td>
                            <td className="border border-slate-300">
                                <select value={user.role} onChange={e => editUser('role', user, e.target.value)}>
                                    <option value="admin">ادمین</option>
                                    <option value="agent">کارشناس</option>
                                    <option value="customer">مشتری</option>
                                </select>
                            </td>
                            <td className="border border-slate-300">
                                <select value={user.state} onChange={e => editUser('state', user, e.target.value)}>
                                    <option value="enabled">فعال</option>
                                    <option value="disabled">غیرفعال</option>
                                </select>
                            </td>
                            <td className="border border-slate-300">
                                <button onClick={() => router.push(`/dashboard/user?userId=${user.id}`)} className="bg-blue-400 aspect-square w-10 h-10 m-1 rounded-full text-white font-bold text-2xl shadow border-2 border-gray-300">
                                    +
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>
        </div>
    )
}

export default Users;