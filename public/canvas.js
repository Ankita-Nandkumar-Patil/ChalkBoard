let canvas = document.querySelector("canvas");
let mainBoard = document.querySelector(".main_board");
canvas.height = mainBoard.clientHeight;
canvas.width = mainBoard.clientWidth;
let download = document.querySelector(".download")
let undo = document.querySelector(".undo")
let redo = document.querySelector(".redo")

// updating pencil color-width, eraser-width
let pencilColor = document.querySelectorAll(".pencil_color")
let pencilWidthEle = document.querySelector(".pencil_width")
let eraserWidthEle = document.querySelector(".eraser_width")

let penColor = "#FFE700"
let penWidth = pencilWidthEle.value;
let eraserColor = "#222831"
let eraserWidth = eraserWidthEle.value;

let ctx = canvas.getContext("2d");
let mouseDown = false;

ctx.strokeStyle = penColor;
ctx.lineWidth = penWidth;

let undoRedoTracker = [];
let track = 0;

// mouseDown : start new path || mouseMove : path fill with color

canvas.addEventListener("mousedown", (e)=> {
    mouseDown = true;
    const {x, y} = getCoordinates(e);
    let data = {
        x,y,
        color: eraserFlag ? eraserColor : penColor,
        width: eraserFlag ? eraserWidth : penWidth
    }
    socket.emit("beginPath", data) 
    
    // ctx.beginPath();
    // ctx.moveTo(x, y);

})

function beginPath(strokObj){
    ctx.beginPath();
    ctx.moveTo(strokObj.x, strokObj.y);
}

function drawStroke(strokObj){
    ctx.strokeStyle = strokObj.color;
    ctx.lineWidth = strokObj.width;
    ctx.lineTo(strokObj.x, strokObj.y);
    ctx.stroke();
}

canvas.addEventListener("mousemove", (e)=>{
    if (mouseDown){
        const {x, y} = getCoordinates(e);
        let data = {
            x,y,
            color: eraserFlag ? eraserColor : penColor,
            width: eraserFlag ? eraserWidth : penWidth
        }
        console.log("data:::", data);
        
        socket.emit("drawStroke", data) 
    }
})

function getCoordinates(e){
    // we need to adjust the co-ordinates :: due to the difference between the mouse coordinates and the canvas coordinates. The clientX and clientY properties of the mouse event gives the position of the mouse relative to the viewport, but the canvas may be positioned differently on the page (due to margins, padding, or other layout factors)

    // Get the canvas position
    const rect = canvas.getBoundingClientRect();
    // Adjust mouse coordinates
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    return {x, y}
}

canvas.addEventListener("mouseup", (e)=>{
    mouseDown = false;
    
    let url = canvas.toDataURL();
    undoRedoTracker.push(url);
    track = undoRedoTracker.length-1;
})


pencilColor.forEach((colorEle)=>{    
    colorEle.addEventListener("click", (e)=>{
        let color = colorEle.getAttribute("data-color")
        penColor = color;
        ctx.strokeStyle = penColor;        
    })
})

pencilWidthEle.addEventListener("change", (e) => {
    penWidth = pencilWidthEle.value;
    ctx.lineWidth = penWidth;
})

eraserWidthEle.addEventListener("change", (e)=>{
    eraserWidth = eraserWidthEle.value;
    ctx.lineWidth = eraserWidth;
})

eraserCont.addEventListener("click", (e)=>{
    if(eraserFlag){
        ctx.strokeStyle = eraserColor;
        ctx.lineWidth = eraserWidth;
    } else{
        ctx.strokeStyle = penColor;
        ctx.lineWidth = penWidth;
    }    
})


download.addEventListener("click", (e)=>{
    let url = canvas.toDataURL();

    let a = document.createElement("a");
    a.href = url;
    a.download = "slate.jpg";
    a.click()
})


undo.addEventListener("click", (e)=>{
    console.log("undo clicked", track);
    
    if(track > 0) track--;
    let data = {
        trackvalue : track,
        undoRedoTracker
    }
    socket.emit("undoRedo", data)
    // undoRedoCanvas(trackObj);
})

redo.addEventListener("click", (e)=>{
    console.log("redo clicked", track);
    
    if(track < undoRedoTracker.length-1) track++;  
    let data = {
        trackvalue : track,
        undoRedoTracker : undoRedoTracker
    }
    socket.emit("undoredo", data)
    // undoRedoCanvas(trackObj);
})


function undoRedoCanvas(trackObj){
    track = trackObj.trackvalue;
    undoRedoTracker = trackObj.undoRedoTracker;

    if (track < 0 || track >= undoRedoTracker.length) {
        console.error("Track is out of bounds");
        return;
    }

    let url = undoRedoTracker[track];
    let img = new Image();
    img.src = url;
    img.onload = (e)=>{
        ctx.drawImage(img, 0, 0, canvas.clientHeight, canvas.clientWidth);
    }
    console.log(mainBoard.clientHeight, mainBoard.clientWidth)
    console.log(canvas.width, canvas.height);
}

socket.on("beginPath", (data)=>{
    // data from server
    beginPath(data);
})

socket.on("drawStroke", (data)=>{
    // data from server
    drawStroke(data);
})

socket.on("undoredo", (data) => {
    undoRedoCanvas(data);
})