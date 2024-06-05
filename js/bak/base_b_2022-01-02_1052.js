var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var gameState = false;
var gameOver = false;

var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;

var cStageDefault, cStage, maxStage, scoreDefault, score, stepScoreDefault, stepScore, maxBalls, colorBall, ballRadius, ballX, ballY, dX, dY, paddleHeight, paddleWidthDefault, paddleWidthMin, paddleWidthStep, paddleWidth, paddleXDefault, paddleYDefault, paddleX, paddleY, paddleSpeedDefault, paddleSpeedFactor, paddleSpeed;

// Старт игры
function startGame(){
//	console.log('Start Game');
	cStageDefault = 1; // уровень (начальное значение)
	cStage = cStageDefault; // уровень (будет меняться в процессе прохождения)
	maxStage = 10; // максимальный уровень

	scoreDefault = 0; // очки (начальное значение)
	score = scoreDefault; // очки (будет меняться в процессе прохождения)

	stepScoreDefault = 5; // приращение очков для смены уровня (начальное значение)
	stepScore = stepScoreDefault; // приращение очков для смены уровня (будет меняться с увеличением уровня)
	maxBalls = maxStage; // максимальное кол-во шариков

	// параметры шарика (заполняются при генерации)
	colorBall =  new Array(); 
	ballRadius =  new Array();
	ballX =  new Array();
	ballY =  new Array();
	dX = new Array();
	dY = new Array();

	paddleHeight = 3; // толщина ракетки
	paddleWidthDefault = (canvas.width/1.5); // ширина ракетки (начальное значение)
	paddleWidthMin = (canvas.width/5); // минимальная ширина ракетки
	paddleWidthStep = (canvas.width/15); //  шаг уменьшения ширины ракетки
	paddleWidth = paddleWidthDefault; // ширина ракетки (будет уменьшаться с увеличением уровня)
	paddleXDefault = (canvas.width - paddleWidthDefault)/2; // начальные координаты ракетки по оси X
	paddleYDefault = canvas.height - paddleHeight; // начальные координаты ракетки по оси Y
	paddleX = paddleXDefault; // начальные координаты ракетки по оси X
	paddleY = paddleYDefault; // начальные координаты ракетки по оси Y
	paddleSpeedDefault = 7; // скорость движения ракетки (начальное значение)
	paddleSpeedFactor = 5; // фактор приращения скорости, с увеличением уровня
	paddleSpeed = paddleSpeedDefault; // скорость движения ракетки (будет уменьшаться с увеличением уровня)

	clearMsg();
	getBalls();
	showScore();
	startTimer();
}

// генерация параметров шариков
function getBalls(){
	for(var i = 0; i < maxBalls; i++)
	{
		colorBall[i] = "#0095DD"; // цвет шарика
		ballRadius[i] = 15; // радиус шарика
		ballX[i] = Math.random() * (canvas.width - (ballRadius[i]*2)) + ballRadius[i]; //координаты по оси X
		ballY[i] = ballRadius[i]; // координаты по оси Y
		ballSpeed = i+4 // скорость шарика
		dX[i] = ballSpeed; // направление движения по оси X
		dY[i] = -ballSpeed; // направление движения по оси Y
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
	if(ballY[i] + dY[i] < ballRadius[i]) {
		dY[i] = -dY[i];
	} else if((ballY[i] + dY[i] > paddleY + paddleHeight - ballRadius[i]*0.8) && (dY[i] > 0)){
		if(ballX[i] > paddleX && ballX[i] < paddleX + paddleWidth) {
			score++;
			showScore();
			resizeBall(i);
			dY[i] = -dY[i];
		} else if(ballX[i] > paddleX - (ballRadius[i]*1.1) && ballX[i] < paddleX + paddleWidth + (ballRadius[i]*0.8)){
			score++;
			showScore();
			resizeBall(i);
			dX[i] = -dX[i];
			dY[i] = -dY[i];
		}else {
			colorBall[i] = "red";
			if(gameOver == true){
				endGame();
			}
			gameOver = true;
			return;
		}
	}

	ballX[i] += dX[i];
	ballY[i] += dY[i];
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
	else if(e.keyCode == 32){
		if(gameState == false || gameOver == true) {
		gameState = true;
		gameOver = false;
		startGame();
		}
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
	var cStageNew = Math.floor(score/stepScore);
	if(cStageNew > cStage){
		cStage = cStageNew;
	}
	document.getElementById('score').innerHTML=score;
	document.getElementById('stage').innerHTML=cStage;
	resizePadle();
	if(cStageOld < cStage){
		stepScore = stepScore + stepScoreDefault;
	}
	gameOver = false;
}

// если проиграли, останавливаем игру, выводим сообщение
function endGame(){
	clearInterval(timer);
	document.getElementById('textbox1').innerHTML="Game Over";
	document.getElementById('textbox2').innerHTML="Press SPACE to start";
//	console.log('Game Over');
}

function clearMsg(){
	document.getElementById('textbox1').innerHTML="";
	document.getElementById('textbox2').innerHTML="";
}

// Дергаем ф-цию draw() каждые "interval" мс
var timer, interval = 10;
function startTimer(){
	timer =	setInterval(draw, interval); 
}

document.getElementById('textbox1').innerHTML="Bouncing Balls";
document.getElementById('textbox2').innerHTML="Press SPACE to start";