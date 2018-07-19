 'use strict';
 let db = global.db;

module.exports = {

    LoadQuery: (table, userId, startId, limit) => {
        let q = `SELECT * FROM ${table} WHERE userid = ${userId} AND id > ${startId} LIMIT ${limit}`;
        
        return new Promise((resolve, reject) => {
            db.all(q, (err, rows) => {
                if(!err) {
                    resolve(rows);
                } else {
                    reject({
                        message:'something went wrong.plz login.'
                    });
                }
            });
        });
    },
    LoadQuery2:(table,id,  startId, limit) => {
        var id=this.lastID;
        let q = `SELECT * FROM ${table} WHERE id=${id} AND id > ${startId} LIMIT ${limit}`;
        
        return new Promise((resolve, reject) => {
            db.all(q, (err, rows) => {
                if(!err) {
                    resolve(rows);
                } else {
                    reject({
                        message:'something went wrong.plz login.'
                    });
                }
            });
        });
    },

    login: (table, userId, password) => {
        let q = `SELECT * FROM ${table} WHERE userid=${userId} AND password='${password}'`;
        return new Promise((resolve, reject) => {
            db.all(q, (err, rows) => {
                if(!err) {
                    resolve(rows);
                } else {
                    reject(err);
                }
            });
        });
    },

    insert: (table,id, userid, fName, content) => {
        
        let stmt = db.prepare(`INSERT INTO ${table} VALUES (?, ?, ?, ?)`);
        stmt.run(id, userid, content, fName);
        stmt.finalize();
        
        let query = `SELECT * FROM ${table} WHERE id = (SELECT MAX(id) from ${table}) LIMIT 1`;
        return new Promise((resolve, reject) => {
            db.all(query, (err, rows) => {
                if(!err) {
                    if(rows.length) {
                        resolve(rows[0]);
                    } else {
                        reject({
                            error: 'No data found'
                        });
                    }
                } else {
                    reject(err);
                }
            });
        });
    },

    find: (table, id) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT * from ${table} WHERE id = ${id}`;
            
            db.all(query, (err, rows) => {
                if(!err) {
                    if(rows.length) {
                        resolve(rows[0]);
                    } else {
                        reject({
                            code: 0,
                            error: 'no data found with given name.'
                        });
                    }
                } else {
                    console.log(err);
                    reject({
                        code: 0,
                        error: 'no data found with given name.'
                    });
                }
            });
        });
    },

    update: (table, id, fName, content) => {

        return new Promise((resolve, reject) => {
            
            db.run(`UPDATE ${table} SET filename = ?, info = ? WHERE id = ?`, [fName, content, id], (err, data) => {
                if(!err) {
                    resolve({
                        message: "Data updated successfully.",
                        code: 1
                    });
                } else {
                    reject({
                        code: 0,
                        message: "Failed to update data. Something went wrong."
                    });
                }
            });
        });
    },

    remove: (table, id) => {
        return new Promise((resolve, reject) => {
            db.run(`DELETE FROM ${table} WHERE id = ?`, [id], (err, data) => {
                if(!err) {
                    resolve({
                        message: "Note is removed successfully.",
                        code: 1
                    });
                } else {
                    reject({
                        code: 0,
                        message: 'Failed to delete note.'
                    });
                }
            });
        });
    },
    search: (table,key) => {
        return new Promise((resolve, reject) => {
            let id = parseInt(key);

            if(Number.isNaN(id)) {
                var query = `SELECT * from d7 WHERE filename = "${key}"`;
            } else {
                var query = `SELECT * from d7 WHERE (id = ${id} OR filename = "${key}")`;
            }

            db.all(query, (err, rows) => {
                if(!err) {
                    if(rows.length) {
                        resolve({
                            code: 1,
                            rows: rows
                        })
                    } else {
                        reject({
                            code: 0,
                            error: 'no data found with given name.'
                        });
                    }
                } else {
                    reject({
                        code: 0,
                        error: 'no data found with given name.'
                    });
                }
            });
        });
    },
    
       join: (table,table1,data) => {

    let userid=data.userid;
    let password=data.password;
    return new Promise ((resolve,reject) => {
    
   let sql=`SELECT username FROM d7 INNER JOIN d5 ON d7.userid=d5.userid AND d5.userid=${userid} AND d5.password="${password}"`;
    db.all(sql,(err,rows) => {

        if(!err)
        {
            if(rows.length){
                
                resolve(Object.assign({
            
                    code:1,
                     },rows[0]));
                
            }
            else
            {
                reject({
                    code:0,
                    error:'userid and password not match'
                });
            }
        }
        else
        {
            reject({
                code:0,
                error:'plz enter valid userid'
            });
        }
    });
    
    });       
    }

};