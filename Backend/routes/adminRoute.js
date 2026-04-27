import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import pool from "../sql.js";
import multer from "multer";
import cloudinary , {uploadImage} from "../cloudnary.js"
import fs from "fs";
import { sendStatusChange } from "../email.js";
const router = express.Router();


router.get("/getBookings",async (req,res)=>{

    try {
        
        const [row] = await pool.query("SELECT * FROM bookings");

        
        if(row.length==0){
            return res.status(400).json({message:"No bookings found"})
        }

        let bookings = [];
        for(let i = 0; i <row.length ;i++){ 

            const [row2] = await pool.query('SELECT imageUrl FROM images WHERE bookingid =?',[row[i].id]);

            const bookingInfo = row[i];
            let booking = {
                bookingInfo,row2
            }

            bookings.push(booking)
        }


        

        return res.status(200).json(bookings)

    } catch (error) {
        
        console.error(error);

        return res.status(500).json({message:"Internal Server Error"})
    }

})



router.put("/updateBookings", async (req,res)=>{


    const {bookingId, newStatus } = req.body;

    

    try {
        
        const [result] = await pool.query("UPDATE bookings SET status=? WHERE id =?",[newStatus,bookingId])

        
        if( result.affectedRows===0){
            return res.status(400).json({message:"Could not update the booking status"})
        }

        const [row] = await pool.query("SELECT * FROM bookings WHERE id = ?", [bookingId]);

        sendStatusChange(row[0].emailAddress,row[0])

        return res.status(200).json({message:"Booking status successfully updated"})

    } catch (error) {
    
        return res.status(500).json({message:"Internal Server Error"})
    }


})


router.delete("/deleteBooking/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(
      "DELETE FROM bookings WHERE id = ? AND status =?",
      [id,"Cancelled"]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Only cancelled bookings can be deleted" });
    }

    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const upload = multer({ dest: 'uploads/' }); 


router.post('/createGallery', upload.single('image'), async (req, res) => {
  const { title, category, description } = req.body;

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "gallery"
    });

    // Remove temp file
    fs.unlinkSync(req.file.path);

    const imageUrl = result.secure_url;

    // Save to DB
    const [dbResult] = await pool.query(
      "INSERT INTO gallery (title, category, description, imageUrl) VALUES (?,?,?,?)",
      [title, category, description, imageUrl]
    );

    return res.status(201).json({
      message: "Image uploaded successfully",
      
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});


router.delete("/deleteGallery/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(
      "DELETE FROM gallery WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Image not found" });
    }

    res.status(200).json({ message: "Gallery image deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
export default router