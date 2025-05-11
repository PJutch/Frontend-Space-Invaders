const score = parseInt(localStorage.getItem('score')) ?? 0;
document.getElementById('gameover-score').textContent = score;

document.getElementById('save-score-form').onsubmit = (e) => {
    const nickname = document.getElementById('nickname').value;
    localStorage.removeItem('score');

    console.log(nickname, score);
}
