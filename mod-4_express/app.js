import express from 'express'
import router from './routes/studentRoutes.js'
const app = express();

app.use(express.json());

app.get("/", (req, res)=>{
    res.status(200).json({message: 'Welcome to express api.'})
})

const Port = process.env.PORT ?? 3000;

app.listen(Port, ()=>{
    console.log(`App is listening on port: ${Port}`)
})


app.use('/api/student', router);
