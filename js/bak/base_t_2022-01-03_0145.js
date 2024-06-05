var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var gameState = false;
var gameWin = false;

var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;

var cRound = 1;
var msgGameOver = 'Game Over'; 
var msgWin = 'YOU WIN!';
var msgNextRound = 'Press SPACE to Next Round'; 
var msgNewGame = 'Press SPACE to Start';

var cStageDefault, cStage;
var brickScore, stepScoreDefault, stepScore;
var maxBalls, colorBall, ballRadius, ballX, ballY, dX, dY;
var paddleHeight, paddleWidthDefault, paddleWidthMin, paddleWidthStep, paddleWidth, paddleXDefault, paddleYDefault, paddleX, paddleY, paddleSpeedDefault, paddleSpeedFactor, paddleSpeed, paddleScore;
var maxBricks, rowBricks, colorBrick, brickWidth, brickHeight, brickX, brickY, brickEnable;

// Старт игры
function startGame(){
	cStageDefault = 0; // уровень (начальное значение)
	stepScoreDefault = 5; // приращение очков для смены уровня (начальное значение)

// === VARS BALL >>>> ===
	maxBalls = 10; // максимальное кол-во шариков

	// параметры шарика (заполняются при генерации)
	colorBall =  new Array(); 
	ballRadius =  new Array();
	ballX =  new Array();
	ballY =  new Array();
	dX = new Array();
	dY = new Array();
// === VARS BALL <<<< ===

// === VARS PADDLE >>>> ===
	paddleHeight = 3; // толщина ракетки
	paddleWidthDefault = (canvas.width/1.1); // ширина ракетки (начальное значение)
	paddleWidthMin = (canvas.width/4); // минимальная ширина ракетки
	paddleWidthStep = (canvas.width/50); //  шаг уменьшения ширины ракетки
	paddleWidth = paddleWidthDefault; // ширина ракетки (будет уменьшаться с увеличением уровня)
	paddleXDefault = (canvas.width - paddleWidthDefault)/2; // начальные координаты ракетки по оси X
	paddleYDefault = canvas.height - paddleHeight; // начальные координаты ракетки по оси Y
	paddleX = paddleXDefault; // начальные координаты ракетки по оси X
	paddleY = paddleYDefault; // начальные координаты ракетки по оси Y
	paddleSpeedDefault = 20; // скорость движения ракетки (начальное значение)
	paddleSpeedFactor = 5; // фактор приращения скорости, с увеличением уровня
	paddleSpeed = paddleSpeedDefault; // скорость движения ракетки (будет уменьшаться с увеличением уровня)
// === VARS PADDLE <<<< ===

// === VARS BRICK >>>> ===
	maxBricks = 20; // кол-во кубиков в линии
	rowBricks = 3; // кол-во линий кубиков
	
	// параметры кубика (заполняются при генерации)
	colorBrick = new Array(); 
	brickWidth = new Array(); 
	brickHeight = new Array(); 
	brickX = new Array(); 
	brickY = new Array();
	brickEnable = new Array();
// === VARS BRICK <<<< ===

	if(gameWin == false){
		cStage = cStageDefault; // уровень (будет меняться в процессе прохождения)
		stepScore = stepScoreDefault; // приращение очков для смены уровня (будет меняться с увеличением уровня)
		brickScore = 0; // очки от кирпичиков
		paddleScore = 0; // очки от ракетки
	}
	gameWin = false;


	clearMsg();
	getBricks();
	getBalls();
	showScore();
	startTimer();
}

// генерация параметров шариков
function getBalls(){
	for(var i = 0; i < (maxBalls-1); i++)
	{
		colorBall[i] = "#0095DD"; // цвет шарика
		ballRadius[i] = 15; // радиус шарика
		ballX[i] = Math.random() * (canvas.width - (ballRadius[i]*2)) + ballRadius[i]; //координаты по оси X
		ballY[i] = ballRadius[i] + (brickWidth[0][0]*rowBricks); // координаты по оси Y
		ballSpeed = i+10 // скорость шарика
		dX[i] = ballSpeed; // направление движения по оси X
		dY[i] = ballSpeed; // направление движения по оси Y
	}
}

