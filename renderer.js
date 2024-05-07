// Bindings 
// Loading Screen
const loginwindow = document.getElementById('loginwindow')
const loginbutton = document.getElementById('loginbutton')

// Main Window
const mainWindow = document.getElementById('main-page')

// Header
const setMainMenuChoice1 = document.getElementById('mainmenu-choice1')
const setMainMenuChoice2 = document.getElementById('mainmenu-choice2')
const setMainMenuChoice3 = document.getElementById('mainmenu-choice3')
const setMainMenuChoice4 = document.getElementById('mainmenu-choice4')
const helpbutton = document.getElementById('helpbtn')

// Prompt gen page
const promptgenPage = document.getElementById('promptgen-page')
const promptgenTab1 = document.getElementById('promptgen-tab-1')
const promptgenTab2 = document.getElementById('promptgen-tab-2')
const promptgenTab1Content = document.getElementById('promptgen-random-tab')
const promptgenTab2Content = document.getElementById('promptgen-combination-tab')
const promptgenPromptbox = document.getElementById('promptgen-promptbox')
const promptgenFiles = document.getElementById('promptgen-filelist')
const promptgenCombinationFiles = document.getElementById('promptgen-combination-filelist')
const promptgenAddFileButton = document.getElementById('promptgen-addfile-button')
const promptgenGenerateButton = document.getElementById('promptgen-generate-button')
const promptgenOpenFileButton = document.getElementById('promptgen-openfile-button')
const promptgenPromptCount = document.getElementById('promptgen-amountofprompts')
const promptgenShouldSaveGenFile1 = document.getElementById('promptgen-shouldsavegenfile')
const promptgenCombintationbox = document.getElementById('promptgen-combinationbox')
const promptgenCombinationAddfileButton = document.getElementById('promptgen-combination-addfile')
const promptgenCombinationGenerateButton = document.getElementById('promptgen-combination-generate-button')
const promptgenCombinationOpenFileButton = document.getElementById('promptgen-combination-openfile-button')
const promptgenShouldSaveGenFile2 = document.getElementById('promptgen-combination-shouldsavegenfile')

// Bing page 
const bingPage = document.getElementById('bing-page')
const bingPromptbox = document.getElementById('bing-promptbox')
const bingLoadpromptsButton = document.getElementById('bing-loadprompts-button')
const bingWaittimeInput = document.getElementById('bing-waittime-input')
const bingEmailInput = document.getElementById('bing-email-input')
const bingPasswordInput = document.getElementById('bing-pass-input')
const bingDownloadPathButton = document.getElementById('bing-downloadpath-button')
const bingDownloadPathText = document.getElementById('bing-downloadpath-text')
const bingStartButton = document.getElementById('bing-startbutton')

