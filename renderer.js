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

// Login
loginbutton.addEventListener('click', () => { // Log in, close the welcome screen
  console.log("logging in...")
  window.electronAPI.login();
  loginwindow.style.display = "none";
  mainWindow.style.display = "flex";
})

// Navigation Header
setMainMenuChoice1.addEventListener('click', () => {
  window.electronAPI.mainmenuChoice(1);
})
setMainMenuChoice1.addEventListener('click', () => {
  window.electronAPI.mainmenuChoice(2);
})
setMainMenuChoice1.addEventListener('click', () => {
  window.electronAPI.mainmenuChoice(3);
})
setMainMenuChoice1.addEventListener('click', () => {
  window.electronAPI.mainmenuChoice(4);
})
helpbutton.addEventListener('click', () => {
  window.electronAPI.help();
})

// Prompt page
window.electronAPI.promptgenLoaded((e, data) => {
  promptgenPage.style.display = 'flex'
  bingPage.style.display = 'none'
  midjourneyPage.style.display = 'none'
  analysispage.style.display = 'none'
  if (data.menuChoice === 0) {
    promptgenTab1Content.style.display === 'flex'
    promptgenTab2Content.style.display === 'none'
  } else {
    promptgenTab1Content.style.display === 'none'
    promptgenTab2Content.style.display === 'flex'
  }
  promptgenShouldSaveGenFile1.checked === data.saveprompt;
  promptgenShouldSaveGenFile2.checked === data.saveprompt;
  promptgenPromptCount.value = data.generation.count
  for(var i = 0; i < data.generation.files.length; i++) {
    // Add elements for each added file
  }
  for(var i = 0; i < data.permutations.files.length; i++) {
    // Add elements for each added file
  }
})

promptgenTab1.addEventListener('click', () => {
  window.electronAPI.promptgenMenuChoice(0);
  promptgenTab1Content.style.display === 'flex'
  promptgenTab2Content.style.display === 'none'
})
promptgenTab2.addEventListener('click', () => {
  window.electronAPI.promptgenMenuChoice(1);
  promptgenTab1Content.style.display === 'none'
  promptgenTab2Content.style.display === 'flex'
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
  window.electronAPI.promptgenLoadGenFile()
})
promptgenPromptCount
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
  window.electronAPI.promptgenLoadCombinationGenFile()
})
promptgenShouldSaveGenFile2.addEventListener('click', () => {
  window.electronAPI.setShouldSaveGenFile(e.target.checked)
})


// Bing page 
window.electronAPI.bingLoaded((e, data) => {
  promptgenPage.style.display = 'none'
  bingPage.style.display = 'none'
  midjourneyPage.style.display = 'flex'
  analysispage.style.display = 'none'

  bingPromptbox.value = data.prompts;
  bingWaittimeInput.value = data.waittime;
  bingEmailInput.value = data.email;
  bingPasswordInput.value = data.password;
  bingDownloadPathText.value = data.savePath;
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

window.electronAPI.midjourneyLoaded((e, data) => {
  switch(data.selectedTab) {
    case 0:
      midjourneyPrompts.style.display = 'flex'
      midjourneyBlending.style.display = 'none'
      midjourneyDescriptions.style.display = 'none' 
      midjourneySetup.style.display = 'none'
      break;
    case 1:
      midjourneyPrompts.style.display = 'none'
      midjourneyBlending.style.display = 'flex'
      midjourneyDescriptions.style.display = 'none' 
      midjourneySetup.style.display = 'none'
      break;
    case 2:
      midjourneyPrompts.style.display = 'none'
      midjourneyBlending.style.display = 'none'
      midjourneyDescriptions.style.display = 'flex' 
      midjourneySetup.style.display = 'none'
      break;
    case 3:
      midjourneyPrompts.style.display = 'none'
      midjourneyBlending.style.display = 'none'
      midjourneyDescriptions.style.display = 'none' 
      midjourneySetup.style.display = 'flex'
      break;
    default:
      midjourneyPrompts.style.display = 'flex'
      midjourneyBlending.style.display = 'none'
      midjourneyDescriptions.style.display = 'none' 
      midjourneySetup.style.display = 'none'
  }

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

  midjourneyBlendLoops.value = data.blend.loops 
  midjourneyBlendWaittimeText.value = data.blend.waittime
  midjourneyBlendSavepathText.value = data.blend.savepath
  midjourneyBlendAspectratio.value = data.blend.aspectratio
  midjourneyBlendNumberOfBlends.value = data.blend.numblends
  midjourneyBlendImgPath1Text.value = data.blend.img1path
  midjourneyBlendImgPath2Text.value = data.blend.img2path 
  midjourneyBlendImgPath3Text.value = data.blend.img3path 
  midjourneyBlendImgPath4Text.value = data.blend.img4path
  midjourneyBlendImgPath5Text.value = data.blend.img5path

  midjourneyPromptBox.value = data.promptpath
  midjourneyPromptWaittime.value = data.waittime
  midjourneyPromptSavepathText.value = data.savepath
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
  midjourneyBlendWaittimeText.value = int(midjourneyBlendLoops.value) * e.target.value;
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
  window.electronAPI.setMidjourneyBlendImg1Path(e.target.value).then(res => {
    if (res) 
      midjourneyBlendImgPath1Text.value = res
  })
}) 
 
midjourneyBlendImgPath2.addEventListener('click', (e) => {
  window.electronAPI.setMidjourneyBlendImg2Path(e.target.value).then(res => {
    if (res) 
      midjourneyBlendImgPath2Text.value = res
  })
}) 

midjourneyBlendImgPath3.addEventListener('click', (e) => {
  window.electronAPI.setMidjourneyBlendImg3Path(e.target.value).then(res => {
    if (res) 
      midjourneyBlendImgPath3Text.value = res
  })
}) 

midjourneyBlendImgPath4.addEventListener('click', (e) => {
  window.electronAPI.setMidjourneyBlendImg4Path(e.target.value).then(res => {
    if (res) 
      midjourneyBlendImgPath4Text.value = res
  })
}) 

midjourneyBlendImgPath5.addEventListener('click', (e) => {
  window.electronAPI.setMidjourneyBlendImg5Path(e.target.value).then(res => {
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
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
  }
  
// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

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
	var myTabs = document.querySelectorAll("ul.nav-tabs > li");
  function myTabClicks(tabClickEvent) {
		for (var i = 0; i < myTabs.length; i++) {
			myTabs[i].classList.remove("active");
      myTabs[i].classList.replace("important-text", "reg-text");
		}
		var clickedTab = tabClickEvent.currentTarget;
		clickedTab.classList.add("active");
    clickedTab.classList.replace("reg-text", "important-text");
		tabClickEvent.preventDefault();
		var myContentPanes = document.querySelectorAll(".tab-pane");
		for (i = 0; i < myContentPanes.length; i++) {
			myContentPanes[i].classList.remove("active");
		}
		var anchorReference = tabClickEvent.target;
		var activePaneId = anchorReference.getAttribute("href");
		var activePane = document.querySelector(activePaneId);
		activePane.classList.add("active");
	}
	for (i = 0; i < myTabs.length; i++) {
		myTabs[i].addEventListener("click", myTabClicks)
	}
});