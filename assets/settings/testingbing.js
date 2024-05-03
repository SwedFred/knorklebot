/* eslint-disable prettier/prettier */
process.env.SELENIUM_BROWSER_EXECUTABLES = 'false';

const {Builder, By, Key, until} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const {suite, Environment} = require('selenium-webdriver/testing')
const fs = require('fs');
const path = require('path')
var driverpath = require('chromedriver').path;

const RESOURCES_PATH = path.join(__dirname, '../../assets/settings');
let settingspath = path.join(RESOURCES_PATH, "settings.json")
let driver;
let settingsfile = fs.readFileSync(settingspath)
let settings = JSON.parse(settingsfile)

const wait = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

const between = (min, max) => {  
    return Math.floor(
      Math.random() * (max - min) + min
    )
}

const isBrowserClosed = async () => {
  var isClosed = false;
  try {
      var res = await driver.getTitle();
  } catch(err) {
    console.log(err.code)
      isClosed = true;
  }

  return isClosed;
}

const sessionid = new Date(Date.now()).toISOString().split('T')[0] + '_' + between(10000,100000).toString()

const download = async (url, filePath) => {
  try {
    let response = null
    var index = url.indexOf('?')
    if (index > -1) {
       response = await fetch(url.substring(0, index))
    } else { response = await fetch(url)}
    const blob = await response.blob();
    const arraybuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arraybuffer);
    await fs.writeFile(filePath, buffer, (err) => err && console.log(err));
  } catch (err) {
    console.log(err)
  }
}

const findAndDownload = async (results,resultType,i) => {
  try {
    if (resultType.e && resultType.code > 0) {
      let imagepaths = await visitLeafNodes(resultType.e)
      for (var n = 0; n < imagepaths.length; n++) {
        var dlpath = path.join(settings.bing.savepath, sessionid + '_' + i + '_' + n + '.jpg')
        await download(imagepaths[n], dlpath)
        results.results[results.results.length-1].images.push(dlpath)
      }
    } else { console.log("no images")}
  } catch(err) { console.log(err)}
}

const getResultType = async () => {
  try {
    // Alternativt letar vi efter //*[@id="gir_async"] och hämtar alla children efteråt
    var element = await driver.wait(until.elementLocated(By.xpath('//*[@id="mmComponent_images_as_1"]')),2000)
    return {e: element,code: 2}
  } catch(err2) { console.log(err2)}

  try {
    // Alternativt letar vi efter //*[@id="gir_async"] och hämtar alla children efteråt
    var element = await driver.wait(until.elementLocated(By.xpath('//*[@id="mmComponent_images_1"]')),2000)
    return {e: element,code: 2}
  } catch(err2) { console.log(err2)}
  
  try {
    var element = await driver.wait(until.elementLocated(By.xpath('/html/body/div[3]/div/div[5]/div[1]/div/div/a/img')),2000)
    return {e: element,code: 1}      
  } catch(err3) {
    console.log(err3)
  }

  try {
    var element = await driver.wait(until.elementLocated(By.xpath('//*[@id="girer"]')),2000)
    let childElements = await element.findElements(By.xpath('./*'));
    if (childElements.length > 0) {
      const tagName = await childElements[0].getTagName();
      if (tagName.toLowerCase() === 'img') {
        console.log("FOund error image")
        return {e: null, code: -1}
      } else {
        console.log("no eror image found")
        return {e: null,code: -100}
      }
    }
    console.log("base case error found")
    return {e: null,code: -100} // safeguard
  } catch(err) { console.log(err) }

  console.log("Something failed")
  return {e: null,code: -100}
}

const isTimeout = async () => {
  try {
    var timeout = await driver.wait(until.elementLocated(By.xpath('//*[@id="gilen_c"]')),1000)
    if (timeout) {
      let timeoutdisplay = await timeout.getCssValue('display');
      if (timeoutdisplay !== 'none') {
        return true
      } else {
        return false
      }
    }
    else {
      return false
    }
  }catch(err) {return false}
}

const displayValueChanged = async (element, previousDisplayValue) => {
  try {
    let currentDisplayValue = await element.getCssValue('display');
    if (currentDisplayValue !== previousDisplayValue) {
      return true;
    }
    else {
      var timeout = await isTimeout()
      if (timeout) {
          return false
      }
      await wait(5000)
      return await displayValueChanged(element, previousDisplayValue)
    }
  } catch(err) { console.log(err); return true;}
};