// Midjourney page
const midjourneyPage = document.getElementById('midjourney-page')
const midjourneyPrompts = document.getElementById('midjourney-prompts')
const midjourneyBlending = document.getElementById('midjourney-blending')
const midjourneyDescriptions = document.getElementById('midjourney-descriptions')
const midjourneySetup = document.getElementById('midjourney-setup')
const midjourneyTab1 = document.getElementById('mj-tab-1')
const midjourneyTab2 = document.getElementById('mj-tab-2')
const midjourneyTab3 = document.getElementById('mj-tab-3')
const midjourneyTab4 = document.getElementById('mj-tab-4')
const midjourneyEmail = document.getElementById('midjourney-email')
const midjourneyPassword = document.getElementById('midjourney-password')
const midjourneyUrl = document.getElementById('midjourney-url')
const midjourneyDescribeWaittime = document.getElementById('midjourney-describe-waittime')
const midjourneyDescribeSavefolder = document.getElementById('midjourney-describe-savefolder')
const midjourneyDescribeSavefolderText = document.getElementById('midjourney-describe-savefolder-text')
const midjourneyDescribeSavePhrases = document.getElementById('midjourney-describe-savephrases')
const midjourneyDescribeSavePrompts = document.getElementById('midjourney-describe-saveprompts')
const midjourneyDescribeSaveKeywords = document.getElementById('midjourney-describe-savekeywords')
const midjourneyDescribeSaveArtists = document.getElementById('midjourney-describe-saveartists')
const midjourneyDescribeSaveWeights = document.getElementById('midjourney-describe-saveweights')
const midjourneyDescribeSourcefolder = document.getElementById('midjourney-describe-sourcefolder')
const midjourneyDescribeSourcefolderText = document.getElementById('midjourney-describe-sourcefolder-text')
const midjourneyDescribeStartbutton = document.getElementById('midjourney-describe-startbutton')
const midjourneyBlendLoops = document.getElementById('midjourney-blend-loops')
const midjourneyBlendWaittimeText = document.getElementById('midjourney-blend-waittime-text')
const midjourneyBlendWaittime = document.getElementById('midjourney-blend-waittime')
const midjourneyBlendSavepath = document.getElementById('midjourney-blend-savepath')
const midjourneyBlendSavepathText = document.getElementById('midjourney-blend-savepath-text')
const midjourneyBlendAspectratio = document.getElementById('midjourney-blend-aspectratio')
const midjourneyBlendNumberOfBlends = document.getElementById('midjourney-blend-numblends')
const midjourneyBlendImgPath1 = document.getElementById('midjourney-blend-img1path')
const midjourneyBlendImgPath1Text = document.getElementById('midjourney-blend-img1path-text')
const midjourneyBlendImgPath2 = document.getElementById('midjourney-blend-img2path')
const midjourneyBlendImgPath2Text = document.getElementById('midjourney-blend-img2path-text')
const midjourneyBlendImgPath3 = document.getElementById('midjourney-blend-img3path')
const midjourneyBlendImgPath3Text = document.getElementById('midjourney-blend-img3path-text')
const midjourneyBlendImgPath4 = document.getElementById('midjourney-blend-img4path')
const midjourneyBlendImgPath4Text = document.getElementById('midjourney-blend-img4path-text')
const midjourneyBlendImgPath5 = document.getElementById('midjourney-blend-img5path')
const midjourneyBlendImgPath5Text = document.getElementById('midjourney-blend-img5path-text')
const midjourneyBlendStartButton = document.getElementById('midjourney-blend-startbutton')
const midjourneyPromptBox = document.getElementById('midjourney-prompt-promptbox')
const midjourneyPromptLoadPromptsButton = document.getElementById('midjourney-prompt-loadprompts')
const midjourneyPromptWaittime = document.getElementById('midjourney-prompt-waittime')
const midjourneyPromptSavepath = document.getElementById('midjourney-prompt-downloadpath-button')
const midjourneyPromptSavepathText = document.getElementById('midjourney-prompt-downloadpath-text')
const midjourneyPromptStartButton = document.getElementById('midjourney-prompt-startbutton')


// Events
const LoggedIn = () => {
  mainWindow.style.display = 'flex'
  loginwindow.style.display = 'none'
}

const SetPageVisibility = (val) => {
  switch(val) {
    case 1: 
      promptgenPage.style.display = 'flex'
      bingPage.style.display = 'none'
      midjourneyPage.style.display = 'none'
      setMainMenuChoice1.checked = true
      setMainMenuChoice2.checked = false
      setMainMenuChoice3.checked = false
      setMainMenuChoice4.checked = false
      break;
    case 2:
      promptgenPage.style.display = 'none'
      bingPage.style.display = 'none'
      midjourneyPage.style.display = 'flex'
      setMainMenuChoice1.checked = false
      setMainMenuChoice2.checked = true
      setMainMenuChoice3.checked = false
      setMainMenuChoice4.checked = false
      break;
    case 3:
      promptgenPage.style.display = 'none'
      bingPage.style.display = 'flex'
      midjourneyPage.style.display = 'none'
      setMainMenuChoice1.checked = false
      setMainMenuChoice2.checked = false
      setMainMenuChoice3.checked = true
      setMainMenuChoice4.checked = false
      break;
    default:
      console.log("fail")
      promptgenPage.style.display = 'none'
      bingPage.style.display = 'none'
      midjourneyPage.style.display = 'none'
      setMainMenuChoice1.checked = false
      setMainMenuChoice2.checked = false
      setMainMenuChoice3.checked = false
      setMainMenuChoice4.checked = true
      break;
  }
}

