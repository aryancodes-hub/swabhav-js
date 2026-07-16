import express from 'express';
import router from './routes/studentRoutes.js';


const app = express();
const  PORT = process.env.PORT ?? 3000;
app.use(express.json());

app.get('/', (req, res)=>{
    res.status(200).json({message: 'express api running'})
})

app.listen(PORT, ()=>{
    console.log(`express api running on port: ${PORT}`)
})

app.use('/api/student', router)
