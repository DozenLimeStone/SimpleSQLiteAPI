A game changer if you want to use sqlite.\
\
Supports JSON / Object formats and correctly encodes, decodes them.
\
\
List of functions:\
\
- async function sql_get(keyname,keyvalue,tablename,contents="*",param="")
- async function sql_get_all(tablename,contents="*",param="")
- async function sql_update(keyname,keyvalue,tablename,contents)
- async function sql_insert(tablename,contents)
- async function sql_delete(keyname,keyvalue,tablename)
\
Note: You need to define db variable at the top of the file as is shown in example.js
