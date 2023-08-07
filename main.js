const { app, BrowserWindow, shell } = require('electron')
const path = require('path')
const electron = require('electron');
const child_process = require('child_process');
const {ipcMain} = require('electron')
const dialog = electron.dialog;
const fs = require('fs');
const axios = require('axios');
const {EOL} = require('os');
const Mocha = require('mocha')

  let win = null
  let settings = null;
  let settingspath = path.join(__dirname, "settings.json")
  let testpath = path.join(__dirname, "testing.js")
  let bingpath = path.join(__dirname, 'testingbing.js')
  let mocha;
  function createWindow()
  {
    var settingsfile = fs.readFileSync(settingspath)
    if (settingsfile)
        settings = JSON.parse(settingsfile)
    else
        console.log("error cannot load settings file")

    win = new BrowserWindow({
        width: 1000,
        height: 600,
        backgroundColor: "#142426",
        autoHideMenuBar: true,
        webPreferences:  {
            nodeIntegration:  false,
            contextIsolation: true,
            enableRemoteModule: true,
            devTools: true,
            preload: path.join(__dirname, 'preload.js')
        }
      })
    win.maximize();
    win.loadFile('index.html')
    .then(() => {
      // Lägg till hantering av filsökvägar så att vi inte laddar filer som saknas
      if (!fs.existsSync(settings.img1source))
      {
        settings.img1source = "";
      }
      if (!fs.existsSync(settings.img2source))
      {
        settings.img2source = "";
      }
      if (!fs.existsSync(settings.img3source))
      {
        settings.img3source = "";
      }
      if (!fs.existsSync(settings.img4source))
      {
        settings.img4source = "";
      }
      if (!fs.existsSync(settings.img5source))
      {
        settings.img5source = "";
      }
      if (!fs.existsSync(settings.descriptions.descpath))
      {
        settings.descriptions.descpath = "";
      }
      if (!fs.existsSync(settings.descriptions.descsavepath))
      {
        settings.descriptions.descsavepath = "";
      }
      for (var i = 0; i < settings.promptgen.files.length; i++)
      {
        if (!fs.existsSync(settings.promptgen.files[i])) {
          settings.promptgen.files[i] = "";
        }
      }
      for (var j = 0; j < settings.promptgen.permutationfiles.length; j++)
      {
        if (!fs.existsSync(settings.promptgen.permutationfiles[j])) {
          settings.promptgen.permutationfiles[j] = "";
        }
      }
      win.webContents.send('load-settings', settings);
    })
    // Handle opening a directory
    ipcMain.handle('dialog:openDirectory', async () => {
      const { canceled, filePaths } = await dialog.showOpenDialog(win, {
        properties: ['openDirectory']
      })
      if (canceled) {
        return
      } else {
        return filePaths[0]
      }
    })
    ipcMain.handle('dialog:openFile', async () => {
      const { canceled, filePaths } = await dialog.showOpenDialog(win, {
        properties: ['openFile']
      })
      if (canceled) {
        return
      } else {
        var file = fs.readFileSync(filePaths[0], 'utf-8')
        settings.prompts = file.split('\r\n');  fs.writeFileSync(settingspath,JSON.stringify(settings));
        return file;
      }
    })
    ipcMain.handle('dialog:selectFile', async () => {
      const { canceled, filePaths } = await dialog.showOpenDialog(win, {
        properties: ['openFile']
      })
      if (canceled) {
        return
      } else {
        settings.promptgen.files.push(filePaths[0]);
        fs.writeFileSync(settingspath,JSON.stringify(settings));
        return filePaths[0];
      }
    })
    ipcMain.handle('dialog:permutefile', async () => {
      const { canceled, filePaths } = await dialog.showOpenDialog(win, {
        properties: ['openFile']
      })
      if (canceled) {
        return
      } else {
        settings.promptgen.permutationfiles.push(filePaths[0]);
        fs.writeFileSync(settingspath,JSON.stringify(settings));
        return filePaths[0];
      }
    })
    return win;
  }

  app.whenReady().then(() => {
      win = createWindow();
  })


  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })

