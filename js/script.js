var app = new Vue({
  el: '#app',
  data() {
    return {
      canUsekeyBoard: false,//控制鍵盤移動是否有效
      isStart: true,//預設false
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
      timer: 300,
      rowMaxCount: 28,//一行有28個BOX
      colMaxCount: 16,//一欄有16個BOX
      nowRow: 1,//目前在第幾行
      nowCol: 1,//目前在第幾欄
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
      leftBoxArray: [1, 29, 57, 85, 113, 141, 169, 197, 225, 253, 281, 309, 337, 365, 393, 421],
      rightBoxArray: [28, 56, 84, 112, 140, 168, 196, 224, 252, 280, 308, 336, 364, 392, 420, 448],
      topBoxArray: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
      bottomBoxArray: [421, 422, 423, 424, 425, 426, 427, 428, 429, 430, 431, 432, 433, 434, 435, 436, 437, 438, 439, 440, 441, 442, 443, 444, 445, 446, 447, 448]
    }
  },
  methods: {
    snakeMoving() {
      const vm = this;
      setInterval(() => {
        vm.canUsekeyBoard = true;//允許移動
        vm.removeOldSnakeHeader();//移除舊的蛇蛇小頭
        vm.determineOverflow();//判斷蛇蛇下一步是否會超出界 && 改變蛇蛇小頭的資訊(方向、POS)
        vm.snakeEatBait();//判斷蛇蛇是否吃到餌
        vm.drawSnake();//渲染新的蛇蛇
      }, vm.timer);//固定時間執行
    },
    determineOverflow() {
      const vm = this;
      vm.snakeHeader.type = vm.addType.type;//改變蛇蛇小頭前進的方向
      vm.snakeHeader.pos += vm.addType.push;//改變蛇蛇小頭所在的BOX位置

      console.log(vm.snakeHeader.pos);
      //先判斷目前前進的方向
      let isLeft = vm.leftBoxArray.some((item) => { if (item == vm.oldSnakeHeader.pos) { return true; } });
      let isRight = vm.rightBoxArray.some((item) => { if (item == vm.oldSnakeHeader.pos) { return true; } });
      let isTop = vm.topBoxArray.some((item) => { if (item == vm.oldSnakeHeader.pos) { return true; } });
      let isBottom = vm.bottomBoxArray.some((item) => { if (item == vm.oldSnakeHeader.pos) { return true; } });
      if (isLeft && vm.snakeHeader.type == 'left') {
        console.log('目前前進方向為左邊且上一個BOX為同行最左側');
        vm.snakeHeader.pos += vm.addDown.push;//往下一格
      }
      if (isRight && vm.snakeHeader.type == 'right') {
        console.log('目前前進方向為右邊且上一個BOX為同行最右側');
        vm.snakeHeader.pos += vm.addUp.push;//往下一格
      }
      if (isTop && vm.snakeHeader.type == 'up') {
        console.log('目前前進方向為往上且上一個BOX為同欄最頂端');
        vm.snakeHeader.pos += 28 + 420;
      }
      if (isBottom && vm.snakeHeader.type == 'down') {
        console.log('目前前進方向為往下且上一個BOX為同欄最底端');
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
            vm.snakeBody.forEach(item => {
              let body = document.getElementById(`box_${item.pos}`);
              body.classList.add('snakeBody');
            });
          }
          return true;
        }
      });
    },
    addSnakeBody() {
      const vm = this;
      if (vm.snakeBody.length == 0) {
        if (vm.snakeHeader.type == 'right') {
          vm.snakeBody.push({
            type: 'right',
            pos: vm.snakeHeader.pos - 1,
            oldType: null,
            oldPos: null
          });
        }
        if (vm.snakeHeader.type == 'left') {
          vm.snakeBody.push({
            type: 'left',
            pos: vm.snakeHeader.pos + 1,
            oldType: null,
            oldPos: null
          });
        }
        if (vm.snakeHeader.type == 'up') {
          vm.snakeBody.push({
            type: 'up',
            pos: vm.snakeHeader.pos + 28,
            oldType: null,
            oldPos: null
          });
        }
        if (vm.snakeHeader.type == 'down') {
          vm.snakeBody.push({
            type: 'down',
            pos: vm.snakeHeader.pos - 28,
            oldType: null,
            oldPos: null
          });
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
      vm.isStart = true;
    },
    watchKeyDown() {
      const vm = this;
      document.onkeydown = function (ev) {
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
    randomBait() {
      const vm = this;
      vm.baitPos = getRandom(1, 448);
      vm.boxItem[vm.baitPos - 1].isPoint = true;//1~448 -1 => 0~447

      function getRandom(min, max) {
        let number = Math.floor(Math.random() * (max - min + 1)) + min;
        let isEqualSnakeBody = vm.snakeBody.some((item) => { if (item.pos == number) { return true } });
        if (number == vm.snakeHeader.pos || isEqualSnakeBody) {
          getRandom(1, 448);//如果餌的座標等於蛇的身體或是頭 就再產生一次
        } else {
          return number;//回傳random數字
        }
      };
    },
    removeOldBait() {
      const vm = this;
      vm.boxItem[vm.baitPos - 1].isPoint = false;
    },
    snakeEatBait() {
      const vm = this;
      if (vm.snakeHeader.pos == vm.baitPos) {
        console.log('得分!');
        vm.addSnakeBody();
        vm.removeOldBait();//移除舊的餌座標
        vm.randomBait();//重新產生餌
      }//如果蛇蛇小頭座標等於餌的座標
    },
  },
  async mounted() {
    const vm = this;
    await vm.createBox();//要等createBox執行完才能渲染小頭，否則會找不到DOM
    vm.drawSnake();//渲染蛇蛇
    vm.randomBait();//隨機產生餌
    vm.watchKeyDown();//監視user操作方向鍵
    vm.snakeMoving();//控制蛇蛇前進
  },
})
