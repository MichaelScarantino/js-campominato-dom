// L'utente indica un livello di difficoltà in base al quale viene generata una griglia di gioco quadrata, 
// in cui ogni cella contiene un numero tra quelli compresi in un range:
// con difficoltà 1 => tra 1 e 100
// con difficoltà 2 => tra 1 e 81
// con difficoltà 3 => tra 1 e 49
// Quando l'utente clicca su ogni cella, la cella cliccata si colora di azzurro.

// ---------------------------------------------------------------------------------------------------------

// [x] Il computer deve generare 16 numeri casuali nello stesso range della difficoltà prescelta: le bombe.
// [x] I numeri nella lista delle bombe non possono essere duplicati.
// [x] In seguito l'utente clicca su una cella: se il numero è presente nella lista dei numeri generati 
//                - abbiamo calpestato una bomba 
//                - la cella si colora di rosso e la partita termina, 
//    altrimenti 
//                - la cella cliccata si colora di azzurro e 
//                - l'utente può continuare a cliccare sulle altre celle.
// [x] La partita termina quando il giocatore clicca su una bomba o raggiunge il numero massimo possibile di numeri consentiti.
// [x] Al termine della partita il software deve comunicare il punteggio, cioè il numero di volte che l’utente ha cliccato su una cella che non era una b.


// seleziono l'id del bottone, quando eseguo il click sul bottone si visualizza la griglia
const userPlay = document.getElementById('play');
userPlay.addEventListener('click', playGame);

function playGame() {
    // aggiungo la classe hidden all' h2 e la tolgo alla griglia
    const introText = document.getElementById('intro-text');
    introText.classList.add('hidden');

    const mainGrid = document.getElementById('grid');
    mainGrid.classList.remove('hidden');
    // pulisto la griglia e inserisco la classe hidden all'h2
    mainGrid.innerHTML = '';
    document.getElementById('endgamemessage').classList.add('hidden');

    // imposto una variabile con il numero di bombe presenti nel gioco
    const maxBombNumber = 16;

    // leggere la difficoltà impostata dall'utente
    const userDifficulty = document.getElementById('difficulty-type').value;
    let numbersOfCells;
    let gridDimension;
    // comparo la difficoltà scelta dall'utente con la value 
    if(userDifficulty === 'easy') {
        numbersOfCells = 100;
        gridDimension = 10;
    } else if(userDifficulty === 'hard') {
        numbersOfCells = 81;
        gridDimension = 9;
    } else if(userDifficulty === 'crazy') {
        numbersOfCells = 49;
        gridDimension = 7;
    }
    // genero 16 numeri casuali nello stesso range della difficoltà prescelta: le bombe.
    const bombArray = generateBombArray(numbersOfCells, maxBombNumber)
    console.log(bombArray);
    // calcolo il numero massimo di tentativi dopo il quale l'utente ha vinto
    const maxUserAttemps = numbersOfCells - bombArray.length;
    // creo un array in cui inserisco i tentativi corretti dell'utente
    const rightUserAttemps = [];

    // creo le celle in base al livello
    for( let i = 1; i <= numbersOfCells; i++ ) {
        const newGeneratedCell = generateCellsItem(i, gridDimension);
        
        newGeneratedCell.addEventListener('click', cellsClick);
        mainGrid.appendChild(newGeneratedCell);
    }
    
    // funzione al clik su una cella
    function cellsClick() {
        // leggo il valore della cella cliccata dall'utente
        const clickNumber = parseInt( this.querySelector('span').textContent );

        // se il numero è presente nella lista dei numeri generati:
        if (bombArray.includes(clickNumber)) {
            // abbiamo calpestato una bomba 
            // la cella si colora di rosso e la partita termina
            this.classList.add('red');
            endGame('lose');
        } else {
            // altrimenti 
            // la cella cliccata si colora di azzurro 
            this.classList.add('active');
            // l'utente può continuare a cliccare sulle altre celle ma non su quelle già cliccate.
            this.style.pointerEvents = "none";
            // il numero cliccato viene aggiunto nell'array dei tentativi corretti
            rightUserAttemps.push(clickNumber);
            // se i tentativi sono uguali al numero massimo di tentativi il gioco finisce e l'utente ha vinto
            if(rightUserAttemps.length >= maxUserAttemps) {
                endGame('win');
            }
        }
        
    }

    // funzione che specifica se l'utente ha vinto o perso
    // winOrLose = win se l'utente ha vinto e lose se l'utente ha perso
    function endGame(winOrLose) {
        let winOrLoseMessage;
        if(winOrLose === 'win') {
        // se l'utente ha vinto
            winOrLoseMessage = 'Congratulazioni! Hai vinto.';
        } else {
            // se l'utente ha perso inserisco il numero di tentativi azzeccati 
            winOrLoseMessage = 'Hai perso, hai azzeccato ' + rightUserAttemps.length + ' tentativi.';
        }
        // messaggio finale da stampare per l'utente
        const endGameMessage = document.getElementById('endgamemessage');
        endGameMessage.innerHTML = winOrLoseMessage;
        endGameMessage.classList.remove('hidden');

        // impedisco a tutte le celle di essere cliccabili
        const allCells = document.getElementsByClassName('single-cell');
        for( let i = 0; i < allCells.length; i++) {
            const thisCell = allCells[i];
            thisCell.style.pointerEvents = "none";
        }
    }
}

// ---------
    // FUNCTIONS
    // ---------
    
    


    // funzione che genera un array di 16 numneri random = bombe
    // maxNumber = numero di celle in base al livello
    // numberOfBombs = numero di bombe da generare
    // return = array di 16 numeri diversi tra loro
    function generateBombArray(maxNumber, numberOfBombs) {
        let bombGeneratedArray = [];
        while( bombGeneratedArray.length < numberOfBombs ) {
            const bombNumberRandom = getRndInteger(1, maxNumber);
            if(!bombGeneratedArray.includes(bombNumberRandom)){
                bombGeneratedArray.push(bombNumberRandom);
            }
        
        }
        return bombGeneratedArray;
    }
    

    // funzione che mi crea l'elemento della griglia
    // number = numero da inserire nella cella
    // return = l'elemento creato (<div class ="single-cell"><span>${number}</span></div>)
    function generateCellsItem(number, cellDimention) {
        const newCell = document.createElement('div');
        newCell.classList.add('single-cell');
        newCell.innerHTML = `<span>${number}</span>`; 
        // imposto la width e la height in base al livello scelto
        newCell.style.width = `calc(100% / ${cellDimention})`;
        newCell.style.height = `calc(100% / ${cellDimention})`;
        return newCell;
        
    }

    // funzione che genera un numero random
    function getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
      }