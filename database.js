import {existsSync} from "fs"
import sqlite3 from "sqlite3"
import { open } from "sqlite"
let dbFile = './chat.db'
let exists = existsSync(dbFile)
let db;
sqlite3.verbose()

export default  async function(){


await open({
    filename: dbFile,
    driver: sqlite3.Database

}).then(async(dBase) => {
    db = dBase;
    try{
        if(!exists){
            await db.run(`
            CREATE TABLE user(
                user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                login TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
            );`)
            await db.run(`
            CREATE TABLE message(
                msg_id INTEGER PRIMARY KEY AUTOINCREMENT,
                content TEXT NOT NULL,
                author INTEGER,
                FOREIGN KEY(author) REFERENCES user(user_id)
            );
            `)
            await db.run(`
            INSERT INTO user(login, password) VALUES
                ('admin', 'admin'),
                ('user', 'user'),
                ('guest', 'guest'),
                ('root', 'root');
            `)
        }else{
            await db.all(`SELECT * FROM user;`)
        }
    }catch(e){
        console.log(e)
    }
})
}
export default function(){

}

export async function getMessages(){
    try{
        return await db.all(`SELECT * FROM user;`)
    }catch(e){
        console.log(e)
    }
}
