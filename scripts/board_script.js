var dragSrcEl = null;
var prevEl = null;

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
    addDnDHandlers(dropElem);
    console.log(this.outerHTML);
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
  elem.addEventListener('dragenter', handleDragEnter, false)
  elem.addEventListener('dragover', handleDragOver, false);
  elem.addEventListener('dragleave', handleDragLeave, false);
  elem.addEventListener('drop', handleDrop, false);
  elem.addEventListener('dragend', handleDragEnd, false);
}

function addDropHandlers(elem) {
  elem.addEventListener('dragenter', handleDragEnter, false)
  elem.addEventListener('dragover', handleDragOver, false);
  elem.addEventListener('dragleave', handleDragLeave, false);
  elem.addEventListener('drop', handleDrop, false);
  elem.addEventListener('dragend', handleDragEnd, false);
}

var cards = document.querySelectorAll('.list .card');
[].forEach.call(cards, addDnDHandlers);

var list = document.querySelectorAll('.itemsList');
[].forEach.call(list, addDropHandlers);