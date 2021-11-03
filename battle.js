const board = document.querySelector("#board");
const boardAttack = document.querySelector("#boardAttack");
const position = document.querySelectorAll(".position");

let matrix = [];
let matrixAttack = [];

const sizeShip = [5, 4, 3, 2];
const positionArray = ["horizontal", "vertical"]

let quantityShip = [1, 1, 1, 2];
let quantityShipPC =  [1, 1, 1, 2];
let ship = {};
let shipRandom = {};

//Función para creación de tableros
function createMatrix(boardType, matrixType, func, type){
    for(let i=0; i<10; i++){
        let list = []
        let row = document.createElement("div");
        boardType.appendChild(row);
        row.className = "myRow"
        for(let j=0; j<10; j++){
            let grid = document.createElement("div");
            row.appendChild(grid);
            grid.className = "grid";
            grid.id = i + "," + j + "," + type;
            grid.addEventListener("click", func);
            list.push("");
        }
        matrixType.push(list)
    }
}
//Función para seleccionar barco
function selectShip(event){
    shipData = event.target.className.split(" ");
    ship.position = shipData[0];
    ship.size = sizeShip[shipData[1]];
    ship.quantity = quantityShip[shipData[1]];
    ship.id = shipData[1];
}

//Creación de tablero jugador
createMatrix(board, matrix, selectPosition, "player");
//Creación de barcos
for(let i=0; i<position.length; i++){
    let horizontal = document.createElement("div");
    position[i].appendChild(horizontal);
    horizontal.className = "horizontal " + i;
    horizontal.addEventListener("click", selectShip)
    let vertical = document.createElement("div");
    position[i].appendChild(vertical);
    vertical.className = "vertical " + i;
    vertical.addEventListener("click", selectShip)
}

//Función para seleccionar posición de los barcos
function selectPosition(event){
    if(ship.quantity > 0){
        let grid = event.target
        let gridID = grid.id.split(",");
        let x = parseInt(gridID[0]);
        let y = parseInt(gridID[1]);
        if(ship.position === "horizontal"){
            if((y + (ship.size - 1)) < 10){
                for(let i=y; i<(y + ship.size); i++){
                    matrix[x][i] = "ship";
                    document.getElementById(x + "," + i + "," + "player").className += " selected";
                }
                quantityShip[ship.id] -= 1;
                ship = {}
            }
            else{
                alert("Selecciona una posición válida");
            }
        }
        else if(ship.position === "vertical"){
            if((x + (ship.size - 1)) < 10){
                for(let i=x; i<(x + ship.size); i++){
                    matrix[i][y] = "ship";
                    document.getElementById(i + "," + y + "," + "player").className += " selected";
                }
                quantityShip[ship.id] -= 1;
                ship = {}
            }
            else{
                alert("Selecciona una posición válida");
            }
        }
    }
    else{
        alert("Debes seleccionar un barco disponible");
    }
}

//Función de botón iniciar juego
function startGame(){
    createMatrix(boardAttack, matrixAttack, checkShot, "pc");
    selectPositionRandom()
    document.querySelector("#button").disabled = true;
}
//Generar posición random de barcos
function selectPositionRandom(){
    for(let i=0; i<quantityShipPC.length; i++){
        while(quantityShipPC[i] > 0){
            random(i);
            quantityShipPC[i] -= 1;
        }
    }
}

//Verificación de posición válida
function checkPosition(pos, axis, size){
    if(shipRandom.position  === pos){
        if((axis + (size - 1)) < 10){
            return true;
        }
        else{
            return false;
        }
    }
}

//Función para crear barco random
function random(i){
    shipRandom.position = positionArray[Math.floor(Math.random() * Math.floor(positionArray.length))];
    shipRandom.x = Math.floor(Math.random() * Math.floor(10));
    shipRandom.y = Math.floor(Math.random() * Math.floor(10));
    if(checkPosition("horizontal", shipRandom.y, sizeShip[i])){
        for(let j=shipRandom.y; j<(shipRandom.y + sizeShip[i]); j++){
            if(matrixAttack[shipRandom.x][j] === "ship"){
                return random(i)
            }
        }
        for(let j=shipRandom.y; j<(shipRandom.y + sizeShip[i]); j++){
            matrixAttack[shipRandom.x][j] = "ship";
        }
    }
    else if(checkPosition("vertical", shipRandom.x, sizeShip[i])){
        for(let j=shipRandom.x; j<(shipRandom.x + sizeShip[i]); j++){
            if(matrixAttack[j][shipRandom.y] === "ship"){
                return random(i)
            }
        }
        for(let j=shipRandom.x; j<(shipRandom.x + sizeShip[i]); j++){
            matrixAttack[j][shipRandom.y] = "ship";
        }
    }
    else{
        return random(i)
    }
}

//Verificar tiro de jugador
function checkShot(event){
    let grid = event.target
    let gridID = grid.id.split(",");
    let x = parseInt(gridID[0]);
    let y = parseInt(gridID[1]);
    if(matrixAttack[x][y] === "ship"){
        alert("Muy bien, acertaste. Vuelve a jugar");
        matrixAttack[x][y] = "hit";
        document.getElementById(x + "," + y + "," + "pc").className += " hit";
        checkWinner(matrixAttack, "player")
    }
    else{
        alert("Mal! tu disparo cayó al agua");
        matrixAttack[x][y] = "miss";
        document.getElementById(x + "," + y + "," + "pc").className += " miss";
        shotPc()
    }
}

//Jugada del PC
function shotPc(){
    let x = Math.floor(Math.random() * Math.floor(10));
    let y = Math.floor(Math.random() * Math.floor(10));
    if(matrix[x][y] === "ship"){
        alert("Ops! te han disparado");
        matrix[x][y] = "hit";
        document.getElementById(x + "," + y + "," + "player").className += " hit";
        checkWinner(matrix, "pc");
        return shotPc();
    }
    else if(matrix[x][y] === "hit" || matrix[x][y] === "miss"){
        return shotPc();
    }
    else{
        alert("El disparo del pc cayó al agua");
        matrix[x][y] = "miss";
        document.getElementById(x + "," + y + "," + "player").className += " miss";
    }
}

//Revisar ganador
function checkWinner(matrix, player){
    for(let i=0; i<10; i++){
        let arraychecked = matrix[i].filter((index)=>{return index === "ship"})
        if(arraychecked.length > 0){
            return
        }
    }
    if(player === "pc"){
        alert("Ha ganado el PC")
    }
    else{
        alert("GANASTE!!!")
    }
}