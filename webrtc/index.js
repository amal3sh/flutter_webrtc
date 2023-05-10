const express = require("express");
const app = express();
const mongoose = require("mongoose");
const {MONGO_DB_CONFIG}=require('./config/app.config');
const http = require("http");
const server = http.createServer(app);

mongoose.Promise = global.Promise;
mongoose.connect(MONGO_DB_CONFIG.DB)
.then(()=>{
    console.log("Database connected");
},(error)=>{
    console.log("Database cannot be connected");
});
app.use(express.json());
app.use("/api",require("./routes/app.routes"));
server.listen(process.env.port || 4000,()=>{
    console.log(`Server listening on port ${process.env.port || 4000}`)
})