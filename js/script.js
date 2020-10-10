var app = new Vue({
  el: '#app',
  data() {
    return {
      bestScore: 0,//歷史最高分
      audio: '',
      canUsekeyBoard: false,//控制鍵盤移動是否有效
      isPlay: false,//預設false
      isOver: false,//預設false
      boxItem: [],
      snakeBody: [
      ],//蛇蛇身體
      snakeHeader: {
        type: 'right',//方向
        pos: 1//目前蛇蛇小頭所在的BOX位置
      },//目前蛇蛇小頭所在的BOX位置
      oldSnakeHeader: {
        type: 'right',
        pos: 1
      },
      timeObj: null,
      timer: 250,
      score: 0,//目前獲得分數
      rowMaxCount: 28,//一行有28個BOX
      colMaxCount: 16,//一欄有16個BOX
      baitPos: null,//餌的位置
      oldAddType: 'right',//
      addType: {
        type: 'right',//方向
        push: 1//前進單位
      },//目前前進的方向
      addUp: {
        type: 'up',
        push: -28//往上一格
      },
      addDown: {
        type: 'down',
        push: 28//往下一格
      },
      addRight: {
        type: 'right',
        push: 1//往右一格
      },
      addLeft: {
        type: 'left',
        push: -1//往左一格
      },
      baitBoxRight: [],
      baitBoxLeft: [],
      baitBoxUp: [],
      baitBoxDown: [],
      leftBoxArray: [1, 29, 57, 85, 113, 141, 169, 197, 225, 253, 281, 309, 337, 365, 393, 421],
      rightBoxArray: [28, 56, 84, 112, 140, 168, 196, 224, 252, 280, 308, 336, 364, 392, 420, 448],
      topBoxArray: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
      bottomBoxArray: [421, 422, 423, 424, 425, 426, 427, 428, 429, 430, 431, 432, 433, 434, 435, 436, 437, 438, 439, 440, 441, 442, 443, 444, 445, 446, 447, 448]
    }
  },
  methods: {
    snakeMoving() {
      const vm = this;
      let addtime = 0;
      vm.timeObj = setInterval(fn, vm.timer);//固定時間執行

      function fn() {
        vm.canUsekeyBoard = true;//允許移動
        vm.removeOldSnakeHeader();//移除舊的蛇蛇小頭
        vm.determineOverflow();//判斷蛇蛇下一步是否會超出界 && 改變蛇蛇小頭的資訊(方向、POS)
        vm.gameover();//判斷遊戲結束
        vm.snakeEatBait();//判斷蛇蛇是否吃到餌
        vm.drawSnake();//渲染新的蛇蛇

        speedChange();//改變速度 score 越高 speed 越高
        function speedChange() {
          if (vm.score == 5 && addtime == 0) {
            clearInterval(vm.timeObj);
            vm.timeObj = setInterval(fn, vm.timer = 200);
            addtime++;
          }
          if (vm.score == 10 && addtime == 1) {
            clearInterval(vm.timeObj);
            vm.timeObj = setInterval(fn, vm.timer = 100);
            addtime++;
          }
          if (vm.score == 30 && addtime == 2) {
            clearInterval(vm.timeObj);
            vm.timeObj = setInterval(fn, vm.timer = 50);
            addtime++;
          }
        }
      }

    },
    gameover() {
      const vm = this;
      vm.snakeBody.some((item) => {
        if (vm.snakeHeader.pos == item.pos) {
          clearInterval(vm.timeObj);
          if (vm.score > vm.bestScore) {
            console.log('恭喜刷新歷史新高!');
            localStorage.setItem('snakeScore', vm.score);
            vm.bestScore = Number(localStorage.getItem('snakeScore'));
          }
          reset();//設定初始化
          vm.isPlay = false;
          vm.isOver = true;
          return true;
        }
      });


      function reset() {
        vm.snakeBody = [];
        vm.snakeHeader = {
          type: 'right',
          pos: 1
        };
        vm.oldSnakeHeader = {
          type: 'right',
          pos: 1
        };
        vm.canUsekeyBoard = false;
        vm.timeObj = null;
        vm.timer = 250;
        vm.baitPos = null;
        vm.oldAddType = 'right',
          vm.addType = {
            type: 'right',//方向
            push: 1//前進單位
          };
        vm.baitBoxRight = [];
        vm.baitBoxLeft = [];
        vm.baitBoxUp = [];
        vm.baitBoxDown = [];
        vm.boxItem = [];
        vm.createBox();
      }
    },
    determineOverflow() {
      const vm = this;
      vm.snakeHeader.type = vm.addType.type;//改變蛇蛇小頭前進的方向
      vm.snakeHeader.pos += vm.addType.push;//改變蛇蛇小頭所在的BOX位置

      // console.log(vm.snakeHeader.pos);
      //先判斷目前前進的方向
      let isLeft = vm.leftBoxArray.some((item) => { if (item == vm.oldSnakeHeader.pos) { return true; } });
      let isRight = vm.rightBoxArray.some((item) => { if (item == vm.oldSnakeHeader.pos) { return true; } });
      let isTop = vm.topBoxArray.some((item) => { if (item == vm.oldSnakeHeader.pos) { return true; } });
      let isBottom = vm.bottomBoxArray.some((item) => { if (item == vm.oldSnakeHeader.pos) { return true; } });
      if (isLeft && vm.snakeHeader.type == 'left') {
        // console.log('目前前進方向為左邊且上一個BOX為同行最左側');
        vm.snakeHeader.pos += vm.addDown.push;//往下一格
      }
      if (isRight && vm.snakeHeader.type == 'right') {
        // console.log('目前前進方向為右邊且上一個BOX為同行最右側');
        vm.snakeHeader.pos += vm.addUp.push;//往下一格
      }
      if (isTop && vm.snakeHeader.type == 'up') {
        // console.log('目前前進方向為往上且上一個BOX為同欄最頂端');
        vm.snakeHeader.pos += 28 + 420;
      }
      if (isBottom && vm.snakeHeader.type == 'down') {
        // console.log('目前前進方向為往下且上一個BOX為同欄最底端');
        vm.snakeHeader.pos += -28 - 420;
      }
      if (vm.snakeBody[0]) {
        vm.snakeBody[0].type = vm.oldSnakeHeader.type;
        vm.snakeBody[0].pos = vm.oldSnakeHeader.pos;
      }//身體第一個BOX追蹤蛇蛇小頭的舊方向&舊位置
      vm.snakeBody.forEach((item, index) => {
        if (index != 0) {
          item.type = vm.snakeBody[index - 1].oldType;
          item.pos = vm.snakeBody[index - 1].oldPos;
        }
      })//其餘身體BOX追蹤前一個身體BOX的舊方向&舊位置
    },
    removeOldSnakeHeader() {
      const vm = this;
      let header = document.getElementById(`box_${vm.snakeHeader.pos}`);
      header.classList.remove('snakeHeader');
      vm.oldSnakeHeader.type = vm.snakeHeader.type;//紀錄
      vm.oldSnakeHeader.pos = vm.snakeHeader.pos;

      if (vm.snakeBody.length > 0) {
        vm.snakeBody.forEach(item => {
          let body = document.getElementById(`box_${item.pos}`);
          body.classList.remove('snakeBody');
          body.style.backgroundColor = '#00035a';//消除蛇蛇身體顏色
          //把現在的方向&位置記錄到舊資料裡
          item.oldType = item.type;
          item.oldPos = item.pos;
        });
      }
    },
    drawSnake() {
      const vm = this;
      vm.boxItem.some(element => {
        if (element.id == vm.snakeHeader.pos) {
          let header = document.getElementById(`box_${vm.snakeHeader.pos}`);
          header.classList.add('snakeHeader');
          if (vm.snakeBody.length > 0) {
            vm.snakeBody.forEach((item, index) => {
              let body = document.getElementById(`box_${item.pos}`);
              body.classList.add('snakeBody');

              function BGCgradient() {
                let level = null;
                if (vm.snakeBody.length <= 10) {
                  level = 100 * Math.pow(index, (1 / 3));
                } else if (vm.snakeBody.length <= 20 && vm.snakeBody.length > 10) {
                  level = 90 * Math.pow(index, (1 / 3));
                } else if (vm.snakeBody.length <= 30 && vm.snakeBody.length > 20) {
                  level = 80 * Math.pow(index, (1 / 3));
                } else if (vm.snakeBody.length <= 40 && vm.snakeBody.length > 30) {
                  level = 70 * Math.pow(index, (1 / 3));
                } else if (vm.snakeBody.length <= 70 && vm.snakeBody.length > 40) {
                  level = 60 * Math.pow(index, (1 / 3));
                } else if (vm.snakeBody.length <= 90 && vm.snakeBody.length > 70) {
                  level = 55 * Math.pow(index, (1 / 3));
                } else if (vm.snakeBody.length <= 120 && vm.snakeBody.length > 90) {
                  level = 50 * Math.pow(index, (1 / 3));
                } else if (vm.snakeBody.length > 120) {
                  level = 30 * Math.pow(index, (1 / 3));
                }
                return 255 - level;
              }//蛇蛇小頭產生漸層

              let bgc = BGCgradient();
              // let BGCopacity = index / vm.snakeBody.length;
              body.style.backgroundColor = `rgba(${bgc},${bgc},${bgc},1)`;
              console.log(body.style.backgroundColor, bgc);
            });
          }
          return true;
        }
      });
    },
    addSnakeBody() {
      const vm = this;
      // console.log(vm.snakeBody.length, vm.snakeHeader.pos)
      if (vm.snakeBody.length == 0) {
        if (vm.snakeHeader.type == 'right') {
          let isLeft = vm.leftBoxArray.some((item) => { if (item == vm.snakeHeader.pos) { return true } });
          // console.log(isLeft);
          if (isLeft) {
            vm.snakeBody.push({
              type: 'right',
              pos: vm.snakeHeader.pos + 28 - 1,
              oldType: null,
              oldPos: null
            });
          } else {
            vm.snakeBody.push({
              type: 'right',
              pos: vm.snakeHeader.pos - 1,
              oldType: null,
              oldPos: null
            });
          }
        }
        if (vm.snakeHeader.type == 'left') {
          let isRight = vm.rightBoxArray.some((item) => { if (item == vm.snakeHeader.pos) { return true } });
          // console.log(isRight);
          if (isRight) {
            vm.snakeBody.push({
              type: 'left',
              pos: vm.snakeHeader.pos - 28 + 1,
              oldType: null,
              oldPos: null
            });
          } else {
            vm.snakeBody.push({
              type: 'left',
              pos: vm.snakeHeader.pos + 1,
              oldType: null,
              oldPos: null
            });
          }
        }
        if (vm.snakeHeader.type == 'up') {
          // console.log('up');
          let isBottom = vm.bottomBoxArray.some((item) => { if (item == vm.snakeHeader.pos) { return true } });
          // console.log(isBottom);
          if (isBottom) {

            vm.snakeBody.push({
              type: 'up',
              pos: vm.snakeHeader.pos - 420,
              oldType: null,
              oldPos: null
            });
          } else {
            vm.snakeBody.push({
              type: 'up',
              pos: vm.snakeHeader.pos + 28,
              oldType: null,
              oldPos: null
            });
          }
        }
        if (vm.snakeHeader.type == 'down') {
          // console.log('down');
          let isTop = vm.topBoxArray.some((item) => { if (item == vm.snakeHeader.pos) { return true } });
          // console.log(isTop);
          if (isTop) {
            vm.snakeBody.push({
              type: 'down',
              pos: vm.snakeHeader.pos + 420,
              oldType: null,
              oldPos: null
            });
          } else {
            vm.snakeBody.push({
              type: 'down',
              pos: vm.snakeHeader.pos - 28,
              oldType: null,
              oldPos: null
            });
          }
        }
      } else {
        switch (vm.snakeBody[vm.snakeBody.length - 1].type) {
          case 'right':
            vm.snakeBody.push({
              type: vm.snakeBody[vm.snakeBody.length - 1].type,
              pos: vm.snakeBody[vm.snakeBody.length - 1].pos - 1,
              oldType: null,
              oldPos: null
            });
            break;
          case 'left':
            vm.snakeBody.push({
              type: vm.snakeBody[vm.snakeBody.length - 1].type,
              pos: vm.snakeBody[vm.snakeBody.length - 1].pos + 1,
              oldType: null,
              oldPos: null
            });
            break;
          case 'up':
            vm.snakeBody.push({
              type: vm.snakeBody[vm.snakeBody.length - 1].type,
              pos: vm.snakeBody[vm.snakeBody.length - 1].pos + 28,
              oldType: null,
              oldPos: null
            });
            break;
          case 'down':
            vm.snakeBody.push({
              type: vm.snakeBody[vm.snakeBody.length - 1].type,
              pos: vm.snakeBody[vm.snakeBody.length - 1].pos - 28,
              oldType: null,
              oldPos: null
            });
            break;
        }

      }
    },
    createBox() {
      const vm = this;
      let boxNumber = vm.rowMaxCount * vm.colMaxCount;//28*16
      for (var i = 0; i < boxNumber; i++) {
        vm.boxItem.push({ id: i + 1, isPoint: false });
      }
    },
    start() {
      const vm = this;
      vm.isPlay = true;
      setTimeout(function () {
        vm.drawSnake();//渲染蛇蛇
        vm.randomBait();//隨機產生餌
        vm.watchKeyDown();//監視user操作方向鍵
        vm.snakeMoving();//控制蛇蛇前進
      }, 100);
    },
    watchKeyDown() {
      const vm = this;
      document.onkeydown = function (ev) {
        if (!vm.isPlay && vm.isOver) {
          if (ev.keyCode == 89) {
            vm.isPlay = true;
            vm.isOver = false;
            vm.score = 0;
            setTimeout(function () {
              vm.drawSnake();//渲染蛇蛇
              vm.randomBait();//隨機產生餌
              vm.watchKeyDown();//監視user操作方向鍵
              vm.snakeMoving();//控制蛇蛇前進
            }, 100);
          }
          if (ev.keyCode == 78) {
            vm.isPlay = false;
            vm.isOver = false;
            vm.score = 0;
            vm.watchStart();
          }
        }


        if (vm.canUsekeyBoard) {
          if (ev.keyCode == 38 && vm.addType.type != 'down') {
            vm.addType = vm.addUp;
          }
          if (ev.keyCode == 40 && vm.addType.type != 'up') {
            vm.addType = vm.addDown;
          }
          if (ev.keyCode == 37 && vm.addType.type != 'right') {
            vm.addType = vm.addLeft;
          }
          if (ev.keyCode == 39 && vm.addType.type != 'left') {
            vm.addType = vm.addRight;
          }
        }
        vm.canUsekeyBoard = false;
      }
    },
    async randomBait() {
      const vm = this;
      await getRandom(1, 448);//隨機產生餌
      console.log(vm.baitPos - 1);
      vm.boxItem[vm.baitPos - 1].isPoint = true;//1~448 -1 => 0~447
      baitGradient(vm.baitPos);//產生餌的陰影
      function baitGradient(pos) {
        vm.baitBoxRight = [];
        vm.baitBoxLeft = [];
        vm.baitBoxUp = [];
        vm.baitBoxDown = [];
        let rightPos = null;//以目前的餌為準，最右邊的BOX位置
        let leftPos = null;
        if (!(vm.rightBoxArray.some(item => { if (item == pos) { return true } }))) {
          let temp = pos;
          do {
            temp++;
            vm.baitBoxRight.push(temp);
          } while (!(vm.rightBoxArray.some(item => { if (item == temp) { return true } })))
        }//如果目前餌不是在最右邊
        vm.baitBoxRight.forEach((item, index) => {
          let baitbox = document.getElementById(`box_${item}`);
          if (index < 6) {
            baitbox.style.backgroundColor = `rgba(0,3,90,${0.5 + 0.1 * index})`;
          } else {
            baitbox.style.backgroundColor = `rgba(0,3,90,1)`;
          }
        })
        console.log(vm.baitBoxRight);

        if (!(vm.leftBoxArray.some(item => { if (item == pos) { return true } }))) {
          let temp = pos;
          do {
            temp--;
            vm.baitBoxLeft.push(temp);
          } while (!(vm.leftBoxArray.some(item => { if (item == temp) { return true } })))
        }//如果目前餌不是在最左邊
        vm.baitBoxLeft.forEach((item, index) => {
          let baitbox = document.getElementById(`box_${item}`);
          if (index < 6) {
            baitbox.style.backgroundColor = `rgba(0,3,90,${0.5 + 0.1 * index})`;
          } else {
            baitbox.style.backgroundColor = `rgba(0,3,90,1)`;
          }
        })
        console.log(vm.baitBoxLeft);

        if (!(vm.topBoxArray.some(item => { if (item == pos) { return true } }))) {
          let temp = pos;
          do {
            temp -= 28;
            vm.baitBoxUp.push(temp);
          } while (!(vm.topBoxArray.some(item => { if (item == temp) { return true } })))
        }//如果目前餌不是在最上面
        vm.baitBoxUp.forEach((item, index) => {
          let baitbox = document.getElementById(`box_${item}`);
          if (index < 6) {
            baitbox.style.backgroundColor = `rgba(0,3,90,${0.5 + 0.1 * index})`;
          } else {
            baitbox.style.backgroundColor = `rgba(0,3,90,1)`;
          }
        })
        console.log(vm.baitBoxUp);

        if (!(vm.bottomBoxArray.some(item => { if (item == pos) { return true } }))) {
          let temp = pos;
          do {
            temp += 28;
            vm.baitBoxDown.push(temp);
          } while (!(vm.bottomBoxArray.some(item => { if (item == temp) { return true } })))
        }//如果目前餌不是在最下面
        vm.baitBoxDown.forEach((item, index) => {
          let baitbox = document.getElementById(`box_${item}`);
          if (index < 6) {
            baitbox.style.backgroundColor = `rgba(0,3,90,${0.5 + 0.1 * index})`;
          } else {
            baitbox.style.backgroundColor = `rgba(0,3,90,1)`;
          }
        })
        console.log(vm.baitBoxDown);
      }
      function getRandom(min, max) {
        let number = Math.floor(Math.random() * (max - min + 1)) + min;
        let isEqualSnakeBody = vm.snakeBody.some((item) => { if (item.pos == number) { return true } });
        if (number == vm.snakeHeader.pos || isEqualSnakeBody) {//餌的座標是否和蛇重疊
          console.log('again :', number);
          getRandom(1, 448);//如果餌的座標等於蛇的身體或是頭 就再產生一次
        } else {
          console.log('return :', number);
          vm.baitPos = number;
        }
      };
    },
    removeOldBait() {
      const vm = this;
      vm.boxItem[vm.baitPos - 1].isPoint = false;
      vm.baitBoxRight.forEach((item, index) => {
        let baitbox = document.getElementById(`box_${item}`);
        baitbox.style.backgroundColor = '#00035a';
      })
      vm.baitBoxLeft.forEach((item, index) => {
        let baitbox = document.getElementById(`box_${item}`);
        baitbox.style.backgroundColor = '#00035a';
      })
      vm.baitBoxUp.forEach((item, index) => {
        let baitbox = document.getElementById(`box_${item}`);
        baitbox.style.backgroundColor = '#00035a';
      })
      vm.baitBoxDown.forEach((item, index) => {
        let baitbox = document.getElementById(`box_${item}`);
        baitbox.style.backgroundColor = '#00035a';
      })
    },
    snakeEatBait() {
      const vm = this;
      if (vm.snakeHeader.pos == vm.baitPos) {
        vm.score += 1;
        let audio = new Audio('../static/getPoint.mp3');
        audio.play();
        vm.addSnakeBody();//增加一個蛇蛇身體的BOX
        vm.removeOldBait();//移除舊的餌座標
        vm.randomBait();//重新產生餌
      }//如果蛇蛇小頭座標等於餌的座標
    },
    watchStart() {
      const vm = this;
      document.onkeydown = function (ev) {
        if (ev.keyCode == 32 && vm.isPlay == false) {
          vm.start();
        }
      }
    },
    backgroundMusic() {
      const vm = this;
      vm.audio = new Audio('../static/snake.mp3');
      vm.audio.volume = 0.2;
      vm.audio.loop = true;
      vm.audio.muted
      vm.audio.play();
    },
    getLocalStorgeScore() {
      const vm = this;
      if (localStorage.getItem('snakeScore')) {
        vm.bestScore = Number(localStorage.getItem('snakeScore'));
      }
    }
  },
  mounted() {
    const vm = this;
    vm.getLocalStorgeScore();//取得localstorage分數
    setTimeout(() => {
      vm.backgroundMusic();//播放背景音樂
    }, 1000);
    vm.createBox();//要等createBox執行完才能渲染蛇蛇，否則會找不到DOM
    vm.watchStart();//監聽空白鍵開始
  },
})
