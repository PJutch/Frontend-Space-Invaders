let scores = await fetch("/api/score").then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
    }
    return response.json();
});

scores.sort((lhs, rhs) => -(lhs.score - rhs.score));

function insertCell(row, text, className) {
    const cell = row.insertCell();
    cell.textContent = text;
    cell.className = className;
}

const recordsData = document.getElementById('records-data');

for (const [i, {nickname, score}] of scores.entries()) {
    const row = recordsData.insertRow();
    row.className = 'records-table-row';

    insertCell(row, i + 1, 'records-table-place-column')
    insertCell(row, nickname, 'records-table-string-column');
    insertCell(row, score, 'records-table-number-column')
}
