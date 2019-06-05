var size_options_dict = {"klein":"bis 120 Liter", "mittel":"240 Liter", "gross":"770 bis 1100 Liter"};
var size_options = ["bis 120 Liter", "240 Liter", "770 bis 1100 Liter"];
var intervall_options = ["1 Mal die Woche", "2 Mal die Woche", "5 Mal im Jahr"];
var tonnenArten = ["Biotonne", "Restmülltonne", "Mekam", "Wertstoff"];
var expandoSemaphor = false;
var numberOfToggleButtons = 1;
var numberOfBinMenus = 1;
var regionBaden = ["2500", "2340"];
var regionNeustadt = ["2604", "2700", "2751", "2752", "7201", "2620", "7000", "7051", "7210"];
var region = "baden";

var priceList = new Object();
priceList.baden = {	"einmalpacket":["20,50", "22,70", "42,00", "22,70"],
					"zweimalpacket": ["20,50", "22,70", "42,00", "22,70"],
					"quartalspacket": ["6,50", "7,00", "29,00", "7,70"],
					"2monatspacket": ["6,10", "6,70", "28,80", "7,20"],
					"sommerwinterpacket": ["5,40", "5,70", "25,30", "6,60"],
					"standardpacket": ["4,80", "5,20", "22,10", "5,30"],
					"sommerpacket": ["4,80", "5,20", "22,10", "5,30"],
					"optimalpacket": ["3,99", "4,90", "21,00", "5,00"]
				};
window.onload = function(){
	console.log("window loaded");
	areaSelection(); 
	
}
window.onresize = function(){
	console.log("resizing window");
	var schedules = document.getElementsByClassName("toggleSchedule");
	for (var i = 0; i < schedules.length; i++) {
        resizeToggleSchedule(schedules[i]);
    }
	
}
function resizeToggleSchedule(schedule){
	console.log("height: " + schedule.style.height);
	if(hasClass(schedule, "expanded")){
		schedule.style.height = schedule.childNodes[0].offsetHeight;
	}else{
		schedule.style.height = null;
	}
}
function numberInputOnly(){
	return event.charCode >= 48 && event.charCode <= 57; 
}
function areaSelection(){
	var areaDiv = document.createElement("DIV");
	var areaInput = document.createElement("INPUT");
	var areaBtn = document.createElement("BUTTON");
	areaInput.addEventListener("keyup", event => {
		if(event.key !== "Enter") return;
		areaBtn.click();
	});
	areaInput.placeholder = "Postleitzahl eingeben";
	areaInput.setAttribute("id", "areaInput");

	areaInput.addEventListener("keypress", (event) => {
		return event.charCode >= 48 && event.charCode <= 57;
	});
	

	areaBtn.innerHTML = "Weiter";
	areaBtn.onclick = function(){
		var input = document.getElementById("areaInput");
		var plz = input.value;
		if(!regionNeustadt.includes(plz) && !regionBaden.includes(plz)){
			alert("Postleitzahl falsch");
			return false;
		}
		if(regionNeustadt.includes(plz)){
			region = "neustadt";	
		} else if (regionBaden.includes(plz)){
			region = "baden";
		}
		areaDiv.remove();
		addBin();
		document.getElementById("personalInfoForm").removeAttribute("hidden");
		showTab(currentTab); // Display the crurrent tab
	}
	areaDiv.appendChild(areaInput);
	areaDiv.appendChild(areaBtn);
	document.body.appendChild(areaDiv);
}

function toggleFunction(element){
	var nodeListMenu = element.parentNode.childNodes;
	for(var i=0; i<nodeListMenu.length; i++){
		if(hasClass(nodeListMenu[i], "toggleSchedule")){
			var schedule = nodeListMenu[i];
		}
	}
	toggleHandler(schedule);
	resizeToggleSchedule(schedule);
}

function packageSelected(el){
	var toggleBtn = el.parentNode.parentNode.parentNode.getElementsByClassName("toggleButton")[0];
	var newToggleText = el.getElementsByClassName("schedule-item-title")[0].innerHTML;
	toggleBtn.innerHTML = newToggleText;
	toggleFunction(el.parentNode.parentNode, "expanded");
}


