/*
    Course: SENG 513
    Date: Nov.7
    Assignment 3
    Name: Joy Wang
    UCID: 30102919
*/
function takeStep()
{
    if (gameSetting.status === gameStatusEnum.going) {
        let playerTeam;
        // get current user piece colour
        if (userMovement.current_mover === UserB) {
            playerTeam = UserB.team;
        } else {
            playerTeam = UserA.team;
        }

        // get index position
        let posX = userMovement.indexX - 1;
        let posY = userMovement.indexY - 1;

        // if the position is empty (valid to put a piece at this spot)
        if (gameBoard[posY][posX] == 0 || gameBoard[posY][posX] == null) {
            placePieceUI(playerTeam, posY, posX);
            gameBoard[posY][posX] = playerTeam === "black" ? 1 : 2;

            // keep tracking of each user's last movement
            userMovement.current_mover.lastMove.x = posX;
            userMovement.current_mover.lastMove.y = posY;

            // check if there are any connecting pieces
            if (checkSurround(posX, posY)) {
                gameSetting.status = gameStatusEnum.pause;
                // current winner add point
                userMovement.current_mover.win++;
                updateGameScore(UserA.win, UserB.win)
                // game mode
                if((UserA.win + UserB.win) === gameSetting.mode)
                {
                    gameSetting.status = gameStatusEnum.end;
                    displayWInner();
                    return 0;
                }
            }
            switchRole();
        }
    }
}

// this function add corresponding piece img tag to the html file
function placePieceUI(playerTeam)
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

// check nearby 8 positions to check if there are any connecting 2
// if so, continue check +- 5 positions
function checkSurround(x, y)
{
    let currentColour = userMovement.current_mover.team === "black" ? 1 : 2;
    for(let j = -1; j < 2; j++)
    {
        for(let i = -1; i < 2; i++)
        {
            newX = x + i;
            newY = y + j;

            if((newX == x && newY == y)
                || newX < 0
                || newY < 0
                || newX > gameSetting.width - 1
                || newY > gameSetting.height - 1)
            {
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

// check +- 5 positions to see if any connecting five
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
            //log("Edge")
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
            //log("Edge")
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

    //log(path)
    return (accumulate >= 5);
}