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

//startup();

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
    setTimeout(zr,105)
    } else if(tmpzr<50){
    document.getElementById("log").style.border="1px solid #cccccc"
    setconsole.style.border="1px solid #cccccc"
    setTimeout(zr,90)
    } else if(tmpzr<80){
    setconsole.innerHTML="<button onclick='document.getElementById(\"log\").hidden=1;this.hidden=1;echoconsole.hidden=0' id=hiddenconsole>隐藏控制台</button><button onclick='document.getElementById(\"log\").hidden=0;this.hidden=1;hiddenconsole.hidden=0' hidden id=echoconsole>显示控制台</button>"
    el.width = 600;
    setTimeout(zr,75)
    } else if(tmpzr<99){
    el.height = 600;
    setTimeout(zr,35)
    } else if(tmpzr==99){
    setconsole.innerHTML+="<button onclick=\"document.getElementById('log').innerHTML=''\">清空控制台</button>"
    setconsole.innerHTML+="<button onclick=\"writeconsole.hidden=0\">写控制台</button><span id=writeconsole hidden><textarea id=writevalueconsole cols=50 rows=1></textarea><button onclick=\"try{log(eval(writevalueconsole.value),1);}catch(err){log(writevalueconsole.value,1);};writevalueconsole.value='';writeconsole.hidden=1\">确定</button></span><button onclick='print()'>打印</button>"
    setconsole.innerHTML+="<button onclick='location.href=(\"toOther.html\")'>分享</button>"
    document.getElementById("canvasize").disabled=0
    statorendmarker=1
    statpassreset=0
    setTimeout(zr,700)
    } else if(tmpzr>99){
  el.addEventListener("touchstart", handleStart, false);
  el.addEventListener("touchend", handleEnd, false);
  el.addEventListener("touchcancel", handleCancel, false);
  el.addEventListener("touchmove", handleMove, false);
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
    if(statorendmarker=="1"){
    ctx.arc(touches[i].pageX, touches[i].pageY, 4, 0, 2 * Math.PI, false);
    // 在起点画一个圆
    log("厌烦了起终点标记?<a href='javascript:statorendmarker=0;log(\"关闭成功!\")'>关闭它</a>")
    } else {
    log("想念了起终点标记?<a href='javascript:statorendmarker=1;log(\"打开成功!\")'>打开它</a>")
    }
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
      if(statorendmarker=="1"){
      ctx.fillRect(touches[i].pageX - 4, touches[i].pageY - 4, 8, 8);
      log("厌烦了起终点标记?<a href='javascript:statorendmarker=0;log(\"关闭成功!\")'>关闭它</a>")
      // 在终点画一个正方形
      } else {
      log("想念了起终点标记?<a href='javascript:statorendmarker=1;log(\"打开成功!\")'>打开它</a>")
      }
      log("<button onclick='if(confirm(\"Are you sure?\")) location.reload(1)'><span style='color:red'>刷新</span></button>")
      log("画板太乱?<a href='javascript:el.width=50;setCanvaSize(elew,eleh);log(\"操作成功!\");statpassreset=1'>重置</a>")
      if(1){log("对稳定性不满意?<a href='javascript:if(confirm(\"Are you sure?\")) location.reload(1)' style='color:red'>刷新</a>或<a href='javascript:open(\"https://github.com/shc7432/mdn-demo-chn/issues/new/\",\"_blank\")'>新开issue</a>")}
      log("触摸结束。");
      ongoingTouches.splice(idx, 1);  // 用完后移除
    } else {
      log("无法确定要结束哪个触摸点。");
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
  //log("identifier " + touch.identifier + " 的颜色为: " + /*color*/"("+colr+","+colg+","+colb+")");
  log("identifier " + touch.identifier + " 的颜色为: ("+colr+","+colg+","+colb+")",0)
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

function setCanvaSize(size,size2){
if(size=="other"){setCanvaSizeByOther();return}
//alert(size+" "+size2)
if((size2!==undefined)&&(isNaN(Number(String(size)))||isNaN(Number(String(size2))))){
log("您输入的不是数字,请输入数字!");
return;
}
el.width=size
elew=size
if(size2===undefined){
el.height=size;
log("您已成功把触控板大小调整到"+size+"×"+size+" <a href='javascript:setCanvaSizeByOther()'>其他...</a>")
eleh=size
} else {
el.height=size2;
log("您已成功把触控板大小调整到"+size+"×"+size2+" <a href='javascript:setCanvaSizeByOther()'>其他...</a>")
eleh=size2
 }
}
function setCanvaSizeByOther(){
var str0="输入高度:<input useto=setCanvaSizeByOther size=6 placeholder=px>"
var str1="输入宽度:<input useto=setCanvaSizeByOther size=6 placeholder=px>"
log(str1+str0+"<button onclick='setCanvaSizeToOk()'>确定</button>")
}
function setCanvaSizeToOk(){
var str=document.querySelectorAll("input[useto='setCanvaSizeByOther']")
var str0=str[0].value,str1=str[1].value
setCanvaSize(str0,str1)
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

function log(msg,long) {
  const p = document.getElementById('log');
  var a=new Date().getMilliseconds()
  if(a<10){a="00"+a} else 
  if(a<100){a="0"+a};
  if(long){
  p.innerHTML =
    Math.ceil(new Date().getFullYear()/100)+" Century "+new Date().getFullYear()+" Year "+(new Date().getMonth()+1)+" Month "+new Date().getDate()+" Day "+ 
    new Date().toString().substring(16, 24)+"."+ a + '\n' + msg + "\n" + p.innerHTML;
    return true;
  }
  p.innerHTML =
    Math.ceil(new Date().getFullYear()/100)+" Century "+new Date().getFullYear()+" Year "+(new Date().getMonth()+1)+" Month "+new Date().getDate()+" Day "+ 
    new Date().toString().substring(16, 24)+"."+ a + ' ' + msg + "\n" + p.innerHTML;
}

(function(){try{
pw=undefined
var path=location.href
if(path.search("\\?")!==-1){
var inputContent=path.split("?")[1]
if(inputContent.search("\\&")!==-1) { 
inputContent=inputContent.split("&") 
var i=0
for(;i<inputContent.length;i++){
if(inputContent[i].search(/pw\u003d/)!==-1){
pw=inputContent[i].replace("pw=","");
break;
 }
}
} else {
if(inputContent.search(/pw\u003d/)!==-1){
pw=inputContent.replace(/pw\u003d/,"")
 }
}
  }

if(pw){

log("请输入密码<input onblur='checkpw(this.value,this)'>")

pw=decodeURI(pw)

 } else {

startup();

 }
}catch(err){alert(err)}})()

function checkpw(v,o){
if(pw==v){
log("密码正确!")
o.disabled=1
startup();
 } else log("密码错误!")
}
