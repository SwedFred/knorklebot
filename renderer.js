const setBlendcontainer = document.getElementById('blendcontainer')
const setPromptcontainer = document.getElementById('promptcontainer')
const setDescribecontainer = document.getElementById('describecontainer')
const setPromptMode = document.getElementById('prompt-choice')
const setBlendMode = document.getElementById('blend-choice')
const setDescribeMode = document.getElementById('describe-choice')
const chaosValue2 = document.getElementById('chaos-value2')
const stylizeValue2 = document.getElementById('stylize-value2')
const totaltime = document.getElementById('totaltime')
const img1path = document.getElementById('img1path')
const img2path = document.getElementById('img2path')
const img3path = document.getElementById('img3path')
const img4path = document.getElementById('img4path')
const img5path = document.getElementById('img5path')
const descfolder = document.getElementById('descfolder')
const descpath = document.getElementById('descpath')
const descsavepath = document.getElementById('descsavepath')
const descsavefolder = document.getElementById('descsavefolder')
const linecount = document.getElementById('linecount')
const loginwindow = document.getElementById('loginwindow')
const mainpage = document.getElementById('mainpage')
const errortext = document.getElementById('errortext')
const override = document.getElementById('override') // override the stylize settings n stuff
const passcontainer = document.getElementById('passcontainer')
const changepass = document.getElementById('changepass')
const loginbutton = document.getElementById('loginbutton')
const setLoadPrompts = document.getElementById('kek')
const setButton = document.getElementById('startbot-button')
const helpbutton = document.getElementById('helpbtn')
const imgweight = document.getElementById('imgweight')
const version = document.getElementById('version')
const gentext = document.getElementById('gen-textu')
const saveGeneration = document.getElementById('save-generation')
const savePermutation = document.getElementById('save-permutation')
// Permutations
const permutetext = document.getElementById('permute-textu')
const permuteAddbutton = document.getElementById('permuteaddbutton')
const permuteFileList = document.getElementById('permutefilelist')
const permutebutton = document.getElementById('permutebutton')
// Descriptions
const descPrompts = document.getElementById('desc-prompts')
const descKeywords = document.getElementById('desc-keywords')
const descArtists = document.getElementById('desc-artists')
const descPhrases = document.getElementById('desc-phrases')
const descWeights = document.getElementById('desc-weights')
const descInterval = document.getElementById('interval3')

descInterval.addEventListener('change', (e) => {
  window.electronAPI.setDescInterval(e.target.value)
})
descPrompts.addEventListener('click', (e) => {
  var val = e.target.checked ? true : false;
  window.electronAPI.setDescPrompts(val)
})
descKeywords.addEventListener('click', (e) => {
  var val = e.target.checked ? true : false;
  window.electronAPI.setDescKeywords(val)
})
descArtists.addEventListener('click', (e) => {
  var val = e.target.checked ? true : false;
  window.electronAPI.setDescArtists(val)
})
descPhrases.addEventListener('click', (e) => {
  var val = e.target.checked ? true : false;
  window.electronAPI.setDescPhrases(val)
})
descWeights.addEventListener('click', (e) => {
  var val = e.target.checked ? true : false;
  window.electronAPI.setDescWeights(val)
})
saveGeneration.addEventListener('click', (e) => {
  var val = e.target.checked ? true : false;
  window.electronAPI.setSaveGeneration(val)
})
savePermutation.addEventListener('click', (e) => {
  var val = e.target.checked ? true : false;
  window.electronAPI.setSavePermutation(val)
})

helpbutton.addEventListener('click', (e) => {
  window.electronAPI.help();
})

loginbutton.addEventListener('click', () => {
  window.electronAPI.login();
})

setLoadPrompts.addEventListener('click', () => {
  window.electronAPI.selectFile().then(result=>{ 
    prompts.innerHTML = result;
    linecount.innerHTML = result.split('\r\n').length;
  })
})

setButton.addEventListener('click', () => {
    window.electronAPI.startBot()
})

const prompts = document.getElementById('prompts')

const setUsername = document.getElementById('user')
setUsername.addEventListener('change', (e) => {
  window.electronAPI.setUsername(e.target.value)
})

const setPassword = document.getElementById('password')
setPassword.addEventListener('change', (e) => {
    window.electronAPI.setPassword(e.target.value)
})

const setDiscordurl = document.getElementById('discordurl')
setDiscordurl.addEventListener('change', (e) => {
    window.electronAPI.setDiscordChatUrl(e.target.value)
})

const setBlendnum = document.getElementById('numblends')
setBlendnum.addEventListener('change', (e) => {
    window.electronAPI.setBlendnum(e.target.value)
})


setPromptMode.addEventListener('click', (e) => {    
  setBlendcontainer.style.display = "none";
  setPromptcontainer.style.display = "flex";
  setDescribecontainer.style.display = "none";
  window.electronAPI.setMode(1)
})