function tonneSelected(tonnentype){
	var option = document.getElementsByClassName("tonnenmenu")[0];
	var hasBeenChanged = tonnentype.getAttribute("hasbeenchanged");
	if (hasBeenChanged == "false"){

		var size = document.createElement("SELECT");
		size.setAttribute("class","tonneninput");
		for (var i=0; i<size_options.length; i++){
			var opt = document.createElement("option");
			opt.setAttribute("value", size_options[i]);
			opt.setAttribute("text", size_options[i]);
			opt.text = size_options[i];
		    size.appendChild(opt);
		}

		var intervall = document.createElement("INPUT");
		intervall.setAttribute("class","tonneninput");
		intervall.setAttribute("placeholder", "Intervall");

		var number = document.createElement("INPUT");
		number.setAttribute("class","tonneninput");
		number.setAttribute("placeholder", "Anzahl der Tonne/n");

		option.appendChild(size);
		option.appendChild(number);
		option.appendChild(intervall);

		tonnentype.setAttribute("hasbeenchanged", "True");
		document.body.appendChild(option);
	}
}


function toggleHandler(el){
	expandoSemaphor = true;
	toggle(el, "expanded");
	expandoSemaphor = false;
	return;
}

function subBin(btn){
	btn.parentNode.remove();
}
function addBin(el){




	var numberOfBinMenus = document.getElementsByClassName("bintypeselect").length;
	console.log("numberofbins: " + numberOfBinMenus);
	if (numberOfBinMenus >= 4) return;

	var dynamicFormContainer = document.getElementsByClassName("dynamicFormContainer")[0];
	console.log("dynformcont: " +dynamicFormContainer);
	var binTypeUsed = document.getElementsByClassName("binTypeSelect");
	var binTypeUsedArray = [];
	var binTypeOption = [];

	for(var i=0; i < binTypeUsed.length; i++){
		binTypeUsedArray.push(binTypeUsed[i].value);
	}

	var binSelectionDiv = document.createElement("DIV");
	binSelectionDiv.setAttribute("class", "binSelection");
	var addBtn = document.createElement("BUTTON");
	var toolTipSpan = document.createElement('SPAN');
	addBtn.setAttribute("class", "addBinBtn");
	if (numberOfBinMenus == 0){
		toolTipSpan.innerHTML = "Weitere Tonnen(n) hinzufügen";
		var icon = document.createElement("i");
		icon.setAttribute("class", "fa fa-plus");
		addBtn.appendChild(icon);
		addBtn.onclick = function(){
			this.blur();
			addBin();
		}
	}else{
		addBtn.setAttribute("class", "addBinBtn");
		var icon = document.createElement("i");
		icon.setAttribute("class", "fa fa-minus");
		addBtn.appendChild(icon);
		toolTipSpan.innerHTML = "Tonne enternen";
		addBtn.onclick = function(){
			this.blur();
			subBin(addBtn);
		}
	}
	
	addBtn.appendChild(toolTipSpan);
	toolTipSpan.setAttribute('class', 'addBtnTooltip');		
	binSelectionDiv.appendChild(addBtn);

	var binTypeSelect = document.createElement("SELECT");
	binTypeSelect.onchange = function(){
		console.log(binTypeSelect.options[binTypeSelect.selectedIndex].value);
		if(binTypeSelect.options[binTypeSelect.selectedIndex].value == "Mekam"){
			binSizeSelect.selectedIndex = 4;
			binSizeSelect.disabled = true;
			var priceTags = this.parentNode.getElementsByClassName("schedule-item-price");
			var bsValue = binSizeSelect.options[binSizeSelect.selectedIndex].value;
			updatePrice(priceTags, bsValue);
			console.log(binSizeSelect);
		} else{
			var schedDiv = this.parentNode.getElementsByClassName("toggleSchedule")[0];
			console.log("cl: " + schedDiv.classList);
			
			if (hasClass(schedDiv, "expanded") && binSizeSelect.selectedIndex == 4) {
				console.log("schedule div should unexpand now pls");
				toggleHandler(schedDiv);
			}else{
				console.log("not expanded apparently");
			}
			binSizeSelect.selectedIndex = 0;
			binSizeSelect.disabled = false;
		}


		
	}
	binTypeSelect.setAttribute("class", "bintypeselect");
	var defaultOption = document.createElement("OPTION");
	defaultOption.setAttribute("selected", true);
	defaultOption.setAttribute("disabled", true);
	defaultOption.text = "Tonnenart wählen";
	binTypeSelect.appendChild(defaultOption);
	for(var i=0; i < tonnenArten.length; i++){
		if (!binHasBeenUsed(binTypeUsedArray, tonnenArten[i])){
			var o1 = document.createElement("OPTION");
			o1.setAttribute("value", tonnenArten[i]);
			o1.text=tonnenArten[i];
			binTypeSelect.appendChild(o1);
		} else{
			console.log(tonnenArten[i] + " already used");
		}
	}

	binSelectionDiv.appendChild(binTypeSelect);
	var prevSibling = document.getElementsByClassName("personalInfoDiv");
	if (prevSibling.length > 1) {
		prevSibling = prevSibling[prevSibling.length-1];
	}else{
		prevSibling = prevSibling[0];
	}

	var binSizeSelect = document.createElement("SELECT");
	binSizeSelect.setAttribute("class", "binSizeSelect");
	binSizeSelect.style.visibility = "visible";

	binSizeSelect.onchange = function(){
		var priceTags = this.parentNode.getElementsByClassName("schedule-item-price");
		updatePrice(priceTags, binSizeSelect.options[binSizeSelect.selectedIndex].value);
	}
	var defaultOptionSize = document.createElement("OPTION");
	defaultOptionSize.setAttribute("selected", true);
	defaultOptionSize.setAttribute("disabled", true);
	defaultOptionSize.text = "Tonnengröße wählen";
	binSizeSelect.appendChild(defaultOptionSize);

	var optionSmall = document.createElement("OPTION");
	optionSmall.setAttribute("value", "small");
	optionSmall.text = "bis 120 Liter";
	binSizeSelect.appendChild(optionSmall);

	var optionMedium = document.createElement("OPTION");
	optionMedium.setAttribute("value", "medium");
	optionMedium.text = "240 Liter";
	binSizeSelect.appendChild(optionMedium);

	var optionLarge = document.createElement("OPTION");
	optionLarge.setAttribute("value", "large");
	optionLarge.text = "770 bis 1100 Liter";
	binSizeSelect.appendChild(optionLarge);


	/* testing invis options for mekam */
	var optionMekam = document.createElement("OPTION");
	optionMekam.setAttribute("value", "mekam");
	optionMekam.text = "Mekam";
	optionMekam.setAttribute("hidden", "true");
	binSizeSelect.appendChild(optionMekam);


	binSelectionDiv.append(binSizeSelect);
	
	var numberInput = document.createElement("INPUT");
	numberInput.setAttribute("class", "binNumberInput");
	numberInput.addEventListener("keypress", (event) => function() {
		return event.charCode >= 48 && event.charCode <= 57;
	});
	numberInput.setAttribute("type", "number");
	numberInput.placeholder = "Anzahl";
	binSelectionDiv.appendChild(numberInput);
	
	var scheduleBtn = document.createElement("BUTTON");
	scheduleBtn.setAttribute("class", "toggleButton");
	scheduleBtn.innerHTML = "Reinigungspaket wählen";

	scheduleBtn.onclick = function(){
		var e = binSizeSelect;
		var binSize = e.options[e.selectedIndex].value;
		if (!["small", "medium", "large", "mekam"].includes(binSize)){
			alert("Bitte wählen Sie zuerst eine Tonnengröße aus");
			return;
		}
		var priceTags = this.parentNode.getElementsByClassName("schedule-item-price");
		updatePrice(priceTags, binSize);
		/*
		var rect = scheduleBtn.getBoundingClientRect();
		window.scrollTo(rect.x, rect.y);
		*/
		toggleFunction(this);
	}
	binSelectionDiv.appendChild(scheduleBtn);

	document.body.insertBefore(binSelectionDiv, prevSibling);
	numberOfBinMenus++;
	var scheduleDiv = createScheduleDiv();
	binSelectionDiv.appendChild(scheduleDiv);
	dynamicFormContainer.appendChild(binSelectionDiv);
}


