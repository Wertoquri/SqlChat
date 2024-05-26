
import http from "http";
import path, { resolve } from "path";
import fs from "fs";
import { Server } from "socket.io";
import { getMessages, addMessage, isExistUser, addUser, getAuthToken} from "./database.js";
import cookie from "cookie";

const validTokens = [];

const __dirname = path.resolve();

let pathToIndex = path.join(__dirname, "static", "index.html");
let indexHTMLFile = fs.readFileSync(pathToIndex);
let pathToStyle = path.join(__dirname, "static", "style.css");
let StyleFile = fs.readFileSync(pathToStyle);
let pathToScript = path.join(__dirname, "static", "script.js");
let ScriptFile = fs.readFileSync(pathToScript);
let pathToScriptIO = path.join(__dirname, "static", "socket.io.min.js");
let ScriptFileIO = fs.readFileSync(pathToScriptIO);
let pathToRegister = path.join(__dirname, "static", "register.html");
let registerHTML = fs.readFileSync(pathToRegister);
let pathToAuthScript = path.join(__dirname, "static", "auth.js");
let authScript = fs.readFileSync(pathToAuthScript);
let pathToLoginHTML = path.join(__dirname, "static", "login.html");
let loginHTML = fs.readFileSync(pathToLoginHTML);

let server = http.createServer((req, res) => {
    try {
        // if (req.url === "/" && req.method == "GET") {
        //     return res.end(indexHTMLFile);
        // }
        // if (req.url === "/script.js" && req.method == "GET") {
        //     return res.end(ScriptFile);
        // }
        if (req.url === "/style.css" && req.method == "GET") {
            return res.end(StyleFile);
        }
        if (req.url === "/socket.io.min.js" && req.method == "GET") {
            return res.end(ScriptFileIO);
        }
        if (req.url === "/register" && req.method == "GET") {
            return res.end(registerHTML);
        }
        if (req.url === "/auth.js" && req.method == "GET") {
            return res.end(authScript);
        }
        if (req.url === "/api/register" && req.method == "POST") {
            return registerUser(req, res)
        }
        if (req.url === "/login" && req.method == "GET") {
            return res.end(loginHTML);
        }
        if (req.url === "/api/login" && req.method == "POST") {
            return loginUser(req, res)
        }
        guarded(req, res)
        
    } catch (error) {
        console.error(error.message);
        res.writeHead(500, "Server Error");
        res.end()
    }
})

server.listen(3000, function () {
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

function registerUser(req, res) {
    let data = ""
    req.on("data", (chunk) => {
        data += chunk
    })
    req.on("end", async () => {
        try {
            data = JSON.parse(data)
            if (!data.login || !data.password) {
                res.end("Error: empty login or password")
                return
            }
            if(!await isExistUser(data.login)){
                res.end("user is already exist")
                return
            }
            await addUser(data.login, data.password)
            res.end("Register success!")
        } catch (error) {
            console.error(error)
            res.writeHead(500)
            res.end("Error:" + error)
        }
    })
}


function loginUser(req, res) {
    let data = ""
    req.on("data", (chunk) => {
        data += chunk
    })
    req.on("end", async () => {
        try {
            data = JSON.parse(data)
            if (!data.login || !data.password) {
                res.end("Error: empty login or password")
                return
            }
            let token = await getAuthToken(data)
            validTokens.push(token)
            res.writeHead(200)
            res.end(token)
        } catch (error) {
            console.error(error)
            res.end("Error:" + error)
        }
    })
    res.end("OK")
}

function getCredentials(req){
    let cookies = cookie.parse(req.headers?.cookie || "")
    let token = cookies?.token;
    if(!token || !validTokens.includes(token)){
        return null
    }
    let [user_id, login] = token.split(".")
    if(!user_id || !login) return null
    return {user_id, login}
}

function guarded(req,res){
    const credentials = getCredentials(req)
    try{
        if(!credentials){
            res.writeHead(301, {Location: "/register"})
            res.end()
        }else if(req.method = "GET"){
            switch(req.url){
                case "/":
                    res.end(indexHTMLFile)
                    return
                case "/script.js":
                    res.end(ScriptFile)
                    return
            }
        }
    }catch(err){
        res.writeHead(404)
        res.end(err)
    }
}