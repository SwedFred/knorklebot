process.env.SELENIUM_BROWSER_EXECUTABLES = 'false';

const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { suite, Environment } = require('selenium-webdriver/testing')
const fs = require('fs');
const path = require('path')
var driverpath = require('chromedriver').path;
const { EOL } = require('os');
// const PNG = require('pngjs').PNG;
// const { createCanvas } = require('canvas');

console.log(__dirname)
const RESOURCES_PATH = path.join(__dirname, '../settings');
let settingspath = path.join(RESOURCES_PATH, "settings.json")
let driver;
let settingsfile = fs.readFileSync(settingspath)
let settings = JSON.parse(settingsfile)
let currentId = ""
let idList = []
// Midjourney specific variables
let dartists = []
let dphrases = []
let dkeywords = []
let dprompts = []
let dweights = []
const extensions = ["jpg", "png", "avif", "webp", "jpeg"]

const isBrowserClosed = async () => {
    var isClosed = false;
    try {
        var res = await driver.getTitle();
    } catch (err) {
        console.log(err.code)
        isClosed = true;
    }

    return isClosed;
}

const wait = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

const between = (min, max) => {
    return Math.floor(
        Math.random() * (max - min) + min
    )
}
const sessionid = new Date(Date.now()).toISOString().split('T')[0] + '_' + between(10000, 100000).toString()

function checkIfFiveMinutesPassed(object) {
    try {
        let currentTime = Date.now(); // Get the current time
        return currentTime - object.timestamp >= 2 * 60 * 1000; // Check if 5 minutes have passed (5 minutes * 60 seconds * 1000 milliseconds)
    }catch(err) {console.log(err); return true}
}

const GetImageUrl = async (element) => {
    try {
        if (element) {
            if (settings.midjourney.mode === 2) // blend
            {
                let blendimagesource = './div/div[2]/div[1]/div/div/div/div/div/a'
                let aElement = await element.findElement(By.xpath(blendimagesource), 5000)
                if (aElement) {
                    let res = await aElement.getAttribute('data-safe-src');
                    return res
                } else console.log("no aElement")
            } else if (settings.midjourney.mode === 1) // prompt
            {
                let aElement = await element.findElement(By.tagName("a"), 5000)
                if (aElement) {
                    let res = await aElement.getAttribute('data-safe-src');
                    return res
                } else console.log("no aElement")
            }
            return null
        }
    } catch (err) { console.log(err); return null }
}

const GetLatestMessage = async () => {
    try {
        let mainElements = await driver.findElements(By.tagName('main'), 5000);
        let firstMainElement = null
        let firstOlElement = null
        if (mainElements.length > 0) {
            firstMainElement = mainElements[0];
            let olElements = await firstMainElement.findElements(By.tagName('ol'), 5000);
            if (olElements.length > 0) {
                firstOlElement = olElements[0]
                let listItems = await firstOlElement.findElements(By.tagName('li'), 5000);
                let currentElement = listItems[listItems.length - 1]
                return currentElement
            }
        }
        console.log("list NOT found")
        return null
    } catch (err) { console.log("Failed to get message"); console.log(err); return null }
}

const TryAddNewId = async (element, index) => {
    try {
        let id = await element.getAttribute('id');
        let e = idList.find(x => x.id === id)
        if (e) {
            return null
        } else {
            return { id: id, index: index, timestamp: Date.now() }
        }
    } catch (err) { console.log(err); return null }
}

const FindAllActiveMessages = async () => {
    try {
        let mainElements = await driver.findElements(By.tagName('main'), 5000);
        let firstMainElement = null
        let firstOlElement = null
        let returnlist = []
        if (mainElements.length > 0) {
            firstMainElement = mainElements[0];
            let olElements = await firstMainElement.findElements(By.tagName('ol'), 5000);
            if (olElements.length > 0) {
                firstOlElement = olElements[0]
                let listItems = await firstOlElement.findElements(By.tagName('li'), 5000);
                for (var i = 0; i < listItems.length; i++) {
                    let id = await listItems[i].getAttribute('id');
                    let e = idList.find(x => x.id === id)
                    if (e) {
                        returnlist.push(id)
                    }
                }
                return returnlist
            }
        }
        console.log("list NOT found")
        return null
    } catch (err) { console.log("Failed to get message"); console.log(err); return null }
}