function createScheduleDiv(){
	var toggleDiv = document.createElement("DIV");
	toggleDiv.setAttribute("class", "toggleSchedule");
	var container = document.createElement("DIV");
	container.setAttribute("class", "schedule-container");

	/* first packet */
	var packetDiv1 = document.createElement("DIV");
	var title1 = document.createElement("P");
	title1.setAttribute("class", "schedule-item-title");
	title1.innerHTML = "Einmalwäsche";
	var desc1 = document.createElement("P");
	desc1.innerHTML = "Eine einmalige Wäsche, die Ihre Tonne blitz blank macht!";
	desc1.setAttribute("class", "schedule-item-desc");
	var price1 = document.createElement("P");
	price1.innerHTML = "99,99€";
	price1.setAttribute("class", "schedule-item-price");
	packetDiv1.setAttribute("class", "packet");
	packetDiv1.setAttribute("id", "einmalpacket");
	packetDiv1.setAttribute("onclick", "packageSelected(this)");
	
	var imgContainer1 = document.createElement("DIV");
	var img1 = document.createElement("IMG");
	img1.setAttribute("class", "schedule-image");
	img1.setAttribute("src", "./stuff/number-1.svg");
	imgContainer1.setAttribute("class", "schedule-image-container");
	imgContainer1.appendChild(img1);
	packetDiv1.appendChild(imgContainer1);
	packetDiv1.appendChild(desc1);
	packetDiv1.appendChild(title1);
	packetDiv1.appendChild(price1);
	container.appendChild(packetDiv1);


	/* second packet */
	var packetDiv2 = document.createElement("DIV");
	var title2 = document.createElement("P");
	title2.setAttribute("class", "schedule-item-title");
	title2.innerHTML = "Zweimalwäsche";
	var desc2 = document.createElement("P");
	desc2.innerHTML = "Suchen Sie sich Zwei Monate aus, in denen wir Ihnen die Tonne putzen";
	desc2.setAttribute("class" , "schedule-item-desc");
	var price2 = document.createElement("P");
	price2.innerHTML = "88,88€";
	price2.setAttribute("class", "schedule-item-price");
	packetDiv2.setAttribute("class", "packet");
	packetDiv2.setAttribute("id", "zweimalpacket");
	packetDiv2.setAttribute("onclick", "packageSelected(this)");

	var imgContainer2 = document.createElement("DIV");
	var img2 = document.createElement("IMG");
	img2.setAttribute("src", "./stuff/number-2.svg");
	img2.setAttribute("class", "schedule-image");
	imgContainer2.setAttribute("class", "schedule-image-container");
	imgContainer2.appendChild(img2);
	packetDiv2.appendChild(imgContainer2);
	packetDiv2.appendChild(desc2);
	packetDiv2.appendChild(title2);
	packetDiv2.appendChild(price2);
	container.appendChild(packetDiv2);


	/* third packet */
	var packetDiv3 = document.createElement("DIV");
	var title3 = document.createElement("P");
	title3.setAttribute("class", "schedule-item-title");
	title3.innerHTML = "Quartalspaket";
	var desc3 = document.createElement("P");
	desc3.innerHTML = "Sichern Sie sich eine saubere Tonne für das ganze Jahr, die Reinigung erfolgt 1 Mal im Quartal";
	desc3.setAttribute("class", "schedule-item-desc");
	var price3 = document.createElement("P");
	price3.innerHTML = "77,77€";
	price3.setAttribute("class", "schedule-item-price");
	packetDiv3.setAttribute("class", "packet");
	packetDiv3.setAttribute("id", "quartalspacket");
	packetDiv3.setAttribute("onclick", "packageSelected(this)");

	var imgContainer3 = document.createElement("DIV");
	var img3 = document.createElement("IMG");
	img3.setAttribute("src", "./stuff/quarter.svg");
	img3.setAttribute("class", "schedule-image");
	imgContainer3.setAttribute("class", "schedule-image-container");
	imgContainer3.appendChild(img3);
	packetDiv3.appendChild(imgContainer3);
	packetDiv3.appendChild(desc3);
	packetDiv3.appendChild(title3);
	packetDiv3.appendChild(price3);
	container.appendChild(packetDiv3);


	/* fourth packet */
	var packetDiv4 = document.createElement("DIV");
	var title4 = document.createElement("P");
	title4.setAttribute("class", "schedule-item-title");
	title4.innerHTML = "Zweimonatspaket";
	var desc4 = document.createElement("P");
	desc4.innerHTML = "Lassen Sie ihre Tonne jedes zweite Monat reinigen";
	desc4.setAttribute("class", "schedule-item-desc");
	var price4 = document.createElement("P");
	price4.innerHTML = "66,66€";
	price4.setAttribute("class", "schedule-item-price");

	packetDiv4.setAttribute("class", "packet");
	packetDiv4.setAttribute("id", "2monatspacket");
	packetDiv4.setAttribute("onclick", "packageSelected(this)");

	var imgContainer4 = document.createElement("DIV");
	var img4 = document.createElement("IMG");
	img4.setAttribute("src", "./stuff/weekly-calendar.png");
	img4.setAttribute("class", "schedule-image");
	imgContainer4.setAttribute("class", "schedule-image-container");
	imgContainer4.appendChild(img4);
	packetDiv4.appendChild(imgContainer4);
	packetDiv4.appendChild(desc4);
	packetDiv4.appendChild(title4);
	packetDiv4.appendChild(price4);
	container.appendChild(packetDiv4);


	/* fith packet */
	var packetDiv5 = document.createElement("DIV");
	var title5 = document.createElement("P");
	title5.setAttribute("class", "schedule-item-title");
	title5.innerHTML = "Sommerwinterpaket";
	var desc5 = document.createElement("P");
	desc5.setAttribute("class", "schedule-item-desc");
	desc5.innerHTML = "8 Mal im Jahr: von April bis Oktober jede 4te Woche, im Winter 1 Mal";
	var price5 = document.createElement("P");
	price5.setAttribute("class", "schedule-item-price");
	price5.innerHTML = "55,55€";
	
	packetDiv5.setAttribute("class", "packet");
	packetDiv5.setAttribute("id", "sommerwinterpacket");
	packetDiv5.setAttribute("onclick", "packageSelected(this)");
	
	var imgContainer5 = document.createElement("DIV");
	var img5 = document.createElement("IMG");
	img5.setAttribute("class", "schedule-image");
	img5.setAttribute("src", "./stuff/snowman.svg");
	imgContainer5.setAttribute("class", "schedule-image-container");
	imgContainer5.appendChild(img5);
	packetDiv5.appendChild(imgContainer5);
	packetDiv5.appendChild(desc5);
	packetDiv5.appendChild(title5);
	packetDiv5.appendChild(price5);
	container.appendChild(packetDiv5);


	/* sixth packet */
	var packetDiv6 = document.createElement("DIV");
	var title6 = document.createElement("P");
	title6.setAttribute("class", "schedule-item-title");
	title6.innerHTML = "Standardpaket";
	var desc6 = document.createElement("P");
	desc6.setAttribute("class", "schedule-item-desc");
	desc6.innerHTML = "Wer seinen Standard verliert, verliert seine Seele <br> -Goehte";
	var price6 = document.createElement("P");
	price6.setAttribute("class", "schedule-item-price");
	price6.innerHTML = "44,44€";

	packetDiv6.setAttribute("class", "packet");
	packetDiv6.setAttribute("id", "standardpacket");
	packetDiv6.setAttribute("onclick", "packageSelected(this)");

	var imgContainer6 = document.createElement("DIV");
	var img6 = document.createElement("IMG");
	img6.setAttribute("src", "./stuff/handshake.svg");
	img6.setAttribute("class", "schedule-image");
	imgContainer6.setAttribute("class", "schedule-image-container");
	imgContainer6.appendChild(img6);
	packetDiv6.appendChild(imgContainer6);
	packetDiv6.appendChild(desc6);
	packetDiv6.appendChild(title6);
	packetDiv6.appendChild(price6);
	container.appendChild(packetDiv6);

	
	/* seventh packet */
	var packetDiv7 = document.createElement("DIV");
	var title7 = document.createElement("P");
	title7.setAttribute("class", "schedule-item-title");
	title7.innerHTML = "Sommerpaket";
	var desc7 = document.createElement("P");
	desc7.setAttribute("class", "schedule-item-desc");
	desc7.innerHTML = "Sommer, Sonne, Tonne rein.";
	var price7 = document.createElement("P");
	price7.setAttribute("class", "schedule-item-price");
	price7.innerHTML = "33,33€";

	packetDiv7.setAttribute("class", "packet");
	packetDiv7.setAttribute("id", "sommerpacket");
	packetDiv7.setAttribute("onclick", "packageSelected(this)");
	
	var imgContainer7 = document.createElement("DIV");
	var img7 = document.createElement("IMG");
	img7.setAttribute("src", "./stuff/sun.svg");
	img7.setAttribute("class", "schedule-image");
	imgContainer7.setAttribute("class", "schedule-image-container");
	imgContainer7.appendChild(img7);
	packetDiv7.appendChild(imgContainer7);
	packetDiv7.appendChild(desc7);
	packetDiv7.appendChild(title7);
	packetDiv7.appendChild(price7);
	container.appendChild(packetDiv7);


	/* eigth packet */
	var packetDiv8 = document.createElement("DIV");
	var title8 = document.createElement("P");
	title8.setAttribute("class", "schedule-item-title");
	title8.innerHTML = "Optimalpaket";
	var desc8 = document.createElement("P");
	desc8.innerHTML = "Das beste wo gibt - schlechthin! Also bitte...";
	desc8.setAttribute("class", "schedule-item-desc");
	var price8 = document.createElement("P");
	price8.setAttribute("class", "schedule-item-price");
	price8.innerHTML = "22,22€";

	packetDiv8.setAttribute("class", "packet");
	packetDiv8.setAttribute("id", "optimalpacket");
	packetDiv8.setAttribute("onclick", "packageSelected(this)");

	var imgContainer8 = document.createElement("DIV");
	var img8 = document.createElement("IMG");
	img8.setAttribute("src", "./stuff/optimization.png");
	img8.setAttribute("class", "schedule-image");
	imgContainer8.setAttribute("class", "schedule-image-container");
	imgContainer8.appendChild(img8);
	packetDiv8.appendChild(desc8);
	packetDiv8.appendChild(title8);
	packetDiv8.appendChild(price8);
	packetDiv8.appendChild(imgContainer8);
	container.appendChild(packetDiv8);
	

	/* cleanup */
	toggleDiv.appendChild(container);
	return toggleDiv;
}


