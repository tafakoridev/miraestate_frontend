interface Information {
    rate: number;
    profile_photo_url: string;
    is_active: string;
}

interface User {
    created_at: string;
    gender: string | null;
    id: number;
    name: string | null;
    national_code: string | null;
    phonenumber: string;
    role: string;
    state: string;
    city_id: string;
    wallet: string;
    updated_at: string;
    information: Information;
}