const waitWhileLoading = async () => {
  try {
    var element = await driver.wait(until.elementLocated(By.xpath('//*[@id="giloader"]')),5000)
    //let initialDisplayValue = 'flex' 
    let initialDisplayValue = await element.getCssValue('display');
    let result = await driver.wait(displayValueChanged(element, initialDisplayValue),90000)
    return result
  } catch(err) {console.log("LOADER FAIL!"); console.log(err); return true}
}

const createOrLoadResults = async (promptLength) => {
  try {
    let results = null
    if (fs.existsSync(settings.bing.savepath + path.basename(settings.bing.promptpath) + '.result'))
    {
      results = JSON.parse(fs.readFileSync(settings.bing.savepath + path.basename(settings.bing.promptpath) + '.result'))
    } else {
      results = {
        prompts: promptLength,
        currentPrompt: 0,
        maxPrompts: promptLength,
        results: []
      };
    }
    return results
  } catch(err) {console.log(err)}
}

const visitLeafNodes = async (element, imagepaths = []) => {
  try {
    // Find all child elements of the current element
    let childElements = await element.findElements(By.xpath('./*'));
    // If the current element has no child elements, it's a leaf node
    if (childElements.length === 0) {
        const tagName = await element.getTagName();
        if (tagName.toLowerCase() === 'img') {
          let source = await element.getAttribute("src")
          imagepaths.push(source)
        }
        return imagepaths
    } else {
        let results = []
        // If the current element has child elements, recursively visit each child
        for (let child of childElements) {
            var resultPromise = visitLeafNodes(child, [...imagepaths]);
            results.push(resultPromise)
        }

          // Wait for all the recursive calls to complete and collect their results
          let childImagePathsArrays = await Promise.all(results);
          // Concatenate the arrays of image paths
          for (let childImagePathsArray of childImagePathsArrays) {
              imagepaths = imagepaths.concat(childImagePathsArray);
          }
          return imagepaths; // Return the concatenated array of image paths
    }
  } catch (err) {console.log("visit leaf nodes failed with: " + err)}
}

