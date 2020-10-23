let mirrorFragment = "-mirror";
let mobileSuffix = "-mobile";
let properties = ["health", "mana", "dps", "dmg", "bar", "ms", "r", "res", "a"];
var mainOutline = "4px solid #0980a4";
var secondaryOutline = "3px solid #0980a4";
var select1 = document.getElementById("select-hero-1");
var select2 = document.getElementById("select-hero-2");
var jsonData;
var fab = document.getElementById("fab");
var filter1Value = 0;
var hero1lvl1 = document.getElementById("hero-1-level-1");
var hero1lvl2 = document.getElementById("hero-1-level-2");
var hero1lvl3 = document.getElementById("hero-1-level-3");
var hero1lvl1m = document.getElementById("hero-1-level-1-mobile");
var hero1lvl2m = document.getElementById("hero-1-level-2-mobile");
var hero1lvl3m = document.getElementById("hero-1-level-3-mobile");
var hero1Filters = Array.of(hero1lvl1, hero1lvl2, hero1lvl3, hero1lvl1m, hero1lvl2m, hero1lvl3m);
var filter2Value = 0;
var hero2lvl1 = document.getElementById("hero-2-level-1");
var hero2lvl2 = document.getElementById("hero-2-level-2");
var hero2lvl3 = document.getElementById("hero-2-level-3");
var hero2lvl1m = document.getElementById("hero-2-level-1-mobile");
var hero2lvl2m = document.getElementById("hero-2-level-2-mobile");
var hero2lvl3m = document.getElementById("hero-2-level-3-mobile");
var hero2Filters = Array.of(hero2lvl1, hero2lvl2, hero2lvl3, hero2lvl1m, hero2lvl2m, hero2lvl3m);

fab.addEventListener("click", () => { window.scrollTo(0, 0); });

properties.forEach(property => AddListenersToBase(property));

var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    jsonData = JSON.parse(this.responseText);
    InitializeDropdown(select1);
    InitializeDropdown(select2);
    select1.addEventListener("change", LoadNewHero1);
    select2.addEventListener("change", LoadNewHero2);
    ChooseRandomHero(select1);
    ChooseRandomHero(select2);
    hero1Filters.forEach(filter => filter.addEventListener("click", UpdateFilter1));
    hero2Filters.forEach(filter => filter.addEventListener("click", UpdateFilter2));
  }
};
xmlhttp.open("GET", "data/underlords.json", true);
xmlhttp.send();

function HideMobileHeaderElements()
{
    var elements = document.getElementsByClassName("to-hide");
    var i;
    for (i = 0; i < elements.length; i++) {
        elements[i].classList.add("hide");
    }
}

function ShowMobileHeaderElements()
{
    var elements = document.getElementsByClassName("to-hide");
    var i;
    for (i = 0; i < elements.length; i++) {
        elements[i].classList.remove("hide");
    }
}

function HideMobileHeroData()
{
    var i;
    for(i = 1; i <= 3; i++)
    {
        if(i != filter1Value)
        {
            HideElement("hero-1-data", i);
        }
        else
        {
            ShowElement("hero-1-data", i);
        }
        if(i != filter2Value)
        {
            HideElement("hero-2-data", i);
        }
        else
        {
            ShowElement("hero-2-data", i);
        }
    }
}

function ShowMobileHeroData()
{
    var i;
    for(i = 1; i <= 3; i++)
    {
        ShowElement("hero-1-data", i);

        ShowElement("hero-2-data", i);
    }
}

function HideElement(property, index)
{
    var element = document.getElementById(property + "-" + index + mobileSuffix);
    
    element.classList.add("hide");
}

function ShowElement(property, index)
{
    var element = document.getElementById(property + "-" + index + mobileSuffix);
    element.classList.remove("hide");
}

function UpdateFilter1()
{
    var element;
    var elementId;
    var mobileElement;
    
    if(this.id.indexOf(mobileSuffix) != -1)
    {
        elementId = this.id.replace(mobileSuffix, "");
        element = document.getElementById(elementId);
        mobileElement = this;
    }
    else
    {
        element = this;
        elementId = this.id;
        mobileElement = document.getElementById(elementId + mobileSuffix);;
    }

    var filterValue = elementId.charAt(elementId.length-1);
    if(element.classList.contains("selected-filter"))
    {
        element.classList.remove("selected-filter");
        mobileElement.classList.remove("selected-filter");
        Unfilter();
        filter1Value = 0;
    }
    else
    {
        element.classList.add("selected-filter");
        mobileElement.classList.add("selected-filter");
        filter1Value = filterValue;
    }
    hero1Filters.forEach(filter => RemoveHighlight(filter, filterValue));
    if(filter1Value > 0 && filter2Value > 0)
    {
        Filter();
    }
}

