function Phonenumber({ SetPhonenumber, Submit }: any) {
    return (
        <div>
            <div className="mb-4">
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-600 text-start mb-2">شماره موبایل</label>
                <input type="text" id="phoneNumber" inputMode="decimal" placeholder="09123456789" onChange={e => SetPhonenumber(e.target.value)} className="mt-1 p-2 pt-3 w-full border rounded-md" />
            </div>

            <button className="bg-blue-800 hover:bg-blue-600 text-white p-2 rounded-md w-full transition-colors" onClick={Submit}>ورود</button>
        </div>
    )
}

export default Phonenumber;