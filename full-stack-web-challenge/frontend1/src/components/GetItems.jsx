import React, { useState } from "react";
import axios from "axios";

function GetItems() {
  const [users, setUsers] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  const getItems = () => {
    axios
      .get(process.env.REACT_APP_API_ENDPOINT)
      .then((response) => {
        console.log(response);
        setUsers(response.data);
      })
      .catch((error) => {
        console.log(error);
        setErrorMsg("Error retrieving data");
      });
  };

  return (
    <div>
      <button
        onClick={getItems}
        className="px-4 py-2 bg-blue-500 text-white rounded mb-4"
      >
        Get User
      </button>
      {users.map((user) => (
        <div key={user.id} className="mb-2">
          <h4>
            {user.id} || {user.name}
          </h4>
        </div>
      ))}
      {errorMsg && <h3 className="text-red-500">{errorMsg}</h3>}
    </div>
  );
}

export default GetItems;