const SetMidJourneyTabVisibility = (val) => {
  switch(val) {
    case 1:
      midjourneyTab1.classList.remove('inactive')
      midjourneyTab1.classList.add('active')
      midjourneyTab2.classList.remove('active')
      midjourneyTab3.classList.remove('active')
      midjourneyTab4.classList.remove('active')
      midjourneyTab2.classList.add('inactive')
      midjourneyTab3.classList.add('inactive')
      midjourneyTab4.classList.add('inactive')
      midjourneyPrompts.style.display = 'flex'
      midjourneyBlending.style.display = 'none'
      midjourneyDescriptions.style.display = 'none'
      midjourneySetup.style.display = 'none'
      break;
    case 2:
      midjourneyTab1.classList.remove('active')
      midjourneyTab1.classList.add('inactive')
      midjourneyTab2.classList.remove('inactive')
      midjourneyTab3.classList.remove('active')
      midjourneyTab4.classList.remove('active')
      midjourneyTab2.classList.add('active')
      midjourneyTab3.classList.add('inactive')
      midjourneyTab4.classList.add('inactive')
      midjourneyPrompts.style.display = 'none'
      midjourneyBlending.style.display = 'flex'
      midjourneyDescriptions.style.display = 'none'
      midjourneySetup.style.display = 'none'
      break;
    case 3:
      midjourneyTab1.classList.remove('active')
      midjourneyTab1.classList.add('inactive')
      midjourneyTab2.classList.remove('active')
      midjourneyTab3.classList.remove('inactive')
      midjourneyTab4.classList.remove('active')
      midjourneyTab2.classList.add('inactive')
      midjourneyTab3.classList.add('active')
      midjourneyTab4.classList.add('inactive')
      midjourneyPrompts.style.display = 'none'
      midjourneyBlending.style.display = 'none'
      midjourneyDescriptions.style.display = 'flex'
      midjourneySetup.style.display = 'none'
      break;
    case 4:
      midjourneyTab1.classList.remove('active')
      midjourneyTab1.classList.add('inactive')
      midjourneyTab2.classList.remove('active')
      midjourneyTab3.classList.remove('active')
      midjourneyTab4.classList.remove('inactive')
      midjourneyTab2.classList.add('inactive')
      midjourneyTab3.classList.add('inactive')
      midjourneyTab4.classList.add('active')
      midjourneyPrompts.style.display = 'none'
      midjourneyBlending.style.display = 'none'
      midjourneyDescriptions.style.display = 'none'
      midjourneySetup.style.display = 'flex'
      break;
    default:
      console.log("fail")
      break;
  }
}


// Login
loginbutton.addEventListener('click', () => { // Log in, close the welcome screen
  window.electronAPI.login();
  LoggedIn();
})

// Navigation Header
setMainMenuChoice1.addEventListener('click', () => {
  window.electronAPI.mainmenuChoice(1);
})
setMainMenuChoice2.addEventListener('click', () => {
  window.electronAPI.mainmenuChoice(2);
})
setMainMenuChoice3.addEventListener('click', () => {
  window.electronAPI.mainmenuChoice(3);
})
setMainMenuChoice4.addEventListener('click', () => {
  window.electronAPI.mainmenuChoice(4);
})
helpbutton.addEventListener('click', () => {
  window.electronAPI.help();
})

