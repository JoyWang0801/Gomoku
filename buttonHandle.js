/* Course: SENG 513 */
/* Date: Oct 23, 2023 */
/* Assignment 2 */
/* Name: Joy Wang */
/* UCID: 30201929 */

// use to store playerA's character icon, piece color, number of winning round, readiness status and last piece coord
UserA: icon, team, win, ready, lastMove
// use to store playerB's character icon, piece color, number of winning round, readiness status and last piece coord
UserB: icon, team, win, ready, lastMove
// use to store current move player, and current cursor x and y coordinate
userMovement: current_mover, posX, posY
// gameboardlist width and heigth(all 16), game mode: bo1, bo3 or bo5, determine mobile version based on current screen size
gameSetting: width, heigh, mode, mobile
// enum for game status
gameStatus: pause, going, end
gameBoard[gameSetting.width][gameSetting.heigh]


/*
* This is an event listener, get pouse position when cursor hover game board
*
*
* mouse_pos_x, mouse_pos_y = mouse position
* calculatePiecePosition(mouse_pos_x, mouse_pos_y)
*/
getCoords(event)

/*
* Goal is to find the closest intersection point
* This function takes in x and y coordinate in pixel value
* convert into game board list index, and then get the closest intersection point
*
*
* cell_width, cell_height
* userMovement.posX = floor division(x/cell_width)
* userMovement.posY = floor division(y/cell_height)
* if remainder > 0.5:
*   userMovement.posX + 1
* if remainder > 0.5:
*    userMovement.posY + 1
*   set <img #select> position = userMovement.posX, userMovement.posY
*/

calculatePiecePosition(x, y)

/*
* add a <img> to <div .all-pieces> bsed on current player's team
*
*   if gameboard[posY][posX] is empty:
*       <img> newmove
*       Set the player's team
*       Set the newmove's image source based on the team
*       Add this newmove to the game board
*       set position = userMovement.posX, userMovement.posY
*       Add this move to the gameBoard[][]
*       checkAlign()
*           player win the round
*           user.win++
*           if total round == gamemode
*               game status = end
*               display winner
*       Switch the current player
*
*/
takeStep()


/*
Check gameboard status based on last movement
return true if aligned 5
else return false
 */
checkAlign()

/*
Get two number input, to update new game score
 */
updateGameScore(a, b)


/*
takes in player team and x,y coordinates as input
 create an element based on player's team, place it under "all-pieces" div put image at (x,y)
 */
placePieceUI(playerTeam, x, y)

/*
take x and y coordinate pass in
go through surrounding 8 cells to see if any pieces are same colour
if there is piece from the same team:
    continueCheckAlign();
 */
checkSurround(x, y)

/*
    follow the direction to check if there are 5 in a row
*/
continueCheckAlign(x, y, deltaX, deltaY, currentColou)

/*
 Implement a countdown timer for each player's move
 when timer == 0:
    switchRole();

*/
userMovementCountdown()

/*
    Switch the current player's role and reset their timer to 5 minutes
*/
switchRole()

/*
Based on the button clicked, change the team (color) of the player
 */
changeTeam(button_element)

/*
Change the readiness of a player for the game
If both players are ready, start a game countdown
game countdown 3s, and display text in the middle shows game start
then start eh black colour player's tunr count down
 */
setReady(button_element)

/*
Change the player's character image based on the button clicked
 */
changeCharacterImage(button_element)

/*
Cycle through different game modes: BO1, BO3, BO5
and update gameSetting.mode based on click
 */
changeGamemode()

/*
Remove all pieces from the game board UI
and set gameboard list to all empty
reset current mover to black colour user
 */
clearBoard()

/*
Reset the game to its initial state
 */
reset()

/*
Remove the last pieces from the game board UI and gameboard list based on player
 */
withdrawPiece()

/*
change winner character image based on winner, and display text
show the crown on the top-right corner of winner's icon
 */
displayWinner()