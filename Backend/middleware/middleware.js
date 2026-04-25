import jwt from 'jsonwebtoken'

function userMiddleware(req,res,next){

    const token = req.headers['authorization']

   

    try {

        if(token == null){
         return res.status(402).json({ message: "Invalid token format" })
    }

    jwt.verify(token,process.env.JWT_SECRET_KEY,(error,decoded)=>{
        if(error){
            return res.status(401).json({ message: "Invalid token" })
        }

        req.userId = decoded.id
        next()
    })
        
    } catch (error) {
            console.error(error)
    }


    

}



export default userMiddleware
