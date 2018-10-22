//https://www.w3schools.com/js/js_es6.asp

var abc = 1;

function publicfunc(){
    return abc;
}

module.exports = {
    publicfunc: publicfunc,
}