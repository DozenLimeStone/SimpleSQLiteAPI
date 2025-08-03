// YOU NEED to add a variable called db,
// which is your sqlite database.

const sqlite3 = require('sqlite3');

async function sql_get(SenderPhoneNumber,tablename) {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT * FROM ${tablename} WHERE phone_number = ?`,
            [SenderPhoneNumber],
            (err, row) => {
                if (err)reject(err)
                else if (row)resolve(row)
                else resolve(null)
            }
        );
    });
}

async function sql_update(SenderPhoneNumber,tablename,contents) {
    let payload=""
    for(let key of Object.keys(contents)){
        payload+=" "+key+"=?,"
    }payload=payload.slice(0,-1)//to remove the trailing colon
    return new Promise((resolve, reject) => {
        db.run(
            `UPDATE ${tablename} SET${payload} WHERE phone_number = ?`,
            [...Object.values(contents),SenderPhoneNumber],
            (err) => {
                if (err)reject(err)
                else resolve(true)
            }
        );
    });
}
async function sql_insert(SenderPhoneNumber,tablename,contents) {
    const contentkeys=Object.keys(contents)
    let payload=""
    for(let key of contentkeys){
        payload+=key+"=?,"
    }payload=payload.slice(0,-1)//to remove the trailing colon
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO ${tablename} (${payload}) VALUES (?${",?".repeat(contentkeys.length-1)})`,
            [...Object.values(contents),SenderPhoneNumber],
            (err) => {
                if (err)reject(err)
                else resolve(true)
            }
        );
    });
}
