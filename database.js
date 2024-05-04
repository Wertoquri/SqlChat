import { existsSync } from "fs";
import { open } from "sqlite";
import sqlite3 from "sqlite3";
let dbfile = "./chat.db";
let exists = existsSync(dbfile);
let db;
try {
    db = await open({
        filename: dbfile,
        driver: sqlite3.Database,
    });
    if (!exists) {
        await db.exec(`
                CREATE TABLE user(
                    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    login TEXT NOT NULL UNIQUE,
                    password TEXT NOT NULL
                );
            `);
        await db.exec(`
                CREATE TABLE message(
                    msg_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    content TEXT NOT NULL,
                    author INTEGER,
                    FOREIGN KEY(author) REFERENCES user(user_id)
                );
            `);
        await db.exec(`
                INSERT INTO user(login, password) VALUES
                ("admin", "admin"),
                ("bohdan", "bohdan"),
                ("DANYA", "CHAIKA");
            `);
    }
} catch (error) {
    console.error(error);
}
export async function getMessages() {
    try {
        return await db.all("SELECT msg_id, content, login, password, user_id FROM message JOIN user ON message.author = user.user_id;");
    } catch (error) {
        console.error(error);
    }
}


export async function addMessage(msg, userid) {
    try {
        await db.run(`INSERT INTO message(content, author) VALUES(?, ?)`, [msg, userid]);
    } catch (error) {
        console.error(error);
    }
}