const UpdateResults = (results, resultType) => {
  results.currentPrompt += 1;
  results.results[results.results.length-1].status = resultType.code;
  fs.writeFileSync(settings.bing.savepath + path.basename(settings.bing.promptpath) + '.result',JSON.stringify(results))
}
 
    before(async function () {
      try {
        const chromePath = path.join('C:\\chrome\\chrome.exe');
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
      try{
        it('First Selenium script', async function () {
          try {
            await driver.get('https://www.bing.com/images/create');
    
            const cookieaccept = '//*[@id="bnp_btn_accept"]'
            const clicktobegin = '//*[@id="create_btn_c"]'
            const signin = '//*[@id="bic_signin"]'
            const signin2 = '//*[@id="bic_signin"]/div[2]/a[1]'
            const e_mail = '/html/body/div/form[1]/div/div/div[2]/div[1]/div/div/div/div/div[1]/div[3]/div/div/div/div[3]/div[2]/div/input[1]'
            const e_mail2 = '//*[@id="i0116"]'
            const pass_word = '/html/body/div/form[1]/div/div/div[2]/div[1]/div/div/div/div/div/div[3]/div/div[2]/div/div[3]/div/div[2]/input'
            const pass_word2 = '//*[@id="i0118"]'
            const savepass = '/html/body/div/form/div/div/div[2]/div[1]/div/div/div/div/div/div[3]/div/div[2]/div/div[3]/div[2]/div/div/div[2]/input'
            const savepass2 = '//*[@id="acceptButton"]'
            var email = settings.bing.email
            var password = settings.bing.password
            var cookie = await driver.wait(until.elementLocated(By.xpath(cookieaccept)), 5000)
            if (cookie)
              cookie.click();
            var begin = await driver.wait(until.elementLocated(By.xpath(clicktobegin)), 5000)
            begin.click();
            await wait(2000)
            var signinbutton = await driver.wait(until.elementLocated(By.xpath(signin)),2000)
            if (signinbutton)
            {
              var signinbutton2 = await driver.wait(until.elementLocated(By.xpath(signin2)),2000)
              if (signinbutton2)
                signinbutton2.click();
              else
                signinbutton.click();
              await wait(500);
            }
            await wait(2000);
            var em = await driver.wait(until.elementLocated(By.xpath(e_mail2)), 2000)
            em.sendKeys(email)
            await wait(500)
            em.sendKeys(Key.ENTER)
            await wait(2000)
            var pss = await driver.wait(until.elementLocated(By.xpath(pass_word2)))
            pss.sendKeys(password)
            await wait(500)
            pss.sendKeys(Key.ENTER)
            await wait(2000)
            var btn = await driver.wait(until.elementLocated(By.xpath(savepass2)), 5000)
            btn.click();
            await wait(5000)
            const prompt_box = '//*[@id="sb_form_q"]'
            const create_button = '//*[@id="create_btn_c"]'
            var promptfile = fs.readFileSync(settings.bing.promptpath,'utf-8')
            var prompts = promptfile.split(/\r?\n/)
            var i = 0;
            var results = await createOrLoadResults(prompts.length);
            i = results.currentPrompt
            let hasRefreshed = false
            mainloop: for (i; i < prompts.length;)
            {
              console.log("i : " + i)
              var isClosed = await isBrowserClosed() // KOLLA OM VI STÄNGT BROWSERN
              if (isClosed) {
                console.log("THE BROWSER IS CLOSED")
                break
              }
              var resultType = {e: null,code: -100}

              // KOLLA IFALL VI KOMMIT HIT FRÅN EN REFRESH
              console.log("has refreshed: " + hasRefreshed)
              if (hasRefreshed) {
                console.log("came here from refreshing")
                await wait(1000)
                var timeout = await isTimeout();
                if (timeout) {
                  await wait(between(10000,15000))
                  driver.navigate().refresh();
                  continue mainloop
                } else {
                  resultType = await getResultType()
                  await findAndDownload(results, resultType,i)
                  UpdateResults(results, resultType);
                  // Clean up
                  promptbox = await driver.wait(until.elementLocated(By.xpath(prompt_box)))
                  createbutton = await driver.wait(until.elementLocated(By.xpath(create_button)))
                  promptbox.clear();
                  console.log("Resetting refreshed")
                  hasRefreshed = false
                  i += 1
                  await wait(between(30000,60000))
                  continue mainloop
                }
              } else {
                var promptbox = await driver.wait(until.elementLocated(By.xpath(prompt_box)), 10000)
                await wait(500)
                var createbutton = await driver.wait(until.elementLocated(By.xpath(create_button)), 10000)
                await wait(500)
                try {
                  results.results.push({prompt: prompts[i], images: [], status: -1, rating: 0, index: i})
                  promptbox.sendKeys(prompts[i])
                  await wait(1000)
                  createbutton.click();
                  await wait(1000)

                  // Check for forbidden image
                  try {
                    var errornode = await driver.wait(until.elementLocated(By.xpath('//*[@id="girer"]')),2000)
                    if (errornode) {
                      UpdateResults(results, resultType);
                      // Clean up
                      promptbox = await driver.wait(until.elementLocated(By.xpath(prompt_box)))
                      createbutton = await driver.wait(until.elementLocated(By.xpath(create_button)))
                      promptbox.clear();
                      i += 1
                      await wait(between(30000,60000))
                      continue mainloop
                    }                    
                  } catch(err) {console.log(err)}
                  
                  var loadres = await waitWhileLoading()  // wait while loading element is visible
                  if (loadres === false) {                         // negative results means bing has hit a soft timeout
                    console.log("load result: " + loadres)
                    hasRefreshed = true
                    driver.navigate().refresh();
                    continue mainloop
                  }

                  resultType = await getResultType()
                  await findAndDownload(results, resultType,i)
                  UpdateResults(results, resultType);
                  // Clean up
                  promptbox = await driver.wait(until.elementLocated(By.xpath(prompt_box)))
                  createbutton = await driver.wait(until.elementLocated(By.xpath(create_button)))
                  promptbox.clear();
                  i += 1
                  await wait(between(30000,60000))
                } catch(err) {
                  console.log("something errored")
                  console.log(err)
                  i += 1
                }
              }
              
              
            }
          } catch(ex) {console.log(ex)}
        });
    
      } catch(ex){
        console.log(ex)
      }
      });

    after(async function () {
      // Cleanup tasks
      if (driver) {
          await driver.quit();
      }
  });