setBlendMode.addEventListener('click', (e) => {    
  setBlendcontainer.style.display = "flex";
  setPromptcontainer.style.display = "none";
  setDescribecontainer.style.display = "none";
  window.electronAPI.setMode(2)
})

setDescribeMode.addEventListener('click', (e) => {    
  setBlendcontainer.style.display = "none";
  setPromptcontainer.style.display = "none";
  setDescribecontainer.style.display = "flex";
  window.electronAPI.setMode(3)
})

imgweight.addEventListener('input', (e) => {
  window.electronAPI.setImgWeight(e.target.value)
})

const setStylize2 = document.getElementById('stylize-slider2')
setStylize2.addEventListener('input', (e) => {
  stylizeValue2.innerHTML = e.target.value;
  window.electronAPI.setStylize(e.target.value)
})

const setChaos2 = document.getElementById('chaos-slider2')
setChaos2.addEventListener('input', (e) => {
  chaosValue2.innerHTML = e.target.value;
  window.electronAPI.setChaos(e.target.value)
})

const setLoops = document.getElementById('loopcount')
setLoops.addEventListener('change', (e) => {
  totaltime.innerHTML = ((e.target.value * setInterval.value) / 60).toFixed(1);
    window.electronAPI.setLoops(e.target.value)
})

version.addEventListener('change', (e) => {
  window.electronAPI.setVersion(e.target.value)
})

const setInterval = document.getElementById('interval')
const setInterval2 = document.getElementById('interval2')
setInterval.addEventListener('change', (e) => {
  totaltime.innerHTML = ((e.target.value * setLoops.value) / 60).toFixed(1);
  setInterval2.value = e.target.value;
  window.electronAPI.setInterval(e.target.value)
})
setInterval2.addEventListener('change', (e) => {
  totaltime.innerHTML = ((e.target.value * setLoops.value) / 60).toFixed(1);
  setInterval.value = e.target.value;
  window.electronAPI.setInterval(e.target.value)
})

const setBlendAspectRatio = document.getElementById('blendaspect-ratio')
setBlendAspectRatio.addEventListener('change', (e) => {
    window.electronAPI.setBlendAspect(e.target.value)
})

const setAspectRatio = document.getElementById('aspect-ratio')
setAspectRatio.addEventListener('change', (e) => {
    window.electronAPI.setAspect(e.target.value)
})

const setImg1Source = document.getElementById('img1folder')
setImg1Source.addEventListener('click', (e) => {
  window.electronAPI.selectFolder().then(result=>{ 
    var split = result.split('\\');
    img1path.innerHTML = split[split.length -1];
    window.electronAPI.setImg1Source(result)
  })
})

const setImg2Source = document.getElementById('img2folder')
setImg2Source.addEventListener('click', (e) => {
  window.electronAPI.selectFolder().then(result=>{ 
    var split = result.split('\\');
    img2path.innerHTML = split[split.length -1];
    window.electronAPI.setImg2Source(result)
  })
})

const setImg3Source = document.getElementById('img3folder')
setImg3Source.addEventListener('click', (e) => {
  window.electronAPI.selectFolder().then(result=>{ 
    var split = result.split('\\');
    img3path.innerHTML = split[split.length -1];
    window.electronAPI.setImg3Source(result)
  })
})

const setImg4Source = document.getElementById('img4folder')
setImg4Source.addEventListener('click', (e) => {
  window.electronAPI.selectFolder().then(result=>{ 
    var split = result.split('\\');
    img4path.innerHTML = split[split.length -1];
    window.electronAPI.setImg4Source(result)
  })
})

const setImg5Source = document.getElementById('img5folder')
setImg5Source.addEventListener('click', (e) => {
  window.electronAPI.selectFolder().then(result=>{ 
    var split = result.split('\\');
    img5path.innerHTML = split[split.length -1];
    window.electronAPI.setImg5Source(result)
  })
})

descfolder.addEventListener('click', (e) => {
  window.electronAPI.selectFolder().then(result => {
    var split = result.split('\\');
    descpath.innerHTML = split[split.length -1];
    window.electronAPI.setDescFolder(result)
  })
})

descsavefolder.addEventListener('click', (e) => {
  window.electronAPI.selectFolder().then(result => {
    var split = result.split('\\');
    descsavepath.innerHTML = split[split.length -1];
    window.electronAPI.setDescSaveFolder(result)
  })
})

// Generation

const genButton = document.getElementById('genbutton')
genButton.addEventListener('click', (e) => {
  let text = gentext.value;
  window.electronAPI.generatePrompts(text);
})

const genCount = document.getElementById('gencount')
genCount.addEventListener('change', (e) => {
  window.electronAPI.setPromptCount(e.target.value)
})

