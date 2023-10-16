const UserA =
{
    icon: 1,
    team: "white",
    win: 3,
    ready: 0
}

const UserB =
{
    icon: 2,
    team: "black",
    win: 2,
    ready: 0
}

function changeImage(button_element) {
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
