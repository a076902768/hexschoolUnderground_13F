var app = new Vue({
  el: '#app',
  data() {
    return {
      isStart: true,//預設false
      boxItem: [],
      snakeHeader: 1,//目前蛇蛇小頭所在的BOX位置
      timer: 300,
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
        vm.snakeHeader += vm.addType.push;//改變蛇蛇小頭前進的方向
        vm.controlSnakeHeader();//渲染新的蛇蛇小頭
      }, vm.timer);//固定時間執行
    },
    removeOldSnakeHeader() {
      const vm = this;
      let header = document.getElementById(`box_${vm.snakeHeader}`);
      header.classList.remove('snakeHeader');
    },
    controlSnakeHeader() {
      const vm = this;
      vm.boxItem.some(element => {
        if (element.id == vm.snakeHeader) {
          let header = document.getElementById(`box_${vm.snakeHeader}`);
          header.classList.add('snakeHeader');
          return true;
        }
      });
    },
    createBox() {
      const vm = this;
      let boxNumber = 28 * 16;//28*16
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
