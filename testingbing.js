const {Builder, By, Key, until, webdriver} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const {suite, Environment} = require('selenium-webdriver/testing')
const fs = require('fs');
const path = require('path')
var driverpath = require('chromedriver').path;
const {EOL} = require('os');

let settingspath = path.join(__dirname, "settings.json")
const sessionid = new Date(Date.now()).toISOString().split('T')[0] + '_' + between(10000,100000).toString()

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function between(min, max) {  
    return Math.floor(
      Math.random() * (max - min) + min
    )
}

const download = async (url, path) => {
  try {
    const response = await fetch(url.substring(0, url.indexOf('?')))
    const blob = await response.blob();
    const arraybuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arraybuffer);
    await fs.writeFile(path, buffer, (err) => err && console.log(err));
  } catch (err) {
    console.log(err)
  }
}
  
suite(async function (env) {
    describe('First script', function () {
        let driver;
        let settingsfile = fs.readFileSync(settingspath)
        let settings = JSON.parse(settingsfile)

        before(async function () {
            const service = new chrome.ServiceBuilder(driverpath);
            driver = await new Builder().forBrowser('chrome').setChromeService(service).build();
        });

        it('First Selenium script', async function () {
            await driver.get('https://www.bing.com/images/create');
    
            cookieaccept = '//*[@id="bnp_btn_accept"]'
            clicktobegin = '//*[@id="create_btn_c"]'
            e_mail = '/html/body/div/form[1]/div/div/div[2]/div[1]/div/div/div/div/div[1]/div[3]/div/div/div/div[3]/div[2]/div/input[1]'
            pass_word = '/html/body/div/form[1]/div/div/div[2]/div[1]/div/div/div/div/div/div[3]/div/div[2]/div/div[3]/div/div[2]/input'
            savepass = '/html/body/div/form/div/div/div[2]/div[1]/div/div/div/div/div/div[3]/div/div[2]/div/div[3]/div[2]/div/div/div[2]/input'
            email = settings.bingmail
            password = settings.bingpass
            counter = 0;
     
            var cookie = await driver.wait(until.elementLocated(By.xpath(cookieaccept)))
            var begin = await driver.wait(until.elementLocated(By.xpath(clicktobegin)))
            cookie.click();
            await wait(2000);
            begin.click();
            await wait(2000);
            var em = await driver.wait(until.elementLocated(By.xpath(e_mail)))
            em.sendKeys(email)
            await wait(500)
            em.sendKeys(Key.ENTER)
            await wait(2000)
            var pss = await driver.wait(until.elementLocated(By.xpath(pass_word)))
            pss.sendKeys(password)
            await wait(500)
            pss.sendKeys(Key.ENTER)
            await wait(2000)
            var btn = await driver.wait(until.elementLocated(By.xpath(savepass)))
            btn.click();
            await wait(5000)

            prompt_box = '//*[@id="sb_form_q"]'
            create_button = '//*[@id="create_btn_c"]'
            var promptbox = await driver.wait(until.elementLocated(By.xpath(prompt_box)))
            await wait(500)
            var createbutton = await driver.wait(until.elementLocated(By.xpath(create_button)))
            await wait(500)
            var prompts = settings.prompts;
            var img_1 = '/html/body/div[3]/div/div[5]/div[1]/div[2]/div/div/ul[1]/li[1]/div/div/a/div/img'
            var img_2 = '/html/body/div[3]/div/div[5]/div[1]/div[2]/div/div/ul[1]/li[2]/div/div/a/div/img'
            var img_3 = '/html/body/div[3]/div/div[5]/div[1]/div[2]/div/div/ul[2]/li[1]/div/div/a/div/img'
            var img_4 = '/html/body/div[3]/div/div[5]/div[1]/div[2]/div/div/ul[2]/li[2]/div/div/a/div/img'
               
            for (var i = 0; i < prompts.length; i++)
            {
              try {
                var img1 = null;
                var img2 = null;
                var img3 = null;
                var img4 = null;
                promptbox.sendKeys(prompts[i])
                await wait(1000)
                createbutton.click();
                await wait(60000)
                try {
                  img1 = await driver.wait(until.elementLocated(By.xpath(img_1)), 5000)
                } catch(err) {}
                try {
                  img2 = await driver.wait(until.elementLocated(By.xpath(img_2)), 5000)
                } catch(err) {}
                try {
                  img3 = await driver.wait(until.elementLocated(By.xpath(img_3)), 5000)
                } catch(err) {}
                try {
                  img4 = await driver.wait(until.elementLocated(By.xpath(img_4)), 5000)
                } catch(err) {}
                if (img1) {
                  url1 = await img1.getAttribute('src')
                  await download(url1, path.join(settings.bingpath, sessionid + '_' + i + '_1' + '.jpg'))
                }
                if (img2) {
                  url2 = await img2.getAttribute('src')
                  await download(url2, path.join(settings.bingpath, sessionid + '_' + i + '_2' + '.jpg'))
                }
                if (img3) {
                  url3 = await img3.getAttribute('src')
                  await download(url3, path.join(settings.bingpath, sessionid + '_' + i + '_3' + '.jpg'))
                }
                if (img4) {
                  url4 = await img4.getAttribute('src')
                  await download(url4, path.join(settings.bingpath, sessionid + '_' + i + '_4' + '.jpg'))
                }
                
                // Clean up
                promptbox = await driver.wait(until.elementLocated(By.xpath(prompt_box)))
                createbutton = await driver.wait(until.elementLocated(By.xpath(create_button)))
                promptbox.clear();
                await wait(5000)
              } catch(err) {
                console.log("something errored")
                console.log(err)
              }
            }
            
        });
    });
});