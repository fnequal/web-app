var board = new Array();
var score = 0;
var hasConflicted = new Array();
var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;

$(document).ready(function() {
  prepareForMobile();
  newgame();
});

function prepareForMobile() {
  if(documentWidth > 500) {
    gridContainerWidth = 500;
    cellSpace = 20;
    cellSideLength = 100;
  }
  $('#gridContainer').css('width', gridContainerWidth - 2 * cellSpace);
  $('#gridContainer').css('height', gridContainerWidth - 2 * cellSpace);
  $('#gridContainer').css('padding', cellSpace);
  $('#gridContainer').css('border-radius', 0.02 * gridContainerWidth);

  $('.grid-cell').css('width', cellSideLength);
  $('.grid-cell').css('height', cellSideLength);
  $('.grid-cell').css('border-radius', 0.02 * cellSideLength);
}

function newgame() {
  //初始化棋盘格
  init();
  //在随机两个格子生成数字
  generateOneNumber();
  generateOneNumber();
}

function init() {
  for(var i = 0; i < 4; i ++)
    for(var j = 0; j < 4; j ++) {
      var gridCell = $("#grid-cell-"+i+"-"+j);
      gridCell.css('top', getPosTop(i, j));
      gridCell.css('left', getPosLeft(i, j));
    }

  for(var i = 0; i < 4; i ++) {
    board[i] = new Array();
    hasConflicted[i] = new Array();
    for(var j = 0; j < 4; j ++) {
      board[i][j] = 0;
      hasConflicted[i][j] = false;
    }
  }

  updateBoardView();
  score = 0;
}

function updateBoardView() {
  $(".number-cell").remove();
  for(var i = 0; i < 4; i ++)
    for(var j = 0; j < 4; j ++) {
      $("#gridContainer").append('<div class="number-cell" id="number-cell-'+i+"-"+j+'"></div>');
      var theNumberCell = $("#number-cell-"+i+"-"+j);
  
      if(board[i][j] == 0) {
        theNumberCell.css('width', '0px');
        theNumberCell.css('height', '0px');
        theNumberCell.css('top', getPosTop(i,j)+cellSideLength/2);
        theNumberCell.css('left', getPosLeft(i,j)+cellSideLength/2);
      }else {
        theNumberCell.css('width', cellSideLength);
        theNumberCell.css('height', cellSideLength);
        theNumberCell.css('top', getPosTop(i,j));
        theNumberCell.css('left', getPosLeft(i,j));
        theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]));
        theNumberCell.css('color', getNumberColor(board[i][j]));
        theNumberCell.text(board[i][j]);
      }

      $('.number-cell').css('line-height', cellSideLength+'px');
      $('.number-cell').css('font-size', 0.45*cellSideLength);
      hasConflicted[i][j] = false;
    }
}

function generateOneNumber() {
  if(nospace(board)) 
    return false;
  
  //随机一个位置
  var randx = parseInt(Math.floor(Math.random() * 4));
  var randy = parseInt(Math.floor(Math.random() * 4));
  while(true) {
    if(board[randx][randy] == 0)
      break;
  var randx = parseInt(Math.floor(Math.random() * 4));
  var randy = parseInt(Math.floor(Math.random() * 4));
  }

  //随机一个数字
  var randNumber = Math.random() < 0.5 ? 2 : 4;

  //在随机位置显示随机数字
  
  board[randx][randy] = randNumber;
  showNumberWithAnimation(randx, randy, randNumber);
  return true;
}

$(document).keydown(function(e) {
  switch(e.keyCode) {
    case 37:
      e.preventDefault(); //阻止默认效果
      if(moveLeft()) {
        setTimeout("generateOneNumber()", 210);
        setTimeout("isgameover()", 300);
      }
      break;

    case 38:
      e.preventDefault(); //阻止默认效果
      if(moveUp()) {
        setTimeout("generateOneNumber()", 210);
        setTimeout("isgameover()", 300);
      }
      break;

    case 39:
      e.preventDefault(); //阻止默认效果
      if(moveRight()) {
        setTimeout("generateOneNumber()", 210);
        setTimeout("isgameover()", 300);
      }
      break;

    case 40:
      e.preventDefault(); //阻止默认效果
      if(moveDown()) {
        setTimeout("generateOneNumber()", 210);
        setTimeout("isgameover()", 300);
      }
      break;
  }
});

document.addEventListener('touchstart', function(e) {
  startx = e.touches[0].pageX;
  starty = e.touches[0].pageY;
});

document.addEventListener('touchmove', function(e) {
  e.preventDefault();
});

