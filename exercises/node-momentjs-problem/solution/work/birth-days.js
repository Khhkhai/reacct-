curr = require('moment')();
for (let i = 0; i < 14; i++){
    console.log(curr.format('dddd'));
    curr = curr.subtract(1, 'year');
}
