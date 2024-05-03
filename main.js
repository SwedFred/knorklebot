/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
const path = require('path')
const { app, BrowserWindow, shell, ipcMain, dialog } = require('electron')
const fs = require('fs')
const { EOL } = require('os')
const Mocha = require('mocha')

const electron = require('electron');
const child_process = require('child_process');

const RESOURCES_PATH = app.isPackaged
? path.join(process.resourcesPath, 'assets')
: path.join(__dirname, '/assets');
let settings = null;
let settingspath = path.join(RESOURCES_PATH, '/settings/settings.json')
let midjourneypath = path.join(RESOURCES_PATH, '/scripts/testing.js')
let bingpath = path.join(RESOURCES_PATH, '/scripts/testingbing.js')
let mocha = null;
let currentAnalysisFile = null

let mainWindow = null;



function resolveHtmlPath(htmlFileName) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 4343;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, htmlFileName)}`;
}

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  const settingsfile = fs.readFileSync(settingspath);
  if (settingsfile) 
    settings = JSON.parse(settingsfile)
  else 
    console.log("error cannot load settings file")
  
  if (isDebug) {
    await installExtensions();
  }

  const getAssetPath = (...paths) => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1000,
    height: 600,
    backgroundColor: '#fff',
    autoHideMenuBar: true,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true,
      webSecurity: false,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'))
  // Här efter load kanske vi behöver en ".then" som hanterar olika settings

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Open urls in the user's browser
  // mainWindow.webContents.setWindowOpenHandler((edata) => {
  //   shell.openExternal(edata.url);
  //   return { action: 'deny' };
  // });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  // new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });

    ipcMain.handle('dialog:openDirectory', async () => {
      const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory']
      });
      if (canceled) {
        return;
      } else {
        return filePaths[0]
      }
    });

    ipcMain.on('analysis-changedir', async () => {
      const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory']
      });
      if (canceled) {
        return false
      } else {
        var newpath = filePaths[0]
        var file = fs.readFileSync(currentAnalysisFile, 'utf-8')
        var jason = JSON.parse(file)
        if (jason.currentPrompt > 0) {
          for (var i = 0; i < jason.results.length; i++) {
            for (var j = 0; j < jason.results[i].images.length; j++) {
              var toReplace = path.dirname(jason.results[i].images[j])
              jason.results[i].images[j] = jason.results[i].images[j].replace(toReplace, newpath)
            }
          }
          fs.writeFileSync(currentAnalysisFile,JSON.stringify(jason))
          mainWindow?.webContents.send('analysisbody-loaded', jason) 
          mainWindow?.webContents.send('analysis-update', jason)
        }

      }
    });

    ipcMain.handle('dialog:openFile', async () => {
      const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
        properties: ['openFile']
      });
      if (canceled) {
        return;
      } else {
        var file = fs.readFileSync(filePaths[0], 'utf-8')
        return file;
      }
    });

    // Analysis
    ipcMain.on('analysis-load-file', async () => {
      console.log("LOADING ANALYSIS")
      const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
        title: 'Open results file',
        properties: ['openFile'],
        filters: [{name:"Result files", extensions: ["result"]}]
      });
      if (canceled) {
        console.log(canceled + " FAIL")
        return "";
      } else {
        currentAnalysisFile = filePaths[0]
        var file = fs.readFileSync(filePaths[0], 'utf-8')
        var name = path.basename(filePaths[0], path.extname(filePaths[0]))
        mainWindow?.webContents.send('analysisheader-loaded', name)
        var result = JSON.parse(file);
        mainWindow?.webContents.send('analysisbody-loaded', result)
        mainWindow?.webContents.send('analysis-update', result)
      }
    })
  })
  .catch(console.log);

  ipcMain.handle('promptgen-load', async () => {
    return GetPromptGenData()
  })

// Analysis
// Command Bar
ipcMain.on('analysis-sorted', (event,arg) => {
  mainWindow.webContents.send('analysis-sort-update', arg)
})
ipcMain.on('analysis-filtered', (event,arg) => {
  mainWindow.webContents.send('analysis-filter-update', arg)
})
ipcMain.on('update-rating', (event,arg) => {
  fs.writeFileSync(currentAnalysisFile,JSON.stringify(arg));
})
ipcMain.on('analysis-updated', (event,arg) => {
  mainWindow.webContents.send('analysis-update', arg)
})

// IPCMain.on calls
// Header
ipcMain.on('update-page', (event,arg) => {mainWindow.webContents.send('page-update', arg); settings.selectedmode = arg; fs.writeFileSync(settingspath,JSON.stringify(settings));})
ipcMain.on('help', (event, arg) => {shell.openExternal("https://www.youtube.com/channel/UCaCm9nJTmy-lHSGpBM7L6sg");})

// Prompt gen
ipcMain.on('promptgen-cache-prompt', (event, arg) => { settings.promptgen.saveprompt = arg; fs.writeFileSync(settingspath,JSON.stringify(settings));  })
ipcMain.on('promptgen-gen-amount', (event,arg) => {settings.promptgen.generation.count = arg; fs.writeFileSync(settingspath,JSON.stringify(settings));})
ipcMain.on('filelistitem-perm-remove', (event,arg) => {
  settings.promptgen.generation.files.splice(settings.promptgen.generation.files.indexOf(arg), 1); 
  fs.writeFileSync(settingspath,JSON.stringify(settings));
  mainWindow?.webContents.send('promptgen-permlist-load', settings.promptgen.generation.files);
});
ipcMain.on('filelistitem-gen-remove', (event,arg) => {
  settings.promptgen.generation.files.splice(settings.promptgen.generation.files.indexOf(arg), 1); 
  fs.writeFileSync(settingspath,JSON.stringify(settings));
  mainWindow?.webContents.send('promptgen-filelist-load', settings.promptgen.generation.files);
});

ipcMain.handle('promptgen-gen-addfile', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    title: 'Add keywords file',
    properties: ['openFile'],
    filters: [{name:"keyword-files", extensions: ["keywords"]}, {name:"text-files", extensions: ["txt"]},{name:"All files", extensions: ["*"]}]
  });
  if (canceled) {
    return;
  } else {
    settings.promptgen.generation.files.push(filePaths[0]);
    fs.writeFileSync(settingspath,JSON.stringify(settings)); 
    return settings.promptgen.generation.files;
  }
});

ipcMain.handle('promptgen-perm-addfile', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    title: 'Add keywords file',
    properties: ['openFile'],
    filters: [{name:"keyword-files", extensions: ["keywords"]}, {name:"text-files", extensions: ["txt"]},{name:"All files", extensions: ["*"]}]
  });
  if (canceled) {
    return;
  } else {
    settings.promptgen.permutations.files.push(filePaths[0]);
    fs.writeFileSync(settingspath,JSON.stringify(settings)); 
    return settings.promptgen.permutations.files;
  }
});

ipcMain.handle('promptgen-gen-open-prompt', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    title: 'Open prompts file',
    properties: ['openFile'],
    filters: [{name:"Generation files", extensions: ["gen"]}, {name:"text-files", extensions: ["txt"]},{name:"All files", extensions: ["*"]}]
  });
  if (canceled) {
    return "";
  } else {
    var file = fs.readFileSync(filePaths[0], 'utf-8')
    return file;
  }
});

ipcMain.handle('promptgen-perm-open-prompt', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    title: 'Open prompts file',
    properties: ['openFile'],
    filters: [{name:"Generation files", extensions: ["gen"]}, {name:"text-files", extensions: ["txt"]},{name:"All files", extensions: ["*"]}]
  });
  if (canceled) {
    console.log(canceled + " FAIL")
    return "";
  } else {
    var file = fs.readFileSync(filePaths[0], 'utf-8')
    return file;
  }
});

// General app start 
ipcMain.on('login', (event, arg) => {  
  console.log("Logged in")
  switch(settings.selectedmode) {
    case 1:
      mainWindow.webContents.send('promptgen-loaded', GetPromptGenData());
      break
    case 2:
      mainWindow.webContents.send('midjourney-loaded', GetMidjourneyData());
      break;
    case 3:
      mainWindow.webContents.send('bing-loaded', GetBingData());
    case 4: 
      break;
  }    
 });

// Bing
ipcMain.handle('bing-loaded', async () => {
  return GetBingData()
})
ipcMain.on('bing-email-update', (event, arg) => { settings.bing.email = arg; fs.writeFileSync(settingspath,JSON.stringify(settings));})
ipcMain.on('bing-pass-update', (event, arg) => { settings.bing.password = arg; fs.writeFileSync(settingspath,JSON.stringify(settings));})
ipcMain.on('bing-waittime-set', (event,arg) => {settings.bing.waittime = arg; fs.writeFileSync(settingspath,JSON.stringify(settings))})
ipcMain.handle('bing-prompt-set', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    title: 'Open prompts file',
    properties: ['openFile'],
    filters: [{name:"Prompt files", extensions: ["prompts"]}, {name: "All files", extensions: ["*"]}]
  });
  if (canceled) {
    console.log(canceled + " FAIL")
    return "";
  } else {
    settings.bing.promptpath = filePaths[0]; 
    fs.writeFileSync(settingspath,JSON.stringify(settings));
    var file = fs.readFileSync(filePaths[0], 'utf-8')
    return file;
  }
});
ipcMain.handle('bing-path-set', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    title: 'Select save directory',
    properties: ['openDirectory']
  });
  if (canceled) {
    return "";
  } else {
     settings.bing.savepath = filePaths[0]; 
     fs.writeFileSync(settingspath,JSON.stringify(settings));
    return filePaths[0];
  }
});

// MidJourney - Add path checks when loading
ipcMain.handle('midjourney-loaded', async () => {
  return GetMidjourneyData()
})

ipcMain.on('mj-set-tab', (event, arg) => { settings.midjourney.selectedtab = arg; fs.writeFileSync(settingspath,JSON.stringify(settings));})
ipcMain.on('mj-url-update', (event, arg) => { settings.midjourney.discordchaturl = arg; fs.writeFileSync(settingspath,JSON.stringify(settings));})
ipcMain.on('mj-email-update', (event, arg) => { settings.midjourney.email = arg; fs.writeFileSync(settingspath,JSON.stringify(settings));})
ipcMain.on('mj-pass-update', (event, arg) => { settings.midjourney.password = arg; fs.writeFileSync(settingspath,JSON.stringify(settings));})
ipcMain.on('mj-waittime-set', (event,arg) => {settings.midjourney.waittime = arg; fs.writeFileSync(settingspath,JSON.stringify(settings))})

ipcMain.handle('mj-prompt-set', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    title: 'Open prompts file',
    properties: ['openFile'],
    filters: [{name:"Prompt files", extensions: ["prompts"]}, {name: "All files", extensions: ["*"]}]
  });
  if (canceled) {
    console.log(canceled + " FAIL")
    return "";
  } else {
    settings.midjourney.promptpath = filePaths[0]; 
    fs.writeFileSync(settingspath,JSON.stringify(settings));
    var file = fs.readFileSync(filePaths[0], 'utf-8')
    return file;
  }
});

ipcMain.handle('mj-path-set', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    title: 'Select save directory',
    properties: ['openDirectory']
  });
  if (canceled) {
    return "";
  } else {
     settings.midjourney.savepath = filePaths[0]; 
     fs.writeFileSync(settingspath,JSON.stringify(settings));
    return filePaths[0];
  }
});

ipcMain.handle('mj-blend-savepath-set', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    title: 'Select save directory',
    properties: ['openDirectory']
  });
  if (canceled) {
    return "";
  } else {
     settings.midjourney.blends.savepath = filePaths[0]; 
     fs.writeFileSync(settingspath,JSON.stringify(settings));
    return filePaths[0];
  }
});

ipcMain.handle('mj-blend-img-set', async (event,val) => {
  console.log(val)
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    title: 'Select image folder',
    properties: ['openDirectory']
  });
  if (canceled) {
    console.log(canceled + " FAIL")
    return "";
  } else {
    if (val === 1)
      settings.midjourney.blends.img1source = filePaths[0]; 
    else if (val === 2)
      settings.midjourney.blends.img2source = filePaths[0]; 
    else if (val === 3)
      settings.midjourney.blends.img3source = filePaths[0]; 
    else if (val === 4)
      settings.midjourney.blends.img4source = filePaths[0]; 
    else if (val === 5)
      settings.midjourney.blends.img5source = filePaths[0]; 
    fs.writeFileSync(settingspath,JSON.stringify(settings));
    return filePaths[0];
  }
});

ipcMain.handle('mj-describe-sourcepath-set', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    title: 'Select source directory',
    properties: ['openDirectory']
  });
  if (canceled) {
    return "";
  } else {
     settings.midjourney.descriptions.sourcepath = filePaths[0]; 
     fs.writeFileSync(settingspath,JSON.stringify(settings));
    return filePaths[0];
  }
});

ipcMain.handle('mj-describe-savepath-set', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    title: 'Select save directory',
    properties: ['openDirectory']
  });
  if (canceled) {
    return "";
  } else {
     settings.midjourney.descriptions.savepath = filePaths[0]; 
     fs.writeFileSync(settingspath,JSON.stringify(settings));
    return filePaths[0];
  }
});

ipcMain.on('mj-describe-interval-set', (event,arg) => {settings.midjourney.descriptions.interval = arg; fs.writeFileSync(settingspath,JSON.stringify(settings))})
ipcMain.on('mj-saveprompts-set', (event,arg) => {settings.midjourney.descriptions.saveprompts = arg; fs.writeFileSync(settingspath,JSON.stringify(settings))})
ipcMain.on('mj-savekeywords-set', (event,arg) => {settings.midjourney.descriptions.savekeywords = arg; fs.writeFileSync(settingspath,JSON.stringify(settings))})
ipcMain.on('mj-savephrases-set', (event,arg) => {settings.midjourney.descriptions.savephrases = arg; fs.writeFileSync(settingspath,JSON.stringify(settings))})
ipcMain.on('mj-saveartists-set', (event,arg) => {settings.midjourney.descriptions.saveartists = arg; fs.writeFileSync(settingspath,JSON.stringify(settings))})
ipcMain.on('mj-saveweights-set', (event,arg) => {settings.midjourney.descriptions.saveweights = arg; fs.writeFileSync(settingspath,JSON.stringify(settings))})


// End

ipcMain.on('midjourney-start', (event, arg) => {
  console.log("We just started midjourney in Main")
  settings.midjourney.mode = arg; fs.writeFileSync(settingspath,JSON.stringify(settings))
  process.env.SELENIUM_BROWSER_EXECUTABLES = 'false';
  try {
     mocha = new Mocha({});
     mocha.addFile(midjourneypath);
     mocha.timeout(0);
     mocha.run().on('test', () => {console.log("test")}).on('test end', () => {console.log("test complete")}).on('end', () => {console.log("ended"); mocha.unloadFiles(); mocha.dispose();}).on('fail', () => {console.log("FAILED");mocha.unloadFiles(); mocha.dispose();})
  } catch(ex) {console.log(ex)}
});

ipcMain.on('bing-start', (event, arg) => {
  // Find out why we need to click twice
  console.log("We just started bing in Main")
  process.env.SELENIUM_BROWSER_EXECUTABLES = 'false';
  try {
     mocha = new Mocha({});
     mocha.addFile(bingpath);
     mocha.timeout(0);
     mocha.run().on('test', () => {console.log("test")}).on('test end', () => {console.log("test complete")}).on('end', () => {console.log("ended"); mocha.unloadFiles(); mocha.dispose();}).on('fail', () => {console.log("FAILED");mocha.unloadFiles(); mocha.dispose();})
  } catch(ex) {console.log(ex)}
});

 ipcMain.on('remove-listfile', (event, arg) => {
  settings.promptgen.generation.files.splice(arg,1)
  fs.writeFileSync(settingspath,JSON.stringify(settings));
  mainWindow?.webContents.send('promptgen-filelist-load', settings.promptgen.generation.files)
 });

 ipcMain.on('remove-permutationfile', (event, arg) => {
  settings.promptgen.permutations.files.splice(arg,1)
  fs.writeFileSync(settingspath,JSON.stringify(settings));
  mainWindow?.webContents.send('promptgen-permlist-load', settings.promptgen.permutations.files)
 });

 ipcMain.on('promptgen-generate', async (event, arg) => {
  let arr = []
  for(var j = 0; j < settings.promptgen.generation.count; j++)
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
        for (var f of settings.promptgen.generation.files)
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
    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {properties: ['createDirectory']})
      if (canceled) {
        return;
      } else {
          var path = AddExtension(filePath,'.prompts')
          var file = fs.createWriteStream(path);
          file.on('error', function(err) { console.log("Error writing file: " +err)});
          arr.forEach(function(e,i,a) { 
            if(i < a.length-1) 
              file.write(e + EOL);
            else
              file.write(e);
            });
          file.end(); 

          if (settings.promptgen.saveprompt)
            SavePrompt(path, arg);
        return;
      }
  }
  catch (err)
  {
    console.log("Error: " + err)
  }
 });

 ipcMain.on('promptgen-generate-permutations', async (event, arg) => {
  // Först ska vi hämta alla keywords och lägga dem i en lista av listor, samtidigt som vi byter ut de listorna mot ett nytt keyword
  // Efter det ska vi gå igenom alla permutation och sätta ihop en ny prompt i tur och ordning
  // Kasta ett error ifall det är mer än säg 10,000 prompter
  let idNumber = 0;
  let content = '';
  let name = '';
  let userlists = []; // arrayen ska innehålla en array of [keyword], [array] objekt där arrayen innehåller alla värden och keyword används för att byta ut på rätt plats i stringen
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
      for (var f of settings.promptgen.permutations.files)
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

  if (userlists === undefined || userlists.length === 0)
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
    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {properties: ['createDirectory']})
      if (canceled) {
        return
      } else {
          var path = AddExtension(filePath, '.prompts')
          var file = fs.createWriteStream(path);
          file.on('error', function(err) { console.log("Error writing file: " +err)});
          arr.forEach(function(e,i,a) { 
            if(i < a.length-1) 
              file.write(e + EOL);
            else
              file.write(e);
            });
          file.end(); 

          if (settings.promptgen.saveprompt)
            SavePrompt(path, arg);

        return
      }
  }
  catch (err)
  {
    console.log("Error: " + err)
  }
 })

 // Helper functions

 const GetPromptGenData = () => {
  var promptgenSettings = {cache: settings.promptgen.saveprompt, generations: settings.promptgen.generation.count, genfiles: settings.promptgen.generation.files, permfiles: settings.promptgen.permutations.files};
  return promptgenSettings;
 }

 const GetBingData = () => {
  var file = '';
  var spath = '';
  if (settings.bing.promptpath !== '')
    file = fs.readFileSync(settings.bing.promptpath, 'utf-8');
  if (fs.existsSync(settings.bing.savepath))
    spath = settings.bing.savepath
  return {pass: settings.bing.password, email: settings.bing.email, path: spath,prompt: file, time: settings.bing.waittime }
 }

 const GetMidjourneyData = () => {
  var file = '';
  var spath = '';
  if (settings.midjourney.promptpath !== '')
    file = fs.readFileSync(settings.midjourney.promptpath, 'utf-8');
  if (fs.existsSync(settings.midjourney.savepath))
    spath = settings.midjourney.savepath
  return {  pass: settings.midjourney.password, 
            email: settings.midjourney.email, 
            discordchaturl: settings.midjourney.discordchaturl,
            path: spath,
            prompt: file,
            selectedtab: settings.midjourney.selectedtab, 
            waittime: settings.midjourney.waittime,
            blends: {
              img1source: settings.midjourney.blends.img1source,
              img2source: settings.midjourney.blends.img2source,
              img3source: settings.midjourney.blends.img3source,
              img4source: settings.midjourney.blends.img4source,
              img5source: settings.midjourney.blends.img5source,
              blendnum: settings.midjourney.blends.blendnum,
              aspect:settings.midjourney.blends.aspect,
              savepath:settings.midjourney.blends.savepath,
              loops: settings.midjourney.blends.loops,
              waittime: settings.midjourney.blends.waittime
            },
            describe: {
              interval: settings.midjourney.descriptions.interval,
              sourcepath:settings.midjourney.descriptions.sourcepath,
              savepath:settings.midjourney.descriptions.savepath,
              saveprompts:settings.midjourney.descriptions.saveprompts,
              savekeywords:settings.midjourney.descriptions.savekeywords,
              saveartists:settings.midjourney.descriptions.saveartists,
              saveweights:settings.midjourney.descriptions.saveweights,
              savephrases:settings.midjourney.descriptions.savephrases
            }
          }
 }

const SavePrompt = (filePath, prompt) => {
  var filename = path.basename(filePath, path.extname(filePath))
  var basepath = path.dirname(filePath)
  var file = fs.createWriteStream(basepath + '\\' + filename + '.prompts.gen');
  file.on('error', function(err) { console.log("Error writing file: " +err)});
  file.write(prompt);
  file.end(); 
}

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

 function AddExtension(filePath, type) {
  const regex = /\.[a-zA-Z0-9]+$/; // Regex to match file extension

  // Check if path contains a filename with file extension
  if (!regex.test(filePath)) {
    // If no file extension found, append ".txt" to the filename
    const lastIndex = filePath.lastIndexOf('\\');
    if (lastIndex !== -1) {
      const newPath = filePath.substring(0, lastIndex + 1) + filePath.substring(lastIndex + 1) + type;
      return newPath;
    } else {
      // If there's no directory in the path, simply append ".txt" to it
      return filePath + type;
    }
  }

  // If path already contains a file extension, return the original path
  return filePath;
}
