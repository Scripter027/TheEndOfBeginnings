window.generateBBPieces = function(boardMatrix) {
    const easyPieces = [
        [[1,1]], [[1],[1]], [[1]]
    ];
    const hardPieces = [
        [[1,1,1],[1,0,0],[1,0,0]],
        [[1,1,1,1]],
        [[1,1],[1,1]],
        [[1,1,1],[0,1,0]]
    ];

    let filledCount = boardMatrix.flat().filter(cell => cell === 1).length;
    let selectedList = [];

    function canFit(matrix, board) {
        for (let r = 0; r <= 8 - matrix.length; r++) {
            for (let c = 0; c <= 8 - matrix[0].length; c++) {
                let match = true;
                for (let pr = 0; pr < matrix.length; pr++) {
                    for (let pc = 0; pr < matrix[0].length; pc++) {
                        if (matrix[pr][pc] && board[r+pr][c+pc]) match = false;
                    }
                }
                if (match) return true;
            }
        }
        return false;
    }

    if (filledCount > 25) {
        let complexPiece = hardPieces[Math.floor(Math.random() * hardPieces.length)];
        selectedList.push(complexPiece);
        
        let virtualBoard = JSON.parse(JSON.stringify(boardMatrix));
        let rescuePiece = easyPieces[Math.floor(Math.random() * easyPieces.length)];
        selectedList.push(rescuePiece);
        selectedList.push(hardPieces[Math.floor(Math.random() * hardPieces.length)]);
    } else {
        for (let i = 0; i < 3; i++) {
            let p = Math.random() > 0.5 ? hardPieces[Math.floor(Math.random() * hardPieces.length)] : easyPieces[Math.floor(Math.random() * easyPieces.length)];
            selectedList.push(p);
        }
    }
    return selectedList;
};