// Note: This works for Blend and Imagine
// Note2: Images are returned as new chat messages with unique ids and they lack a trace to the old ids so we cannot reliably track them
const WaitUntilComplete = async () => {
    let isComplete = false
    let msgs = []
    while (!isComplete) {
        try {
            if (await isBrowserClosed())
                break
            if (idList.length === 0)
                break;
            await wait(between(5000, 10000))
            console.log(idList)
            msgs = await FindAllActiveMessages()

            // nu gick något åt helvete
            if (msgs.length < 3)
                return msgs
        } catch (err) { console.log(err); return null }
    }
    return null
}

// Wait condition for describe function
const WaitUntilDescribed = async () => {
    let isComplete = false
    let msg = null
    while (!isComplete) {
        try {
            if (await isBrowserClosed()) {
                console.log("browser is closed")
                break
            }
            await wait(between(2000, 5000))
            msg = await GetLatestMessage()
            let element = null
            try {
                let successtext = './div/div[3]/article/div/div/div[2]/div/div/a'
                try {
                    element = await msg.findElement(By.xpath(successtext), 5000)
                    if (element)
                        return true
                } catch (err) {
                    let failtext = './div/div[3]/article/div/div/div[1]'
                    try {
                        element = await msg.findElement(By.xpath(failtext), 5000)
                        if (element)
                            return false
                    } catch (err) { console.log("error message not found") }
                }
            } catch (err) { console.log("WAIT LOOP FAILED") }
        } catch (err) { console.log("where are we even?") }
    }
    return false
}

const download = async (url, filePath) => {
    // try {
    //     let response = null
    //     const index = url.indexOf('&width')
    //     let tmpUrl = url.substr(0,index)
    //     tmpUrl = tmpUrl.replace('webp', 'png')
    //     response = await fetch(tmpUrl)
    //     if (!response)
    //         return null
    //     const blob = await response.blob();
    //     const arraybuffer = await blob.arrayBuffer();
    //     const buffer = Buffer.from(arraybuffer);

    //     const png = PNG.sync.read(buffer)

    //     const quadrantWidth = Math.floor(png.width / 2);
    //     const quadrantHeight = Math.floor(png.height / 2);

    //     for (let i = 0; i < 2; i++) {
    //         for (let j = 0; j < 2; j++) {
    //             const x = i * quadrantWidth;
    //             const y = j * quadrantHeight;

    //             const canvas = createCanvas(quadrantWidth, quadrantHeight);
    //             const ctx = canvas.getContext('2d');

    //             // Copy the pixels from the PNG image to the canvas
    //             PNG.bitblt(png, ctx, x, y, quadrantWidth, quadrantHeight, 0, 0);

    //             // Convert the canvas to a PNG Buffer
    //             const buffer = canvas.toBuffer();

    //             // Write the PNG Buffer to a file
    //             fs.writeFileSync(filePath + `output_quadrant_${i}_${j}.png`, buffer);
    //         }
    //     }

    //     await fs.writeFile(filePath, buffer, (err) => err && console.log(err));
    // } catch (err) {
    //     console.log(err)
    // }
}

const createOrLoadBlendResults = async (promptLength) => {
    try {
        let results = null
        let spath = path.join(settings.midjourney.blends.savepath, path.basename(settings.midjourney.blends.img1source)) + '.mj.prompt.result'
        console.log(spath)
        if (fs.existsSync(spath)) {
            results = JSON.parse(fs.readFileSync(spath))
        } else {
            results = {
                prompts: promptLength,
                currentPrompt: 0,
                maxPrompts: promptLength,
                results: []
            };
        }
        return results
    } catch (err) { console.log(err) }
}

