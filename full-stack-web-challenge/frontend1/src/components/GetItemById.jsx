import React, { useState } from "react";
import axios from "axios";

function GetItemById() {
  const [user, setUser] = useState({ id: "", name: "" });
  const [formData, setFormData] = useState({ userId: "" });
  const [errorMsg, setErrorMsg] = useState("");

  const getItemsById = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_ENDPOINT}${formData.userId}`
      );
      setUser(response.data);
      setErrorMsg("");
    } catch (error) {
      console.error(error);
      setErrorMsg("Error retrieving data");
    }
  };

  return (
    <div>
      <form onSubmit={getItemsById}>
        <div className="mb-4">
          <label
            htmlFor="userId"
            className="block text-sm font-medium text-gray-700"
          >
            User ID
          </label>
          <input
            type="text"
            id="userId"
            value={formData.userId}
            onChange={(e) =>
              setFormData({ ...formData, userId: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Get User
          </button>
        </div>
      </form>
      {user.id && (
        <h3 className="mt-4 text-lg font-medium">
          {user.id} . {user.name}
        </h3>
      )}
      {errorMsg && <h3 className="mt-4 text-red-600">{errorMsg}</h3>}
    </div>
  );
}

export default GetItemById;
