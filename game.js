var firstGame = true;

function startGame(){
var timeEnd = new Event ('timeEnd',{bubbles:true});                    //логическое имя переменной не верно=) просто отправляем событие на тригер окна о победе!
var gameField = document.getElementById('gameField');

for(var i = 0; i < 12; i++){
    gameField.appendChild(document.createElement('div'));
}
var startSec = 0,startMin = 1;
var timerSec;
if(startSec < 10){
    timerSec = '0'+startSec;
}else{timerSec = startSec;}
if(startMin < 10){
    timerMin = '0'+startMin;
}else{timerMin = startMin;}
document.querySelector('.timer__box').innerHTML = timerMin + ' : ' + timerSec;
//массив всех карточек (div блоки для будущих карточек)
var divMass = document.querySelectorAll('#gameField > div');

//массив для растановки по grid
var gridAreas = ['a','b','c','d','e','f','g','h','i','k','l','m'];

//блок создания базового элемента карточки
var baseCardElem = document.createElement('div');
baseCardElem.className = 'card';
var baseCardElemCardFace = document.createElement('div');
baseCardElemCardFace.className = "card__face card__face--front";
var baseCardElemCardBack = document.createElement('div');
baseCardElemCardBack.className = "card__face card__face--back";
baseCardElem.appendChild(baseCardElemCardFace);
baseCardElem.appendChild(baseCardElemCardBack);
//окончание создания базового элемента
var emojis = ['🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸'];
function compareRandom(a, b) {
    return Math.random() - 0.5;
  }
emojis.sort(compareRandom);
var addClass = function(event){
    event.currentTarget.querySelector('.card').classList.toggle('is-flipped');
    var flip = new Event('flip');
    event.currentTarget.dispatchEvent(flip);
}
var addFlip = function (event){                                                //событие переворота карточки
    if(firstGame){
        addTimer();
        firstGame = false;
    }
    event.currentTarget.classList.toggle('flipped');
    var timeToTest = new Event('timeToTest',{bubbles:true});                    //генерируем событие, отправляющее на тест карточки
    event.currentTarget.dispatchEvent(timeToTest);
}

//итерация по массиву карточек
for(var i = 0; i < divMass.length; i++){
    divMass[i].style.gridArea = gridAreas[i];                                   //расставляем карточки внутри грид сетки по массиву значений area (см. стр 9)
    divMass[i].appendChild(baseCardElem.cloneNode(true));                       //добавляем базовый элемент (см. стр. 11)
    divMass[i].addEventListener('click',addClass);                              //обработчик переворота карточки
    divMass[i].querySelector('.card__face--back').dataset.emoji = emojis[i];
    divMass[i].addEventListener('flip',addFlip);
}
var TimeToTestFunction = function (event){
    //вызывается в случае запроса на тест карточек (стр. 35)
var flippedCards = document.querySelectorAll('.flipped');               //массив всех карточек, получивших статус (перевернута) стр.32
clearBlocked();                                                         //очистка массива неправильных значений и разблокировка карточек
if(flippedCards.length == 2){                                           

if(flippedCards[0].querySelector('.card__face--back').dataset.emoji == flippedCards[1].querySelector('.card__face--back').dataset.emoji){ //в случае совпадения карточек

flippedCards.forEach(function(elem){
elem.querySelector('.card__face--back').classList.add('blocked-match');   //добавляем класс с фоном
elem.querySelector('.card').style.border = 'solid #5ad66f 5px';            //меняем границу блока
elem.classList.remove('flipped');                                           //далее убираем все обработчики - более они не нужны
elem.removeEventListener('click',addClass);
elem.removeEventListener('flip',addFlip);
if(document.querySelectorAll('.blocked-match').length == divMass.length){  //может уже выйграли??=)
 gameField.dispatchEvent(timeEnd);   
}


})

}else{
flippedCards.forEach(function(elem){
elem.querySelector('.card__face--back').classList.add('blocked-wrong'); //меняем фон на wrong
elem.querySelector('.card').style.border = 'solid #f44336 5px'; //меняем границу на wrong
})
blocked(flippedCards[0],flippedCards[1]);  //помещаем в ожидание, блокируя переворот карточки до следующей проверки
}



}
}
var wrongMass = [];                                                      //массив карточек, которые заблокировались на время (не правильно  угаданные)
gameField.addEventListener('timeToTest', TimeToTestFunction);


function blocked(a,b){   ///блокирование карточек, с не правильным выбором
    wrongMass.push(a); //добавляем в массив "ожидания"
    wrongMass.push(b);
    wrongMass.forEach(function(elem){
        elem.removeEventListener('click',addClass); //приостанавливаем действия обработчиков
        elem.removeEventListener('flip',addFlip);
        elem.classList.remove('flipped'); //убираем класс, переворота карточки
    })
}
function clearBlocked(){ //очистка ожидания
    wrongMass.forEach(function(elem){
        elem.addEventListener('click',addClass);//возвращаем обработчики
        elem.addEventListener('flip',addFlip);
        elem.querySelector('.is-flipped').classList.remove('is-flipped');//переворачиваем карточки обратно
        elem.querySelector('.card__face--back').classList.remove('blocked-wrong');//возвращаем цвет фона
        elem.querySelector('.card').style.border = 'solid white 5px';//возвращаем границу
    })
    wrongMass.length = 0;//удаляем карточки из массива "ожидания"
}
var seconds = [];
for(var i = 0; i < 60; i++){
    if(i<10){
        var a = '0' + i;
    seconds.push(a)
    }else{
        seconds.push(''+ i);
    }
}
var minutes=[];
for(var i = 0; i < 15; i++){
    if(i<10){
        var a = '0' + i;
    minutes.push(a)
    }else{
        minutes.push(''+ i);
    }
}


var countDownSec = 59;
var countDownMin = startMin-1;
timerStop = false;
// addTimer();
function addTimer(){ //отвечает за таймер
    if(timerStop){return false;}
    setTimeout(function(){
        if(countDownSec == 0 && countDownMin > 0){
            document.querySelector('.timer__box').innerHTML = minutes[countDownMin] + ' : ' + seconds[0];
            countDownMin--;
            countDownSec = 59;
        }else{
        document.querySelector('.timer__box').innerHTML = minutes[countDownMin] + ' : ' + seconds[countDownSec];
        countDownSec--;
        }
        if(countDownSec < 0 && countDownMin == 0){
            gameField.dispatchEvent(timeEnd);
        }
        if(countDownSec >=0){
            addTimer();
        }
        

    },1000)
}
var timeEndFunction = function (){
    if(document.querySelectorAll('.blocked-match').length == divMass.length){
        console.log('u win');
        timerStop = true;   
        document.querySelector('.u-win').style.display = 'flex';
        document.querySelector('.u-win__button').addEventListener('click',restartGame);

    }else{
        console.log('u loose');
        document.querySelector('.u-loose').style.display = 'flex';
        document.querySelector('.u-loose__button').addEventListener('click',restartGame);
    }
}
document.addEventListener('timeEnd',timeEndFunction);

function clearField(){
    while(gameField.firstChild){
        gameField.removeChild(gameField.firstChild);
    }
}

var restartGame = function(){
    console.log('restart');
    clearBlocked();
    flippedCards = [];
    firstGame = true;
    timerStop = true;
    document.querySelector('.u-loose').style.display = 'none';
    document.querySelector('.u-win').style.display = 'none';
    gameField.removeEventListener('timeToTest',TimeToTestFunction);
    console.log('timeendshouldbedeployed');
    document.removeEventListener('timeEnd',timeEndFunction);
    clearField();
    document.querySelector('.u-win__button').removeEventListener('click',restartGame);
    document.querySelector('.u-loose__button').removeEventListener('click',restartGame);

    
    startGame();
}
}
startGame();







