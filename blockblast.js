window.initBlockBlast = function() {
    const gridEl = document.getElementById('blockGrid');
    if (!gridEl) return;
    gridEl.innerHTML = "";
    let gridMatrix = Array(8).fill(0).map(() => Array(8).fill(0));
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const cell = document.createElement('div');
            cell.className = 'block-cell';
            cell.dataset.r = r; cell.dataset.c = c;
            cell.onclick = function() {
                if (gridMatrix[r][c] === 0) { gridMatrix[r][c] = 1; cell.classList.add('filled'); checkClears(); }
                else { gridMatrix[r][c] = 0; cell.classList.remove('filled'); }
            };
            gridEl.appendChild(cell);
        }
    }
    function checkClears() {
        for (let r = 0; r < 8; r++) { if (gridMatrix[r].every(val => val === 1)) { gridMatrix[r] = Array(8).fill(0); setTimeout(syncDOM, 200); } }
    }
    function syncDOM() {
        document.querySelectorAll('.block-cell').forEach(cell => {
            let r = cell.dataset.r, c = cell.dataset.c;
            if (gridMatrix[r][c] === 1) cell.classList.add('filled');
            else cell.classList.remove('filled');
        });
    }
    document.getElementById('blockBtn').onclick = function() {
        let randR = Math.floor(Math.random() * 6);
        for (let i = 0; i < 3; i++) { gridMatrix[randR][i + 2] = 1; }
        syncDOM();
    };
};