const createOrLoadResults = async (promptLength) => {
    try {
        let results = null
        let spath = path.join(settings.midjourney.savepath, path.basename(settings.midjourney.promptpath)) + '.mj.prompt.result'
        console.log(spath)
        if (fs.existsSync(spath)) {
            results = JSON.parse(fs.readFileSync(spath))
        } else {
            results = {
                prompts: promptLength,
                currentPrompt: 0,
                maxPrompts: promptLength,
                results: []
            };
        }
        return results
    } catch (err) { console.log(err) }
}

const createOrLoadDescribeResults = async (foldersize) => {
    try {
        let results = null
        let spath = path.join(settings.midjourney.descriptions.savepath, path.basename(settings.midjourney.descriptions.sourcepath)) + '.mj.desc.result'
        if (fs.existsSync(spath)) {
            results = JSON.parse(spath)
        } else {
            results = {
                prompts: foldersize,
                currentPrompt: 0,
                results: []
            };
        }
        return results
    } catch (err) { console.log(err) }
}

// In this new version we just get results and remove the id from the list of ID's
const UpdateBlendResults = (results, blendresult) => {
    try {
        var resultType = 1;
        if (blendresult.element === null)
            resultType = -1;
        if (!blendresult.imgurl && blendresult.element) {
            resultType = 0;
        }
        results.currentPrompt += 1;
        results.results[results.results.length - 1].status = resultType;
        if (blendresult.imgurl)
            results.results[results.results.length - 1].images = blendresult.imgurl
        let kek = path.join(settings.midjourney.blends.savepath, path.basename(settings.midjourney.blends.img1source)) + '.mj.prompt.result'
        fs.writeFileSync(kek, JSON.stringify(results))
    } catch (err) { console.log("failed to update blend results"); console.log(err) }
}

const UpdatePromptResults = (results, resultType) => {
    try {
        results.currentPrompt += 1;
        results.results[results.results.length - 1].status = resultType;
        let kek = path.join(settings.midjourney.savepath, path.basename(settings.midjourney.promptpath)) + '.mj.prompt.result'
        console.log(kek)
        fs.writeFileSync(kek, JSON.stringify(results))
    } catch (err) { console.log("failed to update prompt results"); console.log(err) }
}


const UpdateDescResults = (results, resultType) => {
    try {
        results.currentPrompt += 1;
        results.results[results.results.length - 1].status = resultType;
        let kek = path.join(settings.midjourney.descriptions.savepath, path.basename(settings.midjourney.descriptions.sourcepath)) + '.mj.desc.result'
        fs.writeFileSync(kek, JSON.stringify(results))
    } catch (err) { console.log("failed to update description results"); console.log(err) }
}

// OLD: CHECK THEM OUT

function parsedescription(text, settings) {
    try {
        if (!text || text.length === 0)
            return;
        var findkeys = /(?<=<span>)(.*?)(?=<\/span>)/g
        var findartists = /(?<=<a([^>]*)><span>)(.*?)(?=<\/span><\/a>)/g
        var results = []
        var lines = text.match(findkeys)

        if (lines) {
            for (var i = 0; i < lines.length; i++) {
                // check if the prompt is over
                if (lines[i][0] === ':' || (lines[i][lines[i].length - 1] === ' ' && lines[i].length > 3)) {
                    if (settings.midjourney.descriptions.saveprompts) {
                        dprompts.push(results.join())
                    }
                    if (settings.midjourney.descriptions.savekeywords) {
                        dkeywords = dkeywords.concat(results.filter(x => x.split(' ').length <= 2))
                    }
                    if (settings.midjourney.descriptions.savephrases) {
                        dphrases = dphrases.concat(results.filter(x => x.split(' ').length > 2))
                    }
                    if (settings.midjourney.descriptions.saveweights) {
                        dweights = dweights.concat(results)
                    }
                    results = [];
                }
                // Check if it's a bullshit line
                if (lines[i].length < 3 || lines[i][0] === '-' || lines[i][0] === ':') {
                    continue;
                }

                // It's a regular result, but we need to trim it
                if (lines[i][0] === ',')
                    results.push(lines[i].slice(2).trim())
                else if (lines[i][0] === '\'' || lines[i][0] === '.')
                    results[results.length - 1].concat(lines[i][0])
                else
                    results.push(lines[i].trim())
            }

            if (results.length > 0)
                dprompts.push(results.join()); // finishing off since the last line isn't a newline
            // Get artists
            var artlines = text.match(findartists)
            if (artlines) {
                for (var j = 0; j < artlines.length; j++) {
                    if (artlines[j].includes('span')) {
                        var start = artlines[j].indexOf('<')
                        if (artlines[j][start] === ' ')
                            start = start - 1;
                        var end = artlines[j].lastIndexOf('>')
                        dartists.push(artlines[j].slice(0, start).concat(artlines[j].slice(end + 1)))
                    } else {
                        dartists.push(artlines[j])
                    }
                }
            }
        }
    } catch (err) { console.log(err) }
}

