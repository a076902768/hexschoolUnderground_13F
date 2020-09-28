var app = new Vue({
  el: '#app',
  data() {
    return {
      isStart: true,//預設false
      boxItem: [],
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
        vm.removeOldSnakeHeader();//移除舊的蛇蛇小頭
        vm.determineOverflow();//判斷蛇蛇下一步是否會超出界
        vm.controlSnakeHeader();//渲染新的蛇蛇小頭
      }, vm.timer);//固定時間執行
    },
    determineOverflow() {
      const vm = this;
      vm.snakeHeader.type = vm.addType.type;//改變蛇蛇小頭前進的方向
      vm.snakeHeader.pos += vm.addType.push;//改變蛇蛇小頭所在的BOX位置

      // let leftBox = vm.rowMaxCount * (vm.nowRow - 1) + 1;//左側邊緣的BOX
      // let rightBox = vm.rowMaxCount * vm.nowRow;//右側邊緣的BOX
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

      vm.nowRow = Math.floor(vm.snakeHeader.pos / (vm.rowMaxCount + 1)) + 1;
      vm.nowCol = vm.snakeHeader.pos % vm.rowMaxCount;

    },
    removeOldSnakeHeader() {
      const vm = this;
      let header = document.getElementById(`box_${vm.snakeHeader.pos}`);
      header.classList.remove('snakeHeader');
      vm.oldSnakeHeader.type = vm.snakeHeader.type;//紀錄
      vm.oldSnakeHeader.pos = vm.snakeHeader.pos;
    },
    controlSnakeHeader() {
      const vm = this;
      vm.boxItem.some(element => {
        if (element.id == vm.snakeHeader.pos) {
          let header = document.getElementById(`box_${vm.snakeHeader.pos}`);
          header.classList.add('snakeHeader');
          return true;
        }
      });
    },
    createBox() {
      const vm = this;
      let boxNumber = vm.rowMaxCount * vm.colMaxCount;//28*16
      for (var i = 0; i < boxNumber; i++) {
        vm.boxItem.push({ id: i + 1 });
      }
    },
    start() {
      const vm = this;
      vm.isStart = true;
    },
    watchKeyDown() {
      const vm = this;
      document.onkeydown = function (ev) {
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
    },
  },
  async mounted() {
    const vm = this;
    await vm.createBox();//要等createBox執行完才能渲染小頭，否則會找不到DOM
    vm.controlSnakeHeader();//顯示蛇蛇小頭
    vm.watchKeyDown();//監視user操作方向鍵
    vm.snakeMoving();//控制蛇蛇前進
  },
})
