const game = {
    xTurn: true,
    xState: [],
    oState: [],
    winningStates: [
        // Rows
        ['0', '1', '2'],
        ['3', '4', '5'],
        ['6', '7', '8'],

        // Columns
        ['0', '3', '6'],
        ['1', '4', '7'],
        ['2', '5', '8'],

        // Diagonal
        ['0', '4', '8'],
        ['2', '4', '6']
    ]
}
let xSum = 0;
let oSum = 0;

var opponent = 'x', 
    player = 'o',
    board = [0, 1, 2, 3, 4, 5, 6, 7, 8]

function evaluate(board, player)
{
    if (
        (board[0] == player && board[1] == player && board[2] == player) ||
        (board[3] == player && board[4] == player && board[5] == player) ||
        (board[6] == player && board[7] == player && board[8] == player) ||
        (board[0] == player && board[3] == player && board[6] == player) ||
        (board[1] == player && board[4] == player && board[7] == player) ||
        (board[2] == player && board[5] == player && board[8] == player) ||
        (board[0] == player && board[4] == player && board[8] == player) ||
        (board[2] == player && board[4] == player && board[6] == player)
      ) {
        return true;
      } else {
        return false;
      }
}
 
function minimax(board, depth, isMax)
{
    let score = board.filter((s) => s != 'x' && s != 'o');
    if (evaluate(board, player))
        return 10;
    if (evaluate(board, opponent))
        return -10;
    if (score.length == 0)
        return 0;
    if (isMax)
    {
        let best = -1000;
        for(let i = 0; i < 9; i++)
        {
                if (board[i] == i)
                {
                    board[i] = player;
                    best = Math.max(best, minimax(board, depth + 1, !isMax));
                    board[i] = i;
                }
            
        }
        return best;
    }
    else
    {
        let best = 1000;
        for(let i = 0; i < 9; i++)
        {
                if (board[i] == i)
                {
                    board[i] = opponent;
                    best = Math.min(best, minimax(board,
                                    depth + 1, !isMax));
                    board[i] = i;
                }
            
        }
        return best;
    }
}

function findBestMove(board)
{
    let bestVal = -1000;
    let bestMove = {};
    bestMove.row = -1;
    for(let i = 0; i < 9; i++)
    {
            if (board[i] == i)
            {
                board[i] = player;
                let moveVal = minimax(board, 0, false);
                board[i] = i;
                if (moveVal > bestVal)
                {
                    bestMove.row = i;
                    bestVal = moveVal;
                }
            }
    }
    return bestMove;
}
var qanak = 0
function ogamer(){
    if(qanak == 0){
        qanak++;
        opponent = 'o'
        player = 'x'
        document.querySelectorAll('.Xgame')[0].style.cssText = `
            border-bottom-color: white;
            box-shadow: none;
        `;
        document.querySelectorAll('.Ogame')[0].style.cssText = `
            border-bottom-color: #ed6b5b;;
            box-shadow: 0 4px 5px rgb(0 0 0 / 50%);;
        `;
        console.log(document.querySelectorAll('.Xgame')[0].style)
        var bestMove = findBestMove(board)
        board[bestMove.row] = player;
        game.xState.push(String(bestMove.row))
        var aiGamer = document.getElementsByClassName('box')
        aiGamer[bestMove.row].classList.add('disabled')
        aiGamer[bestMove.row].classList.add('x')
    }
}
document.addEventListener('click', event => {
    const target = event.target
    const isCell = target.classList.contains('box')
    const isDisabled = target.classList.contains('disabled')
    if (isCell && !isDisabled && opponent == 'x') {
        const cellValue = target.dataset.value
        game.xState.push(cellValue) 
        board[cellValue] = opponent;
        target.classList.add('disabled')
        target.classList.add('x')
        

        var bestMove = findBestMove(board)
        if(bestMove.row !== -1){
            board[bestMove.row] = player;
            game.oState.push(String(bestMove.row))
            var aiGamer = document.getElementsByClassName('box')
            setTimeout(() => {
                aiGamer[bestMove.row].classList.add('disabled')
                aiGamer[bestMove.row].classList.add('o')
            }, 500)
        }
    }
    else if(isCell && !isDisabled) {
        const cellValue = target.dataset.value
        game.oState.push(cellValue) 
        board[cellValue] = opponent;
        target.classList.add('disabled')
        target.classList.add('o')
        
        var bestMove = findBestMove(board)
        if(board[bestMove.row] != 'o'){
            setTimeout(() => {

                board[bestMove.row] = player;
                game.xState.push(String(bestMove.row))
                var aiGamer = document.getElementsByClassName('box')
                aiGamer[bestMove.row].classList.add('disabled')
                aiGamer[bestMove.row].classList.add('x')
            }, 250)
        }    
    }
    setTimeout(() => {
        if (!document.querySelectorAll('.box:not(.disabled)').length) {
            document.querySelectorAll('.match')[0].style.display = "none";
            document.querySelector('.winner-massage').classList.add('visible')
            document.querySelector('.gamer-winner').textContent = 'X'
            document.querySelector('.gamer-draw').textContent = 'O'
            document.querySelector('.gamer-text').textContent = 'Draw!'
        }
    
        game.winningStates.forEach(winningState => {
            const xWins = winningState.every(state => game.xState.includes(state))
            const oWins = winningState.every(state => game.oState.includes(state))
            if (xWins || oWins) {
                document.querySelectorAll('.box').forEach(cell => cell.classList.add('disabled'))
                document.querySelectorAll('.match')[0].style.display = "none";
                document.querySelector('.winner-massage').classList.add('visible')
                document.querySelector('.gamer-winner').textContent = xWins ? 'X': 'O';
                xWins ?
                document.querySelector('.xGamerNumber').textContent =  ++xSum :
                document.querySelector('.oGamerNumber').textContent =  ++oSum ;
                document.querySelector('.gamer-winner').style.color = xWins ? '#2f0f0f': 'white'
                document.querySelector('.gamer-text').textContent = "Wins!"
                
            }
        })
    
        document.querySelector('.winner-massage').addEventListener('click', event => {
            document.querySelector('.gamer-winner').classList.remove('visible')
            document.querySelectorAll('.match')[0].style.display = "grid";
            document.querySelectorAll('.box').forEach(cell => {
                cell.classList.remove('disabled', 'x', 'o')
            })
            document.querySelectorAll('.Xgame')[0].style.cssText = `
                border-bottom-color: #ed6b5b;;
                box-shadow: 0 4px 5px rgb(0 0 0 / 50%);
            `;
            document.querySelectorAll('.Ogame')[0].style.cssText = `
                border-bottom-color: white;
                box-shadow: none;
            `;
            qanak = 0;
            opponent = 'x',
            player = 'o'
            board = [0, 1, 2, 3, 4, 5, 6, 7, 8]
            game.xTurn = true
            game.xState = []
            game.oState = []
        });
    }, 450)
})