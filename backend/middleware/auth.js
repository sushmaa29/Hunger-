import jwt from 'jsonwebtoken'


const authMiddleware=async(req,res,next)=>{

    const {token}=req.headers;
    if(!token){
        return res.json({success:false,message:"Not Authorised Login Again"});
    }

    try{

        const  token_decode=jwt.verify(token,process.env.JWT_SECRET);
        // when we have generated the token we had one id so when we decode it we will have that i d
        req.body.userId=token_decode.id;
        next();
    }
    catch(error){
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}


export default authMiddleware;