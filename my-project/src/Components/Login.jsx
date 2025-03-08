// import { useState } from "react";
// import {AiOutlineEye, AiOutlineEyeInvisible} from "react-icons/ai";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";

// const Login = () => {
// const navigate = useNavigate();
// const [username,setUserName]= useState("");
// const [password,setPassword]= useState("");
// const [visible,setVisible]= useState(false);

// const handleSubmit = async(e) => {
//   e.preventDefault();

// try{
//   await axios.post(`https://webclicksees.onrender.com/api/login`,{
//   username,
//   password,
// },{withCredentials:true}).then((res)=>{
//   toast.success("Login Successfully");
//   navigate("/home");
//   window.location.reload(true);
//   console.log(res);

// })

// }catch(error){
//   if(error.response.status === 400){
//     toast.error("Invalid email or password");
//   }else{
//     toast.error("Login Failed");
//   }
//   console.log(error);

// }

// }

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//           Login to Your Account
//         </h2>
//         </div>
//         <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//           <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
//             <form className="space-y-6" onSubmit={handleSubmit}>
//               <div>
//                 <label htmlFor="user">Email Address</label>
//                 <div className="mt-1">
//                   <input type="user" name="user" autoComplete="email" required value={username}
//                   onChange={(e)=>setUserName(e.target.value) } className="apperance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
//                 </div>
//               </div>
//               <div>
//                 <label htmlFor="password">Password</label>
//                 <div className="mt-1 relative">
//                   <input type={visible ? "text" :"password" } name="password" autoComplete="current-password" required value={password}
//                   onChange={(e)=>setPassword(e.target.value) } className="apperance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
//                     {visible ? (<AiOutlineEye className="absolute right-2 top-2 cursor-pointer" size={22} onClick={()=>setVisible(false)}/>
//                     ):
//                     (
//                         <AiOutlineEyeInvisible className="absolute right-2 top-2 cursor-pointer" size={22} onClick={()=>setVisible(true)}/>
//                     )}

//                 </div>
//               </div>
//               <div className={`flex items-center justify-between`}>
//                 <div className="flex items-center">
//                     <input type="checkbox" name="remember-me " id="remember-me" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
//                     <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember me</label>
//                 </div>

//               </div>
//               <div>
//                 <button type="submit" className=" w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">Submit</button>
//               </div>

//             </form>
//           </div>
//         </div>

//     </div>
//   );
// };

// export default Login;

// new code
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
// import axios from "axios";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { loginUser } from "@/store/authSlice";

const initialState = {
  email: "",
  password: "",
};

const Login = () => {
  const [formData, setFormData] = useState(initialState);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // try {
    //   await axios
    //     .post(
    //       `https://webclicksees.onrender.com/api/login`,
    //       {
    //         username,
    //         password,
    //       },
    //       { withCredentials: true }
    //     )
    //     .then((res) => {
    //       toast.success("Login Successfully");
    //       navigate("/home");
    //       window.location.reload(true);
    //       console.log(res);
    //     });
    // } catch (error) {
    //   if (error.response.status === 400) {
    //     toast.error("Invalid email or password");
    //   } else {
    //     toast.error("Login Failed");
    //   }
    //   console.log(error);
    // }

    dispatch(loginUser(formData)).then((data)=>{
      if(data?.payload?.success){
        toast.success(data?.payload?.message);
        navigate("/home");
      }else {
        toast.error("Invalid email or password");
        console.log(data?.payload?.message)
      }
    })

  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Login to Your Account
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="user">Email Address</label>
              <div className="mt-1">
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="apperance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <div className="mt-1 relative">
                <input
                  type={visible ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="apperance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {visible ? (
                  <AiOutlineEye
                    className="absolute right-2 top-2 cursor-pointer"
                    size={22}
                    onClick={() => setVisible(false)}
                  />
                ) : (
                  <AiOutlineEyeInvisible
                    className="absolute right-2 top-2 cursor-pointer"
                    size={22}
                    onClick={() => setVisible(true)}
                  />
                )}
              </div>
            </div>
            <div className={`flex items-center justify-between`}>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="remember-me "
                  id="remember-me"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>
            </div>
            <div>
              <button
                type="submit"
                className=" w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
