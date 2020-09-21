"use strict";
const sqlite3 = require("sqlite3").verbose();

class Db {
  constructor(file) {
    this.db = new sqlite3.Database(file);
    this.createTable();
  }

  createTable() {
    const sql = `
            CREATE TABLE IF NOT EXISTS user (
                id integer PRIMARY KEY, 
                username text UNIQUE, 
                password text,
                token text DEFAULT NULL)`;
    return this.db.run(sql);
  }

  selectByUsername(username, callback) {
    return this.db.get(
      `SELECT * FROM user WHERE username = ?`,
      [username],
      function(err, row) {
        callback(err, row);
      }
    );
  }

  updateToken(data, callback) {
    return this.db.run(
      `UPDATE user SET token = ? WHERE username = ?`,
      data,
      (err) => {
        callback(err);
      }
    );
  }

  insert(user, callback) {
    return this.db.run(
      "INSERT INTO user (username,password) VALUES (?,?)",
      user,
      (err) => {
        callback(err);
      }
    );
  }
}

module.exports = Db;