// рисование шарика
function drawBall(i) {
  ctx.beginPath();
  ctx.arc(ballX[i], ballY[i], ballRadius[i], 0, Math.PI * 2);
  ctx.fillStyle = colorBall[i];
  ctx.fill();
  ctx.closePath();
}

// генерация параметров кубиков
function getBricks(){
	for(var r = 0; r < rowBricks; r++)
	{
		colorBrick[r] = new Array; // цвет кубика 
		brickWidth[r] = new Array; // ширина кубика
		brickHeight[r] = new Array; //высота кубика
		brickX[r] = new Array; // положение по оси X
		brickY[r] = new Array; // положение по оси Y
		brickEnable[r] = new Array; // Есть ли кубик
		for(var i = 0; i < maxBricks; i++)
		{
			colorBrick[r][i] = "#0095DD"; // цвет
			brickWidth[r][i] = (canvas.width/maxBricks); // длина
			brickHeight[r][i] = brickWidth[r][i]; // высота
			if(i == 0){
				brickX[r][i] = 0; //координаты по оси X
			} else {
				brickX[r][i] = brickX[r][i-1]+brickWidth[r][i]; //координаты по оси X
			}
			brickY[r][i] = brickWidth[r][i]*r; // координаты по оси Y
			brickEnable[r][i] = true;
		}
	}
}

// рисование кубиков
function drawBricks() {
    ctx.beginPath();
	for(var r = 0; r < rowBricks; r++)
	{
		for(var i = 0; i < maxBricks; i++)
		{	
			if(brickEnable[r][i] == false){
				continue;
			}
			ctx.rect(brickX[r][i], brickY[r][i], brickWidth[r][i], brickHeight[r][i]);
			ctx.fillStyle = colorBrick[r][i];
			ctx.fill();
		}
	}
	ctx.closePath();
}

// рисование ракетки
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

// определение коллизии шарика со стенками и ракеткой
function ballCollision(i){ 
	if (ballX[i] + dX[i] > canvas.width - ballRadius[i] || ballX[i] + dX[i] < ballRadius[i]) {
		dX[i] = -dX[i];
	}
	else if(ballY[i] + dY[i] < ballRadius[i] + (brickWidth[0][0]*rowBricks)) {
		brickCollision(i);
	}
	else if((ballY[i] + dY[i] > (paddleY + paddleHeight - (ballRadius[i]/4))) && (dY[i] > 0)){
		if(ballX[i] > paddleX && ballX[i] < paddleX + paddleWidth) {
			resizeBall(i);
			paddleScore++;
			dY[i] = -dY[i];
		} else if(ballX[i] > paddleX - (ballRadius[i]) && ballX[i] < paddleX + paddleWidth + (ballRadius[i]*2)){
			resizeBall(i);
			paddleScore++;
			dX[i] = -dX[i];
			dY[i] = -dY[i];
		}else {
			colorBall[i] = "red";
			gameState = false;
			endGame(i, msgGameOver, msgNewGame);
			return;
		}
	}

	ballX[i] += dX[i];
	ballY[i] += dY[i];
}

// определение коллизии шарика со стенками и кубиком
function brickCollision(i){
	var brickIndex = Math.round(ballX[i] / brickWidth[0][0]);
	var brickIndexL = ((brickIndex < 0) ? 0 : (brickIndex-1));
	var brickIndexR = ((brickIndex > maxBricks) ? (maxBricks-1) : (brickIndex+1));
	for(var r = 0; r < rowBricks; r++) {
		var brickIndexLX = ((brickX[r][brickIndexL+1])*brickWidth[0][0]);
		var brickIndexRX = ((brickX[r][brickIndexR])*brickWidth[0][0]);
		if(ballY[i] + dY[i] < ballRadius[i] + (brickWidth[0][0]*(r+1))) {
			if(brickEnable[r][brickIndex] == true){
				brickEnable[r][brickIndex] = false;
				brickScore++;
				showScore();
				dY[i] = -dY[i];
				return false;
			} else if(ballY[i] + dY[i] < ballRadius[i]) {
				dY[i] = -dY[i];
				return false;
			}
			if(ballX[i] < brickIndexLX && brickEnable[r][brickIndexL] == true){
				brickEnable[r][brickIndexL] = false;
				brickScore++;
				showScore();
				dX[i] = -dX[i];
				dY[i] = -dY[i];
				return false;
			} else if(ballX[i] > brickIndexRX && brickEnable[r][brickIndexR] == true){
				brickEnable[r][brickIndexL] = false;
				brickScore++;
				showScore();
				dX[i] = -dX[i];
				dY[i] = -dY[i];
				return false;
			}
		}
	}
}
			
