// rem等比适配配置文件
// 基准大小
const baseSize = 16
// 设置 rem 函数
function setRem() {
    // // 屏幕宽度
    // let clientWidth = document.documentElement.clientWidth;
    // // 屏幕高度
    // let clientHeight = document.documentElement.clientHeight;
    // // 比例
    // let radio = clientWidth / clientWidth;
    // console.log("radio=",radio)
    // 当前页面宽度相对于 1920宽的缩放比例，可根据自己需要修改。
    const scale = document.documentElement.clientWidth / 1920
    // const scale = radio * 4 / 3
    // 设置页面根节点字体大小（“Math.min(scale, 2)” 指最高放大比例为2，可根据实际业务需求调整）
    document.documentElement.style.fontSize = baseSize * Math.min(scale, 2) + 'px'
    // document.documentElement.style.fontSize = baseSize * Math.min(scale, 1.5) + 'px'
}
// 初始化
setRem();
// 改变窗口大小时重新设置 rem
window.onresize = function () {
    // console.log("onresiz");
    setRem();
}
