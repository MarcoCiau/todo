const sqlite3 = require('sqlite3').verbose();
const DB_FILENAME = 'myApp.db';


let db = null;

// create a new database file or open existing db
async function connectDB(){
    return new Promise ((resolve, reject) => {
        db = new sqlite3.Database(DB_FILENAME, (err) => {
            if (err) {
                console.log("oohps!");
                console.error(err.message);
                reject(err.message);
            }
            console.log('Connected to the SQlite database.');
            resolve(true);
        });
    });
}

// close db connection
function close() {
    return new Promise ( (resolve, reject) => {
        db.close( (err) => {
            if (err) {
                console.log(err.message);
                reject(err.message);
            }
            console.log('Close the database connection.');
            resolve(true);
        });
    });
}

//query one row by id
async function getOne(id) {
    try {
        let promise = new Promise ((resolve, reject) => {
            let sql = `SELECT description FROM tasks WHERE task_id  = ?`;
            db.get(sql, [id], (err, row) => {
                if (err) {
                    console.error(err.message);
                    reject(err.message);
                }
                console.log(`Single Query ${row}`);
                resolve(row);
            });
        });
        let result = await promise; //wait for query
        if (!result) throw new Error (`Gettin task id=${id} : Error!`);
        return result;
    } catch (error) {
        console.log(error);
    }
} 


// create table
async function createTable(tableName) {
    try {
        let connect = await connectDB();
        if (!connect) throw new Error ('open DB Failed');
        // create table
        let promise = new Promise( (resolve, reject) => {
            db.run( `CREATE TABLE IF NOT EXISTS ${tableName} (task_id INTEGER PRIMARY KEY AUTOINCREMENT, description varchar(255))`, (err) => {
                if (err) {
                    reject(err);
                }
                console.log(`${tableName} table created!`);
                resolve(true)
            });
        });
        let result = await promise; //wait for table creation
        if (!result) throw new Error (`Creating ${tableName} Table : Error!`);
        let resp = await close();
        if (!resp) throw new Error ('close DB Failed');
        return resp;
    } catch (error) {
        console.error(error);
    }
}

//insert items into task table
async function insertTask(task) {

    try {
        let connect = await connectDB();
        if (!connect) throw new Error ('open DB Failed');
        let promise = new Promise((resolve, reject) => {
            db.run(`INSERT INTO tasks(description) VALUES (?)`, [task],  (err) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                resolve(true);
            });
        });
        let result = await promise; //add new task
        if (!result) throw new Error (`Adding ${task} : Error!`);
        let resp = await close();
        if (!resp) throw new Error ('close DB Failed');
        return resp;
    } catch (error) {
        console.error(error);
    }
}

async function getTask(id) {

    try {
        let connect = await connectDB();
        if (!connect) throw new Error ('open DB Failed');
        let data = await getOne(id);
        if (!data) throw new Error ('Get Tasks Failed');
        let resp = await close();
        if (!resp) throw new Error ('close DB Failed');
        return data;
    } catch (error) {
        console.error(error);
    }
}

//query all table

async function getAllTasks() {
    try {
        let connect = await connectDB();
        if (!connect) throw new Error ('open DB Failed');
        const sqlAll = 'SELECT * FROM tasks ORDER BY task_id';
        let promise = new Promise ((resolve, reject) => {
            db.all(sqlAll, [], (err, rows) => {
                if (err) {
                    reject(err);
                }
                resolve(rows);
            });
        });
        let result = await promise;
        if (!result) throw new Error (`Getting All ${tableName} Table : Error!`);
        console.log(result);
        return result;
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    createTable, 
    insertTask, 
    getTask,
    getAllTasks
}
