
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User")

const registerUser = async (req, res) => {
  try {
    const { userName, email, password, adminCode } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let role = "user"; // Default role

    // Check if the admin code matches the secret key
    if (adminCode === process.env.ADMIN_SECRET) {
      role = "admin";
    }

    const newUser = new User({ userName, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({
      success: true, // ✅ Ensure success key exists
      message: "User registered successfully",
      role,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: "Signup failed" });
  }
};




// const loginUser =  async (req,res) => {
//     try {
//         const { email , password} = req.body;
//         const user = await User.findOne({ email });

//         if (!user) return res.status(400).json({error: "User not Found"});

//         const isMatch = await bcrypt.compare(password,user.password);

//         if(!isMatch) return res.status(400).json({ error: "Invalid Credentials" });

//         const token = jwt.sign({id: user._id, role: user.name, email: user.email, role: user.role})
//         res.json({token, user:{id:user._id, name: user.name, email: user.email, role: user.role}})
//     } catch(error){
//       res.status(500).json({ error: "Login failed" });
//     }
// }

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser)
      return res.json({
        success: false,
        message: "User doesn't exists! Please register first",
      });

    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password
    );
    if (!checkPasswordMatch)
      return res.json({
        success: false,
        message: "Incorrect password! Please try again",
      });

    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName,
      },
      process.env.JWT_SECRET,
      { expiresIn: "60m" }
    );

    console.log("Generated Token:", token);

    res.cookie("token", token, { httpOnly: true, secure: false });

    console.log("Token set in cookie successfully!"); // ✅ Debug log for cookie

    res.json({
      success: true,
      message: "Logged in successfully",
      token, // ✅ Sending token in response for debugging
      user: {
        email: checkUser.email,
        role: checkUser.role,
        id: checkUser._id,
        userName: checkUser.userName,
      },
    });

    // res.cookie("token", token, { httpOnly: true, secure: false }).json({
    //   success: true,
    //   message: "Logged in successfully",
    //   token,
    //   user: {
    //     email: checkUser.email,
    //     role: checkUser.role,
    //     id: checkUser._id,
    //     userName: checkUser.userName,
    //   },
    // });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logged out successfully!",
  });
};


const authMiddleware = async (req, res, next) => {
  console.log("Cookies Received:", req.cookies); // Debugg
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });
  }
};


// const jwt = require("jsonwebtoken");

// module.exports = (req, res, next) => {
//   const token = req.header("Authorization");
//   if (!token) return res.status(401).json({ error: "Access denied" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     res.status(400).json({ error: "Invalid token" });
//   }
// };


module.exports = { registerUser, loginUser, logoutUser, authMiddleware };