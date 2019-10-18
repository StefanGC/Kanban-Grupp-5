var defaultCards = JSON.stringify([
  {"id": 1, "titel": "Issue 1", "text": "Skapa ett repo och bjuda in alla."},
  {"id": 2, "titel": "Issue 2", "text": "Skapa JSON fil med inloggning för alla användare."},
  {"id": 3, "titel": "Issue 3", "text": "Skapa index.html som inloggning sida."},
  {"id": 4, "titel": "Issue 4", "text": "Bygga script för inloggning."},
  {"id": 5, "titel": "Issue 5", "text": "Skapa sidan för tavlan."},
  {"id": 6, "titel": "Issue 6", "text": "Bygga script för tavlan."},
  {"id": 7, "titel": "Issue 7", "text": "Skapa styles för inloggning."},
  {"id": 8, "titel": "Issue 8", "text": "Skapa styles för tavlan."}
]);

var defaultLists = JSON.stringify([
  {"id": 1, "name": "To do"},
  {"id": 2, "name": "Doing"},
  {"id": 3, "name": "Test"},
  {"id": 4, "name": "Done"}
]);

var defaultConfiguration = JSON.stringify([  
  {"cardid": 3, "listid": 1},
  {"cardid": 4, "listid": 1},
  {"cardid": 5, "listid": 1},
  {"cardid": 6, "listid": 1},
  {"cardid": 7, "listid": 1},
  {"cardid": 8, "listid": 1},
  {"cardid": 1, "listid": 4},
  {"cardid": 2, "listid": 4}
]);

Array.prototype.insert = function (index, item) {
  this.splice(index, 0, item);
};

var dragSrcEl = null;
var prevEl = null;
var cardId = 0;

var user = sessionStorage.getItem("usersID");
var cards = [];
var lists = [];
var configuration = [];

//funktion som ritar tavlan
function makeLists() {
  
  if (localStorage.getItem(user) !== null) {
    cards = JSON.parse(localStorage.getItem("cards"));
    lists = JSON.parse(defaultLists);
    configuration = JSON.parse(localStorage.getItem(user));
  }
  else {
    if (localStorage.getItem("cards") !== null) {
      cards = JSON.parse(localStorage.getItem("cards"));
    }
    else {
      cards = JSON.parse(defaultCards);
    }
    lists = JSON.parse(defaultLists);
    configuration = JSON.parse(defaultConfiguration);
  }  

  cardId = cards[cards.length - 1].id;

  configuration.sort((a, b) => a.listid - b.listid);

  var html = "";
  
  for (var i = 0; i < lists.length; i++) {
    html += "<div id=\"" + lists[i].id + "\" class=\"list\">\n";
    html += "<h2>" + lists[i].name + "</h2>\n";

    for (var j = 0; j < configuration.length; j++){

      if (lists[i].id === configuration[j].listid) {
        var card = cards.find( ({ id }) => id === configuration[j].cardid);

        html += "<div id=\"c" + configuration[j].cardid + "\" class=\"card\" draggable=\"true\">\n";
        html += "<span onclick=\"removeCard(" + configuration[j].cardid + ")\" class=\"close\" title=\"Stäng\">&times;</span>\n";
        html += "<h6>" + card.titel + "</h6>\n";
        html += "<p>" + card.text + "</p>\n";
        html += "</div>\n";
      }
      
    }

    html += "<div id=\"i" + lists[i].id + "\" class=\"itemsList\"></div>\n";
    html += "<a id=\"a" + lists[i].id + "\" style=\"display: block;\" href=\"javascript:newCard('" + lists[i].id + "');\">+ Lägg till ett kort</a>\n";
    html += "</div>\n";
  }

  document.getElementById("board").insertAdjacentHTML('beforeend', html);
}

//drag and dropp block
function handleDragStart(e) {
  dragSrcEl = this;
  prevEl = this;

  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.outerHTML);

  this.classList.add('dragElem');
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }
  
  if (prevEl !== this) {
    prevEl = this
  }

  if (dragSrcEl !== this){
    this.classList.add('over');
  }

  e.dataTransfer.dropEffect = 'move';
  
  return false;
}

function handleDragEnter(e) {
  if (prevEl !== this) {
    prevEl.classList.remove('over');
  }
}

function handleDragLeave(e) {
  if (prevEl !== this) {
    prevEl.classList.remove('over');
  }  
}

function handleDrop(e) {
  if (dragSrcEl != this) {
    dragSrcEl.parentNode.removeChild(dragSrcEl);
    var dropHTML = e.dataTransfer.getData('text/html');
    this.insertAdjacentHTML('beforebegin', dropHTML);
    var dropElem = this.previousSibling;
    if (this.id.substring(0, 1) === "c") {
      changeCardPosition(Number(dropElem.id.substring(1)), Number(this.id.substring(1)), 0);
    }
    else {
      changeCardPosition(Number(dropElem.id.substring(1)), 0, Number(this.id.substring(1)));
    }
    addDnDHandlers(dropElem);
  }
  this.classList.remove('over');
  if (prevEl !== this) {
    prevEl.classList.remove('over');
  }
  return false;
}

function handleDragEnd(e) {
  this.classList.remove('over');
  this.classList.remove('dragElem');
  if (prevEl !== this) {
    prevEl.classList.remove('over');
  }
}

function addDnDHandlers(elem) {
  elem.addEventListener('dragstart', handleDragStart, false);
  elem.addEventListener('dragenter', handleDragEnter, false);
  elem.addEventListener('dragover', handleDragOver, false);
  elem.addEventListener('dragleave', handleDragLeave, false);
  elem.addEventListener('drop', handleDrop, false);
  elem.addEventListener('dragend', handleDragEnd, false);
}

