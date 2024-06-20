import express from 'express';
import cors from 'cors';
import hallRouter from './Routers/roomRouter.js'



//Initialization
const app=express();
const PORT=8000;

//Middleware
app.use(express.json());
app.use(cors());

//router
app.use('/api',hallRouter)

app.get('/',(req,res)=>{
    res.status(200).send("API Running Successfully")
})

//app listening port
app.listen(PORT,()=>{
    console.log(`App running on port ${PORT}`)
})