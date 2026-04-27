import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import pool from "./sql.js";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import adminRoute from "./routes/adminRoute.js"
import middleware from "./middleware/middleware.js"
import cloudinary , {uploadImage} from "./cloudnary.js"
import { sendBookingConfirmation } from "./email.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const PORT = process.env.PORT|| 1010


app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.options(/.*/, cors());
app.use(express.json())

app.post("/login", async(req,res)=>{

    const {email,password} = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailRegex.test(email) || !password){
        return res.status(401).json({message:"Invalid Request"})
    }

    try {
        
        const [row] = await pool.query("SELECT * FROM users WHERE email =?",[email])

        if(row.length===0){
            return res.status(401).json({message:"Invalid credentials, please try again"})
        }

        if(!bcrypt.compareSync(password,row[0].password))
        {
            return res.status(401).json({message:"Invalid credentials, please try again"})
        }
              
        //Creating a session token using a combinaton of user id and our own secret key 
        const token = jwt.sign({id:row[0].id}, process.env.JWT_SECRET_KEY,  { expiresIn: '24h'})
        
        //Sending a session token to the frontend to be used for authentication
        return res.status(200).json({token})


    } catch (error) {
        
        console.log(error)

        return res.status(500).json({message:"Internal Server Error"})
    }
})

// Multer storage config
const upload = multer({ dest: 'uploads/' }); 


app.post('/bookings', upload.array('images', 5), async (req, res) => {

    
        const {
           firstName,lastName,emailAddress,phoneNumber,preferredDate,preferredTime,serviceType,tattoSize,tattoPlacement,tattoDescription,additonalNotes,images
        } = req.body;

       console.log(req.body) 

  try {
    
   
        // Upload all images to Cloudinary at the same time
        const uploadPromises = req.files.map(file =>
            cloudinary.uploader.upload(file.path, { folder: "products" })
        );

        const results = await Promise.all(uploadPromises);

        // Build image array and delete temp files
        const imagePaths = [];

        for (let i = 0; i < results.length; i++) {
            imagePaths.push({
                url: results[i].secure_url,
              
            });

            // Delete temp file
            fs.unlinkSync(req.files[i].path);
        }
            
    const [result] = await pool.query(
      "INSERT INTO bookings(firstName,lastName,emailAddress,phoneNumber,preferredDate,preferredTime,serviceType,tattoSize,tattoPlacement,tattoDescription,additionalNotes) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
      [firstName,lastName,emailAddress,phoneNumber,preferredDate,preferredTime,serviceType,tattoSize,tattoPlacement,tattoDescription,additonalNotes]
    );
    // Save images in productImages table
    for (const image of imagePaths) {
        await pool.query(
            "INSERT INTO images (bookingId, imageUrl) VALUES (?, ?)",
            [result.insertId, image.url]
    );
        }

    
    
    sendBookingConfirmation(req.body.emailAddress, req.body);
    res.status(201).json({ message: "Booking  Successful", });

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal Server error" });
    }
    finally {
    // Delete temp files no matter what
    if (req.files) {
        req.files.forEach(file => {
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
        });
    }
    }
});


app.get("/getGallery",async (req,res)=>{

    try {
        
        const [row] = await pool.query("SELECT * FROM gallery");

        
        if(row.length==0){
            return res.status(400).json({message:"No images found"})
        }


        return res.status(200).json(row)

    } catch (error) {
        
        console.error(error);

        return res.status(500).json({message:"Internal Server Error"})
    }

})

/*
app.post("/register",async (req,res)=>{

    const {email,password} = req.body;
        const hashPassword = bcrypt.hashSync(password,8)

    try {
        const [result ] = await pool.query("INSERT INTO users(email,password) VALUES (?,?)",[email,hashPassword])


        res.status(200)
    } catch (error) {
        console.log(error)
        res.status(500)
    }

})
*/

app.use("/admin",middleware, adminRoute)





app.listen(PORT,()=>{

    console.log(`Server started at ${PORT}`)
})