// Prompt page
window.electronAPI.promptgenLoaded((e, data) => {
  console.log(data)
  promptgenPage.style.display = 'flex'
  bingPage.style.display = 'none'
  midjourneyPage.style.display = 'none'
  analysispage.style.display = 'none'
  if (data.menuChoice === 0) {
    promptgenTab1.classList.add("active")
    promptgenTab1.classList.remove("inactive")
    promptgenTab2.classList.remove("active")
    promptgenTab2.classList.add("inactive")
    promptgenTab1Content.style.display = 'flex'
    promptgenTab2Content.style.display = 'none'
  } else {
    promptgenTab1.classList.add("inactive")
    promptgenTab1.classList.remove("active")
    promptgenTab2.classList.add("active")
    promptgenTab2.classList.remove("inactive")
    promptgenTab1Content.style.display = 'none'
    promptgenTab2Content.style.display = 'flex'
  }
  promptgenShouldSaveGenFile1.checked === data.cache;
  promptgenShouldSaveGenFile2.checked === data.cache;
  promptgenPromptCount.value = data.generations
  for(var i = 0; i < data.genfiles.length; i++) {
    // Add elements for each added file
  }
  for(var i = 0; i < data.permfiles.length; i++) {
    // Add elements for each added file
  }
  SetPageVisibility(1);
})

promptgenTab1.addEventListener('click', () => {
  window.electronAPI.promptgenMenuChoice(0);
  promptgenTab1.classList.add("active")
  promptgenTab1.classList.remove("inactive")
  promptgenTab2.classList.add("inactive")
  promptgenTab2.classList.remove("active")
  promptgenTab1Content.style.display = 'flex'
  promptgenTab2Content.style.display = 'none'
})
promptgenTab2.addEventListener('click', () => {
  window.electronAPI.promptgenMenuChoice(1);
  promptgenTab1.classList.add("inactive")
  promptgenTab1.classList.remove("active")
  promptgenTab2.classList.add("active")
  promptgenTab2.classList.remove("inactive")
  promptgenTab1Content.style.display = 'none'
  promptgenTab2Content.style.display = 'flex'
})

midjourneyTab1.addEventListener('click', () => {
  window.electronAPI.midjourneyTabChoice(1);
  SetMidJourneyTabVisibility(1);
})

midjourneyTab2.addEventListener('click', () => {
  window.electronAPI.midjourneyTabChoice(2);
  SetMidJourneyTabVisibility(2);
})

midjourneyTab3.addEventListener('click', () => {
  window.electronAPI.midjourneyTabChoice(3);
  SetMidJourneyTabVisibility(3);
})

midjourneyTab4.addEventListener('click', () => {
  window.electronAPI.midjourneyTabChoice(4);
  SetMidJourneyTabVisibility(4);
})

promptgenAddFileButton.addEventListener('click', () => {
  window.electronAPI.promptgenAddGenFile().then(result=>{ 
    // Add element to list
  })
})
promptgenGenerateButton.addEventListener('click', () => {
  window.electronAPI.promptgenGenerate(promptgenPromptbox.value);
})
promptgenOpenFileButton.addEventListener('click', () => {
  window.electronAPI.promptgenLoadGenFile().then(res => {
    if (res)
      promptgenPromptbox.value = res
  })
})
promptgenPromptCount.addEventListener('change', (e) => {
  window.electronAPI.promptgenSetCount(e.target.value);
})

promptgenShouldSaveGenFile1.addEventListener('click', (e) => {
  window.electronAPI.setShouldSaveGenFile(e.target.checked)
})

promptgenCombinationAddfileButton.addEventListener('click', () => {
  window.electronAPI.promptgenAddCombinationGenFile().then(result=>{ 
    // Add element to list
  })
})
promptgenCombinationGenerateButton.addEventListener('click', () => {
  window.electronAPI.promptgenCombinationGenerate(promptgenCombintationbox.value);
})
promptgenCombinationOpenFileButton.addEventListener('click', () => {
  window.electronAPI.promptgenLoadCombinationGenFile().then(res => {
    if (res)
      promptgenCombintationbox.value = res
  })
})
window.electronAPI.promptgenLoadCombinationFileList((e,data) => {
  console.log("IMPLEMENT THIS")
})

window.electronAPI.promptgenLoadFileList((e,data) => {
  console.log("IMPLEMENT THIS")
})

promptgenShouldSaveGenFile2.addEventListener('click', () => {
  window.electronAPI.setShouldSaveGenFile(e.target.checked)
})


