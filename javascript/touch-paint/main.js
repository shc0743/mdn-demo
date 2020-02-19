const ongoingTouches = [];
const el = document.getElementById("canvas");
const colR = document.querySelectorAll("input[useto=\"color\"]")
const ctx = el.getContext("2d")
var colr=Number(colR[0].value)
var colg=Number(colR[1].value)
var colb=Number(colR[2].value)

startup();

function startup() {
  el.width = 600;
  el.height = 600;
  el.addEventListener("touchstart", handleStart, false);
  el.addEventListener("touchend", handleEnd, false);
  el.addEventListener("touchcancel", handleCancel, false);
  el.addEventListener("touchmove", handleMove, false);
  log("初始化成功。");
}

function handleStart(evt) {
  if(isNaN(colr)||isNaN(colg)||isNaN(colb)||colr<0||colr>255||colg<0||colg>255||colb<0||colb>255||colr==""||colg==""||colb==""){
  log("请输入0-255的颜色!")
  return false
  }
  evt.preventDefault();
  log("触摸开始。");
  log("<button onclick='handleCalcel({preventDefault:function(){},changedTouches:0})'>取消</button>")
  const touches = evt.changedTouches;

  for (let i = 0; i < touches.length; i++) {
    log("开始第 " + i + " 个触摸 ...");
    ongoingTouches.push(copyTouch(touches[i]));
    ctx.beginPath();
    ctx.fillStyle = colorForTouch(touches[i]);
    ctx.arc(touches[i].pageX, touches[i].pageY, 4, 0, 2 * Math.PI, false);
    // 在起点画一个圆
    ctx.fill();
    log("第 " + i + " 个触摸已开始。");
  }
}

function handleMove(evt) {
  evt.preventDefault();
  const touches = evt.changedTouches;
  for (let i = 0; i < touches.length; i++) {
    const color = colorForTouch(touches[i]);
    const idx = ongoingTouchIndexById(touches[i].identifier);
    if (idx >= 0) {
      log("继续第 " + idx + " 个触摸。");
      log("<button onclick='handleCalcel({preventDefault:function(){},changedTouches:0})'>取消</button>")
      ctx.beginPath();
      log("ctx.moveTo(" + ongoingTouches[idx].pageX + ", " +
        ongoingTouches[idx].pageY + ");");
      ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
      ctx.lineWidth = 4;
      ctx.fillStyle = color;
      log("ctx.lineTo(" + touches[i].pageX + ", " + touches[i].pageY + ");");
      ctx.lineTo(touches[i].pageX, touches[i].pageY);
      ctx.strokeStyle = color;
      ctx.stroke();
      ongoingTouches.splice(idx, 1, copyTouch(touches[i]));  // 切换到新触摸
      log(".");
    } else {
      log("无法确定下一个触摸点。");
    }
  }
}

function handleEnd(evt) {
  evt.preventDefault();
  log("触摸结束。");
  log("<button onclick='location.reload(1)'>重置</button>")
  const touches = evt.changedTouches;
  for (let i = 0; i < touches.length; i++) {
    const color = colorForTouch(touches[i]);
    const idx = ongoingTouchIndexById(touches[i].identifier);
    if (idx >= 0) {
      ctx.lineWidth = 4;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
      ctx.lineTo(touches[i].pageX, touches[i].pageY);
      ctx.fillRect(touches[i].pageX - 4, touches[i].pageY - 4, 8, 8);
      // 在终点画一个正方形
      ongoingTouches.splice(idx, 1);  // 用完后移除
    } else {
      log("无法确定下一个触摸点。");
    }
  }
}

function handleCancel(evt) {
  evt.preventDefault();
  log("触摸取消。");
  const touches = evt.changedTouches;

  for (let i = 0; i < touches.length; i++) {
    const idx = ongoingTouchIndexById(touches[i].identifier);
    ongoingTouches.splice(idx, 1);  // 用完后删除
  }
}

// 以下是便捷函数

function colorForTouch(touch) {
  const r = (touch.identifier % 16).toString(16);
  const g = (Math.floor(touch.identifier / 3) % 16).toString(16);
  const b = (Math.floor(touch.identifier / 7) % 16).toString(16);
  const color = "#" + r + g + b;
  log("identifier " + touch.identifier + " 的颜色为：" + color);
  var outcolor="rgb("+colr+','+colg+','+colb+")"
  return outcolor;
}

function copyTouch(touch) {
  return {
    identifier: touch.identifier,
    pageX: touch.pageX,
    pageY: touch.pageY
  };
}

function ongoingTouchIndexById(idToFind) {
  for (let i = 0; i < ongoingTouches.length; i++) {
    const id = ongoingTouches[i].identifier;

    if (id === idToFind) {
      return i;
    }
  }
  return -1;    // 未找到
}

function log(msg) {
  const p = document.getElementById('log');
  p.innerHTML =
    new Date().toString().substring(16, 24) + ' ' + msg + "\n" + p.innerHTML;
}
