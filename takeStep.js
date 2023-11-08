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

        if (gameBoard[posY][posX] == 0 || gameBoard[posY][posX] == null) {
            placePieceUI(playerTeam, posY, posX);
            gameBoard[posY][posX] = playerTeam === "black" ? 1 : 2;
            userMovement.current_mover.lastMove = {posX, posY}
            if (checkSurround(posX, posY)) {
                gameSetting.status = gameStatusEnum.pause;
                userMovement.current_mover.win++;
                updateGameScore(UserA.win, UserB.win)
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