// Bing page 
window.electronAPI.bingLoaded((event,data) => {
  promptgenPage.style.display = 'none'
  bingPage.style.display = 'none'
  midjourneyPage.style.display = 'flex'
  analysispage.style.display = 'none'

  bingPromptbox.value = data.prompts;
  bingWaittimeInput.value = data.waittime;
  bingEmailInput.value = data.email;
  bingPasswordInput.value = data.password;
  bingDownloadPathText.value = data.savePath;
  SetPageVisibility(3);
})
bingLoadpromptsButton.addEventListener('click', () => {
  window.electronAPI.bingLoadPrompts().then(res => {
    bingPromptbox.value = res;
  })
})
bingWaittimeInput.addEventListener('change', (e) => {
  window.electronAPI.bingSetWaitTime(e.target.value)
})
bingEmailInput.addEventListener('change', (e) => {
  window.electronAPI.bingSetEmail(e)
})
bingPasswordInput.addEventListener('change', (e) => {
  window.electronAPI.bingSetPassword(e.target.value)
})
bingDownloadPathButton.addEventListener('click', () => {
  window.electronAPI.setBingDownloadPath().then(res => {
    bingDownloadPathText.value = res;  
  })
})
bingStartButton.addEventListener('click', () => {
  window.electronAPI.startBing();
})


// MidJourney

window.electronAPI.midjourneyLoaded((event, data) => {
  try {

    SetMidJourneyTabVisibility(parseInt(data.selectedtab))
  
    midjourneyEmail.value = data.email; 
    midjourneyPassword.value = data.password; 
    midjourneyUrl.value = data.url; 
  
    midjourneyDescribeWaittime.value = data.describe.waittime;
    midjourneyDescribeSavefolderText.value = data.describe.savepath;
    midjourneyDescribeSavePhrases.checked = data.describe.savephrases 
    midjourneyDescribeSavePrompts.checked = data.describe.saveprompts
    midjourneyDescribeSaveKeywords.checked = data.describe.savekeywords 
    midjourneyDescribeSaveArtists.checked = data.describe.saveartists
    midjourneyDescribeSaveWeights.checked = data.describe.saveweights
    midjourneyDescribeSourcefolderText.value = data.describe.sourcepath
  
    midjourneyBlendLoops.value = data.blends.loops 
    midjourneyBlendWaittimeText.value = data.blends.waittime
    midjourneyBlendSavepathText.value = data.blends.savepath
    midjourneyBlendAspectratio.value = data.blends.aspect
    midjourneyBlendNumberOfBlends.value = data.blends.blendnum
    midjourneyBlendImgPath1Text.value = data.blends.img1source
    midjourneyBlendImgPath2Text.value = data.blends.img2source
    midjourneyBlendImgPath3Text.value = data.blends.img3source 
    midjourneyBlendImgPath4Text.value = data.blends.img4source
    midjourneyBlendImgPath5Text.value = data.blends.img5source
  
    midjourneyPromptBox.value = data.promptpath
    midjourneyPromptWaittime.value = data.waittime
    midjourneyPromptSavepathText.value = data.savepath
    SetPageVisibility(2);
  }catch(err) {console.log(err)}
})

midjourneyEmail.addEventListener('change', (e) => {
  window.electronAPI.setMidjourneyEmail(e.target.value)
})
midjourneyPassword.addEventListener('change', (e) => {
  window.electronAPI.setMidjourneyPassword(e.target.value)
})
midjourneyUrl.addEventListener('change', (e) => {
  window.electronAPI.setMidjourneyUrl(e.target.value)
})
midjourneyDescribeWaittime.addEventListener('change', (e) => {
  window.electronAPI.setMidjourneyDescribeWaittime(e.target.value)
}) 
midjourneyDescribeSavefolder.addEventListener('click', (e) => {
  window.electronAPI.setMidjourneyDescribeSavefolder().then(res => {
    if (res) {
      midjourneyDescribeSavefolderText.value = res;
    }
  })
})  