function savefiles(settings) {
    // fs writefile och dela upp allt
    var filePath = ''
    if (dartists.length > 0) {
        var artistset = [...new Set(dartists)]
        var source = settings.midjourney.descriptions.sourcepath.substring(settings.midjourney.descriptions.sourcepath.lastIndexOf('\\') + 1)
        filePath = path.join(settings.midjourney.descriptions.savepath, (source + "_artists_" + sessionid + ".txt"));
        var file = fs.createWriteStream(filePath);
        file.on('error', function (err) { console.log("Error writing file: " + err) });
        artistset.forEach(function (e, i, a) {
            if (i < a.length - 1)
                file.write(e + EOL);
            else
                file.write(e);
        });
        file.end();
    }
    if (dkeywords.length > 0) {
        var keywordset = [...new Set(dkeywords)]
        var source = settings.midjourney.descriptions.sourcepath.substring(settings.midjourney.descriptions.sourcepath.lastIndexOf('\\') + 1)
        filePath = path.join(settings.midjourney.descriptions.savepath, (source + "_keywords_" + sessionid + ".txt"));
        var file = fs.createWriteStream(filePath);
        file.on('error', function (err) { console.log("Error writing file: " + err) });
        keywordset.forEach(function (e, i, a) {
            if (i < a.length - 1)
                file.write(e + EOL);
            else
                file.write(e);
        });
        file.end();
    }
    if (dphrases.length > 0) {
        var phrasesset = [...new Set(dphrases)]
        var source = settings.midjourney.descriptions.sourcepath.substring(settings.midjourney.descriptions.sourcepath.lastIndexOf('\\') + 1)
        filePath = path.join(settings.midjourney.descriptions.savepath, (source + "_phrases_" + sessionid + ".txt"));
        var file = fs.createWriteStream(filePath);
        file.on('error', function (err) { console.log("Error writing file: " + err) });
        phrasesset.forEach(function (e, i, a) {
            if (i < a.length - 1)
                file.write(e + EOL);
            else
                file.write(e);
        });
        file.end();
    }
    if (dprompts.length > 0) {
        var promptset = [...new Set(dprompts)]
        var source = settings.midjourney.descriptions.sourcepath.substring(settings.midjourney.descriptions.sourcepath.lastIndexOf('\\') + 1)
        filePath = path.join(settings.midjourney.descriptions.savepath, (source + "_prompts_" + sessionid + ".txt"));
        var file = fs.createWriteStream(filePath);
        file.on('error', function (err) { console.log("Error writing file: " + err) });
        promptset.forEach(function (e, i, a) {
            if (i < a.length - 1)
                file.write(e + EOL);
            else
                file.write(e);
        });
        file.end();
    }
    if (dweights.length > 0) {
        var sortedWeights = dweights.toSorted();
        var weights = [];
        for (var v = 0; v < sortedWeights.length; v++) {
            var dex = weights.find(x => x.id === sortedWeights[v]);
            if (dex === undefined) {
                weights.push({ id: sortedWeights[v], count: 1 });
            } else {
                weights[weights.indexOf(dex)].count++;
            }
        }
        var source = settings.midjourney.descriptions.sourcepath.substring(settings.midjourney.descriptions.sourcepath.lastIndexOf('\\') + 1)
        filePath = path.join(settings.midjourney.descriptions.savepath, (source + "_weights_" + sessionid + ".txt"));
        var file = fs.createWriteStream(filePath);
        file.on('error', function (err) { console.log("Error writing file: " + err) });
        weights.forEach(function (e, i, a) {
            if (i < a.length - 1)
                file.write(a[i].id + "," + a[i].count + EOL);
            else
                file.write(a[i].id + "," + a[i].count);
        });
        file.end();
    }
}

