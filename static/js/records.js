const recordsData = document.getElementById('records-data');
const nicknameFilter = document.getElementById('nickname-filter');

let scores = await fetch("/api/score").then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
    }
    return response.json();
});

redrawTable();
nicknameFilter.oninput = redrawTable;

function insertCell(row, text, className) {
    const cell = row.insertCell();
    cell.textContent = text;
    cell.className = className;
}

function redrawTable() {
    const filtered = scores
        .toSorted((lhs, rhs) => -(lhs.score - rhs.score))
        .filter(entry => entry.nickname.toLowerCase()
            .includes(nicknameFilter.value.toLowerCase()));
    
    recordsData.replaceChildren();
    for (const [i, {nickname, score}] of filtered.entries()) {
        const row = recordsData.insertRow();
        row.className = 'records-table-row';
    
        insertCell(row, i + 1, 'records-table-place-column')
        insertCell(row, nickname, 'records-table-name-column');
        insertCell(row, score, 'records-table-score-column')
    }    
}