// дергаем рисование шариков и ракетки, плюс упраление ракеткой
function draw() {
	var i = cStage;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	if(cStage == 0){
		drawBall(i);
		ballCollision(i);
	} else {
		for(i = 0; i <= cStage; i++){
			drawBall(i);
			ballCollision(i);
		}
	}
	drawPaddle();
	drawBricks();

	if(rightPressed && paddleX < canvas.width-paddleWidth) {
		paddleX += (paddleSpeedDefault + cStage);
	}
	else if(leftPressed && paddleX > 0) {
		paddleX -= (paddleSpeedDefault + (cStage*paddleSpeedFactor));
	}
//	else if(downPressed && paddleY < canvas.height-paddleHeight) {
//		paddleY += 7;
//	}
//	else if(upPressed && paddleY > 0 && paddleY > y+ballRadius) {
//		paddleY -= 7;
//	}
	if(gameState == false){
		clearInterval(timer);
	}
}

// слушаем события нажатия на клафиши
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// функция, вызываемая при нажатии клавиши
function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
//    else if(e.keyCode == 38) {
//        upPressed = true;
//    }
//    else if(e.keyCode == 40) {
//        downPressed = true;
//    }	
	else if(e.keyCode == 32 && gameState == false){
		gameState = true;
		startGame();
	}
}

// функция, вызываемая при отпускании клавиши
function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
//    else if(e.keyCode == 38) {
//        upPressed = false;
//    }
//    else if(e.keyCode == 40) {
//        downPressed = false;
//    }
}

// изменение размера шарика
function resizeBall(i) {
	if(ballRadius[i] > 5){
		ballRadius[i] = ballRadius[i] - 1;
	} else {
		ballRadius[i] = 5;
	}
}

// изменение размера ракетки
function resizePadle() {
	if(paddleWidth > paddleWidthMin){
		paddleWidth = paddleWidthDefault - (cStage*paddleWidthStep);
	} else {
		paddleWidth = paddleWidthMin;
	}
}

// функция показа очков и смены уровня
function showScore(){
	var cStageOld = cStage;
	var cStageNew = Math.floor(brickScore/stepScore);
	if(cStageNew > cStage){
		cStage = cStageNew;
	}
	document.getElementById('stage').innerHTML=cRound;
	document.getElementById('score').innerHTML=brickScore+paddleScore;
	resizePadle();
	if(cStageOld < cStage){
		stepScore = stepScore + stepScoreDefault;
	}
	if(brickScore >= (maxBricks*rowBricks)*cRound){
		gameState = false;
		gameWin = true;
		cRound++;
		endGame(0, msgWin, msgNextRound);
	}
}

// если проиграли, останавливаем игру, выводим сообщение
function endGame(i, msg1, msg2){
	clearInterval(timer);
	drawBall(i);
	document.getElementById('textbox1').innerHTML=msg1;
	document.getElementById('textbox2').innerHTML=msg2;
}

function clearMsg(){
	document.getElementById('textbox1').innerHTML="";
	document.getElementById('textbox2').innerHTML="";
}

// Дергаем ф-цию draw() каждые "interval" мс
var timer, interval = 25;
function startTimer(){
	timer =	setInterval(draw, interval); 
}

document.getElementById('textbox1').innerHTML="Bouncing Balls";
document.getElementById('textbox2').innerHTML=msgNewGame;
