// YOU NEED to add a variable called db,
// which is your sqlite database.

const sqlite3 = require('sqlite3');

async function sql_get(keyname,keyvalue,tablename) {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT * FROM ${tablename} WHERE ${keyname} = ?`,
            [keyvalue],
            (err, row) => {
                if (err)reject(err)
                else if (row){
                    for (let key in row) {
                        if (typeof row[key] === "string") {
                            try {
                                const parsed = JSON.parse(row[key]);
                                row[key] = parsed;
                            } catch (e) {}
                        }
                    }
                    resolve(row)
                }
                else resolve(null)
            }
        );
    });
}

async function sql_update(keyname,keyvalue,tablename,contents) {
    let payload=""
    for(let key of Object.keys(contents)){
        payload+=" "+key+"=?,"
        if (typeof contents[key] === "object") {
            contents[key] = JSON.stringify(contents[key]);
        }
    }payload=payload.slice(0,-1)//to remove the trailing colon
    return new Promise((resolve, reject) => {
        db.run(
            `UPDATE ${tablename} SET${payload} WHERE ${keyname} = ?`,
            [...Object.values(contents),keyvalue],
            (err) => {
                if (err)reject(err)
                else resolve(true)
            }
        );
    });
}
async function sql_insert(tablename,contents) {
    const contentkeys=Object.keys(contents)
    let payload=""
    for(let key of contentkeys){
        payload+=key+","
        if (typeof contents[key] === "object") {
            contents[key] = JSON.stringify(contents[key]);
        }
    }payload=payload.slice(0,-1)//to remove the trailing colon
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO ${tablename} (${payload}) VALUES (?${",?".repeat(contentkeys.length-1)})`,
            [...Object.values(contents)],
            (err) => {
                if (err)reject(err)
                else resolve(true)
            }
        );
    });
}
