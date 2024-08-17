import { useState } from "react";
import axios from "axios";

function CreateItem() {
  const [formData, setFormData] = useState({ id: "", name: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [response, setResponse] = useState("");

  const createItem = (e) => {
    e.preventDefault();
    axios
      .post(process.env.REACT_APP_API_ENDPOINT, formData)
      .then((response) => {
        console.log(response);
        setResponse("User created");
        setErrorMsg(""); // Limpar mensagem de erro em caso de sucesso
      })
      .catch((error) => {
        console.log(error);
        setErrorMsg("Error posting data");
        setResponse(""); // Limpar resposta em caso de erro
      });
  };

  return (
    <div>
      <form onSubmit={createItem} className="space-y-4">
        <div>
          <label
            htmlFor="userId"
            className="block text-sm font-medium text-gray-700"
          >
            User ID
          </label>
          <input
            type="text"
            id="userId"
            value={formData.id}
            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="userName"
            className="block text-sm font-medium text-gray-700"
          >
            User Name
          </label>
          <input
            type="text"
            id="userName"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create User
          </button>
        </div>
      </form>
      {response && <h3 className="text-green-500 mt-4">{response}</h3>}
      {errorMsg && <h3 className="text-red-500 mt-4">{errorMsg}</h3>}
    </div>
  );
}

export default CreateItem;
