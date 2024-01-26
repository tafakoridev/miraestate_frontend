import { useState } from "react";
import AuctionStep1 from "./AuctionStep1";
import AuctionStep2 from "./AuctionStep2";
import AuctionStep3 from "./AuctionStep3";
import AuctionStep4 from "./AuctionStep4";
import AuctionStep5 from "./AuctionStep5";
import { Loading, Notify } from "notiflix";
import { GetToken } from "@/app/utils/Auth";
import { useRouter } from "next/navigation";

interface FormData {
  category_id: number;
  title: string;
  description: string;
  address: string;
  fields: string;
  dates: Dates;
  price: number;
  city_id: number;
  agent_id: number | null;
  picture: File | null;
}

interface S1BKP {
  selected: string;
  selected2: string;
  selected3: string;
}

interface S2BKP {
  // selectedProvince: string;
  // selectedCity: string;
  address: string;
}

interface Field {
  title: string;
  value: string;
}

interface Dates {
  start: string;
  end: string;
}

function AuctionCmp() {
  const [S1BKP, setS1BKP] = useState<S1BKP>({
    selected: "",
    selected2: "",
    selected3: "",
  });
  const [S2BKP, setS2BKP] = useState<S2BKP>({
    // selectedCity: "0",
    // selectedProvince: "0",
    address: "",
  });
  const [S3BKP, setS3BKP] = useState({});
  const [S4BKP, setS4BKP] = useState({});
  const [S5BKP, setS5BKP] = useState({});

  const [category_id, setCategoryId] = useState("0");
  // const [city_id, setCityId] = useState("0");
  const [address, setAddress] = useState("");
  const [title, setTitle] = useState("");
  const [fields, setFields] = useState<Field[]>();
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [files, SetFiles] = useState<File[]>([]);
  const [dates, setDates] = useState<Dates>({
    start: "",
    end: "",
  });
  const [formData, setFormData] = useState<FormData>({
    category_id: 0,
    title: "",
    dates: {start: "", end:""},
    description: "",
    address: "",
    fields: "",
    price: 0,
    city_id: 0,
    agent_id: null,
    picture: null,
  });
  const router = useRouter();

  const handleSubmit = async () => {
    const token = GetToken();

    Loading.pulse();
    try {
      const formObject = new FormData();
      formObject.append("category_id", category_id);
      formObject.append("title", title);
      formObject.append("description", description);
      formObject.append("price", price);
      formObject.append("address", address);
      formObject.append("start", dates.start);
      formObject.append("end", dates.end);
      formObject.append("fields", JSON.stringify(fields));
      if (files?.length > 0) {
        files.forEach((file, index) => {
          // Append each file with a unique name or handle filenames as needed
          formObject.append(`pictures[${index}]`, file);
        });
      }

      // Post new commodity with the specified data
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auctions`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formObject,
        }
      );

      if (response.ok) {
        Loading.remove();
        Notify.init({
          position: "left-bottom",
        });
        const responseData = await response.json();
        if (responseData.error) {
          Notify.failure(responseData.error);
          return;
        }

        Notify.success("پرداخت با موفقیت انجام شد");
        Notify.success(responseData.success);
        setTimeout(() => router.push("/dashboard/auctions/list"), 1000);
      } else {
        console.error("Failed to create Auctions:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating Auctions:", error);
    }
  };

  const [step, setStep] = useState(1);
  return (
    <div className="lg:w-1/3 w-full">
      {step === 1 && (
        <AuctionStep1
          bkp={S1BKP}
          setBKP={(bkp: S1BKP) => setS1BKP(bkp)}
          setCategoryId={(category_id: string) => setCategoryId(category_id)}
          nextStep={() => setStep(step + 1)}
          title="دسته بندی مورد نظر را انتخاب کنید"
        />
      )}
      {step === 2 && (
        <AuctionStep2
        bkp={S2BKP}
        setBKP={(bkp: S2BKP) => setS2BKP(bkp)}
          // setCityId={(city_id: string) => setCityId(city_id)}
          setAddress={(address: string) => setAddress(address)}
          previousStep={() => setStep(1)}
          nextStep={() => setStep(3)}
          title=" آدرس مورد نظر را وارد کنید"
        />
      )}
      {step === 3 && (
        <AuctionStep3
          setItems={(title: string, description: string, price: string, dates: Dates, fields: Field[]) => {
            setTitle(title);
            setFields(fields);
            setDescription(description);
            setPrice(price);
            
            setDates(dates);
          }}
          category_id={category_id}
          previousStep={() => setStep(2)}
          nextStep={() => setStep(4)}
          title="عنوان و توضیحات را وارد کنید"
        />
      )}
      {step === 4 && (
        <AuctionStep4
          setItems={(files: File[]) => {
            SetFiles(files);
          }}
          previousStep={() => setStep(3)}
          nextStep={() => setStep(5)}
          title="تصویر مرتبط را بارگذاری کنید"
        />
      )}
      {step === 5 && (
        <AuctionStep5
          previousStep={() => setStep(4)}
          nextStep={handleSubmit}
          title="صورت حساب"
        />
      )}
    </div>
  );
}

export default AuctionCmp;
