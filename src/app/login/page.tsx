"use client";
import Image from "next/image";
import Phonenumber from "../components/login/phonenumber";
import Otp from "../components/login/Otp";
import { useState } from "react";
import { useRouter } from 'next/navigation'
import { checkRole } from "../utils/Auth";
import SetRole from "../components/login/SetRole";
const LoginPage = () => {


  const router = useRouter()

  const [phonenumber, SetPhonenumber] = useState("");
  const [is_otp, SetIsOtp] = useState(false);
  const [hasRoleUser, SetHasRoleUser] = useState(true);
  async function LoginRequest() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'API-Key': `${process.env.DATA_API_KEY}`,
      },
      body: JSON.stringify({ phonenumber }),
    });
    const result = await res.json();
    result && SetIsOtp(result.retval);
  }

  async function CheckCodeRequest(code: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/checkcode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'API-Key': `${process.env.DATA_API_KEY}`,
      },
      body: JSON.stringify({ code, phonenumber }),
    });
    const result = await res.json();

    if (result && result.retval) {
      localStorage.setItem("api_token", result.token);
      const hasRole = await checkRole();
      if (hasRole === 'disabled')
        SetHasRoleUser(false);
      else
        router.push('/dashboard', { scroll: false })
    }
    else {
      alert("ERROR")
    }
  }


  return (
    <>
      {!hasRoleUser && <SetRole onClose={() => {
        SetHasRoleUser(true)
        router.push('/dashboard', { scroll: false })
       }} />}
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md mx-2">

        <div className="flex items-center justify-center mb-4 flex-col">
          <Image src="/assets/mira_logo.png" alt="mirima logo" width={318} height={647} className="w-1/2" />
          <span className="text-2xl font-bold text-blue-800">Mirima Estate</span>
        </div>
        {
          is_otp
            ? <Otp SetCode={(code: string) => SetPhonenumber(code)} Submit={(code: string) => CheckCodeRequest(code)} />
            : <Phonenumber SetPhonenumber={(phonenumber: string) => SetPhonenumber(phonenumber)} Submit={LoginRequest} />
        }


      </div>
    </>
  );
};

export default LoginPage;