function UpdateFilter2()
{
    var element;
    var elementId;
    var mobileElement;
    
    if(this.id.indexOf(mobileSuffix) != -1)
    {
        elementId = this.id.replace(mobileSuffix, "");
        element = document.getElementById(elementId);
        mobileElement = this;
    }
    else
    {
        element = this;
        elementId = this.id;
        mobileElement = document.getElementById(elementId + mobileSuffix);;
    }

    var filterValue = elementId.charAt(elementId.length-1);
    if(element.classList.contains("selected-filter"))
    {
        element.classList.remove("selected-filter");
        mobileElement.classList.remove("selected-filter");
        Unfilter();
        filter2Value = 0;
    }
    else
    {
        element.classList.add("selected-filter");
        mobileElement.classList.add("selected-filter");
        filter2Value = filterValue;
    }
    hero2Filters.forEach(filter => RemoveHighlight(filter, filterValue));
    if(filter1Value > 0 && filter2Value > 0)
    {
        Filter();
    }
}

function Filter()
{
    HideMobileHeaderElements();
    HideMobileHeroData();
    properties.forEach(property => RemoveListenersFromBase(property));
    properties.forEach(property => RemoveListenersFromFilters(property));
    properties.forEach(property => AddListenersToFilters(property));
}

function Unfilter()
{
    filter1Value = 0;
    filter2Value = 0;
    ShowMobileHeaderElements();
    ShowMobileHeroData();
    hero1Filters.forEach(filter => RemoveHighlight(filter, 0));
    hero2Filters.forEach(filter => RemoveHighlight(filter, 0));
    properties.forEach(property => RemoveListenersFromFilters(property));
    properties.forEach(property => AddListenersToBase(property));
}

function RemoveHighlight(element, filterValue = 0)
{
    var baseElementId = element.id.replace(mobileSuffix, "");
    var elementValue = baseElementId.charAt(baseElementId.length-1);
    if(elementValue != filterValue)
    {
        element.classList.remove("selected-filter");
    }
}

function ChooseRandomHero(select)
{
    select.selectedIndex = Math.floor(Math.random() * select.length);
    var event = new Event("change");
    select.dispatchEvent(event);
}

function InitializeDropdown(select)
{
    var options = [];
    jsonData.heroes.forEach(hero => options.push(hero.name));

    for(var i = 0; i < options.length; i++)
    {
        var opt = options[i];

        var el = document.createElement("option");
        el.text = opt;
        el.value = opt;

        select.add(el);
    }
}

function LoadNewHero1()
{
    LoadHeroData(this.selectedIndex);
}

function LoadNewHero2()
{
    LoadHeroData(this.selectedIndex, 2);
}

function LoadHeroData(heroIndex, heroPosition = 1)
{
    let hero = jsonData.heroes[heroIndex];
    document.getElementById("hero-icon-" + heroPosition).innerHTML = '<img src="images/heroes/' + hero["icon"] + '" alt="' + hero["name"] + '"></img>';
    SetSynergies(heroPosition, ShowSynergies(hero["synergies"]));
    SetTierValues(heroPosition, "Tier " + hero["tier"]);
    properties.forEach(property => LoadData(property, hero[property], heroPosition));
}

function SetTierValues(heroPosition, tierValue)
{
    document.getElementById("hero-tier-" + heroPosition).innerHTML = tierValue;
    document.getElementById("hero-tier-" + heroPosition + mobileSuffix).innerHTML = tierValue;
}

function SetSynergies(heroPosition, synergiesHTML)
{
    document.getElementById("synergies-" + heroPosition).innerHTML = synergiesHTML;
    document.getElementById("synergies-" + heroPosition + mobileSuffix).innerHTML = synergiesHTML;
}

function ShowSynergies(synergiesString)
{
    let output = "";
    let synergies = synergiesString.split(" ");
    for(var i = 0; i < synergies.length; i++)
    {
        output += '<img class="synergy" src="images/synergies/' + synergies[i] + '.png" alt="' + synergies[i] + '">';
    }
    return output;
}

function LoadData(dataLabel, datastring, heroPosition)
{
    let data = ExtractData(datastring);
    let suffix = "";
    if(heroPosition == 2)
    {
        suffix = mirrorFragment;
    }
    if(data.length == 1)
    {
        UpdateLabel(dataLabel + "-1" + suffix, data[0]);
        UpdateLabel(dataLabel + "-2" + suffix, data[0]);
        UpdateLabel(dataLabel + "-3" + suffix, data[0]);

        UpdateLabel(dataLabel + "-1" + suffix + mobileSuffix, data[0]);
        UpdateLabel(dataLabel + "-2" + suffix + mobileSuffix, data[0]);
        UpdateLabel(dataLabel + "-3" + suffix + mobileSuffix, data[0]);
    }
    else
    {
        UpdateLabel(dataLabel + "-1" + suffix, data[0]);
        UpdateLabel(dataLabel + "-2" + suffix, data[1]);
        UpdateLabel(dataLabel + "-3" + suffix, data[2]);

        UpdateLabel(dataLabel + "-1" + suffix + mobileSuffix, data[0]);
        UpdateLabel(dataLabel + "-2" + suffix + mobileSuffix, data[1]);
        UpdateLabel(dataLabel + "-3" + suffix + mobileSuffix, data[2]);
    }
}

