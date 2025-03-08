// import { Routes, Route } from "react-router-dom";
// import Home from "./Pages/Home";
// import AcdemiansComUk from "./Pages/AcdemiansCoUk";
// import TA from "./Pages/TA";
// import { ToastContainer } from "react-toastify";
// import Login from "./Components/Login";
// import { useDispatch, useSelector } from "react-redux";
// import CheckAuth from "./Components/common/check-auth";
// function App() {
//   const {user,isAuthenticated,isLoading} = useSelector((state)=>state.auth)
//   const dispatch = useDispatch();

//   return (
//     <>
//       <Routes>
        
//         <Route
//           path="/"
//           element={
//             <CheckAuth
//               isAuthenticated={isAuthenticated}
//               user={user}
//             ></CheckAuth>
//           }
//         />
//         <Route path="/home" element={<Home />} />
//         <Route path="/academians.co.uk" element={<AcdemiansComUk />} />
//         <Route path="/the-academians.uk" element={<TA />} />
//       <Route path="/login" element={<Login />} />

       
//       </Routes>
//       <ToastContainer
//           position="bottom-center"
//           autoClose={5000}
//           hideProgressBar={false}
//           newestOnTop={false}
//           closeOnClick
//           rtl={false}
//           pauseOnFocusLoss
//           draggable
//           pauseOnHover
//           theme="light"
//         />
//     </>
//   );
// }

// export default App;


import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CheckAuth from "./Components/common/check-auth";
import Home from "./Pages/Home";
import AcdemiansComUk from "./Pages/AcdemiansCoUk";
import TA from "./Pages/TA";
import { checkAuth } from "./store/authSlice/index.js"
import Login from "./Components/Login";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import SignUp from "./Components/SignUp";

function App() {
  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <>
      {/* Wrap all routes inside CheckAuth for protection */}
      <CheckAuth isAuthenticated={isAuthenticated}>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/academians.co.uk" element={<AcdemiansComUk />} />
          <Route path="/the-academians.uk" element={<TA />} />
          
          {/* If user is authenticated, redirect login to home */}
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Home />} />
          <Route path="/register" element={!isAuthenticated ? <SignUp /> : <Home />} />
          {/* Redirect "/" to "/home" if authenticated */}
          <Route path="/" element={<Home />} />
        </Routes>
      </CheckAuth>

      {/* Toast Notifications */}
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
