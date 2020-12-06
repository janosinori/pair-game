let stopperTime = 0;
let stopperIsRunning = false;
setInterval( () => {
    if (!stopperIsRunning) {
        return;
    }
    
    stopperTime++;
    const seconds = padNumbers(stopperTime % 60);
    const minutes = padNumbers(Math.floor(stopperTime / 60) % 60);
    const time = `${[minutes, seconds].join(':')}`;
    const stopperFace = document.querySelector('.stopper-face>p');
    stopperFace.textContent = time;
}, 1000);

const padNumbers = (num) => {
    return num < 10 ? `0${num}` : `${num}`;
};

function toggleStopper() {
    Object.values(document.querySelectorAll('.cards')).map(node=>node.removeEventListener('click', toggleStopper));
    if (stopperIsRunning) {
        stopperIsRunning = false;
        stopperTime = 0;
    } else {
        stopperIsRunning = true;
    }
}
function resetCounter(){
    const stopperFace = document.querySelector('.stopper-face>p');
    stopperFace.textContent = '00:00';
}
//Object.values(document.querySelectorAll('.cards')).map(node=>node.addEventListener('click', toggleStopper));

const turnFrontTime = 1000;
const turnBackTime = 300;
const visible = 400; 
const delay = 0;
let cardsNumbersArray;
let ImagesArray;
startGame();

function startRound(){
    Object.values(document.querySelectorAll('.cards:not(.found)')).map((node)=>node.addEventListener('click',cardsClickHandler));
}
function checkPairs(){
    const turning = document.querySelectorAll('.turning');
    turning[0].className = turning[0].className.replace( /(?:^|\s)turning(?!\S)/g , '' ).replace(/  /g, ' ').replace(/^ /, '');
    turning[1].className = turning[1].className.replace( /(?:^|\s)turning(?!\S)/g , '' ).replace(/  /g, ' ').replace(/^ /, '');
    if (turning[0].firstChild.alt === turning[1].firstChild.alt){
        turning[0].className += ' found';
        turning[1].className += ' found';
        if (!checkEnd()) setTimeout(startRound,delay);
    }
    else{
        setTimeout(()=>{
        turnBack(turning[0]);
        turnBack(turning[1]);},visible);
        setTimeout(startRound,visible+delay);
    }
}
function checkEnd(){
    if (document.querySelectorAll('.cards:not(.found)').length>0){
        return false;
    }
    else{
        Object.values(document.querySelectorAll('.cards')).map((node)=>{node.className = node.className.replace( /(?:^|\s)found(?!\S)/g , '' )});
        toggleStopper();
        setTimeout(startGame,5000);
        return true;
    }
}
function turnBack(cards){
    cards.className += ' not_a_pair';
    setTimeout(()=>{
        cards.firstChild.src = "kepek/kartyahatter.jpg";
        cards.firstChild.alt = "kártyahattér";
    },turnBackTime/2);
    setTimeout(()=>{
        cards.className = cards.className.replace( /(?:^|\s)not_a_pair(?!\S)/g , '' ).replace(/  /g, ' ').replace(/^ /, '');
    },turnBackTime);
}
function rand(n){
    const arr=[];
    for (i=0; i<n; i++){
        arr.push([i, Math.random()]);
    }
    arr.sort(([,a],[,b]) => a-b)
    return arr.reduce((a,b) => {a.push(b[0]); return a}, []);
}
function startGame(){
    resetCounter();
    Object.values(document.querySelectorAll('.cards')).map((node)=>{turnBack(node);node.addEventListener('click',toggleStopper)});
    startRound();
    cardsNumbersArray = rand(10).map(x=>x%5).map(x=>x===0 ? 5 : x);
    ImagesArray = cardsNumbersArray
    .map(x=>x===5 ? 'nyuszi' :
            x===1 ? 'tyuk' :
            x===2 ? 'kutya' :
            x===3 ? 'cica' : 'csacsi');
}
function cardsClickHandler(){
    const lineNum = Array.prototype.indexOf.call(this.parentNode.parentNode.children, this.parentNode);
    const cardsNum = Array.prototype.indexOf.call(this.parentNode.children, this);
    this.className += ' turning';
    if (document.querySelectorAll('.turning').length === 1){
        document.querySelector(`.line:nth-child(${lineNum+1})>.cards:nth-child(${cardsNum+1})`).removeEventListener('click',cardsClickHandler);
    }
    else {
        Object.values(document.querySelectorAll('.cards')).map((node)=>node.removeEventListener('click',cardsClickHandler));
        setTimeout(checkPairs,turnFrontTime);
    }
    setTimeout(()=>{
        this.firstChild.src = `kepek/${ImagesArray[5*lineNum+cardsNum]}.jpg`;
        this.firstChild.alt = `${ImagesArray[5*lineNum+cardsNum]}`;
    },turnFrontTime/2);
}