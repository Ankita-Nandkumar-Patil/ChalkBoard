// Opening and closing the hamburger menu
let toolsContainer = document.querySelector('.tools_container');
let tool = document.querySelector('.tool_options_wrapper')
let optionFlag = true;
// true: show tools || false: hide tools

toolsContainer.children[0].addEventListener("click", (e)=>{
    optionFlag = !optionFlag;
    if(optionFlag) openTools();
    else closeTools();
})

function openTools(){
    let iconElem = toolsContainer.children[0];
    tool.classList.remove("hide")
    iconElem.classList.remove("close")
    iconElem.classList.add("hamburger")
    iconElem.src = "./icons/close.svg";
}

function closeTools(){
    let iconElem = toolsContainer.children[0];
    tool.classList.add("hide")
    iconElem.classList.remove("hamburger")
    iconElem.classList.add("close")
    iconElem.src = "./icons/hamburger.svg";
}


// hiding and showing the pencil-eraser options
let pencilCont = document.querySelector('.pencil_cont');
let eraserCont = document.querySelector('.eraser_cont');
let pencilFlag = false;
let eraserFlag = false;

pencilCont.addEventListener('click', (e)=>{
    pencilFlag = !pencilFlag;
    console.log('pencil clicked', pencilFlag);
    let itemOption = pencilCont.children[1];
  if(pencilFlag){itemOption.classList.remove('hide')}
  else{itemOption.classList.add('hide')}  
})

eraserCont.addEventListener('click', (e)=>{
    eraserFlag = !eraserFlag;
    console.log('eraser clicked', eraserFlag);
    let itemOption = eraserCont.children[1];
    if(eraserFlag){itemOption.classList.remove('hide')}
    else{itemOption.classList.add('hide')}  
  })


let upload = document.querySelector(".addImg")
upload.addEventListener("click", (e)=>{
    // Open file explorer to upload img
    let input = document.createElement("input")
    input.setAttribute("type", "file");
    input.click();


    input.addEventListener("change", (e)=>{
        let file = input.files[0];
        let url = URL.createObjectURL(file);
        console.log(url);
        
        let elementToAdd = `<img src="${url}"/>`
        createNote(elementToAdd);
    })
})

// adding sticky note : we need to create a new note everytime user clicks on note icon
let note = document.querySelector(".addNote");
note.addEventListener("click", (e)=>{
    // adding sticky note
    let elementToAdd = '<textarea spellcheck="false"></textarea>'
    createNote(elementToAdd);
})

function createNote(elementToAdd){
    let stickyNote = document.createElement("div");
    stickyNote.setAttribute('class','sticky_note');
    stickyNote.innerHTML = `
        <div class="note_header">
            <div class="minimize" style="background-color: #88C273;"></div>
            <div class="remove" style="background-color: #FF8080;"></div>
        </div>
        <div class="note_content">
            ${elementToAdd}
        </div>
    `;
    document.body.appendChild(stickyNote);

    // minimize/remove note
    let minimize = stickyNote.querySelector(".minimize")
    let remove = stickyNote.querySelector(".remove")
    noteActions(minimize, remove, stickyNote);

    // drag-drop note
    stickyNote.onmousedown = function (event) {
        dragAndDrop(stickyNote, event);
    };

    stickyNote.ondragstart = function () {
        return false;
    };
}

// minimize/remove note
function noteActions(minimize, remove, stickyNote){
    remove.addEventListener("click", (e)=>{
        stickyNote.remove();
    })

    minimize.addEventListener("click", (e)=>{
        let noteContent = stickyNote.querySelector(".note_content");
        let display = getComputedStyle(noteContent).getPropertyValue("display");
        if(display === "none") noteContent.style.display = "block";
        else noteContent.style.display = "none";
    })
}

// drag-drop note
function dragAndDrop(element, event) {
    let shiftX = event.clientX - element.getBoundingClientRect().left;
    let shiftY = event.clientY - element.getBoundingClientRect().top;

    element.style.position = 'absolute';
    element.style.zIndex = 1000;

    moveAt(event.pageX, event.pageY);

    // moves the ball at (pageX, pageY) coordinates
    // taking initial shifts into account
    function moveAt(pageX, pageY) {
        element.style.left = pageX - shiftX + 'px';
        element.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    // move the ball on mousemove
    document.addEventListener('mousemove', onMouseMove);

    // drop the ball, remove unneeded handlers
    element.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        element.onmouseup = null;
    };
}

