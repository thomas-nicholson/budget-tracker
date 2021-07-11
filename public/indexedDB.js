let db;

// We request a database instance.
const request = indexedDB.open("firstDatabase", 1);

request.onsuccess = ({target}) => {
    console.log("Success");
    db = target.result
}

request.onerror = event => {
    console.error("Database error: " + event.target.errorCode);
}

