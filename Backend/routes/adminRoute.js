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

            const [row2] = await pool.query('SELECT imageUrl FROM images WHERE bookingid =?',[row[0][i].id]);

            const bookingInfo = row[0][i];
            let booking = {
                bookingInfo,row2
            }

            bookings.push(booking)
        }


        return res.status(200).json({bookings})

    } catch (error) {
        
        console.error(error);

        return res.status(500).json({message:"Internal Server Error"})
    }

})


router.put("/updateBookings", async (req,res)=>{

    const path = req.query;
    const {completed , adminConfirm , confirmDate , id } = req.body;


    if(completed==null || adminConfirm ==null || confirmDate==null){
        return res.status(401).json({message:"Invalid Input"})
    }

    try {
        
        const [row] = await pool.query("UPDATE users SET completed=?, adminConfirm =? , confirmDae")

    } catch (error) {
        
    }


})

export default router