function binHasBeenUsed(used, bin){
	for(var i=0; i < used.length; i++){
		if (used[i] == bin) return true;
	}
	return false;
}

function updatePrice(pTags, binSize){
	console.log("updateing the prices now");
	switch(binSize){
		case "small":
			binSize = 0;
			break;
		case "medium":
			binSize = 1;
			break;
		case "large":
			binSize = 2;
			break;
		case "mekam":
			binSize = 3;
			break;
		default:
			binSize = -1;
			console.log("invalid bin size for price calculation");
			return;
	}
	for (var i = 0; i < pTags.length; i++) {
		var id = pTags[i].parentNode.id;
		if (region == "baden") {
			var newPrice = priceList.baden[id][binSize];
			pTags[i].innerHTML = newPrice + " €";
		}
	}
}

function foo(form){
		/* console.log(binTypeUsed[0].options[binTypeUsed[0].selectedIndex]); */
	form = document.forms["personalInfoForm"];
	var binMenus = document.getElementsByClassName("binselection");
	var rawBins = "";
	/* supports only 1 bin menu */
	for (var i = binMenus.length - 1; i >= 0; i--) {
		var menu = binMenus[i].childNodes;
		var type = binMenus[i].getElementsByClassName("bintypeselect");
		type = type[0].options[type[0].selectedIndex].value;
		var size = binMenus[i].getElementsByClassName("binSizeSelect");
		size = size[0].options[size[0].selectedIndex].value;
		var number = binMenus[i].getElementsByClassName("binNumberInput")[0].value;
		var schedule = binMenus[i].getElementsByClassName("toggleButton")[0].innerHTML;
		var binsInput = document.createElement("INPUT");
		binsInput.setAttribute("name", "hiddenbins" + i);
		binsInput.style.visibility  = "hidden";
		rawBins += type + " " + size +  " " + number + " " + schedule + " ";
		binsInput.value = rawBins;
		form.appendChild(binsInput);
		rawBins = "";
	}
}