midjourneyDescribeSavePhrases.addEventListener('click', (e) => {
  window.electronAPI.setMidjourneyDescribeSavePhrases(e.checked)
}) 
midjourneyDescribeSavePrompts.addEventListener('click', (e) => {
  window.electronAPI.setMidjourneyDescribeSavePrompts(e.checked)
}) 
midjourneyDescribeSaveKeywords.addEventListener('click', (e) => {
  window.electronAPI.setMidjourneyDescribeSaveKeywords(e.checked)
}) 
midjourneyDescribeSaveArtists.addEventListener('click', (e) => {
  window.electronAPI.setMidjourneyDescribeSaveArtists(e.checked)
}) 
midjourneyDescribeSaveWeights.addEventListener('click', (e) => {
  window.electronAPI.setMidjourneyDescribeSaveWeights(e.checked)
}) 
midjourneyDescribeSourcefolder.addEventListener('click', (e) => {
  window.electronAPI.setMidjourneyDescribeSource().then(res => {
    if (res) {
      midjourneyDescribeSourcefolderText.value = res;
    }
  })
}) 
midjourneyDescribeStartbutton.addEventListener('click', (e) => {
  window.electronAPI.startMidJourney(3);
})  
midjourneyBlendWaittime.addEventListener('click', (e) => {
  window.electronAPI.setMidjourneyBlendWaittime(e.target.value)
  midjourneyBlendWaittimeText.value = parseInt(midjourneyBlendLoops.value) * e.target.value;
}) 
midjourneyBlendSavepath.addEventListener('click', (e) => {
  window.electronAPI.setMidjourneyBlendSavepath().then(res => {
    if (res) {
      midjourneyBlendSavepathText.value = res
    }
  })
}) 
 
midjourneyBlendAspectratio.addEventListener('change', (e) => {
  window.electronAPI.setMidjourneyBlendAspectratio(e.target.value)
}) 
midjourneyBlendNumberOfBlends.addEventListener('change', (e) => {
  window.electronAPI.setMidjourneyBlendNumblends(e.target.value)
}) 
midjourneyBlendImgPath1.addEventListener('click', (e) => {
  window.electronAPI.setMidjourneyBlendImg1Path().then(res => {
    if (res) 
      midjourneyBlendImgPath1Text.value = res
  })
}) 
 
midjourneyBlendImgPath2.addEventListener('click', (e) => {
  window.electronAPI.setMidjourneyBlendImg2Path().then(res => {
    if (res) 
      midjourneyBlendImgPath2Text.value = res
  })
}) 

midjourneyBlendImgPath3.addEventListener('click', (e) => {
  window.electronAPI.setMidjourneyBlendImg3Path().then(res => {
    if (res) 
      midjourneyBlendImgPath3Text.value = res
  })
}) 

midjourneyBlendImgPath4.addEventListener('click', (e) => {
  window.electronAPI.setMidjourneyBlendImg4Path().then(res => {
    if (res) 
      midjourneyBlendImgPath4Text.value = res
  })
}) 

midjourneyBlendImgPath5.addEventListener('click', (e) => {
  window.electronAPI.setMidjourneyBlendImg5Path().then(res => {
    if (res) 
      midjourneyBlendImgPath5Text.value = res
  })
}) 

midjourneyBlendStartButton.addEventListener('click', (e) => {
  window.electronAPI.startMidJourney(2);
}) 
 
midjourneyPromptLoadPromptsButton.addEventListener('click', (e) => {
  window.electronAPI.loadMidjourneyPrompts(e.target.value).then(res => {
    if (res) 
      midjourneyPromptBox.value = res
  })
}) 
midjourneyPromptWaittime.addEventListener('change', (e) => {
  window.electronAPI.setMidjourneyPromptWaittime(e.target.value)
}) 
midjourneyPromptSavepath.addEventListener('click', (e) => {
  window.electronAPI.setMidjourneyPromptSavepath().then(res => {
    console.log(res)
    if (res)
      midjourneyPromptSavepathText.value = res
  })
}) 

