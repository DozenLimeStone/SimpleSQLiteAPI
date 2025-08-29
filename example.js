const sql=require("simplesqlite.js")
//load db
sql.load_db("path-to-sql-file.sql")
//logic
const all=sql.sql_get_all("MyTable")
const one=sql.sql_get("id",123,"MyTable")
console.log(Boolean(all.find(i=>i.id==one.id))) //true
const id_of_one=sql.sql_get("id",123,"MyTable","id")
console.log(id_of_one) //{id:123}
//you can input additional params
const all_sorted=sql.sql_get_all("MyTable","*","ORDER BY id ASC")
//insert
const insert_success=sql.sql_insert("MyTable",{id:321})
//update
const update_success=sql.sql_update("id","123","MyTable",{id:321})
//delete
const delete_success=sql.sql_delete("id","123","MyTable")
// very simple
