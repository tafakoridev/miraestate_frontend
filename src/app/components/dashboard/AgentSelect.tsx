// Modal.tsx
import { useState } from "react";
import { Loading, Notify } from "notiflix";
import { GetToken } from "@/app/utils/Auth";
import { useEffect } from "react";
interface ModalProps {
  onClose: () => void;
  type: string;
  id: string;
}

const AgentSelect: React.FC<ModalProps> = ({ onClose, type, id }) => {
  const [agent_id, setagent_id] = useState("");
  const [agents, setAgents] = useState([]);
console.log(agent_id);


  const handleSubmit = async () => {
    const token = GetToken();
    Loading.pulse();

    try {
      // Send request to /users/agents/desk with agent_id and token
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/agents/setagent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ agent_id, type, id }),
        }
      );

      if (response.ok) {
        Loading.remove();
        Notify.init({
          width: "300px",
          position: "left-bottom",
        });
        Notify.success("کارشناس با موفقیت انتخاب شد");
      
        onClose(); // Close the modal after successfully sending the agent_id
      } else {
        console.error("Failed to send agent_id:", response.statusText);
      }
    } catch (error) {
      console.error("Error sending agent_id:", error);
    }
  };

  useEffect(() => {
    async function getAgents() {
      try {
        // Send request to /users/agents/desk with agent_id and token
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/agents/list`,
          {
            headers: {
              "Content-Type": "application/json",
            },
           
          }
        );

        const data = await response.json();

        setAgents(data);
        if (response.ok) {
          Loading.remove();
        } else {
          console.error("Failed to send agent_id:", response.statusText);
        }
      } catch (error) {
        console.error("Error sending agent_id:", error);
      }
    }
    getAgents();
  }, []);


  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4">انتخاب کارشناس</h2>
        <select
            name="agent_id"
            value={agent_id}
            onChange={(e) => setagent_id(e.target.value)}
            className="my-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="" disabled>
              انتخاب کارشناس
            </option>
            {agents.map((agent: User) => (
              <option key={agent.id} value={agent.id}>
                {agent.name} - {agent.phonenumber}
              </option>
            ))}
          </select>
        <div className="flex justify-between">
          <button
            className="my-2 float-left text-white bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-gray-300 dark:focus:ring-gray-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
            onClick={onClose}
          >
            انصراف
          </button>
          <button
            className="my-2 float-left text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
            onClick={handleSubmit}
          >
            ارسال
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentSelect;