function addDropHandlers(elem) {
  elem.addEventListener('dragenter', handleDragEnter, false);
  elem.addEventListener('dragover', handleDragOver, false);
  elem.addEventListener('dragleave', handleDragLeave, false);
  elem.addEventListener('drop', handleDrop, false);
  elem.addEventListener('dragend', handleDragEnd, false);
}

var divCards = document.querySelectorAll('.list .card');
[].forEach.call(divCards, addDnDHandlers);

var divList = document.querySelectorAll('.itemsList');
[].forEach.call(divList, addDropHandlers);

//funktion som skapar formen där användaren skulle kunna skapa ett nytt kort
function newCard(id) {
  document.getElementById('a' + id).style.display = "none";

  var html = "";

  html += "<form id=\"f" + id + "\" class=\"p-2\">\n";
  html += "<div class=\"form-group\">\n";
  html += "<label for=\"r" + id + "\">Rubrik</label>\n";
  html += "<input class=\"form-control\" id=\"r" + id + "\" required>\n";
  html += "</div>\n";
  html += "<div class=\"form-group\">\n";
  html += "<label for=\"t" + id + "\">Text</label>\n";
  html += "<textarea class=\"form-control\" id=\"t" + id + "\" rows=\"3\" required></textarea>\n";
  html += "</div>\n";
  html += "<button type=\"button\" class=\"btn btn-primary btn-sm\" onclick=\"addNewCard(\'" + id + "\')\">Lägg till</button>\n";
  html += "<button type=\"button\" class=\"btn btn-secondary btn-sm\" onclick=\"closeNewCard(\'" + id + "\')\">Stäng</button>\n";
  html += "</form>\n";
  
  document.getElementById('a' + id).insertAdjacentHTML('afterend', html);
}

//funktion som stänger formen där man skapar ett ny kort på tavlan
function closeNewCard(id) {
  document.getElementById('f' + id).remove();
  document.getElementById('a' + id).style.display = "block";
}

//funktion som skapar ett nytt kort
function addNewCard(id){
  var html = "";
  cardId += 1;

  html += "<div id=\"c" + cardId + "\" class=\"card\" draggable=\"true\">\n";
  html += "<span onclick=\"removeCard(" + cardId + ")\" class=\"close\" title=\"Stäng\">&times;</span>\n";
  html += "<h6>" + document.forms["f" + id]["r" + id].value + "</h6>\n";
  html += "<p>" + document.forms["f" + id]["t" + id].value + "</p>\n";
  html += "</div>";

  document.getElementById('i' + id).insertAdjacentHTML('beforebegin', html);
  addDnDHandlers(document.getElementById('c' + cardId));

  cards.push({
    "id": cardId, 
    "titel": document.forms["f" + id]["r" + id].value, 
    "text": document.forms["f" + id]["t" + id].value
  });

  configuration.push({
    "cardid": cardId, 
    "listid": Number(id)
  });
  configuration.sort((a, b) => a.listid - b.listid);

  saveConfiguration();  
  closeNewCard(id);
}

//funktion som ger möjlighet att flyta kort i tavlan och sparar ändringar
function changeCardPosition(oldid, newid, newlist) {
  
  if (newid === 0) {
    var oldIndex = configuration.findIndex( ({ cardid }) => cardid === oldid);

    var oldItem = configuration[oldIndex];
    oldItem.listid = newlist;
        
    configuration.push(oldItem);
    configuration.splice(oldIndex, 1);
    configuration.sort((a, b) => a.listid - b.listid);
  }
  else {
    var oldIndex = configuration.findIndex( ({ cardid }) => cardid === oldid);
    var newIndex = configuration.findIndex( ({ cardid }) => cardid === newid);
    var oldItem = {
      "cardid": configuration[oldIndex].cardid, 
      "listid": configuration[oldIndex].listid
    };
    oldItem.listid = configuration[newIndex].listid;
    configuration[oldIndex].listid = -1;
    configuration.insert(newIndex, oldItem);
    var oldObjIndex = configuration.findIndex( ({ listid }) => listid === -1);      
    configuration.splice(oldObjIndex, 1);
  }  
  saveConfiguration();
}

//funktion som raderar kort från tavlan och sedan sparar ändringar genom att anropa saveConfiguration funktion
function removeCard(id) {
  document.getElementById("c" + id).remove();
  var cardIndex = configuration.findIndex( ({ cardid }) => cardid === id);
  configuration.splice(cardIndex, 1);
  saveConfiguration();
}

//function som sparar användarens kort
function saveConfiguration() {
  localStorage.setItem(user, JSON.stringify(configuration));
  localStorage.setItem("cards", JSON.stringify(cards));
}

//funktion som ger möjlighet för användaren att logga ut
function logout() {
  sessionStorage.clear();
  window.open("index.html", "_self");
}

//funktion som ger möjlighet för användaren att rensa sina kort från tavlan
function clearBoard(){
  localStorage.removeItem(user);
  document.getElementById("board").innerHTML = "";
  makeLists();
}

//Function för att hämta inloggad användare
function welcomeIn () {
  if (sessionStorage.getItem('usersID') !== null) {
    fetch('users.json')
        .then(response => response.json())
        .then(function(jsonUsers){
            let userFound = false;
            for(let countUser = 0; countUser < jsonUsers.length && !userFound; countUser++){
                if (sessionStorage.getItem('usersID') === jsonUsers[countUser].id) {
                  userFound = true;
                  document.getElementById("welcome").innerHTML = "Väkommen " + jsonUsers[countUser].name;
                }
            }
        })
        .catch(err => console.log(JSON.stringify(err)));
        makeLists();
        
      } else {
        window.open("index.html", "_self");
      }
    }
welcomeIn ();
