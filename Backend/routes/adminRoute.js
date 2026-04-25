import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import pool from "../sql.js";


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


    const {bookingid, newStatus } = req.body;


    

    try {
        
        const [result] = await pool.query("UPDATE bookings SET status=? WHERE id =?",[newStatus,bookingid])

  
        if( result.affectedRows==0){
            return res.status(400).json({message:"Could not update the booking status"})
        }

        return res.status(200).json({message:"Booking status successfully updated"})

    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Internal Server Error"})
    }


})

export default router