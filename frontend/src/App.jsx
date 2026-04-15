import AppRouter from "./router/AppRouter";
import { ToastContainer, Bounce } from "react-toastify";
import axios from "axios";
function App() {
  // axios.defaults.baseURL = "http://localhost:8000"
  return (

    //hellooo
    <div>
      <AppRouter />
      <ToastContainer
        position="top-center"
        autoClose={500}
        hideProgressBar={true}
        closeButton={false}
        newestOnTop
        draggable={false}
        icon={false}
        pauseOnHover={false}
        toastClassName={() =>
          "bg-[#3a3f5a] text-white text-sm px-5 py-2.5 rounded-md text-center w-fit mx-auto"
        }
        bodyClassName="p-0 m-0"
      />
    </div>
  );
}

export default App;
