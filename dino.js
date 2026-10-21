window.initDinoGame = function() {
    const canvas = document.getElementById('dinoCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let dinoY = 100, dinoVelocity = 0, isJumping = false, obstacleX = 380, obstacleSpeed = 4, score = 0;
    function drawDino() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#33ff33'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(0, 120); ctx.lineTo(380, 120); ctx.stroke();
        ctx.fillStyle = '#33ff33'; ctx.fillRect(40, dinoY, 20, 20);
        ctx.fillRect(obstacleX, 100, 15, 20);
        ctx.font = '12px Courier New'; ctx.fillText(`SCORE: ${score}`, 10, 20);
        if (isJumping) { dinoVelocity += 0.6; dinoY += dinoVelocity; if (dinoY >= 100) { dinoY = 100; isJumping = false; } }
        obstacleX -= obstacleSpeed;
        if (obstacleX < -20) { obstacleX = 380; score += 10; obstacleSpeed += 0.2; }
        if (obstacleX > 40 && obstacleX < 60 && dinoY >= 90) { score = 0; obstacleX = 380; obstacleSpeed = 4; }
    }
    if (!window.dinoTimerActive) {
        window.dinoTimerActive = setInterval(drawDino, 20);
        const jump = () => { if (!isJumping) { dinoVelocity = -9; isJumping = true; } };
        window.addEventListener('keydown', (e) => { if (e.code === 'Space' && document.getElementById('win-dino').style.display === 'block') { e.preventDefault(); jump(); } });
        canvas.addEventListener('click', jump); canvas.addEventListener('touchstart', jump);
    }
};
