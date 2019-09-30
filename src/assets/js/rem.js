// !(function (doc, win) {
//     var docEle = doc.documentElement,
//         evt = "onorientationchange" in window ? "orientationchange" : "resize",
//         fn = function () {
//             var width = docEle.clientWidth;
//             width && (docEle.style.fontSize = width / 7.5 + "px");
//         }
//     win.addEventListener(evt, fn, false);
//     doc.addEventListener("DOMContentLoaded", fn, false);
// }(document, window));
// document.body.addEventListener('touchstart',function(){},false)

(function (doc, win) {
    var docEle=doc.documentElement;         //documentElement 属性是根节点
        evt='orientationchange' in window ? 'orientationchange': 'resize';
        fn = function () {
            var width = docEle.clientWidth;
            if (!width) return;
            docEle.style.fontSize = width / 6 + 'px';//设置html根元素的font-size
        };
    
    if (!doc.addEventListener) return;
    win.addEventListener(evt, fn, false);
    doc.addEventListener('DOMContentLoaded', fn, false)
    ;
}(document, window));
document.body.addEventListener('touchstart',function(){},false)

// 立即执行函数表达式(IIFE)
// (function (window, document, undefined) {
//     // 
// })(window, document);

