const express = require("express")
const app = express()
const cors = require("cors")
const corsOptions = {
    origin: "http://localhost:5173",

}

// This is where you define routes for the application GET, POST ...

app.use(cors(corsOptions))



app.listen(8080, () => {
    console.log("Server has started on port 8080")
})