before(async function () {
    try {
        const chromePath = settings.chromepath;
        const options = new chrome.Options();
        options.setChromeBinaryPath(chromePath);
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
    } catch (error) {
        console.error('Error initializing WebDriver:', error);
        throw error; // Rethrow the error to fail the test setup
    }
});

describe('Chrome tests', function () {
    const img1path = settings.midjourney.blends.img1source
    const img2path = settings.midjourney.blends.img2source
    const img3path = settings.midjourney.blends.img3source
    const img4path = settings.midjourney.blends.img4source
    const img5path = settings.midjourney.blends.img5source
    const describepath = settings.midjourney.descriptions.sourcepath;
    let img1dir = []
    let img2dir = []
    let img3dir = []
    let img4dir = []
    let img5dir = []
    let descdir = []
    if (img1path != "") {
        img1dir = fs.readdirSync(img1path).map(x => x);
    }
    if (img2path != "") {
        img2dir = fs.readdirSync(img2path).map(x => x)
    }
    if (img3path != "") {
        img3dir = fs.readdirSync(img3path).map(x => x)
    }
    if (img4path != "") {
        img4dir = fs.readdirSync(img4path).map(x => x)
    }
    if (img5path != "") {
        img5dir = fs.readdirSync(img5path).map(x => x)
    }
    if (describepath != "") {
        descdir = fs.readdirSync(describepath)
    }

    it('First Selenium script', async function () {
        let text_input = null;
        try {
            await driver.get('https://discord.com/login');
            let username = settings.midjourney.email
            let password = settings.midjourney.password
            await driver.wait(until.elementLocated(By.name('email')), 5000)
            let username_input = await driver.findElement(By.name('email'), 5000)
            username_input.sendKeys(username)
            let password_input = await driver.findElement(By.name('password'), 5000)
            password_input.sendKeys(password)
            let login_button = await driver.findElement(By.xpath('//*[@type="submit"]'), 5000)
            login_button.click()
            let channelUrl = settings.midjourney.discordchaturl
            await driver.wait(until.titleContains('Friend'), 15000)
            await driver.get(channelUrl)
            //text_input = await driver.wait(until.elementLocated(By.xpath('//*[@id="app-mount"]/div[2]/div[1]/div[1]/div/div[2]/div/div/div/div/div[3]/div[2]/div/div[1]/main/form/div/div[1]/div/div[3]/div/div[2]')))
            text_input = await driver.wait(until.elementLocated(By.xpath('/html/body/div[1]/div[2]/div[1]/div[1]/div/div[2]/div/div/div/div/div[3]/div[3]/main/form/div/div[1]/div/div[3]/div/div[2]')), 10000)
        } catch (err) { console.log("no chat window"); console.log(err) }
        await wait(5000)

        try {
            var time = 0;
            if (settings.midjourney.mode === 2) // Blend Mode
            {
                //generate from blends
                var i = 0;
                var results = await createOrLoadBlendResults(settings.midjourney.blends.loops);
                i = results.currentPrompt
                if (settings.midjourney.blends.blendnum == 2) {
                    for (i; i < settings.midjourney.blends.loops;) {
                        var isClosed = await isBrowserClosed() // KOLLA OM VI STÄNGT BROWSERN
                        if (isClosed) {
                            console.log("THE BROWSER IS CLOSED")
                            break
                        }
                        time = (settings.midjourney.blends.waittime * 1000) + (Math.random() * 5000)
                        while (idList.length < 3) {
                            text_input.sendKeys('/blend:')
                            text_input.sendKeys(Key.TAB)
                            var blendimg1 = '//*[@id="app-mount"]/div[2]/div[1]/div[1]/div/div[2]/div/div/div/div/div[3]/div/main/form/div/div[2]/ul/li[1]/div/div/div/input'
                            var blendimg2 = '//*[@id="app-mount"]/div[2]/div[1]/div[1]/div/div[2]/div/div/div/div/div[3]/div/main/form/div/div[2]/ul/li[2]/div/div/div/input'
                            var img1 = await driver.wait(until.elementLocated(By.xpath(blendimg1)), 5000)
                            var img2 = await driver.wait(until.elementLocated(By.xpath(blendimg2)), 5000)
                            var p1 = path.join(img1path, img1dir[between(0, img1dir.length)])
                            var p2 = path.join(img2path, img2dir[between(0, img2dir.length)])
                            img1.sendKeys(p1)
                            img2.sendKeys(p2)

                            //var inputbox = '//*[@id="app-mount"]/div[2]/div[1]/div[1]/div/div[2]/div/div/div/div/div[3]/div/main/form/div/div[2]/div[2]/div[2]/div/div/div/span[5]'
                            var inputbox = '//*[@id="app-mount"]/div[2]/div[1]/div[1]/div/div[2]/div/div/div/div/div[3]/div/main/form/div/div[2]/div[2]/div[2]/div/div/div/span[5]/span'
                            var box = await driver.wait(until.elementLocated(By.xpath(inputbox)), 5000)
                            box.click()
                            box.sendKeys("dimensions: " + settings.midjourney.blends.aspect)
                            await wait(1000)
                            box.sendKeys(Key.ENTER);
                            text_input.sendKeys(Key.ENTER)
                            results.results.push({ img1source: p1, img2source: p2, img3source: null, img4source: null, img5source: null, images: [], status: -1, rating: 0, index: i })
                            await wait(3000)
                            let e = await GetLatestMessage()
                            let nid = await TryAddNewId(e, i)
                            if (nid && nid.id !== '') {
                                idList.push(nid)
                            }
                            i += 1; // We have to include failures otherwise we will re-run banned prompts until we lose the game
                        }
                        let blendresults = await WaitUntilComplete() // returnerar en lista med element (null), id och imgurl (null)
                        // Jättefel logik... vi får tillbaka en lista av alla objekt som finns kvar, dvs vi vill ta bort allt som inte finns i blend-results
                        // Men om vi saknar blend-results så tar vi ju inte bort något!
                        if (blendresults && blendresults.length > 0) {
                            idList = idList.filter(x => blendresults.includes(x.id))
                        } else { idList = []} // Funkar detta bättre? Om vi inte returnerar något så bör det ju betyda att vi ska göra om allt
                        idList = idList.filter(x => !checkIfFiveMinutesPassed(x))

                        await wait(45000)
                    }
                }
                else {
                    for (var i = 0; i < settings.midjourney.blends.loops; i++) {
                        try {
                            var isClosed = await isBrowserClosed() // KOLLA OM VI STÄNGT BROWSERN
                            if (isClosed) {
                                console.log("THE BROWSER IS CLOSED")
                                break
                            }
                            time = (settings.midjourney.blends.waittime * 1000) + (Math.random() * 5000)
                            text_input.sendKeys('/blend:')
                            //Behövs den här koden? JA!
                            if (i == 0) {
                                var beb = await driver.wait(until.elementLocated(By.xpath('//*[@id="autocomplete-0"]/div/div/div[2]/div[1]/div[3]')))
                            }
                            text_input.sendKeys(Key.TAB)
                            var inputbox = '//*[@id="app-mount"]/div[2]/div[1]/div[1]/div/div[2]/div/div/div/div/div[3]/div/main/form/div/div[2]/div[2]/div[2]/div/div/div/span[5]'
                            var blendimg1 = '//*[@id="app-mount"]/div[2]/div[1]/div[1]/div/div[2]/div/div/div/div/div[3]/div/main/form/div/div[2]/ul/li[1]/div/div/div/input'
                            var blendimg2 = '//*[@id="app-mount"]/div[2]/div[1]/div[1]/div/div[2]/div/div/div/div/div[3]/div/main/form/div/div[2]/ul/li[2]/div/div/div/input'
                            var blendimg3 = '//*[@id="app-mount"]/div[2]/div[1]/div[1]/div/div[2]/div/div/div/div/div[3]/div/main/form/div/div[2]/ul/li[3]/div/div/div/input'
                            var blendimg4 = '//*[@id="app-mount"]/div[2]/div[1]/div[1]/div/div[2]/div/div/div/div/div[3]/div/main/form/div/div[2]/ul/li[4]/div/div/div/input'
                            var blendimg5 = '//*[@id="app-mount"]/div[2]/div[1]/div[1]/div/div[2]/div/div/div/div/div[3]/div/main/form/div/div[2]/ul/li[5]/div/div/div/input'
                            var img1 = await driver.wait(until.elementLocated(By.xpath(blendimg1)), 5000)
                            var img2 = await driver.wait(until.elementLocated(By.xpath(blendimg2)), 5000)
                            var box = await driver.wait(until.elementLocated(By.xpath(inputbox)), 5000)
                            box.click()
                            box.sendKeys("image3:")
                            await wait(1000);
                            var img3 = await driver.wait(until.elementLocated(By.xpath(blendimg3)), 5000)
                            box.click()
                            box.sendKeys("image4:")
                            await wait(1000);
                            var img4 = await driver.wait(until.elementLocated(By.xpath(blendimg4)), 5000)
                            box.click()
                            box.sendKeys("image5:")
                            await wait(1000);
                            var img5 = await driver.wait(until.elementLocated(By.xpath(blendimg5)), 5000)
                            box.click()
                            box.sendKeys("dimensions: " + settings.midjourney.blends.aspect)
                            if (img1dir.length > 0) {
                                var p1 = path.join(img1path, img1dir[between(0, img1dir.length)])
                                img1.sendKeys(p1)
                            }
                            if (img2dir.length > 0) {
                                var p2 = path.join(img2path, img2dir[between(0, img2dir.length)])
                                img2.sendKeys(p2)
                            }
                            if (img3dir.length > 0 && settings.midjourney.blends.blendnum > 2) {
                                var p3 = path.join(img3path, img3dir[between(0, img3dir.length)])
                                img3.sendKeys(p3)
                            }
                            if (img4dir.length > 0 && settings.midjourney.blends.blendnum > 3) {
                                var p4 = path.join(img4path, img4dir[between(0, img4dir.length)])
                                img4.sendKeys(p4)
                            }
                            if (img5dir.length > 0 && settings.midjourney.blends.blendnum > 4) {
                                var p5 = path.join(img5path, img5dir[between(0, img5dir.length)])
                                img5.sendKeys(p5)
                            }
                            await wait(5000)
                            let blendresults = await WaitUntilComplete() // returnerar en lista med element (null), id och imgurl (null)
                            if (blendresults && blendresults.length > 0) {
                                for (var br = 0; br < blendresults.length; br++) {
                                    idList = idList.filter(x => blendresults.includes(x.id))
                                    console.log(idList)
                                }
                            }
                        }
                        catch (error) {
                            box.sendKeys(Key.CTRL + "a")
                            box.sendKeys(Key.DELETE)
                            console.log(error)
                        }
                    }
                }
            }
            else if (settings.midjourney.mode === 1) // Prompt mode
            {
                //generate from prompt
                var promptfile = fs.readFileSync(settings.midjourney.promptpath, 'utf-8')
                var prompts = promptfile.split(/\r?\n/)
                var i = 0;
                var results = await createOrLoadResults(prompts.length);
                i = results.currentPrompt
                mainloop: for (i; i < prompts.length;) {
                    try {
                        time = (settings.midjourney.waittime * 1000) + (Math.random() * 5000)
                        var isClosed = await isBrowserClosed() // KOLLA OM VI STÄNGT BROWSERN
                        if (isClosed) {
                            console.log("THE BROWSER IS CLOSED")
                            break
                        }
                        while (idList.length < 3) {
                            var isClosed = await isBrowserClosed() // KOLLA OM VI STÄNGT BROWSERN
                            if (isClosed) {
                                console.log("THE BROWSER IS CLOSED")
                                break
                            }
                            console.log("adding new prompt")
                            var command = '/imagine prompt: ';

                            // if (settings.override === true)
                            // {
                            //     // First remove all existing options
                            //     var prompt = prompts[i];
                            //     var pindex = prompts[i].indexOf("--")
                            //     if (pindex >= 0) {
                            //         prompt = prompts[i].substring(0, prompts[i].indexOf("--"));
                            //     }
                            //     var override = " --stylize " + settings.stylize + " --chaos " + settings.chaos + " --ar " + settings.aspect + " --iw " + settings.imageweight;
                            //     if (settings.version === "niji" || settings.version === "niji 5")
                            //       override += " --" + settings.version;
                            //     else if (settings.version === "51r")
                            //       override += " --" + settings.version + " --style raw";
                            //     else
                            //       override += " --v " + settings.version;
                            //     prompt += override
                            //     command += prompt;
                            // }
                            // else
                            await wait(500)
                            command += prompts[i];
                            text_input.sendKeys(command)
                            await wait(500)
                            text_input.sendKeys(Key.ENTER)
                            results.results.push({ prompt: prompts[i], images: [], status: -1, rating: 0, index: i })
                            await wait(8000)

                            let e = await GetLatestMessage()
                            let nid = await TryAddNewId(e, i)
                            if (nid && nid.id !== '')
                                idList.push(nid)
                            i += 1;
                        }

                        let promptresults = await WaitUntilComplete() // returnerar en lista med element (null), id och imgurl (null)
                        if (promptresults && promptresults.length > 0) {
                            idList = idList.filter(x => promptresults.includes(x.id))
                        } else {idList = []}
                        idList = idList.filter(x => !checkIfFiveMinutesPassed(x)) // Kolla om den här skiten funkar.

                    } catch (err) { console.log(err) }
                    await wait(25000)
                };
            }
            else if (settings.midjourney.mode === 3) // Describe
            {
                let d = 0;
                let descresults = await createOrLoadDescribeResults(descdir.length)
                await wait(5000);
                d = descresults.currentPrompt
                for (d; d < descdir.length; d++) {
                    try {
                        var isClosed = await isBrowserClosed() // KOLLA OM VI STÄNGT BROWSERN
                        if (isClosed) {
                            console.log("THE BROWSER IS CLOSED")
                            break
                        }
                        time = (settings.midjourney.descriptions.interval * 1000) + (Math.random() * 5000)
                        text_input.sendKeys('/desc')
                        try {
                            await wait(1000)
                            text_input.sendKeys(Key.TAB)
                            await wait(1000)
                            text_input.sendKeys(Key.TAB)
                            await wait(1000)
                            text_input.sendKeys(Key.TAB)
                            await wait(1000)
                            var upload_path = '/html/body/div[1]/div[2]/div[1]/div[1]/div/div[2]/div/div/div/div/div[3]/div[2]/main/form/div/div[2]/ul/li/div/div/div/input'
                            var upload = await driver.wait(until.elementLocated(By.xpath(upload_path)), 5000)
                            await driver.executeScript('arguments[0].style.display = "block";', upload);
                            await wait(1000)
                            var p1 = path.join(describepath, descdir[d])
                            upload.sendKeys(p1)
                            upload.sendKeys(Key.ENTER)
                            await wait(3000)
                            text_input.sendKeys(Key.ENTER)
                            descresults.results.push({ filename: p1, status: -1, rating: 0, index: d })
                            var res = await WaitUntilDescribed()
                            if (res) {
                                console.log("about to update result file")
                                await wait(2000)
                                UpdateDescResults(descresults, 1)
                                console.log("results updated")
                                let nitem = await GetLatestMessage()
                                var description = await nitem.getAttribute('innerHTML');
                                parsedescription(description, settings);
                                savefiles(settings);
                            } else {
                                console.log("failed to get results, probably a banned file")
                                UpdateDescResults(descresults, 0)
                            }
                            await wait(between(5000, 6000))
                        } catch (err) { console.log("VAFAN HÄNDER") }
                    }
                    catch (error) {
                        console.log(error)
                    }
                }
            }
        } catch (err) { console.log(err) }
    });
});

after(async function () {
    // Cleanup tasks
    if (driver) {
        await driver.quit();
    }
});