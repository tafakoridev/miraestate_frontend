import Slider from 'react-slick';
import AgentBox from './AgentBox';


interface HomeProps {
    users: IUser[];
    choseAgent: any;
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

const Agents: React.FC<HomeProps> = ({ users, choseAgent }) => {
    return (
        <div className="w-full justify-center items-center flex">
            <div className="w-full xl:w-2/3 p-5 bg-gradient-to-l from-blue-100 to-blue-50 rounded-lg shadow-md my-2">
                <Slider
                    dots
                    infinite
                    speed={500}
                    slidesToShow={4}
                    slidesToScroll={2}
                    responsive={[
                        {
                            breakpoint: 1024,
                            settings: {
                                slidesToShow: 2,
                                slidesToScroll: 1,
                                infinite: true,
                                dots: true,

                            },
                        },
                        {
                            breakpoint: 600,
                            settings: {
                                slidesToShow: 1,
                                slidesToScroll: 1,
                                initialSlide: 1,
                            },
                        },
                    ]}

                >
                    {users.map((user: IUser, i) => (
                        <AgentBox key={i} choseAgent={async(id: string) => choseAgent(id)} user={user}  photo={`/assets/ag-${i + 1}.jpg`}/>
                    ))}
                </Slider>
                <br />
            </div>
        </div>
    )
}

export default Agents;