import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dayjs from "dayjs";
import bcript from "bcrypt";
import jwt from "jsonwebtoken";
import {Controllers} from './models/index.js';
import database from './database.js';
import dotenv from 'dotenv';
import { jwtAuth } from './middleware/jwtAuth.js';
dotenv.config();
// import { swaggerDocs,options } from './swagger/index.js';
// import swaggerUi from "swagger-ui-express";

// const password = "12345";

(async()=>{
    // const salt = Number(process.env.PASSWORD_SAlT);
    // console.log(process.env.PASSWORD_SAlT);

    //const hashedPassword = await bcript.hash(password,salt);
    //console.log(hashedPassword);
    const app = express();
    await database.$connect();
    app.use(cors({
        origin : "*"
    }));
    
    app.use(helmet());
    app.use(express.json()); 
    app.use(jwtAuth);
    Controllers.forEach((controller)=>{
        app.use(controller.path,controller.router);
    });
    // app.get("/swagger.json", (req, res) => {
    //     res.status(200).json(swaggerDocs);
    //   });
    // app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(undefined,options));
    app.use((err,req,res,next)=>{
        res.status(err.status || 500).json({message:err.message ||"서버에서 에러가 발생하였습니다."});
    })
    app.get("/",(req,res)=>{
        res.send("nodejs 강의 재밌어요!");
    })
    
    app.listen(8000,()=>{
        console.log("서버가 시작되었습니다.");
    })
})();