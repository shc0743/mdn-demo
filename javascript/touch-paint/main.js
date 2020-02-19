const ongoingTouches = [];
const el = document.getElementById("canvas");
const colR = document.querySelectorAll("input[useto=\"color\"]")
const ctx = el.getContext("2d")
colR[0].onblur=function(){
if(this.value=="") this.value=0;
colr=parseInt(this.value)
log("您已把颜色设置为:("+colr+","+colg+","+colb+")")
}
colR[1].onblur=function(){
if(this.value=="") this.value=0;
colg=parseInt(this.value)
log("您已把颜色设置为:("+colr+","+colg+","+colb+")")
}
colR[2].onblur=function(){
if(this.value=="") this.value=0;
colb=parseInt(this.value)
log("您已把颜色设置为:("+colr+","+colg+","+colb+")")
}
colR[2].value=0
colR[1].value=0
colR[0].value=0
var colr=Number(colR[0].value)
var colg=Number(colR[1].value)
var colb=Number(colR[2].value)

startup();

function startup() {
try{
  document.getElementById("log").style.border="0 solid"
  var tmpzr=0
  var zr=function(){
    tmpzr++;
    log("正在载入..."+tmpzr+"%")
    if(tmpzr==1){
    colorerr=0
    //log("<input name=inputpw hidden>")
    }
    if(tmpzr<20&&tmpzr>-1){
    document.getElementById("log").style.border="1px solid"
    setconsole.style.border="1px solid"
    setTimeout(zr,500)
    } else if(tmpzr<50){
    document.getElementById("log").style.border="1px solid #cccccc"
    setconsole.style.border="1px solid #cccccc"
    setTimeout(zr,250)
    } else if(tmpzr<80){
    setconsole.innerHTML="<button onclick='document.getElementById(\"log\").hidden=1;this.hidden=1;echoconsole.hidden=0' id=hiddenconsole>隐藏控制台</button><button onclick='document.getElementById(\"log\").hidden=0;this.hidden=1;hiddenconsole.hidden=0' hidden id=echoconsole>显示控制台</button>"
    el.width = 600;
    setTimeout(zr,350)
    } else if(tmpzr<99){
    el.height = 600;
    setTimeout(zr,80)
    } else if(tmpzr==99){
    setconsole.innerHTML+="<button onclick=\"writeconsole.hidden=0\">写控制台</button><span id=writeconsole hidden><textarea id=writevalueconsole cols=50 rows=1></textarea><button onclick=\"log(writevalueconsole.value);writevalueconsole.value='';writeconsole.hidden=1\">确定</button></span><button onclick='print()'>打印</button>"
    setTimeout(zr,5000)
    } else if(tmpzr>99){
  el.addEventListener("touchstart", handleStart, false);
  el.addEventListener("touchend", handleEnd, false);
  el.addEventListener("touchcancel", handleCancel, false);
  el.addEventListener("touchmove", handleMove, false);
  document.getElementById("canvasize").disabled=0
  log("初始化成功。");
    } else {
      throw 'Err in function "zr" '+tmpzr
    }
  }
  log("正在载入..."+tmpzr+"%")
  setTimeout(zr,3000)
 }catch(err){
  log("载入失败,请查看错误报告: "+err)
 }
}

function handleStart(evt) {
  if(isNaN(colr)||isNaN(colg)||isNaN(colb)||colr<0||colr>255||colg<0||colg>255||colb<0||colb>255){
  log("请输入0-255的数字!")
  colorerr=1
  return false
  }
  evt.preventDefault();
  log("触摸开始。");
  //log("<button onclick='handleCalcel({preventDefault:function(){},changedTouches:0})'>取消</button>")
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
      //log("<button onclick='handleCalcel({preventDefault:function(){},changedTouches:0})'>取消</button>")
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
      if(colorerr){
        log("请输入0-255的数字!")
      }
    }
  }
}

function handleEnd(evt) {
  evt.preventDefault();
  log("触摸即将结束...");
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
      //ctx.fillRect(touches[i].pageX-4, touches[i].pageY-4, 8, 8);
      ctx.arc(touches[i].pageX, touches[i].pageY, 4, 0, 2 * Math.PI, false);
      // 在终点画一个正方形
      log("<button onclick='location.reload(1)'>重置</button>")
      log("触摸结束。");
      ongoingTouches.splice(idx, 1);  // 用完后移除
    } else {
      log("错误:无法确定触摸点。");
      log("触摸失败。");
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
  log("identifier " + touch.identifier + " 的颜色为：" + /*color*/"("+colr+","+colg+","+colb+")");
  //log("实际颜色:("+colr+","+colg+","+colb+")")
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

function setCanvaSize(size){
circlecanvasize=el.width
el.width=size
el.height=size
log("您已成功把触控板大小更新到"+size+"×"+size+" <a hidden href='javascript:cancelSetCanvaSize()'>撤销</a>")
setTimeout("delete circlecanvasize",180000)
}
function cancelSetCanvaSize(){
if(typeof (circlecanvasize)==undefined){
log("撤销失败")
}
el.width=circlecanvasize
el.height=circlecanvasize
log("您可以撤销3分钟内的操作。")
log("您已成功撤销操作")
document.querySelectorAll("select[onchange='setCanvaSize()']")[0].querySelectorAll("option[value="+circlecanvasize+"]").selected=true
//delete circlecanvasize
circlecanvasize=undefined
//document.body.innerHTML=document.body.innerHTML.replace("<a href='javascript:cancelSetCanvaSize()'>撤销</a>","")
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
  var a=new Date().getMilliseconds()
  if(a<100){a="0"+a};
  p.innerHTML =
    Math.ceil(new Date().getFullYear()/100)+" Century "+new Date().getFullYear()+" Year "+(new Date().getMonth()+1)+" Month "+new Date().getDate()+" Day "+ 
    new Date().toString().substring(16, 24)+"."+ a + ' ' + msg + "\n" + p.innerHTML;
}
