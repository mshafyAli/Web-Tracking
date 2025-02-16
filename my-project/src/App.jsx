import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import AcdemiansComUk from "./Pages/AcdemiansCoUk";
import TheAcdemiansCoUk from "./Pages/TheAcdemiansCoUk";
import APW from "./Pages/APW";
import BPW from "./Pages/BPW";
import THA from "./Pages/THA";
import TA from "./Pages/TA";
import { ToastContainer } from "react-toastify";
import Login from "./Components/Login";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/academians.co.uk" element={<AcdemiansComUk />} />
        <Route path="/the-academians.co.uk" element={<TheAcdemiansCoUk />} />
        <Route path="/aussiephdwriter.com.au" element={<APW />} />
        <Route path="/britishphdwriters.co.uk" element={<BPW />} />
        <Route path="/the-academians.au" element={<THA />} />
        <Route path="/the-academians.uk" element={<TA />} />
      <Route path="/login" element={<Login />} />

       
      </Routes>
      <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
    </>
  );
}

export default App;
