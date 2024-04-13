
import http from "http";
import path, { resolve } from "path";
import fs from "fs";


const __dirname = path.resolve();

let pathToIndex = path.join(__dirname, "static", "index.html");
let indexHTMLFile = fs.readFileSync(pathToIndex);
let pathToStyle = path.join(__dirname, "static", "style.css");
let StyleFile = fs.readFileSync(pathToStyle);
let pathToScript = path.join(__dirname, "static", "script.js");
let ScriptFile = fs.readFileSync(pathToScript);

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


