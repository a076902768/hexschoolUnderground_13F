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
      vm.nowRow = Math.floor(vm.snakeHeader.pos / (vm.rowMaxCount + 1)) + 1;
      vm.nowCol = vm.snakeHeader.pos % vm.rowMaxCount;
      let leftBox = vm.rowMaxCount * (vm.nowRow - 1) + 1;//左側邊緣的BOX
      let rightBox = vm.rowMaxCount * vm.nowRow;//右側邊緣的BOX

      //先判斷目前前進的方向
      if (vm.snakeHeader.type == 'right' || vm.snakeHeader.type == 'left') {
        // console.log('水平');
        // console.log(vm.snakeHeader.type);
        console.log(vm.snakeHeader.pos);
        console.log(vm.nowRow, vm.nowCol);
        console.log(leftBox, rightBox);
        if (leftBox == vm.snakeHeader.pos) {
          console.log('目前為第' + vm.nowRow + '行最左側:' + vm.snakeHeader.pos);
        }
        if (rightBox == vm.snakeHeader.pos) {
          console.log('目前為第' + vm.nowRow + '行最右側:' + vm.snakeHeader.pos);
        }
      }//如果目前蛇蛇前進的方向為水平的
      else {
        console.log('垂直');
        console.log(vm.snakeHeader.type);
      }//如果目前蛇蛇前進的方向為垂直的

      vm.snakeHeader.pos += vm.addType.push;//改變蛇蛇小頭所在的BOX位置
    },
    removeOldSnakeHeader() {
      const vm = this;
      let header = document.getElementById(`box_${vm.snakeHeader.pos}`);
      header.classList.remove('snakeHeader');
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
    // vm.snakeMoving();//控制蛇蛇前進
  },
})