midjourneyPromptStartButton.addEventListener('click', (e) => {
  window.electronAPI.startMidJourney(1);
}) 


// SUPPORT FUNCTIONS

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
// function myFunction() {
//   console.log("My function")
//     document.getElementById("myDropdown").classList.toggle("show");
//   }
  
// Close the dropdown menu if the user clicks outside of it
// window.onclick = function(event) {
//   console.log("windows on click")
//   if (!event.target.matches('.dropbtn')) {
//     var dropdowns = document.getElementsByClassName("dropdown-content");
//     var i;
//     for (i = 0; i < dropdowns.length; i++) {
//       var openDropdown = dropdowns[i];
//       if (openDropdown.classList.contains('show')) {
//         openDropdown.classList.remove('show');
//       }
//     }
//   }
// }

function AddListItem(item) {
  var split = item.split('\\');
  var filename = split[split.length -1];
  filename = filename.substring(0, filename.lastIndexOf('.'));
  var container = document.createElement('div')
  container.className = 'gen-container'
  var name = document.createElement('p')
  name.appendChild(document.createTextNode(filename))
  name.className = "reg-text nm"
  var deletebutton = document.createElement('div')
  deletebutton.appendChild(document.createTextNode("-"))
  deletebutton.className = "deletebutton"
  container.appendChild(name)
  var filelist = document.getElementById('filelist')
  var listlength = filelist.children.length;
  deletebutton.dataset.index = listlength;
  deletebutton.addEventListener('click', (e) => {
    var index = e.target.getAttribute('data-index')
    window.electronAPI.removeListFile(index)
    var filelist = document.getElementById('filelist')
    filelist.removeChild(e.currentTarget.parentElement)
  })
  container.appendChild(deletebutton)
  filelist.appendChild(container)
}


function AddPermutationItem(item) {
  console.log(item)
  var split = item.split('\\');
  var filename = split[split.length -1];
  filename = filename.substring(0, filename.lastIndexOf('.'));
  var container = document.createElement('div')
  container.className = 'gen-container'
  var name = document.createElement('p')
  name.appendChild(document.createTextNode(filename))
  name.className = "reg-text nm"
  var deletebutton = document.createElement('div')
  deletebutton.appendChild(document.createTextNode("-"))
  deletebutton.className = "deletebutton"
  container.appendChild(name)
  var filelist = document.getElementById('permutefilelist')
  var listlength = filelist.children.length;
  deletebutton.dataset.index = listlength;
  deletebutton.addEventListener('click', (e) => {
    var index = e.target.getAttribute('data-index')
    window.electronAPI.removePermutationFile(index)
    var filelist = document.getElementById('permutefilelist')
    filelist.removeChild(e.currentTarget.parentElement)
  })
  container.appendChild(deletebutton)
  filelist.appendChild(container)
}

// Tabs logic
window.addEventListener("load", function() {
	// store tabs variable
	// var myTabs = document.querySelectorAll("ul.nav-tabs > li");
  // function myTabClicks(tabClickEvent) {
	// 	for (var i = 0; i < myTabs.length; i++) {
	// 		myTabs[i].classList.remove("active");
  //     myTabs[i].classList.replace("important-text", "reg-text");
	// 	}
	// 	var clickedTab = tabClickEvent.currentTarget;
	// 	clickedTab.classList.add("active");
  //   clickedTab.classList.replace("reg-text", "important-text");
	// 	tabClickEvent.preventDefault();
	// 	var myContentPanes = document.querySelectorAll(".tab-pane");
	// 	for (i = 0; i < myContentPanes.length; i++) {
	// 		myContentPanes[i].classList.remove("active");
	// 	}
	// 	var anchorReference = tabClickEvent.target;
	// 	var activePaneId = anchorReference.getAttribute("href");
	// 	var activePane = document.querySelector(activePaneId);
	// 	activePane.classList.add("active");
	// }
	// for (i = 0; i < myTabs.length; i++) {
	// 	myTabs[i].addEventListener("click", myTabClicks)
	// }
});