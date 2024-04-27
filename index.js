import db from "./database.js";
import http from "http";
import path, { resolve } from "path";
import fs from "fs";
import {Server} from "socket.io";
import database, { getMessages } from "./database.js";
await database();
import { getMessages } from "./database.js"
console.log(getMessages())



const __dirname = path.resolve();

let pathToIndex = path.join(__dirname, "static", "index.html");
let indexHTMLFile = fs.readFileSync(pathToIndex);
let pathToStyle = path.join(__dirname, "static", "style.css");
let StyleFile = fs.readFileSync(pathToStyle);
let pathToScript = path.join(__dirname, "static", "script.js");
let ScriptFile = fs.readFileSync(pathToScript);
let pathToScriptIO = path.join(__dirname, "static", "socket.io.min.js");
let ScriptFileIO = fs.readFileSync(pathToScriptIO);

let server = http.createServer((req, res) => {
    try{
        if(req.url === "/" && req.method == "GET"){
            return res.end(indexHTMLFile);
        }
        if(req.url === "/script.js" && req.method == "GET"){
            return res.end(ScriptFile);
        }
        if(req.url === "/style.css" && req.method == "GET"){
            return res.end(StyleFile);
        }
        if(req.url === "/socket.io.min.js" && req.method == "GET"){
            return res.end(ScriptFileIO);
        }
        res.writeHead(404, "Not Found");
        return res.end()
    }catch(error){
        console.error(error.message);
        res.writeHead(500, "Server Error");
        res.end()
    }
})

server.listen(3000, function(){
    console.log("server is running on port 3000")
})


const io = new Server(server);
io.on("connection", (socket) => {
    console.log(`user connected. id ${socket.id}`)
    let userName = ""
    socket.on("change nickname", (data) => {
        userName = data
    })
    socket.on("new chat message", (data) => {
        io.emit("message", userName + ": " + data)
    })
    
})