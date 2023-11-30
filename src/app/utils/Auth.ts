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

async function GetUser(): Promise<User | undefined> {
    if (IsLogin()) {
        const token = GetToken();
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        const result = await res.json();
        return result;
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

export { IsLogin, GetUser, GetToken, checkRole, IsAdmin, IsAgent }