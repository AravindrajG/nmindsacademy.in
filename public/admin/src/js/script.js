document.getElementById('add-course').addEventListener('click', () => {
    document.getElementById('modal').style.display = 'block';
});

document.querySelector('.close-btn').addEventListener('click', () => {
    document.getElementById('modal').style.display = 'none';
});

window.onclick = (event) => {
    if (event.target == document.getElementById('modal')) {
        document.getElementById('modal').style.display = 'none';
    }
};
