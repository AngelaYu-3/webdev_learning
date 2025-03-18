console.log('javscript is cool');

var number = 10;
var string = 'hello there';
var is_cool = true;

if (number == 10) {
    console.log('is 10');
} else {
    console.log('not 10');
}

// document.getElementById('box').innerHTML = string;

function listGroceries() {
    console.log('listing groceries!')
}

listGroceries();

document.getElementById("box").addEventListener('click', function() {
    alert('I got clicked');
});