function UpdateLabel(label, data)
{
    document.getElementById(label).innerHTML = data;
}

function ExtractData(dataString)
{
    if(dataString.indexOf("|") != -1)
    {
        return dataString.split("|");
    }
    else
    {
        return [dataString];
    }
}

function AddListenersToFilters(baseName)
{
    element1Id = baseName + "-" + filter1Value;
    element1 = document.getElementById(element1Id);
    element1.addEventListener("mouseover", ChangeFilterOutline, false);
    element1.addEventListener("mouseout", ResetFilterOutline, false);
    element1.classList.add("filter-background");

    element2Id = baseName + "-" + filter2Value + mirrorFragment;
    element2 = document.getElementById(element2Id);
    element2.addEventListener("mouseover", ChangeFilterOutline, false);
    element2.addEventListener("mouseout", ResetFilterOutline, false);
    element2.classList.add("filter-background");
}

function ChangeFilterOutline(event)
{
    event.target.style.outline = mainOutline;

    var elementId = event.srcElement.id;
    var mirrorId = GetFilterMirrorId(elementId);
    mirrorElement = document.getElementById(mirrorId);
    mirrorElement.style.outline = secondaryOutline;
}

function ResetFilterOutline(event)
{
    event.target.style.outline = "unset";

    var elementId = event.srcElement.id;
    var mirrorId = GetFilterMirrorId(elementId);
    mirrorElement = document.getElementById(mirrorId);
    mirrorElement.style.outline = "unset";
}

function GetFilterMirrorId(id)
{
    baseName = GetBaseName(id);
    if(id.indexOf(mirrorFragment) != -1)
    {
        return baseName + "-" + filter1Value;
    }
    else
    {
        return baseName + "-" + filter2Value + mirrorFragment;
    }
}

function GetBaseName(id)
{
    return id.slice(0, id.indexOf("-"));
}

function RemoveListenersFromFilters(baseName)
{
    RemoveFilterListeners(baseName + "-1");
    RemoveFilterListeners(baseName + "-2");
    RemoveFilterListeners(baseName + "-3");

    RemoveFilterListeners(baseName + "-1" + mirrorFragment);
    RemoveFilterListeners(baseName + "-2" + mirrorFragment);
    RemoveFilterListeners(baseName + "-3" + mirrorFragment);
}

function RemoveFilterListeners(elementId)
{
    element = document.getElementById(elementId);
    element.removeEventListener("mouseover", ChangeFilterOutline, false);
    element.removeEventListener("mouseout", ResetFilterOutline, false);
    element.classList.remove("filter-background");
}

function AddListenersToBase(baseName)
{
    AddListeners(baseName, "-1");
    AddListeners(baseName, "-2");
    AddListeners(baseName, "-3");

    AddListeners(baseName, "-1", mirrorFragment);
    AddListeners(baseName, "-2", mirrorFragment);
    AddListeners(baseName, "-3", mirrorFragment);
}

function AddListeners(baseName, number = "", mirror = "")
{
    elementId = baseName + number + mirror;
    element = document.getElementById(elementId);
    element.addEventListener("mouseover", ChangeOutline, false);
    element.addEventListener("mouseout", ResetOutline, false);
}

function RemoveListenersFromBase(baseName)
{
    RemoveListeners(baseName, "-1");
    RemoveListeners(baseName, "-2");
    RemoveListeners(baseName, "-3");

    RemoveListeners(baseName, "-1", mirrorFragment);
    RemoveListeners(baseName, "-2", mirrorFragment);
    RemoveListeners(baseName, "-3", mirrorFragment);
}

function RemoveListeners(baseName, number = "", mirror = "")
{
    elementId = baseName + number + mirror;
    element = document.getElementById(elementId);
    element.removeEventListener("mouseover", ChangeOutline, false);
    element.removeEventListener("mouseout", ResetOutline, false);
}

function ChangeOutline(event)
{
    event.target.style.outline = mainOutline;

    var elementId = event.srcElement.id;
    var mirrorId = GetMirrorId(elementId);
    mirrorElement = document.getElementById(mirrorId);
    mirrorElement.style.outline = secondaryOutline;
}

function ResetOutline(event)
{
    event.target.style.outline = "unset";

    var elementId = event.srcElement.id;
    var mirrorId = GetMirrorId(elementId);
    mirrorElement = document.getElementById(mirrorId);
    mirrorElement.style.outline = "unset";
}

function GetMirrorId(id)
{
    if(id.indexOf(mirrorFragment) != -1)
    {
        return id.replace(mirrorFragment, "");
    }
    else
    {
        return id + mirrorFragment;
    }
}