let mirrorFragment = "-mirror";
let mobileSuffix = "-mobile";
let properties = ["health", "mana", "dps", "dmg", "bar", "ms", "r", "res", "a"];
var select1 = document.getElementById("select-hero-1");
var select2 = document.getElementById("select-hero-2");
var jsonData;
var fab = document.getElementById("fab");
var filter1Value = 0;
var hero1lvl1 = document.getElementById("hero-1-level-1");
var hero1lvl2 = document.getElementById("hero-1-level-2");
var hero1lvl3 = document.getElementById("hero-1-level-3");
var hero1Filters = Array.of(hero1lvl1, hero1lvl2, hero1lvl3);
var filter2Value = 0;
var hero2lvl1 = document.getElementById("hero-2-level-1");
var hero2lvl2 = document.getElementById("hero-2-level-2");
var hero2lvl3 = document.getElementById("hero-2-level-3");
var hero2Filters = Array.of(hero2lvl1, hero2lvl2, hero2lvl3);
//var filtered = false;

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
    //hero1lvl1.addEventListener("click", UpdateFilter);
    //hero1lvl2.addEventListener("click", UpdateFilter);
    //hero1lvl3.addEventListener("click", UpdateFilter);
    hero1Filters.forEach(filter => filter.addEventListener("click", UpdateFilter1));
    hero2Filters.forEach(filter => filter.addEventListener("click", UpdateFilter2));
  }
};
xmlhttp.open("GET", "data/underlords.json", true);
xmlhttp.send();

function UpdateFilter1()
{
    if(this.classList.contains("selected-filter"))
    {
        this.classList.remove("selected-filter");
        Unfilter();
        filter1Value = 0;
    }
    else
    {
        this.classList.add("selected-filter");
        filter1Value = this.id.charAt(this.id.length-1);
    }
    hero1Filters.forEach(filter => RemoveHighlight(filter, this.id));
    if(filter1Value > 0 && filter2Value > 0)
    {
        Filter();
    }
}

function UpdateFilter2()
{
    if(this.classList.contains("selected-filter"))
    {
        this.classList.remove("selected-filter");
        Unfilter();
        filter2Value = 0;
    }
    else
    {
        this.classList.add("selected-filter");
        filter2Value = this.id.charAt(this.id.length-1);
    }
    hero2Filters.forEach(filter => RemoveHighlight(filter, this.id));
    if(filter1Value > 0 && filter2Value > 0)
    {
        Filter();
    }
}

function Filter()
{
    properties.forEach(property => RemoveListenersFromBase(property));
    properties.forEach(property => RemoveListenersFromFilters(property));
    properties.forEach(property => AddListenersToFilters(property));
}

function Unfilter()
{
    filter1Value = 0;
    filter2Value = 0;
    hero1Filters.forEach(filter => RemoveHighlight(filter, 0));
    hero2Filters.forEach(filter => RemoveHighlight(filter, 0));
    properties.forEach(property => RemoveListenersFromFilters(property));
    properties.forEach(property => AddListenersToBase(property));
}

function RemoveHighlight(element, clickedId = 0)
{
    if(element.id != clickedId)
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
    //document.getElementById("hero-name-" + heroPosition).innerHTML = hero["name"];
    document.getElementById("hero-icon-" + heroPosition).innerHTML = '<img src="images/heroes/' + hero["icon"] + '" alt="' + hero["name"] + '"></img>';
    //document.getElementById("synergies-" + heroPosition).innerHTML = ShowSynergies(hero["synergies"]);
    SetSynergies(heroPosition, ShowSynergies(hero["synergies"]));
    //document.getElementById("hero-tier-" + heroPosition).innerHTML = "Tier " + hero["tier"];
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
        // <img src="images/synergies/Rogue.png" alt="Rogue">
        output += '<img src="images/synergies/' + synergies[i] + '.png" alt="' + synergies[i] + '">';
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
    event.target.style.outline = "4px solid green";

    var elementId = event.srcElement.id;
    var mirrorId = GetFilterMirrorId(elementId);
    mirrorElement = document.getElementById(mirrorId);
    mirrorElement.style.outline = "3px solid green";
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
    // element1Id = baseName + "-" + filter1Value;
    // element1 = document.getElementById(element1Id);
    // element1.removeEventListener("mouseover", ChangeFilterOutline, false);
    // element1.removeEventListener("mouseout", ResetFilterOutline, false);

    // element2Id = baseName + "-" + filter2Value + mirrorFragment;
    // element2 = document.getElementById(element2Id);
    // element2.removeEventListener("mouseover", ChangeFilterOutline, false);
    // element2.removeEventListener("mouseout", ResetFilterOutline, false);
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
    event.target.style.outline = "4px solid green";

    var elementId = event.srcElement.id;
    var mirrorId = GetMirrorId(elementId);
    mirrorElement = document.getElementById(mirrorId);
    mirrorElement.style.outline = "3px solid green";
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