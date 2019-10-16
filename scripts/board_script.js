var dragSrcEl = null;
var prevEl = null;
var cardId = 0;

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
    console.log(dropElem);
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

var cards = document.querySelectorAll('.list .card');
[].forEach.call(cards, addDnDHandlers);

var list = document.querySelectorAll('.itemsList');
[].forEach.call(list, addDropHandlers);

function newCard(id) {
  document.getElementById('a' + id).style.display = "none";

  var html = "";

  html += "<form id=\"f" + id + "\" class=\"p-2\" onsubmit=\"return addNewCard(\'" + id + "\')\">\n";
  html += "<div class=\"form-group\">\n";
  html += "<label for=\"r" + id + "\">Rubrik</label>\n";
  html += "<input class=\"form-control\" id=\"r" + id + "\" required>\n";
  html += "</div>\n";
  html += "<div class=\"form-group\">\n";
  html += "<label for=\"t" + id + "\">Text</label>\n";
  html += "<textarea class=\"form-control\" id=\"t" + id + "\" rows=\"3\" required></textarea>\n";
  html += "</div>\n";
  html += "<button type=\"submit\" class=\"btn btn-primary btn-sm\">Lägg till</button>\n";
  html += "<button type=\"button\" class=\"btn btn-secondary btn-sm\" onclick=\"closeNewCard(\'" + id + "\')\">Stäng</button>\n";
  html += "</form>\n";

  console.log(html);
  document.getElementById('a' + id).insertAdjacentHTML('afterend', html);
}

function closeNewCard(id) {
  document.getElementById('f' + id).remove();
  document.getElementById('a' + id).style.display = "block";
}

function addNewCard(id){
  var html = "";
  cardId += 1;

  html += "<div id=\"c" + cardId + "\" class=\"card\" draggable=\"true\">\n";
  html += "<h6>" + document.forms["f" + id]["r" + id].value + "</h6>\n";
  html += "<p>" + document.forms["f" + id]["t" + id].value + "</p>\n";
  html += "</div>";

  document.getElementById('i' + id).insertAdjacentHTML('beforebegin', html);
  console.log(document.getElementById('c' + cardId));
  addDnDHandlers(document.getElementById('c' + cardId));
  closeNewCard(id);
}

function welcomeIn () {
  if (sessionStorage.length == 2) {
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
        document.getElementById("board").style.display = "flex";
      } else {
        document.getElementById("board").style.display = "none";
      }
}

welcomeIn ();