const UserA =
{
    icon: 1,
    team: "white",
    win: 0,
    ready: 0,
    lastMove: {x: 0, y: 0},
    canWithdraw: true
}

const UserB =
{
    icon: 2,
    team: "black",
    win: 0,
    ready: 0,
    lastMove: {x: 0, y: 0},
    canWithdraw: true
}

const userMovement=
{
    current_mover: UserB,
    posX: 0,
    posY: 0,
    indexX: 0,
    indexY: 0
}
const gameStatusEnum =
{
    "pause":0,
    "going":1,
    "end":2
}

const gameSetting =
{
    width: 16,
    height: 16,
    mode: 1,
    mobile: window.innerWidth < 680,
    status: gameStatusEnum.end
}



let gameBoard;

(function () {
    var gameBoardList = function() {
        let arr = [];
        for(let i = 0; i < gameSetting.height; i++) {
            arr.push(new Array(gameSetting.width).fill(0));
        }
        return arr;
    };

    gameBoard = gameBoardList();
})();

//copied and pasted this algorithm to get mouse position from the following link:
//https://stackoverflow.com/questions/3234256/find-mouse-position-relative-to-element/42111623#42111623
function getCoords(event) {
    if(gameSetting.status === gameStatusEnum.going)
    {
        const rect = document.getElementById("game-board").getBoundingClientRect();
        let x = event.clientX - rect.left; //x position within the element.
        let y = event.clientY - rect.top;  //y position within the element.

        let rect_width = rect.right - rect.left;
        let rect_height = rect.bottom - rect.top;
        let x_perc = Math.round(x / rect_width * 100);
        let y_perc = Math.round(y / rect_height * 100);
        //console.log(`Left: ${x_perc}% ; Top: ${y} or ${y_perc}%.`);

        [userMovement.posX, userMovement.posY] = calculatePiecePosition(x_perc,y_perc);

        const selectTarget = document.getElementById("select");
        selectTarget.style.left = userMovement.posX+"%";
        selectTarget.style.top = userMovement.posY+"%";
    }

    console.log(gameSetting.status);
}

function calculatePiecePosition(x, y)
{
    //window.screen.height;

    let new_x = Math.floor(x/6);
    let new_y = Math.floor(y/6);

    if(new_x > 16){new_x = 16;}
    if(new_y > 16){new_y = 16;}
    if(new_x < 1){new_x = 1;}
    if(new_y < 1){new_y = 1;}

    //console.log(`${new_x}, ${new_y}`)
    userMovement.indexX = new_x;
    userMovement.indexY = new_y;

    return_x = new_x * 6 - 3;
    return_y = new_y * 6 - 3;

    return [return_x, return_y];

}

function takeStep()
{
    if (gameSetting.status === gameStatusEnum.going) {
        let playerTeam;
        let playerIcon;
        if (userMovement.current_mover === UserB) {
            playerTeam = UserB.team;
        } else {
            playerTeam = UserA.team;
        }

        let posX = userMovement.indexX - 1;
        let posY = userMovement.indexY - 1;

        //console.log(gameBoard);

        if (gameBoard[posY][posX] == 0 || gameBoard[posY][posX] == null) {
            placePieceUI(playerTeam, posY, posX);
            //console.log(posX, posY)
            gameBoard[posY][posX] = playerTeam === "black" ? 1 : 2;
            userMovement.current_mover.lastMove = {posX, posY}
            if (checkSurround(posX, posY)) {
                gameSetting.status = gameStatusEnum.pause;
                //console.log("WIN A ROUND!");
                userMovement.current_mover.win++;
                updateGameScore(UserA.win, UserB.win)
                console.log(userMovement.current_mover)
                if(UserA.win + UserB.win === gameSetting.mode)
                {
                    gameSetting.status = gameStatusEnum.end;
                    displayWInner();
                }
            }
            switchRole();
        }
    }
}

function updateGameScore(a, b)
{
    document.getElementById("game-score").innerHTML = `${a}:${b}`
}

function placePieceUI(playerTeam, x, y)
{
    let element = document.createElement("img");
    element.src = `Assets/${playerTeam}.png`
    className = `${playerTeam}`;
    element.classList.add("piece");
    element.classList.add(userMovement.current_mover.team);
    let src = document.getElementById("all-pieces");
    element.style.left = `${userMovement.posX - 1}%`;
    element.style.top = `${userMovement.posY - 1}%`;
    src.appendChild(element);
}