document.addEventListener('touchend', function(e) {
  endx = e.changedTouches[0].pageX;
  endy = e.changedTouches[0].pageY;

  var deltax = endx - startx;
  var deltay = endy - starty;
  if(Math.abs(deltax) < 0.1*documentWidth && Math.abs(deltay) < 0.1*documentWidth)
    return;

  if(Math.abs(deltax) >= Math.abs(deltay)) {
    if(deltax > 0) {
      if(moveRight()) {
        setTimeout("generateOneNumber()", 210);
        setTimeout("isgameover()", 300);
      }
    }else {
      if(moveLeft()) {
        setTimeout("generateOneNumber()", 210);
        setTimeout("isgameover()", 300);
      }
    }
  }
  else {
    if(deltay > 0) {
      if(moveDown()) {
        setTimeout("generateOneNumber()", 210);
        setTimeout("isgameover()", 300);
      }
    }else {
      if(moveUp()) {
        setTimeout("generateOneNumber()", 210);
        setTimeout("isgameover()", 300);
      }
    }
  }
});

function isgameover() {
  if(nospace(board) && nomove(board))
    gameover();
}

function gameover() {
  alert('gameover!');
}

function moveLeft() {
  if(!canMoveLeft(board))
    return false;

  //moveLeft
  for(var i = 0; i < 4; i ++)
    for(var j = 1; j < 4; j ++) {
      if(board[i][j] != 0) {
        for(var k = 0; k < j; k ++) {
          if(board[i][k] == 0 && noBolckHorizontal(i, k, j, board)) {
            //move
            showMoveAnimation(i, j, i, k);
            board[i][k] = board[i][j];
            board[i][j] = 0;
            continue;
          }
          else if(board[i][k] == board[i][j] && noBolckHorizontal(i, k, j, board) && !hasConflicted[i][k]) {
            //move
            showMoveAnimation(i, j, i, k);
            //add
            board[i][k] += board[i][j];
            board[i][j] = 0;
            //add score
            score += board[i][k];
            updateScore(score);

            hasConflicted[i][k] = true;
            continue;
          }
        }
      }
    }
  setTimeout("updateBoardView()", 200);
  return true;
}

function moveRight() {
    if(!canMoveRight(board))
    return false;

  //moveRight
  for(var i = 0; i < 4; i ++)
    for(var j = 2; j >= 0; j --) {
      if(board[i][j] != 0) {
        for(var k = 3; k > j; k --) {
          if(board[i][k] == 0 && noBolckHorizontal(i, j, k, board)) {
            //move
            showMoveAnimation(i, j, i, k);
            board[i][k] = board[i][j];
            board[i][j] = 0;
            continue;
          }
          else if(board[i][k] == board[i][j] && noBolckHorizontal(i, j, k, board) && !hasConflicted[i][k]) {
            //move
            showMoveAnimation(i, j, i, k);
            //add
            board[i][k] += board[i][j];
            board[i][j] = 0;
            //add score
            score += board[i][k];
            updateScore(score);

            hasConflicted[i][k] = true;
            continue;
          }
        }
      }
    }
  setTimeout("updateBoardView()", 200);
  return true;
}

function moveUp() {
  if(!canMoveUp(board))
    return false;

  //moveUp
  for(var i = 1; i < 4; i ++)
    for(var j = 0; j < 4; j ++) {
      if(board[i][j] != 0) {
        for(var k = 0; k < i; k ++) {
          if(board[k][j] == 0 && noBolckVertical(j, k, i, board)) {
            //move
            showMoveAnimation(i, j, k, j);
            board[k][j] = board[i][j];
            board[i][j] = 0;
            continue;
          }
          else if(board[k][j] == board[i][j] && noBolckVertical(j, k, i, board) && !hasConflicted[k][j]) {
            //move
            showMoveAnimation(i, j, k, j);
            //add
            board[k][j] += board[i][j];
            board[i][j] = 0;
            //add score
            score += board[k][j];
            updateScore(score);

            hasConflicted[k][j] = true;
            continue;
          }
        }
      }
    }
  setTimeout("updateBoardView()", 200);
  return true;
}

function moveDown() {
  if(!canMoveDown(board))
    return false;

  //moveDown
  for(var i = 2; i >= 0; i --)
    for(var j = 0; j < 4; j ++) {
      if(board[i][j] != 0) {
        for(var k = 3; k > i; k --) {
          if(board[k][j] == 0 && noBolckVertical(j, i, k, board)) {
            //move
            showMoveAnimation(i, j, k, j);
            board[k][j] = board[i][j];
            board[i][j] = 0;
            continue;
          }
          else if(board[k][j] == board[i][j] && noBolckVertical(j, i, k, board) && !hasConflicted[k][j]) {
            //move
            showMoveAnimation(i, j, k, j);
            //add
            board[k][j] += board[i][j];
            board[i][j] = 0;
            //add score
            score += board[k][j];
            updateScore(score);

            hasConflicted[k][j] = true;
            continue;
          }
        }
      }
    }
  setTimeout("updateBoardView()", 200);
  return true;
}