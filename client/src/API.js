const API_URL = window.location.hostname==='localhost' ? 'http://localhost:1338' : 'https://travel-log-api-two.now.sh/api/logs';

export async function listLogEntries() {
    const response = await fetch(`${API_URL}/api/logs`);
    return response.json();
}

export async function createLogEntries(entry) {
    const API_KEY = entry.apikey;
    delete entry.apikey;
    const response = await fetch(`${API_URL}/api/logs`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'X-API-KEY': API_KEY
        },
        body: JSON.stringify(entry)
    });

    const json =  await response.json();
    if(response.ok){
        return json;
    }
    const error = new Error(json.message);
    error.response = json;
    throw error;
}