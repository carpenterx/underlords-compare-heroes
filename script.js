let mirrorFragment = "-mirror";
let mobileSuffix = "-mobile";
let properties = ["health", "mana", "dps", "dmg", "bar", "ms", "r", "res", "a"];
var select1 = document.getElementById("select-hero-1");
var select2 = document.getElementById("select-hero-2");
var jsonData;
var fab = document.getElementById("fab");

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
  }
};
xmlhttp.open("GET", "data/underlords.json", true);
xmlhttp.send();

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
    LoadHeroData(select1.selectedIndex);
}

function LoadNewHero2()
{
    LoadHeroData(select2.selectedIndex, 2);
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