/* animation stuff */
function hasClass(el, className) {
  return el.classList ? el.classList.contains(className) : new RegExp('\\b' + className + '\\b').test(el.className);
}

function addClass(el, className) {
  if (el.classList) el.classList.add(className);
  else if (!hasClass(el, className)) el.className += ' ' + className;
}

function removeClass(el, className) {
  if (el.classList) el.classList.remove(className);
  else el.className = el.className.replace(new RegExp('\\b' + className + '\\b', 'g'), '');
}

function toggle(el, className) {
	hasClass(el, className) ? removeClass(el, className) : addClass(el, className);
}



/* MULTI STEP FORM */

var currentTab = 0; // Current tab is set to be the first tab (0)


function showTab(n) {
  // This function will display the specified tab of the form...
  var x = document.getElementsByClassName("formTab");
  x[n].style.display = "block";
  //... and fix the Previous/Next buttons:
  if (n == 0) {
    document.getElementById("prevBtn").style.display = "none";
  } else {
    document.getElementById("prevBtn").style.display = "inline";
  }
  if (n == (x.length - 1)) {
    document.getElementById("nextBtn").innerHTML = "Abschicken";
  } else {
    document.getElementById("nextBtn").innerHTML = "Weiter";
  }
  //... and run a function that will display the correct step indicator:
  fixStepIndicator(n)
}

