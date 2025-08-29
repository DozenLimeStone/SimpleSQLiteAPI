// YOU NEED to add a variable called db,
// which is your sqlite database.

const sqlite3 = require('sqlite3');
let db;
function loaddb(sqlpath){
    db = new sqlite3.Database('databases/users.sqlite', sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.error('Error opening database:', err);
        } else {
            db.run('PRAGMA journal_mode=WAL;', (err) => {
                if (err) {
                    console.error('Error setting WAL mode:', err);
                }
            });
        }
    });
}

function BigIntToStr(inp){
    return inp.toLocaleString("fullwide", { useGrouping: false });
}
function isLikelyJSON(str) { //chatgpt
    return /^[\[{"]/.test(str.trim());
}
function decodeformats(row){
    for (let key in row) {
        if (typeof row[key]== "string"&&isLikelyJSON(row[key])) {
            try {
                row[key]=JSON.parse(row[key]);
            } catch{}
        }
    }
}function encodeformats(row){
    for(let key in row){
        const type=typeof row[key];
        if (type=="object")
            row[key]=JSON.stringify(row[key]);
        else if(type=="bigint")
            row[key]=BigIntToStr(row[key]);
    }
}

async function sql_get(keyname,keyvalue,tablename,contents="*",param="") {
    return new Promise((resolve, reject) => {
        db.get(`SELECT ${contents} FROM ${tablename} WHERE ${keyname}=? ${param}`,
            [keyvalue],
            (err, row) => {
                if (err)reject(err)
                else if (row){
                    decodeformats(row)
                    resolve(row)
                }else resolve(null)
            }
        );
    });
}

async function sql_get_all(tablename,contents="*",param=""){
    return new Promise((resolve,reject) => {
        db.all(`SELECT ${contents} FROM "${tablename}" ${param}`,
        (err, rows) => {
            if(err)reject(err)
            else{
                for(let row of rows){
                    decodeformats(row)
                }resolve(rows)
            }
        })
    })
}

async function sql_update(keyname,keyvalue,tablename,contents) {
    contents={...contents} //shallow copy
    encodeformats(contents)
    let payload=""
    for(let key in contents){
        payload+=" "+key+"=?,"
    }payload=payload.slice(0,-1)//to remove the trailing colon
    return new Promise((resolve, reject) => {
        db.run(
            `UPDATE "${tablename}" SET${payload} WHERE ${keyname} = ?`,
            [...Object.values(contents),keyvalue],
            (err) => {
                if (err)reject(err)
                else resolve(true)
            }
        );
    });
}
async function sql_insert(tablename,contents) {
    contents={...contents} //shallow copy
    encodeformats(contents)
    const contentkeys=Object.keys(contents)
    let payload=""
    for(let key of contentkeys){
        payload+=key+","
    }payload=payload.slice(0,-1)//to remove the trailing colon
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT OR REPLACE INTO "${tablename}" (${payload}) VALUES (?${",?".repeat(contentkeys.length-1)})`,
            Object.values(contents),
            (err) => {
                if (err)reject(err)
                else resolve(true)
            }
        );
    });
}
async function sql_delete(keyname,keyvalue,tablename) {
    return new Promise((resolve, reject) => {
        db.get(
            `DELETE FROM "${tablename}" WHERE ${keyname} = ?`,
            [keyvalue],
            (err) => {
                if (err)reject(err)
                else resolve(null)
            }
        );
    });
}

module.exports = {load_db,db
            sql_get_all,sql_remove_balance,sql_get,
            sql_update,sql_insert,sql_get_db,sql_update_db,sql_delete}
