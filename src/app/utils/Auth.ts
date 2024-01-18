import { Notify } from "notiflix";
import Education from "../interfaces/Education";
import Employee from "../interfaces/Employee";

interface IUser extends User {
    city: City;
    educations: Education[];
    employees: Employee[];
  }
  interface City {
    // Define your city interface
    id: number;
    name: string;
    province_id: string;
  }

function IsLogin(): boolean {
    const token = GetToken();
    return token ? true : false;
}

function GetToken(): string | boolean {
    if (typeof window !== 'undefined') {
    const token = window.localStorage.getItem("api_token");
    return token ?? false;
    }
    else return false;
}

async function GetUser(): Promise<IUser | undefined> {
    if (IsLogin()) {
        const token = GetToken();
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        if (res.status === 401) {
            localStorage.removeItem('api_token')
        }
        const result = await res.json();
        return result;
    }
}

async function GetUserById(id: string): Promise<IUser | undefined> {
    if (IsLogin()) {
        const token = GetToken();
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        if (res.status === 401) {
            localStorage.removeItem('api_token')
        }
        const result = await res.json();
        return result;
    }
}


async function GetProfileAgent(): Promise<undefined> {
    if (IsLogin()) {
        const token = GetToken();
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/checkProfile`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        
        const result = await res.json();
        if (res.status === 400) {
            Notify.failure(result.error)
        }
    }
}

async function checkRole(): Promise<any> {
    if (IsLogin()) {
        const user = await GetUser();
        return user?.state;
    }
}

async function IsAdmin(): Promise<boolean> {
    if (IsLogin()) {
        const user = await GetUser();
        return user?.role == 'admin';
    }
    else return false;
}

async function IsAgent(): Promise<boolean> {
    if (IsLogin()) {
        const user = await GetUser();
        return user?.role == 'agent';
    }
    else return false;
}

async function IsActiveAgent(): Promise<boolean> {
    if (IsLogin()) {
        const user = await GetUser();
        user?.role == 'agent';
        return user?.information?.is_active === 'active';
    }
    else return false;
}
// async function checkRole(): Promise<User | undefined> {
//     if (IsLogin()) {
//         const token = GetToken();
//         const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/role/set`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`,
//             },
//         });
//         const result = await res.json();
//         return result;
//     }
// }

export { IsLogin, GetUser, GetToken, checkRole, IsAdmin, IsAgent, IsActiveAgent, GetUserById, GetProfileAgent }