function nextPrev(n) {
  // This function will figure out which tab to display
  var x = document.getElementsByClassName("formTab");
  // Exit the function if any field in the current tab is invalid:
  if (n == 1 && !validateForm()) return false;
  // Hide the current tab:
  x[currentTab].style.display = "none";
  // Increase or decrease the current tab by 1:
  currentTab = currentTab + n;
  // if you have reached the end of the form...
  if (currentTab >= x.length) {
    // ... the form gets submitted:
    document.getElementById("regForm").submit();
    return false;
  }
  // Otherwise, display the correct tab:
  showTab(currentTab);
}

function validateForm() {
  // This function deals with validation of the form fields
  var x, y, i, valid = true;
  x = document.getElementsByClassName("formTab");
  y = x[currentTab].getElementsByTagName("input");
  // A loop that checks every input field in the current tab:
  for (i = 0; i < y.length; i++) {
    // If a field is empty...
    if (y[i].value == "") {
      // add an "invalid" class to the field:
      y[i].className += " invalid";
      // and set the current valid status to false
      valid = false;
    }
  }
  // If the valid status is true, mark the step as finished and valid:
  if (valid) {
    document.getElementsByClassName("step")[currentTab].className += " finish";
  }
  return valid; // return the valid status
}

function fixStepIndicator(n) {
  // This function removes the "active" class of all steps...
  var i, x = document.getElementsByClassName("step");
  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  //... and adds the "active" class on the current step:
  x[n].className += " active";
}