function checkSurround(x, y)
{
    let currentColour = userMovement.current_mover.team === "black" ? 1 : 2;
    for(let j = -1; j < 2; j++)
    {
        for(let i = -1; i < 2; i++)
        {
            newX = x + i;
            newY = y + j;

            console.log(x, y, newX, newY)

            if((newX == x && newY == y)
                || newX < 0
                || newY < 0
                || newX > gameSetting.width - 1
                || newY > gameSetting.height - 1)
            {
                console.log("should continue");
                continue;
            }

            if(gameBoard[newY][newX] == currentColour)
            {
                // if five align return true
                if(continueCheckAlign(newX, newY, i, j, currentColour)){return true;}
                // else continue
            }
        }
    }

    return false;
}

function continueCheckAlign(x, y, deltaX, deltaY, currentColour)
{
    let path = Array(9).fill(0);
    path[4] = 1;
    for(let i = 1; i < 5; i++)
    {
        let newX = x + deltaX * i * -1;
        let newY = y + deltaY * i * -1;
        if(newX < 0
            || newY < 0
            || newX > gameSetting.width - 1
            || newY > gameSetting.height - 1)
        {
            console.log("Edge")
        }
        else if(currentColour === gameBoard[newY][newX])
        {
            path[4 - i] = 1;
        }

        newX = x + deltaX * i;
        newY = y + deltaY * i;
        if(newX < 0
            || newY < 0
            || newX > gameSetting.width - 1
            || newY > gameSetting.height - 1)
        {
            console.log("Edge")
        }
        else if(currentColour === gameBoard[newY][newX])
        {
            path[4 + i] = 1;
        }
    }

    let accumulate = 0;
    for(p of path)
    {
        if(p === 1)
        {
            accumulate++;
        }
        else
        {
            accumulate = 0;
        }

        if(accumulate >= 5)
        {
            return true;
        }
    }

    console.log(path)
    return (accumulate >= 5);
}

function userMovementCountdown()
{
    const movementInterval = setInterval(function() {
        let playerCountdown;
        if(userMovement.current_mover === UserB)
        {
            playerCountdown = document.querySelector("#PlayerB .countdown").innerHTML;
        }
        else
        {
            playerCountdown = document.querySelector("#PlayerA .countdown").innerHTML;
        }

        let timerArray = playerCountdown.split(":");
        let min = parseInt(timerArray[0]);
        let sec = parseInt(timerArray[1]);

        if(sec > 0 && sec < 10)
        {
            sec = "0" + timerArray[1];
        }
        if(sec == 0)
        {
            min = min - 1;
            sec =  59;
        }
        else
        {
            sec = sec - 1;
        }

        if(min < 0)
        {
            switchRole();
        }
        else
        {
            if(userMovement.current_mover === UserB)
            {
                document.querySelector("#PlayerB .countdown").innerHTML = `${min}:${sec}`;
            }
            else
            {
                document.querySelector("#PlayerA .countdown").innerHTML = `${min}:${sec}`;
            }
        }
    }, 1000);
}

function switchRole()
{
    if(userMovement.current_mover === UserB)
    {
        document.querySelector("#PlayerB .countdown").innerHTML = "5:00";
        userMovement.current_mover = UserA;
    }
    else
    {
        document.querySelector("#PlayerA .countdown").innerHTML = "5:00";
        userMovement.current_mover = UserB;
    }
}

function changeTeam(button_element)
{
    const characterId = button_element.parentElement.id;
    let newSrc;
    if (characterId === "PlayerA") {
        if (UserA.team === "white") {
            UserA.team = "black";
            userMovement.current_mover = UserA;
        } else {
            UserA.team = "white";
        }
        newSrc = `Assets/${UserA.team}_cute.png`;
    } else if (characterId === "PlayerB") {
        if (UserB.team === "white") {
            UserB.team = "black";
            userMovement.current_mover = UserB;
        } else {
            UserB.team = "white";
        }
        newSrc = `Assets/${UserB.team}_cute.png`;
    }

    if(newSrc)
    {
        let imgElement = button_element.querySelector('img');
        imgElement.src = newSrc;
    }
    checkReady();
}

function setReady(button_element)
{
    const characterId = button_element.parentElement.id
    if (characterId === "PlayerA") {
        if(!UserA.ready)
        {
            button_element.style.backgroundColor = "green";
        }
        else
        {
            button_element.style.backgroundColor = "red";
        }
        UserA.ready = !UserA.ready ;
    } else if (characterId === "PlayerB") {
        if(!UserB.ready)
        {
            button_element.style.backgroundColor = "green";
        }
        else
        {
            button_element.style.backgroundColor = "red";
        }
        UserB.ready = !UserB.ready ;
    }

    checkReady();
}