ipcMain.on('help', (event, arg) => {shell.openExternal("https://www.youtube.com/channel/UCaCm9nJTmy-lHSGpBM7L6sg");})
ipcMain.on('set-mode', (event, arg) => { settings.mode = arg; fs.writeFileSync(settingspath,JSON.stringify(settings));  })
ipcMain.on('set-password', (event, arg) => { settings.password = arg; fs.writeFileSync(settingspath,JSON.stringify(settings));})
ipcMain.on('set-username', (event, arg) => {settings.username = arg; fs.writeFileSync(settingspath,JSON.stringify(settings));})
ipcMain.on('set-bing-email', (event, arg) => { settings.bingmail = arg; fs.writeFileSync(settingspath, JSON.stringify(settings))});
ipcMain.on('set-bing-password', (event, arg) => { settings.bingpass = arg; fs.writeFileSync(settingspath, JSON.stringify(settings))});
ipcMain.on('set-bing-download-path', (event,arg) => { settings.bingpath = arg; fs.writeFileSync(settingspath, JSON.stringify(settings))});
ipcMain.on('set-stylize', (event, arg) => { settings.stylize = parseInt(arg); fs.writeFileSync(settingspath,JSON.stringify(settings));})
ipcMain.on('set-chaos', (event, arg) => {settings.chaos = parseInt(arg); fs.writeFileSync(settingspath,JSON.stringify(settings));})
ipcMain.on('set-version', (event, arg) => {settings.version = parseInt(arg); fs.writeFileSync(settingspath,JSON.stringify(settings));})
ipcMain.on('set-blendnum', (event, arg) => { settings.blendnum = parseInt(arg); fs.writeFileSync(settingspath,JSON.stringify(settings));})
ipcMain.on('set-img1source', (event, arg) => { settings.img1source = arg; fs.writeFileSync(settingspath,JSON.stringify(settings));})
ipcMain.on('set-img2source', (event, arg) => { settings.img2source = arg; fs.writeFileSync(settingspath,JSON.stringify(settings));})
ipcMain.on('set-img3source', (event, arg) => { settings.img3source = arg; fs.writeFileSync(settingspath,JSON.stringify(settings));})
ipcMain.on('set-img4source', (event, arg) => { settings.img4source = arg; fs.writeFileSync(settingspath,JSON.stringify(settings));})
ipcMain.on('set-img5source', (event, arg) => { settings.img5source = arg; fs.writeFileSync(settingspath,JSON.stringify(settings));})
ipcMain.on('set-descfolder', (event, arg) => { settings.descriptions.descpath = arg; fs.writeFileSync(settingspath,JSON.stringify(settings));})
ipcMain.on('set-descsavefolder', (event, arg) => { settings.descriptions.descsavepath = arg; fs.writeFileSync(settingspath,JSON.stringify(settings));})
ipcMain.on('set-loops', (event, arg) => { settings.loops = parseInt(arg); fs.writeFileSync(settingspath,JSON.stringify(settings));})
ipcMain.on('set-discordchaturl', (event, arg) => { settings.discordchaturl = arg; fs.writeFileSync(settingspath,JSON.stringify(settings));})
ipcMain.on('set-interval', (event, arg) => {settings.interval = parseInt(arg); fs.writeFileSync(settingspath,JSON.stringify(settings));})
ipcMain.on('set-blendaspect', (event, arg) => { settings.blendaspect = arg; fs.writeFileSync(settingspath,JSON.stringify(settings));})
ipcMain.on('set-aspect', (event, arg) => { settings.aspect = arg; fs.writeFileSync(settingspath,JSON.stringify(settings));})
ipcMain.on('set-override', (event, arg) => { settings.override = arg; fs.writeFileSync(settingspath,JSON.stringify(settings));})
ipcMain.on('set-promptcount', (event, arg) => {settings.promptgen.prompts = arg; fs.writeFileSync(settingspath,JSON.stringify(settings));})
ipcMain.on('set-imageweight', (event, arg) => { settings.imageweight = arg; fs.writeFileSync(settingspath,JSON.stringify(settings));})
ipcMain.on('set-desckeywords', (event, arg) => { settings.descriptions.savekeywords = arg; fs.writeFileSync(settingspath,JSON.stringify(settings));})
ipcMain.on('set-descprompts', (event, arg) => { settings.descriptions.saveprompts = arg; fs.writeFileSync(settingspath,JSON.stringify(settings));})
ipcMain.on('set-descartists', (event, arg) => { settings.descriptions.saveartists = arg; fs.writeFileSync(settingspath,JSON.stringify(settings));})
ipcMain.on('set-descphrases', (event, arg) => { settings.descriptions.savephrases = arg; fs.writeFileSync(settingspath,JSON.stringify(settings));})
ipcMain.on('set-descweights', (event, arg) => { settings.descriptions.saveweights = arg; fs.writeFileSync(settingspath,JSON.stringify(settings));})
ipcMain.on('set-describeinterval', (event, arg) => { settings.descriptions.interval = arg; fs.writeFileSync(settingspath,JSON.stringify(settings));})
ipcMain.on('save-permutation', (event, arg) => { settings.promptgen.savePermutation = arg; fs.writeFileSync(settingspath,JSON.stringify(settings));})
ipcMain.on('save-generation', (event, arg) => { settings.promptgen.saveGeneration = arg; fs.writeFileSync(settingspath,JSON.stringify(settings));})
ipcMain.on('start-bot', (event, arg) => {
  // if (mocha !== undefined)
  // {
  //   mocha.unloadFiles(); 
  //   mocha.dispose();
  // }

  mocha = new Mocha({});
  mocha.addFile(testpath);
  mocha.timeout(0);
  mocha.run().on('test', () => {}).on('test end', () => {}).on('end', () => { mocha.unloadFiles(); mocha.dispose();}).on('fail', () => {mocha.unloadFiles(); mocha.dispose();})
})
ipcMain.on('start-bing', (event, arg) => {
  // Find out why we need to click twice
   mocha = new Mocha({});
   mocha.addFile(bingpath);
   mocha.timeout(0);
   mocha.run().on('test', () => {}).on('test end', () => {}).on('end', () => { mocha.unloadFiles(); mocha.dispose();}).on('fail', () => {mocha.unloadFiles(); mocha.dispose();})
 })
