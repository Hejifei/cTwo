/* eslint-disable */
export function MP() {
  return new Promise(function (resolve, reject) {
    window.onload = function () {
      resolve(BMap)
    }
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://api.map.baidu.com/api?v=2.0&ak=bcCZEZkRcGlzO8GLNKpHFOUismi3Qu9e&callback=init&s=1";
    script.onerror = reject;
    document.head.appendChild(script);
  })
}
