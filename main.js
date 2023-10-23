const UserA =
{
    icon: 1,
    team: "white",
    win: 3,
    ready: 0,
    lastMove: {x: 0, y: 0}
}

const UserB =
{
    icon: 2,
    team: "black",
    win: 2,
    ready: 0,
    lastMove: {x: 0, y: 0}
}

const userMovement=
{
    current_mover: UserB,
    posX: 0,
    posY: 0
}

const gameSetting =
{
    width: 16,
    heigh: 16,
    mode: 1,
    mobile: window.innerWidth < 680
}

let gameBoard;

(() => {
    let gameBoardList = function() {
        let arr = [];
        for(let i = 0; i < gameSetting.height; i++) {
            arr.push(new Array(gameSetting.width).fill(0));
        }
        return arr;
    };

    gameBoard = gameBoardList();
})();

function getCoords(event) {
    var x = event.clientX - 85;
    var y = event.clientY - 55;
    [userMovement.posX, userMovement.posY] = calculatePiecePosition(x,y);
    const selectTarget = document.getElementById("select");
    selectTarget.style.left = userMovement.posX+"px";
    selectTarget.style.top = userMovement.posY+"px";
    console.log(x, y, userMovement.posX, userMovement.posY);

}

function calculatePiecePosition(x, y)
{
    //top left: 151,50
    //bottom right: 468, 339

    //window.screen.height;
    if(window.screen.width)
    {
        let new_x = x - 19;
        let new_y = y - 20;
        new_x = Math.floor(new_x/22);
        new_y = Math.floor(new_y/25);
        return [new_x*22 + 19, (new_y+1)*25];
    }
    else
    {
        let new_x = x - 19;
        let new_y = y - 20;
        new_x = Math.floor(new_x/22);
        new_y = Math.floor(new_y/25);
        return [new_x*22 + 19, (new_y+1)*25];
    }
}

function takeStep()
{
    let new_move = document.createElement("img");
    let playerTeam;
    if(userMovement.current_mover === UserB)
    {
         playerTeam = UserB.team;
    }
    else
    {
        playerTeam = UserA.team;
    }

    new_move.src = `Assets/${playerTeam}.png`
    className = `${playerTeam}`;
    new_move.classList.add("piece");
    let src = document.getElementById("all-pieces");
    new_move.style.left = userMovement.posX+"px";
    new_move.style.top = userMovement.posY+"px";
    src.appendChild(new_move);

    new_x = Math.floor(userMovement.posX/22);
    new_y = Math.floor(userMovement.posY/25);

    gameBoard[new_y][new_x] = playerTeam === "black" ? 1 : 2;

    switchRole();
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
}

function setReady(button_element)
{
    const characterId = button_element.parentElement.id;
    console.log(characterId);
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

    if(UserA.ready && UserB.ready)
    {
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
                    console.log(`width: ${gameSetting.mobile}`);
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
            console.log(cd.innerHTML)
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
    let select = document.getElementById("select");
    select.remove();
}

function reset()
{
    switchRole();
    switchRole();
    document.getElementById("game-score").innerHTML = "0:0";
    clearBoard();
}

//TODO - organize algorithm
//     - add select back
//     - adjust game score
//     - update coordinate to let withdraw
//     - add game status to pause and prohibit placing pieces

