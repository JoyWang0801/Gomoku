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
    next_move: UserB,
    posX: 0,
    posY: 0
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

function setReady(button_element)
{
    const characterId = button_element.parentElement.id;
    console.log(characterId);
    if (characterId === "Player1") {
        if(!UserA.ready)
        {
            button_element.style.backgroundColor = "green";
        }
        else
        {
            button_element.style.backgroundColor = "red";
        }
        UserA.ready = !UserA.ready ;
    } else if (characterId === "Player2") {
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
}

function changeTeam(button_element)
{
    const characterId = button_element.parentElement.id;
    let newSrc;
    if (characterId === "Player1") {
        if (UserA.team === "white") {
            UserA.team = "black";
            userMovement.next_move = UserA;
        } else {
            UserA.team = "white";
        }
        newSrc = `Assets/${UserA.team}_cute.png`;
    } else if (characterId === "Player2") {
        if (UserB.team === "white") {
            UserB.team = "black";
            userMovement.next_move = UserB;
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
    let playerTeam
    if(userMovement.next_move === UserB)
    {
         playerTeam = UserB.team;
         userMovement.next_move = UserA;
    }
    else
    {
        playerTeam = UserA.team;
        userMovement.next_move = UserB;
    }

    new_move.src = `Assets/${playerTeam}.png`
    className = `${playerTeam}`;
    new_move.classList.add("piece");
    let src = document.getElementById("all-pieces");
    new_move.style.left = userMovement.posX+"px";
    new_move.style.top = userMovement.posY+"px";


    src.appendChild(new_move);

}
