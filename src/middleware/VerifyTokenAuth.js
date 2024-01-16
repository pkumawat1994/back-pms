import jwt from "jsonwebtoken"
import { jwtKey } from "../../server.js";

export const verifyToken=(req,resp,next)=>{

    let token=req.headers["authorization"];
    console.log(token)
    if(token){
        // token=token.split(' ')[1];
        jwt.verify(token,jwtKey,(err,verifiedSuccess)=>{
            if(err){
                console.log(err,12)
                resp.status(401).send({meassge:"Please Provide valid token"})
            }else{
                console.log(verifiedSuccess,13)
                // req.userId=verifiedSuccess.userLoginResult._id
                next()
            }
        })
    }else{
        resp.status(403).send({message:"user not authorized"});
    }
}