import express from "express"

const server = express();
const PORT = process.env.PORT || 4000


//check if server is 
server.get("/",(req,res)=>{
    res.status(200).json({
        status:'Healthy'
    })
})



server.listen(PORT,()=>{
console.log(`Server is runing on port ${PORT}`)
})