const addButton = document.getElementById('addbutton')
addButton.addEventListener('click', (e) => {
  // Add another list item and give it the name of a selected file
  // make sure to save the path as data to replace the {code}
  window.electronAPI.addListFile().then(result=>{ 
    AddListItem(result)
  })
})

// Permutation

permuteAddbutton.addEventListener('click', (e) => {
  window.electronAPI.addPermutationFile().then(result => {
    AddPermutationItem(result);
  })
})

permutebutton.addEventListener('click', (e) => {
var text = permutetext.value;
  window.electronAPI.generatePermutations(text);
})


// Other stuff

override.addEventListener('click', (e) => {
  var val = e.target.checked ? true : false;
  window.electronAPI.setOverride(val)
})

// From Renderer

window.electronAPI.loggedin((event, val) => {
  if (val)
  {
    loginwindow.style.display = "none";
    mainpage.style.display = "flex";
  }
  else
  {
    errortext.innerHTML = "Login error: please try again."
  }
})

window.electronAPI.loadSettings((event, settings) => {
  try
  {
    var split = "" 
    mainpage.style.display = "none";
    setUsername.value = settings.username;
    setPassword.value = settings.password;
    setDiscordurl.value = settings.discordchaturl;
    setBlendnum.value = settings.blendnum;
    setLoops.value = settings.loops;
    setInterval.value = settings.interval;
    setInterval2.value = settings.interval;
    setImg1Source.value = settings.img1source;
    if (settings.img1source) {
      split = settings.img1source.split('\\');
      img1path.innerHTML = split[split.length -1];
    }
    if (settings.img1source) {
      split = settings.img1source.split('\\');
      img1path.innerHTML = split[split.length -1];
    }
    if (settings.img2source) {
      split = settings.img2source.split('\\');
      img2path.innerHTML = split[split.length -1];
    }
    if (settings.img3source) {
      split = settings.img3source.split('\\');
      img3path.innerHTML = split[split.length -1];
    }
    if (settings.img4source) {
      split = settings.img4source.split('\\');
      img4path.innerHTML = split[split.length -1];
    }
    if (settings.img5source) {
      split = settings.img5source.split('\\');
      img5path.innerHTML = split[split.length -1];
    }
    
    setImg2Source.value = settings.img2source;
    setImg3Source.value = settings.img3source;
    setImg4Source.value = settings.img4source;
    setImg5Source.value = settings.img5source;
    descfolder.value = settings.descriptions.descpath

    if(settings.descriptions.descpath) {
      split = settings.descriptions.descpath.split('\\');
      descpath.innerHTML = split[split.length -1];
    }

    if(settings.descriptions.descsavepath) {
      split = settings.descriptions.descsavepath.split('\\');
      descsavepath.innerHTML = split[split.length -1];
    }
    imgweight.value = settings.imageweight;
    setStylize2.value = settings.stylize;
    stylizeValue2.innerHTML = settings.stylize.toString();
    setChaos2.value = settings.chaos;
    chaosValue2.innerHTML = settings.chaos.toString();
    setBlendAspectRatio.value = settings.blendaspect;
    setAspectRatio.value = settings.aspect
    totaltime.innerHTML = ((settings.loops * settings.interval) / 60).toFixed(1);
    descPrompts.checked = settings.descriptions.saveprompts;
    descKeywords.checked = settings.descriptions.savekeywords;
    descPhrases.checked = settings.descriptions.savephrases;
    descArtists.checked = settings.descriptions.saveartists;
    descWeights.checked = settings.descriptions.saveweights;
    saveGeneration.checked = settings.promptgen.saveGeneration;
    savePermutation.checked = settings.promptgen.savePermutation;
    descInterval.value = settings.descriptions.interval;
    if (settings.mode === 1) //prompts
    {
      setBlendcontainer.style.display = "none";
      setPromptcontainer.style.display = "flex";
      setDescribecontainer.style.display = "none";
      setPromptMode.checked = true;
      setBlendMode.checked = false;
      setDescribeMode.checked = false;
    }
    else if (settings.mode === 2) //blend
    {
      setBlendcontainer.style.display = "flex";
      setPromptcontainer.style.display = "none";
      setDescribecontainer.style.display = "none";
      setPromptMode.checked = false;
      setBlendMode.checked = true;
      setDescribeMode.checked = false;
    }
    else if (settings.mode === 3) //describe
    {
      setBlendcontainer.style.display = "none";
      setPromptcontainer.style.display = "none";
      setDescribecontainer.style.display = "flex";
      setPromptMode.checked = false;
      setBlendMode.checked = false;
      setDescribeMode.checked = true;
    }
    settings.promptgen.files.forEach(f => {
      AddListItem(f);
    });
    override.checked = settings.override;
    genCount.value = settings.promptgen.prompts;
    version.value = settings.version;
  }
  catch(err)
  {
    console.log(err)
  }
})

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