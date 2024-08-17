import CreateItem from "./components/CreateItem";
import GetItems from "./components/GetItems";
import GetItemById from "./components/GetItemById";

function App() {
  return (
    <div className="text-center mt-16 font-sans text-gray-800">
      <div className="flex justify-center mb-6">
        <img src="./logo.png" alt="logo" className="w-1/6" />
      </div>
      <h2 className="text-2xl mb-4">Hi, I Am SAM</h2>
      <hr className="my-4" />
      <h3 className="text-xl mb-2">Create User</h3>
      <CreateItem className="block m-2 justify-start" />
      <hr className="my-4" />
      <h3 className="text-xl mb-2">Get User By ID</h3>
      <GetItemById className="block m-2 justify-start" />
      <hr className="my-4" />
      <h3 className="text-xl mb-2">Get All Users</h3>
      <GetItems className="block m-2 justify-start" />
    </div>
  );
}

export default App;
