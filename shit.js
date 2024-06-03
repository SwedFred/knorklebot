const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { suite, Environment } = require('selenium-webdriver/testing')
const fs = require('fs');
const path = require('path')
var driverpath = require('chromedriver').path;
const { EOL } = require('os');

let file = fs.readFileSync('C:\\Users\\FredrikArvidsson\\Downloads\\descriptions\\to cut\\result.txt').toString()
var lines = file.split(',')
var longlines = []
var shortlines = []
for(var i = 0; i < lines.length; i++) {
    var kek = lines[i].split(' ')
    if (kek.length > 3)
        longlines.push(kek.join(' '))
    else
        shortlines.push(kek.join(' '))
}
// console.log(longlines)
// console.log(shortlines)
var longset = [...new Set(longlines)]
var lf = fs.createWriteStream('C:\\Users\\FredrikArvidsson\\Downloads\\descriptions\\to cut\\long.keywords');
lf.on('error', function (err) { console.log("Error writing file: " + err) });
longset.forEach(function (e, i, a) {
    if (i < a.length - 1)
        lf.write(e + EOL);
    else
        lf.write(e);
});
lf.end();

var shortset = [...new Set(shortlines)]
var sf = fs.createWriteStream('C:\\Users\\FredrikArvidsson\\Downloads\\descriptions\\to cut\\short.keywords');
sf.on('error', function (err) { console.log("Error writing file: " + err) });
shortset.forEach(function (e, i, a) {
    if (i < a.length - 1)
        sf.write(e + EOL);
    else
        sf.write(e);
});
sf.end();
// fs.writeFileSync(, longlines)
// fs.writeFileSync('C:\\Users\\FredrikArvidsson\\Downloads\\prompts\\short.keywords', shortlines)