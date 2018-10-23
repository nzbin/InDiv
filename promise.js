
function cccc1() {
    return new Promise(function (res, rej) {
        var map = new Map();
        res(map);
    });
}
var map1 = cccc1();
console.log(1111111, Promise, Map);
