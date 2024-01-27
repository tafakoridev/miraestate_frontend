import { useState } from "react";
import ExpertStep1 from "./ExpertStep1";
import ExpertStep2 from "./ExpertStep2";
import ExpertStep3 from "./ExpertStep3";
import ExpertStep4 from "./ExpertStep4";
import { Loading, Notify } from "notiflix";
import { GetToken } from "@/app/utils/Auth";
import { useRouter } from "next/navigation";
import ExpertStep5 from "./ExpertStep5";
import ExpertStep6 from "./ExpertStep6";

interface FormData {
  category_id: number;
  title: string;
  description: string;
  price: number;
  local: boolean;
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
  selectedProvince: string;
  selectedCity: string;
}

interface Field {
  title: string;
  value: string;
}


function ExpertCmp() {
  const [S1BKP, setS1BKP] = useState<S1BKP>({
    selected: "",
    selected2: "",
    selected3: "",
  });
  const [S2BKP, setS2BKP] = useState<S2BKP>({
    selectedCity: "0",
    selectedProvince: "0",
  });
  const [S3BKP, setS3BKP] = useState({});
  const [S4BKP, setS4BKP] = useState({});
  const [S5BKP, setS5BKP] = useState({});

  const [category_id, setCategoryId] = useState("0");
  const [city_id, setCityId] = useState("0");
  const [title, setTitle] = useState("");
  const [local, setLocal] = useState(0);
  const [fields, setFields] = useState<Field[]>();
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [files, SetFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState<FormData>({
    category_id: 0,
    title: "",
    description: "",
    price: 0,
    local: false,
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
      formObject.append("city_id", city_id);
      formObject.append("local", String(local));
      formObject.append("fields", JSON.stringify(fields));
      if (files?.length > 0) {
        files.forEach((file, index) => {
          // Append each file with a unique name or handle filenames as needed
          formObject.append(`pictures[${index}]`, file);
        });
      }

      // Post new commodity with the specified data
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/commodities/store/ex`,
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
        setTimeout(() => router.push("/dashboard/clientcartable"), 1000);
      } else {
        console.error("Failed to create commodity:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating commodity:", error);
    }
  };

  const [step, setStep] = useState(1);
  return (
    <div className="lg:w-1/3 w-full">
      {step === 1 && (
        <ExpertStep1
          bkp={S1BKP}
          setBKP={(bkp: S1BKP) => setS1BKP(bkp)}
          setCategoryId={(category_id: string) => setCategoryId(category_id)}
          nextStep={() => setStep(step + 1)}
          title="دسته بندی مورد نظر را انتخاب کنید"
        />
      )}
      {step === 2 && (
        <ExpertStep2
        bkp={S2BKP}
        setBKP={(bkp: S2BKP) => setS2BKP(bkp)}
          setCityId={(city_id: string) => setCityId(city_id)}
          previousStep={() => setStep(1)}
          nextStep={() => setStep(3)}
          title=" شهر مورد نظر را انتخاب کنید"
        />
      )}
      {step === 3 && (
        <ExpertStep3
          setItems={(title: string, description: string, price: string, fields: Field[]) => {
            setTitle(title);
            setFields(fields);
            setDescription(description);
            setPrice(price);
          }}
          category_id={category_id}
          previousStep={() => setStep(2)}
          nextStep={() => setStep(4)}
          title="عنوان و توضیحات را وارد کنید"
        />
      )}
      {step === 4 && (
        <ExpertStep4
          setItems={(files: File[]) => {
            SetFiles(files);
          }}
          previousStep={() => setStep(3)}
          nextStep={() => setStep(5)}
          title="تصویر مرتبط را بارگذاری کنید"
        />
      )}
      {step === 5 && (
        <ExpertStep5
          previousStep={() => setStep(4)}
          nextStep={() => setStep(6)}
          submit={(local: number) => setLocal(local)}
          title="کارشناس در محل"
        />
      )}
      {step === 6 && (
        <ExpertStep6
          previousStep={() => setStep(5)}
          nextStep={handleSubmit}
          categoryId={category_id}
          title="صورت حساب"
        />
      )}
    </div>
  );
}

export default ExpertCmp;