function checkReady()
{

    let checkStart = () =>
    {
        let team = UserA.team !== UserB.team;
        return (UserA.ready && UserB.ready && team);
    }

    if(checkStart() === true)
    {
        for(btn of document.getElementsByClassName("select-color"))
        {
            btn.disabled = true;
        }

        document.getElementsByClassName("display-middle")[0].style.display = "block";
        gameSetting.status = gameStatusEnum.going;
        const gamestartInterval = setInterval(function() {
            const cd = document.getElementById("gamestart-countdown");
            cd.innerHTML = parseInt(cd.innerHTML) - 1;

            switch (cd.innerHTML)
            {
                case "0":
                    cd.innerHTML = "start!";
                    if(gameSetting.mobile)
                    {
                        cd.style.left = "-3vw";
                    }
                    else
                    {
                        cd.style.left = "5vw";
                    }
                    break;
                case "1":
                    cd.style.color= "green";
                    break;
                case "2":
                    cd.style.color= "yellow";
                    break;
                case "NaN":
                    cd.style.display = "none";
                    clearInterval(gamestartInterval);
                    userMovementCountdown();
                    break;
            }
        }, 1000);
    }
}

function changeCharacterImage(button_element) {
    // Check the ID of the button that was clicked
    let characterId = button_element.id;

    // Determine the new image source based on which button was clicked
    let newSrc;
    if (characterId === 'character1') {
        let icon_index = (UserA.icon + 1) % 7 + 1;
        newSrc = `Assets/Character${icon_index}.jpg`;
        UserA.icon = icon_index;
    } else if (characterId === 'character2') {
        let icon_index = (UserB.icon + 1) % 7 + 1;
        newSrc = `Assets/Character${icon_index}.jpg`;
        UserB.icon = icon_index;
    }

    // Change the image source
    if (newSrc) {
        let imgElement = button_element.querySelector('img');
        imgElement.src = newSrc;
    }
}

function changeGamemode()
{
    switch (gameSetting.mode)
    {
        case 1:
            document.getElementById("game-mode").innerHTML = "Gamemode: BO3";
            gameSetting.mode = 3;
            break;
        case 3:
            document.getElementById("game-mode").innerHTML = "Gamemode: BO5";
            gameSetting.mode = 5;
            break;
        case 5:
            document.getElementById("game-mode").innerHTML = "Gamemode: BO1";
            gameSetting.mode = 1;
            break;
    }
}

function clearBoard()
{
    let pieces = document.getElementById("all-pieces")
    pieces.innerHTML = ' ';
    for(let i = 0; i < gameBoard.length; i++)
    {
        gameBoard[i] = Array(gameSetting.width).fill(0);
    }
    userMovement.current_mover = UserB.team === "black" ? UserB : UserA;
    console.log("clear board " + gameSetting.status);
    gameSetting.status =  (gameSetting.status === gameStatusEnum.end) ? gameStatusEnum.end : gameStatusEnum.going;
}

function reset()
{
    gameSetting.status = gameStatusEnum.pause;
    switchRole();
    switchRole();
    document.getElementById("game-score").innerHTML = "0:0";
    clearBoard();
    document.getElementById("winner").style.display = "none";
    UserB.win = 0;
    UserA.win = 0;
}

function withdrawPiece(button_element)
{
    const characterId = button_element.parentElement.id
    if(gameSetting.status === gameStatusEnum.going)
    {
        if (characterId === "PlayerA" && UserA.canWithdraw) {
            let pieceDiv = document.getElementById("all-pieces");
            let className = "." + UserA.team.toString();
            let aMoves = pieceDiv.querySelectorAll(className);
            console.log(aMoves);

            if (aMoves.length > 0) {
                pieceDiv.removeChild(aMoves[aMoves.length-1]);
                gameBoard[UserA.lastMove.x] = 0;
                gameBoard[UserA.lastMove.y] = 0;
                UserA.canWithdraw = false;
            }
        } else if (characterId === "PlayerB") {
            let pieceDiv = document.getElementById("all-pieces");
            let className = "." + UserB.team.toString();
            let bMoves = pieceDiv.querySelectorAll(className);
            console.log(bMoves);

            if (bMoves.length > 0) {
                pieceDiv.removeChild(bMoves[bMoves.length-1]);
                gameBoard[UserB.lastMove.x] = 0;
                gameBoard[UserB.lastMove.y] = 0;
                UserB.canWithdraw = false;
            }
        }
    }
}

function displayWInner()
{
    let winner = (UserA.win > UserB.win) ? UserA : UserB;
    let winnerCharacter = document.getElementById("winner-character");
    let newSrc = `Assets/Character${winner.icon}.jpg`;
    winnerCharacter.src = newSrc;
    document.getElementById("winner").style.display = "block";
}

//TODO - organize algorithm
//     - add select back
//     - adjust game score
//     - update coordinate to let withdraw
//     - add game status to pause and prohibit placing pieces

