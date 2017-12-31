/*
var test = true;
var state = test ? 'verdadeiro' : 'falso';
var state2 = test ? 1 : 0;
console.log(state);
console.log(state2);
*/
var foo = 1;
//console.log("foo 1:"+foo);
var date = new Date();
console.log("Date: " + date.getTime());

var date2 = new Date();
console.log("Date2 1 : " + date2.getTime());
//console.log(date.getTime());
//console.log(date.getMilliseconds());
stateChange();

function stateChange() {
    setTimeout(function () {
        console.log("sleep");
        date2 = new Date();
        console.log("Date2 2 : " + date2.getTime());
        //console.log(date2.getMilliseconds());     
    }, 1000);
}

console.log("Date2 3 : " + date2.getTime());

//foo = 3;
//console.log("foo last 3:"+foo);
console.log("ttt: "+ new Date().getTime());

var t = false;
var tt = false;

if (t || tt) {
    console.log("Entrou");
}
else{
    console.log("Não Entrou");
}
