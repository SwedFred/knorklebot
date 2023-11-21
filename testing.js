const {Builder, By, Key, until, webdriver} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const {suite, Environment} = require('selenium-webdriver/testing')
const fs = require('fs');
const path = require('path')
var driverpath = require('chromedriver').path;
const {EOL} = require('os');

let settingspath = path.join(__dirname, "settings.json")
let dartists = []
let dphrases = []
let dkeywords = []
let dprompts = []
let dweights = []
const sessionid = new Date(Date.now()).toISOString().split('T')[0] + '_' + between(10000,100000).toString()
const extensions = ["jpg", "png", "avif", "webp", "jpeg"]

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function between(min, max) {  
    return Math.floor(
      Math.random() * (max - min) + min
    )
  }

function parsedescription(text, settings) {
    var findkeys = /(?<=<span>)(.*?)(?=<\/span>)/g
    var findartists = /(?<=<a([^>]*)><span>)(.*?)(?=<\/span><\/a>)/g
    var results = []
    var lines = text.match(findkeys)
  
    if (lines) {
      for(var i = 0; i < lines.length; i++) {
        // check if the prompt is over
        if (lines[i][0] === ':' || (lines[i][lines[i].length-1] === ' ' && lines[i].length > 3)) {
          if (settings.descriptions.saveprompts)  {
            dprompts.push(results.join())
          }   
          if (settings.descriptions.savekeywords) {
            dkeywords = dkeywords.concat(results.filter(x => x.split(' ').length <= 2))
          }
          if (settings.descriptions.savephrases) {
            dphrases = dphrases.concat(results.filter(x => x.split(' ').length > 2))
          }
          if (settings.descriptions.saveweights)
          {
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
          results[results.length-1].concat(lines[i][0])
        else
          results.push(lines[i].trim())
      }
      
      if (results.length > 0)
        dprompts.push(results.join()); // finishing off since the last line isn't a newline
      // Get artists
      var artlines = text.match(findartists)
      for (var j = 0; j < artlines.length; j++) {
        if (artlines[j].includes('span')) {
          var start = artlines[j].indexOf('<')
          if (artlines[j][start] === ' ')
            start = start -1;
          var end = artlines[j].lastIndexOf('>')
           dartists.push(artlines[j].slice(0,start).concat(artlines[j].slice(end+1)))
        } else {
          dartists.push(artlines[j])
        }
      }
    }
}

function savefiles(settings) {
    // fs writefile och dela upp allt
    var filePath = ''
    if (dartists.length > 0)
    {
        var artistset = [ ...new Set(dartists)]
        filePath = path.join(settings.descriptions.descsavepath, "artists_" + sessionid + ".txt");
        var file = fs.createWriteStream(filePath);
        file.on('error', function(err) { console.log("Error writing file: " +err)});
        artistset.forEach(function(e,i,a) { 
          if(i < a.length-1) 
            file.write(e + EOL);
          else
            file.write(e);
          });
        file.end(); 
    }
    if (dkeywords.length > 0)
    {
        var keywordset = [ ...new Set(dkeywords)]
        filePath = path.join(settings.descriptions.descsavepath, "keywords_" + sessionid + ".txt");
        var file = fs.createWriteStream(filePath);
        file.on('error', function(err) { console.log("Error writing file: " +err)});
        keywordset.forEach(function(e,i,a) { 
          if(i < a.length-1) 
            file.write(e + EOL);
          else
            file.write(e);
          });
        file.end(); 
    }
    if (dphrases.length > 0)
    {
        var phrasesset = [ ...new Set(dphrases)]
        filePath = path.join(settings.descriptions.descsavepath, "phrases_" + sessionid + ".txt");
        var file = fs.createWriteStream(filePath);
        file.on('error', function(err) { console.log("Error writing file: " +err)});
        phrasesset.forEach(function(e,i,a) { 
          if(i < a.length-1) 
            file.write(e + EOL);
          else
            file.write(e);
          });
        file.end(); 
    }
    if (dprompts.length > 0)
    {
        var promptset = [ ...new Set(dprompts)]
        filePath = path.join(settings.descriptions.descsavepath, "prompts_" + sessionid + ".txt");
        var file = fs.createWriteStream(filePath);
        file.on('error', function(err) { console.log("Error writing file: " +err)});
        promptset.forEach(function(e,i,a) { 
          if(i < a.length-1) 
            file.write(e + EOL);
          else
            file.write(e);
          });
        file.end(); 
    }
    if (dweights.length > 0)
    {
        var sortedWeights = dweights.toSorted();
        var weights = [];
        for (var v = 0; v < sortedWeights.length; v++) {
            var dex = weights.find(x => x.id === sortedWeights[v]);
            if (dex === undefined) {
                weights.push({id: sortedWeights[v], count: 1});
            } else {
                weights[weights.indexOf(dex)].count++;
            }            
        }
        filePath = path.join(settings.descriptions.descsavepath, "weights_" + sessionid + ".txt");
        var file = fs.createWriteStream(filePath);
        file.on('error', function(err) { console.log("Error writing file: " +err)});
        weights.forEach(function(e,i,a) { 
          if(i < a.length-1) 
            file.write(a[i].id + "," + a[i].count + EOL);
          else
            file.write(a[i].id + "," + a[i].count);
          });
        file.end(); 
    }
}

  
suite(async function (env) {
    describe('First script', function () {
        let driver;
        let settingsfile = fs.readFileSync(settingspath)
        let settings = JSON.parse(settingsfile)
        const img1path = settings.img1source
        const img2path = settings.img2source
        const img3path = settings.img3source
        const img4path = settings.img4source
        const img5path = settings.img5source
        const describepath = settings.descriptions.descpath;
        let img1dir = []
        let img2dir = []
        let img3dir = []
        let img4dir = []
        let img5dir = []

        let descdir = []

        if (img1path != "")
        {
            img1dir = fs.readdirSync(img1path).map(x => x);
        }
        if (img2path != "")
        {
            img2dir = fs.readdirSync(img2path).map(x => x)
        }
        if (img3path != "")
        {
            img3dir = fs.readdirSync(img3path).map(x => x)
        }
        if (img4path != "")
        {
            img4dir = fs.readdirSync(img4path).map(x => x)
        }
        if (img5path != "")
        {
            img5dir = fs.readdirSync(img5path).map(x => x)
        }
        if (describepath != "")
        {
            descdir = fs.readdirSync(describepath)
        }

        before(async function () {
            const service = new chrome.ServiceBuilder(driverpath);
            driver = await new Builder().forBrowser('chrome').setChromeService(service).build();
        });

        it('First Selenium script', async function () {
            await driver.get('https://discord.com/login');
    
            username = settings.username
            password = settings.password
     
            await driver.wait(until.elementLocated(By.name('email')))
            username_input = driver.findElement(By.name('email'))
            username_input.sendKeys(username)
            password_input = driver.findElement(By.name('password'))
            password_input.sendKeys(password)
            login_button = driver.findElement(By.xpath('//*[@type="submit"]'))
            login_button.click()
    
    
            channelUrl = settings.discordchaturl
            await driver.wait(until.titleContains('Friend'))
            await driver.get(channelUrl)
            text_input = null;
            console.log("truing to get textbox")
            try {
              //text_input = await driver.wait(until.elementLocated(By.xpath('//*[@id="app-mount"]/div[2]/div/div[1]/div/div[2]/div/div[1]/div/div/div[3]/div[2]/main/form/div/div[1]/div/div[3]/div/div[2]')))
              text_input = await driver.wait(until.elementLocated(By.xpath('//*[@id="app-mount"]/div[2]/div[1]/div[1]/div/div[2]/div/div/div/div/div[3]/div[2]/div/div[1]/main/form/div/div[1]/div/div[3]/div/div[2]')))
              
            } catch(err) {console.log("cant get text input")}
            //let messagelist = await driver.wait(until.elementLocated(By.xpath(msglist)))

            var time = 0;
            if (settings.mode === 2) // Blend Mode
            {
              if (settings.blendnum == 2)
              {
                for (var i = 0; i < settings.loops; i++)
                {
                  var time = (settings.interval * 1000) + (Math.random() * 5000)
                  text_input.sendKeys('/blend:')
                  //Behövs den här koden?
                  if (i == 0)
                  {
                    var beb = await driver.wait(until.elementLocated(By.xpath('//*[@id="autocomplete-0"]/div/div/div[2]/div[1]/div[3]')))
                  }
                  text_input.sendKeys(Key.TAB)
                  var blendimg1 = '//*[@id="app-mount"]/div[2]/div[1]/div[1]/div/div[2]/div/div/div/div/div[3]/div/main/form/div/div[2]/ul/li[1]/div/div/div/input'
                  var blendimg2 = '//*[@id="app-mount"]/div[2]/div[1]/div[1]/div/div[2]/div/div/div/div/div[3]/div/main/form/div/div[2]/ul/li[2]/div/div/div/input'
                  var img1 = await driver.wait(until.elementLocated(By.xpath(blendimg1)))
                  var img2 = await driver.wait(until.elementLocated(By.xpath(blendimg2)))
                  var p1 = path.join(img1path, img1dir[between(0, img1dir.length)])
                  var p2 = path.join(img2path, img2dir[between(0, img2dir.length)])
                  img1.sendKeys(p1)
                  img2.sendKeys(p2)
                 
                  //var inputbox = '//*[@id="app-mount"]/div[2]/div[1]/div[1]/div/div[2]/div/div/div/div/div[3]/div/main/form/div/div[2]/div[2]/div[2]/div/div/div/span[5]'
                  var inputbox = '//*[@id="app-mount"]/div[2]/div[1]/div[1]/div/div[2]/div/div/div/div/div[3]/div/main/form/div/div[2]/div[2]/div[2]/div/div/div/span[5]/span'
                  var box = await driver.wait(until.elementLocated(By.xpath(inputbox)))
                  box.click()
                  box.sendKeys("dimensions: " + settings.blendaspect)
                  await wait(1000)
                  box.sendKeys(Key.ENTER);
                  text_input.sendKeys(Key.ENTER)
                  await wait(time)
                }
              }
              else
              {
                for (var i = 0; i < settings.loops; i++)
                {
                  try
                  {
                    time = (settings.interval * 1000) + (Math.random() * 5000)
                    text_input.sendKeys('/blend:')
                    //Behövs den här koden? JA!
                    if (i == 0)
                    {
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
                    box.sendKeys("dimensions: " + settings.blendaspect)
                    if (img1dir.length > 0)
                    {
                      var p1 = path.join(img1path, img1dir[between(0, img1dir.length)])
                      img1.sendKeys(p1)
                    }
                    if (img2dir.length > 0)
                    {
                        var p2 = path.join(img2path, img2dir[between(0, img2dir.length)])
                        img2.sendKeys(p2)
                    }
                    if (img3dir.length > 0 && settings.blendnum > 2)
                    {
                        var p3 = path.join(img3path, img3dir[between(0, img3dir.length)])
                        img3.sendKeys(p3)
                    }
                    if (img4dir.length > 0 && settings.blendnum > 3)
                    {
                        var p4 = path.join(img4path, img4dir[between(0, img4dir.length)])
                        img4.sendKeys(p4)
                    }
                    if (img5dir.length > 0 && settings.blendnum > 4)
                    {
                        var p5 = path.join(img5path, img5dir[between(0, img5dir.length)])
                        img5.sendKeys(p5)
                    }
                    await wait(time)
                    box.sendKeys(Key.ENTER)
                    box.sendKeys(Key.ENTER)
                    await wait(3000);
                  }
                  catch(error)
                  {
                    box.sendKeys(Key.CTRL + "a")
                    box.sendKeys(Key.DELETE)
                    console.log(error)
                  }
                }
              }
            }
            else if (settings.mode === 1) // Prompt mode
            {
              console.log("hej")
                //generate from prompt
                var prompts = settings.prompts;
               
                for (var i = 0; i < prompts.length; i++)
                {
                  try {
                    time = (settings.interval * 1000) + (Math.random() * 5000)
                    var command = '/imagine prompt: ';

                    if (settings.override === true)
                    {
                        // First remove all existing options
                        var prompt = prompts[i];
                        var pindex = prompts[i].indexOf("--")
                        if (pindex >= 0) {
                            prompt = prompts[i].substring(0, prompts[i].indexOf("--"));
                        }
                        var override = " --stylize " + settings.stylize + " --chaos " + settings.chaos + " --ar " + settings.aspect + " --iw " + settings.imageweight;
                        if (settings.version === "niji" || settings.version === "niji 5")
                          override += " --" + settings.version;
                        else if (settings.version === "51r")
                          override += " --" + settings.version + " --style raw";
                        else
                          override += " --v " + settings.version;
                        prompt += override
                        command += prompt;
                    }
                    else
                    {
                        command += prompts[i];
                    }
                    text_input.sendKeys(command)
                    if (i == 0)
                        await driver.wait(until.elementLocated(By.xpath('//*[@id="autocomplete-0"]/div/div/div[2]')))
                    text_input.sendKeys(Key.ENTER)
                    await wait(time)
                  }catch(err) {console.log(err)}
                };
            }
            else if (settings.mode === 3) // Describe
            {
              await wait(5000);
                for(var d = 0; d < descdir.length; d++)
                {
                  try
                  {
                    let msglist = '//*[@id="app-mount"]/div[2]/div[1]/div[1]/div/div[2]/div/div/div/div/div[3]/div/main/div[1]/div/div/ol/li' //lägg till /li ?
                    let messagelist = await driver.findElements(By.xpath(msglist), 5000)
                    var oldMessageId = await messagelist[messagelist.length-1].getAttribute("id")
                    time = (settings.descriptions.interval * 1000) + (Math.random() * 5000)
                    text_input.sendKeys('/describe:')
                    if (d == 0)
                    {
                      var beb = await driver.wait(until.elementLocated(By.xpath('//*[@id="autocomplete-0"]')),5000)
                    }
                    text_input.sendKeys(Key.TAB)
                    var descimg = '/html/body/div[1]/div[2]/div[1]/div[1]/div/div[2]/div/div/div/div/div[3]/div/main/form/div/div[2]/ul/li/div/div/div/input'
                    var img = await driver.wait(until.elementLocated(By.xpath(descimg)), 5000)
                    var p1 = path.join(describepath, descdir[d])
                    img.sendKeys(p1)
                    await wait(1000)
                    text_input.sendKeys(Key.ENTER)
                    await wait(time)
                    try
                    {
                      retries = 1
                      while (retries <= 3)
                      {
                        retries++;
                        messagelist = await driver.findElements(By.xpath(msglist),5000)
                        newMessageId = await messagelist[messagelist.length-1].getAttribute("id")
                        if (newMessageId !== oldMessageId)
                        {
                          var newitem = msglist + '[' + (messagelist.length-1).toString() + ']/div/div[3]/article/div/div/div[1]'
                          try 
                          {
                            let nitem = await driver.wait(until.elementLocated(By.xpath(newitem)), 5000)
                            var description = await nitem.getAttribute('innerHTML');                       
                            parsedescription(description, settings);
                            savefiles(settings);
                            break;
                          }
                          catch(err)
                          {
                            console.log(err)
                          }
                        }
                      }
                    }
                    catch(err2)
                    {
                      console.log(err2)
                    }
                  }
                  catch(error)
                  {
                    console.log(error)
                  }
                }
            }
        });
    });
});