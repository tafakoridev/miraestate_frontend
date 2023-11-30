import { useRef } from "react";

function Otp({ SetCode, Submit }: any) {
    const digits = [
        useRef<HTMLInputElement | null>(null),
        useRef<HTMLInputElement | null>(null),
        useRef<HTMLInputElement | null>(null),
        useRef<HTMLInputElement | null>(null)
    ];

    function joinDigits(digitNumber: number) {
        const d1 = digits[0].current?.value;
        const d2 = digits[1].current?.value;
        const d3 = digits[2].current?.value;
        const d4 = digits[3].current?.value;
        const code = `${d1}${d2}${d3}${d4}`;
        let nextDigit;
        if (digitNumber < 3) {
            nextDigit = digitNumber + 1;
            digits[nextDigit].current?.focus();
        }

        if (digitNumber == 3)
            Submit(code);
    }

    return (
        <div>
            <div className="mb-4">
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-600 text-start mb-2">کد دریافتی</label>
                <div className="flex gap-4 mb-4 justify-center">
                    <input type="text" className="w-1/6 p-2 text-center border rounded-md aspect-square" maxLength={1} onChange={() => joinDigits(3)} ref={digits[3]} />
                    <input type="text" className="w-1/6 p-2 text-center border rounded-md aspect-square" maxLength={1} onChange={() => joinDigits(2)} ref={digits[2]} />
                    <input type="text" className="w-1/6 p-2 text-center border rounded-md aspect-square" maxLength={1} onChange={() => joinDigits(1)} ref={digits[1]} />
                    <input type="text" className="w-1/6 p-2 text-center border rounded-md aspect-square" maxLength={1} onChange={() => joinDigits(0)} ref={digits[0]} />
                </div>
            </div>

            <button className="bg-blue-800 hover:bg-blue-600 text-white p-2 rounded-md w-full transition-colors">ارسال</button>
        </div>
    )
}

export default Otp;