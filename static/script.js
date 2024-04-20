alert("Wellcome to my chat");
let socket = io();
let name = "user"


document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    let message = document.getElementById("input").value 
    if(message.length){

        socket.emit("new chat message", message);
        document.getElementById("input").value = ""
    }
})

socket.on("message", (data) => {
    let item = document.createElement("li");
    item.textContent = data;
    document.getElementById("messages").appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
})

document.getElementById("cn").addEventListener("click", () => {
    name = prompt("Enter your name");
    socket.emit("change nickname", name);
})

socket.emit("change nickname", name);