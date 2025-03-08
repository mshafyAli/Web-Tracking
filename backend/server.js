// server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const trackingRoutes = require("./routes/trackingRoutes");
const User = require("./models/User");
const scriptRoute = require("./routes/ScriptRoute");
const authRouter = require("./routes/auth/auth-routes")
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: ["http://localhost:5173","https://port-folio-website-two.vercel.app","https://the-academians.au","http://localhost:3000"], // Replace with your frontend URL
    methods: "GET,POST,PUT,DELETE", 
    credentials: true, // Allow cookies to be sent
  }));

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRouter);
app.use(trackingRoutes);
app.use(scriptRoute);

// const createDefaultUser = async () =>{
//   const defaultUsername = "admin";
//   const defaultPassword = "admin123";

//   try {
//     const userExists = await User.findOne({username: defaultUsername})
//     if(!userExists){
//       const hashedPassword = await bcrypt.hash(defaultPassword, 10);
//       const newUser = new User({
//         username: defaultUsername,
//         password: hashedPassword
//       });
//       await newUser.save();
//     } else {
//       console.log("Default user already exists");
//     }

//   } catch(err){
//     console.err("Error creating default user:", err);
//   }


// }

// createDefaultUser();

// app.post("/api/login", async (req, res) => {
//   const {username , password} = req.body;

//   try{
//     const user = await User.findOne({username});

//     if(!user) return res.status(400).send("User not Found");

//     const validPassword = await bcrypt.compare(password, user.password);
 
//     if(!validPassword) return res.status(401).send('Invalid Password');


//     const token = jwt.sign({id: user._id}, 'SECRET_KEY',{expiresIn: '1h'});
    
//     res.json({message: "Login Successfully",token})


//   } catch (err){
//     res.status(500).send("Error while Login")
//   }

// })

app.get("/", (req, res) => {
    res.status(200).json({ message: "Server is running and this is the root test response!" });
  })


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
