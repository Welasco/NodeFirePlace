//interval = setInterval(function () { //#C
//    console.log(new Date().toISOString());
//}, 900000);


/*
function check(callback) {
    callback();
}

console.log('setTimeout');
for(var i = 0; i == 5; i++) {
  //console.log('Inicio st:'+i)
  //setTimeout(function() {console.log('st:'+i)}, 0);
  check(function () {
    console.log('Inicio st:'+i)
  });
}
console.log('fim');
*/

/*
console.log('For loop');
for(var i = 0; i &lt; 5; i++) {
 console.log(i);
}
*/

/*
const timeoutScheduled = Date.now();

setTimeout(() => {
  const delay = Date.now() - timeoutScheduled;

  console.log(`${delay}ms have passed since I was scheduled`);
}, 100);
*/
/*
function check(callback) {
    var interval = setInterval(function(){ 
        console.log('Hello World'); 
      }, 2000);
    setTimeout(function() { 
    clearInterval(interval); 
    }, 10000);
    callback(); 
}
*/

function check(callback) {
    var i = 0;
    var interval = setInterval(function(){ 
        console.log('Hello World ' +  new Date().toISOString()); 
        if (i >= 2) {
            console.log('Dentro do IF ' +  new Date().toISOString()); 
            callback(true);
            clearInterval(interval);     
        }
        i++;
      }, 500);
}

var test = check(function (checkvar) {
    console.log('retornou');
    if (checkvar) {
        console.log('retornou verdadeiro');
        return true;
    }
    else{
        return false;
    }
});

if (test) {
    console.log("Test verdadeiro");
}

console.log(test);
//console.log("test: " + test);

function createID() {
    return Math.random().toString(26).slice(2)
}
console.log(createID())

/*
    Retirar o delay de 100 milseconds ele esta evitando que se o switch esta realmente sendo alterado causando problema
    implementar este codigo para aguardar o valor real do switch por 2 ou 1,5 segundos e talvez implementar um controle aqui
*/