ipcMain.on('login', (event, arg) => {
     win.webContents.send('loggedin', true);
 })
 ipcMain.on('remove-listfile', (event, arg) => {
  settings.promptgen.files.splice(arg,1)
  fs.writeFileSync(settingspath,JSON.stringify(settings));
 })
 ipcMain.on('remove-permutationfile', (event, arg) => {
  settings.promptgen.permutationfiles.splice(arg,1)
  fs.writeFileSync(settingspath,JSON.stringify(settings));
 })
 ipcMain.on('generate', async (event, arg) => {
  let arr = []
  for(var j = 0; j < settings.promptgen.prompts; j++)
  {
    let content = "";
    let name = "";
    for (var i = 0; i < arg.length; i++)
    {
      if (arg[i] === '[')
      {
        name = arg.substring(i+1, arg.length-1).split(']')[0]
        i = i + name.length+1;
        var filename = "" 
        for (var f of settings.promptgen.files)
        {
          var split = f.split('\\');
          var fname = split[split.length-1];
          filename = fname.substring(0, fname.lastIndexOf('.'))
          if (filename === name)
          {
            var file = fs.readFileSync(f, 'utf-8');
            var splitfile = file.split(/\r?\n/)
            var newname = splitfile[Math.floor(Math.random() * (splitfile.length - 0) + 0)];
            content += newname;
          }
        }
      }
      else if (arg[i] === '{')
      {
        var list = arg.substring(i+1, arg.length-1).split('}')[0]
        i = i + list.length+1;
        var lines = list.split(',')
        var newname = lines[Math.floor(Math.random() * (lines.length - 0) + 0)];
        content += newname;
      }
      else
        content += arg[i]
    }
    if (content.length > 3) {
      arr.push(content)
    }
  }

  try {
    const { canceled, filePath } = await dialog.showSaveDialog(win, {properties: ['createDirectory']})
      if (canceled) {
        return
      } else {
          var file = fs.createWriteStream(filePath);
          file.on('error', function(err) { console.log("Error writing file: " +err)});
          arr.forEach(function(e,i,a) { 
            if(i < a.length-1) 
              file.write(e + EOL);
            else
              file.write(e);
            });
          file.end(); 
        return
      }
  }
  catch (err)
  {
    console.log("Error: " + err)
  }
 })

 ipcMain.on('permutate', async (event, arg) => {
  // Först ska vi hämta alla keywords och lägga dem i en lista av listor, samtidigt som vi byter ut de listorna mot ett nytt keyword
  // Efter det ska vi gå igenom alla permutation och sätta ihop en ny prompt i tur och ordning
  // Kasta ett error ifall det är mer än säg 10,000 prompter
  let idNumber = 0
  let content = "";
  let name = "";
  let userlists = [] // arrayen ska innehålla en array of [keyword], [array] objekt där arrayen innehåller alla värden och keyword används för att byta ut på rätt plats i stringen
  for (var i = 0; i < arg.length; i++)
  {
    if (arg[i] === '{')
    {
      var list = arg.substring(i+1, arg.length-1).split('}')[0]
      i = i + list.length+1;
      var lines = list.split(',')
      userlists.push(lines)
      content += "$" + idNumber
      idNumber += 1
    }
    else if (arg[i] === '[')
    {
      name = arg.substring(i+1, arg.length-1).split(']')[0]
      i = i + name.length+1;
      var filename = "" 
      for (var f of settings.promptgen.permutationfiles)
      {
        var split = f.split('\\');
        var fname = split[split.length-1];
        filename = fname.substring(0, fname.lastIndexOf('.'))
        if (filename === name)
        {
          var file = fs.readFileSync(f, 'utf-8');
          var splitfile = file.split(/\r?\n/)
          userlists.push(splitfile)
          content += "$" + idNumber
          idNumber += 1
          break;
        }
      }
    }
    else
      content += arg[i]
  }

  if (userlists === undefined || userlists.length == 0)
  {
    // we don't use any permutations, fail?
    return;
  }
  let count = userlists.reduce((a,b) => a * b.length, 1);
  if (count >= 1000)
  {
    // Kolla här ifall vi får över 1,000 permutationer och kasta ett error i så fall
    return;
  }
  
  let arr = BuildPermutations([content], 0, userlists.length, userlists);
  // content är här vår baseline
  // sedan behöver vi gå igenom alla permutationer som sagt
  arr = arr.filter(x => x.length > 3)

  try {
    const { canceled, filePath } = await dialog.showSaveDialog(win, {properties: ['createDirectory']})
      if (canceled) {
        return
      } else {
          var file = fs.createWriteStream(filePath);
          file.on('error', function(err) { console.log("Error writing file: " +err)});
          arr.forEach(function(e,i,a) { 
            if(i < a.length-1) 
              file.write(e + EOL);
            else
              file.write(e);
            });
          file.end(); 
        return
      }
  }
  catch (err)
  {
    console.log("Error: " + err)
  }
 })

 const BuildPermutations = (agg, current, stop, userlists) => {
  let list = []
  const replacestring = "$" + current;

  if (current === 0)
  {
    for (var j = 0; j < userlists[current].length; j++)
    {
      list.push(agg[0].replace(replacestring, userlists[current][j].trim()))
    }
    return BuildPermutations(list, current+1, stop, userlists);
  }
  else if(current < stop)
  {
    for(var i = 0; i < agg.length; i++)
    {
      for (var j = 0; j < userlists[current].length; j++)
      {
        list.push(agg[i].replace(replacestring, userlists[current][j].trim()))
      }
    }
    return BuildPermutations(list, current+1, stop, userlists);
  }
  else {
    return agg;
  }
 }
