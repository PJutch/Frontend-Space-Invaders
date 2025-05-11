const score = parseInt(localStorage.getItem('score')) ?? 0;
document.getElementById('gameover-score').textContent = score;

document.getElementById('save-score-form').onsubmit = (e) => {
    const nickname = document.getElementById('nickname').value;
    localStorage.removeItem('score');

    const json = JSON.stringify({
        nickname: nickname,
        score: score
    });
    console.log(json);

    fetch("/api/score", { method: "POST", body: json });
}
