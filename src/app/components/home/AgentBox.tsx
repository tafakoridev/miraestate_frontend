import Image from "next/image";


interface AgentBoxProps {
    user: IUser;
    photo: string;
    choseAgent:any;
}

interface IUser {
    created_at: string;
    gender: string | null;
    id: number;
    name: string | null;
    national_code: string | null;
    phonenumber: string;
    role: string;
    state: string;
    updated_at: string;
    department_expertises: IAgentExpertise[];
    category_expertises: IAgentExpertise[];
}

interface Field {
    title: string;
}

interface IAgentExpertise {
    id: number;
    expertiese_id: number;
    field_id: number;
    field_type: string;
    // Add other columns as needed
    created_at: string;
    updated_at: string;
    field: Field;
}

const AgentBox: React.FC<AgentBoxProps> = ({ user, photo,choseAgent }) => {
    return (
        <div key={user.id} className="max-w-sm mx-4 my-4 bg-white shadow-md rounded-md overflow-hidden aspect-square flex justify-center items-center">
            {/* Uncomment the following line when you have the user's photo */}
            <div className="p-4 flex justify-between item-center flex-wrap">
                <div className="w-full">
                    <h3 className="text-md text-center font-semibold">{user.name}</h3>
                </div>
                <div className="w-full h-1/4">
                    <Image src={photo} alt={`${user.name}`} width={300} height={300} className="h-48 md:h-36 rounded-md w-full object-cover object-top" />
                </div>
                <div className="w-full text-right">
                    <h3 className="text-sm">متخصص در</h3>
                    <p className="text-gray-600 text-xs">
                        {user.department_expertises.map((el, i) => i < 2 && (<span key={el.id}>{el.field.title} - </span>))}
                        {user.category_expertises.map((el, i) => i < 2 && (<span key={el.id}>{el.field.title} - </span>))}
                    </p>
                </div>
                <div className="w-full flex justify-center">
                    <button
                        onClick={async() => {
                            choseAgent(user.id)
                        }}
                        className="my-2 float-left text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-1.5 text-center"
                    >
                        مشاهده پروفایل
                    </button>
                </div>



            </div>
        </div>
    );
};

export default AgentBox;
