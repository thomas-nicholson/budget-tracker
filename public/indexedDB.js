let db;

// We request a database instance.
const request = indexedDB.open("firstDatabase", 1);

request.onupgradeneeded = ({ target }) => {
    db = target.result;
    if (db.objectStoreNames.length === 0) {
        db.createObjectStore('BudgetStore', { autoIncrement: true });
    }
};

function pushOnline() {
    let transaction = db.transaction(['BudgetStore'], 'readwrite');
    const budgetStore = transaction.objectStore('BudgetStore');

    const budgetGetAll = budgetStore.getAll();

    budgetGetAll.onsuccess = () => {
        if (getAll.result.length > 0) {
            fetch('/api/transaction/bulk', {
              method: 'POST',
              body: JSON.stringify(getAll.result),
              headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
              },
            })
            .then(res => res.json())
            .then((res) => {
                if (res.length !== 0) {
                    transaction = db.transaction(['BudgetStore'], 'readwrite');        
                    const budgetStore = transaction.objectStore('BudgetStore');
                    budgetStore.clear();
                    console.log("Offline storage cleared");
                  }
            })
        }
    }
}

request.onsuccess = ({target}) => {
    console.log("Success");
    db = target.result
    if (navigator.onLine) {
        console.log('online');
        pushOnline();
    }
}

request.onerror = event => {
    console.error("Database error: " + event.target.errorCode);
}

window.addEventListener('online', pushOnline);

