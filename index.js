const sizePicker = document.querySelector('.size-picker');
const pixelCanvas = document.querySelector('.pixel-canvas');
const quickFill = document.querySelector('.quick-fill');
const genTxt = document.querySelector('.txt-gen');



function makeGrid() {
  let gridHeight = document.querySelector('.input-height').value;
  let gridWidth = document.querySelector('.input-width').value;
  while (pixelCanvas.firstChild) {
    pixelCanvas.removeChild(pixelCanvas.firstChild);
    }
  // Creates rows and cells
  for (let i = 1; i <= gridHeight; i++) {
    let gridRow = document.createElement('tr');
    pixelCanvas.appendChild(gridRow);
    for (let j = 1; j <= gridWidth; j++) {
      let gridCell = document.createElement('td');
      gridRow.appendChild(gridCell);
      // Fills in cell with selected color upon mouse press ('mousedown', unlike 'click', doesn't also require release of mouse button)
      gridCell.addEventListener('mousedown', function() {
        const color = document.querySelector('.color-picker').value;
        this.style.backgroundColor = color;
      })
     }
  }
}

makeGrid(25, 25);

// Upon user's submitting height and width selections, callback function (inside method) calls makeGrid function. But event method preventDefault() first intercepts the 'submit' event, which would normally submit the form and refresh the page, preventing makeGrid() from being processed
sizePicker.addEventListener('submit', function(e) {
  e.preventDefault();
  makeGrid();
});

// Enables color dragging with selected color (code for filling in single cell is above). (No click on 'draw' mode needed; this is default mode)
let down = false; // Tracks whether or not mouse pointer is pressed

// Listens for mouse pointer press and release on grid. Changes value to true when pressed, but sets it back to false as soon as released
pixelCanvas.addEventListener('mousedown', function(e) {
	down = true;
	pixelCanvas.addEventListener('mouseup', function() {
		down = false;
	});
  // Ensures cells won't be colored if grid is left while pointer is held down
  pixelCanvas.addEventListener('mouseleave', function() {
    down = false;
  });

  pixelCanvas.addEventListener('mouseover', function(e) {
    // 'color' defined here rather than globally so JS checks whether user has changed color with each new mouse press on cell
    const color = document.querySelector('.color-picker').value;
    // While mouse pointer is pressed and within grid boundaries, fills cell with selected color. Inner if statement fixes bug that fills in entire grid
  	if (down) {
      // 'TD' capitalized because element.tagName returns upper case for DOM trees that represent HTML elements
      if (e.target.tagName === 'TD') {
      	e.target.style.backgroundColor = color;
      }
    }
  });
});

// Adds color-fill functionality. e.preventDefault(); intercepts page refresh on button click
quickFill.addEventListener('click', function(e) {
  e.preventDefault();
  const color = document.querySelector('.color-picker').value;
  pixelCanvas.querySelectorAll('td').forEach(td => td.style.backgroundColor = color);
});

// Removes color from cell upon double-click
pixelCanvas.addEventListener('dblclick', e => {
  e.target.style.backgroundColor = null;
});

// NONDEFAULT DRAW AND ERASE MODES:



function downloadString(text, fileType, fileName) {
  var blob = new Blob([text], { type: fileType });

  var a = document.createElement('a');
  a.download = fileName;
  a.href = URL.createObjectURL(blob);
  a.dataset.downloadurl = [fileType, a.download, a.href].join(':');
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function() { URL.revokeObjectURL(a.href); }, 1500);
}

// downloadString("a,b,c\n1,2,3", "text/csv", "myCSV.csv")

genTxt.addEventListener('click', function(){
  // console.log('Gen button works!');

  var myTab = pixelCanvas;
  console.log(myTab.rows.length);

  var Pixlmatrix = [];
  for(var i=0; i<myTab.rows.length; i++) {
    var objCells = myTab.rows.item(i).cells;
    Pixlmatrix[i] = [];
    for(var j=0; j<objCells.length; j++) {
      Pixlmatrix[i][j] = "[255,255,255]";
    }
  }
  for (i = 0; i < myTab.rows.length; i++) {
    var objCells = myTab.rows.item(i).cells;
    // console.log(objCells.length);

    for (var j = 0; j < objCells.length; j++) {
      if(objCells.item(j).style.backgroundColor != ""){
        Pixlmatrix[i][j] = objCells.item(j).style.backgroundColor;
        Pixlmatrix[i][j] = Pixlmatrix[i][j].slice(3);
        Pixlmatrix[i][j] = Pixlmatrix[i][j].replace(/\(/g, "[").replace(/\)/g, "]");;
      }     
    }
      
  }
  // console.log(Pixlmatrix);
  console.log(Pixlmatrix.join());
  downloadString(Pixlmatrix.join(), "text/csv", "myCSV.csv")

  
})

function switchfnc(){
  var checkbx = document.getElementById("Chckbox");

  // remove txt and add txt
 
  // by default -> mode = draw 
  if(checkbx.checked == true){
    
    // ERASE MODE
    document.getElementById("text4slider").innerHTML = "Erase Mode";

    //JS
    
    // Enables drag erasing while in erase mode
    pixelCanvas.addEventListener('mousedown', function(e) {
      down = true;
      pixelCanvas.addEventListener('mouseup', function() {
        down = false;
      });
      // Ensures cells won't be erased if grid is left while pointer is held down
      pixelCanvas.addEventListener('mouseleave', function() {
        down = false;
      });
      pixelCanvas.addEventListener('mouseover', function(e) {
        // While mouse pointer is pressed and within grid boundaries, empties cell contents. Inner if statement fixes bug that fills in entire grid
        if (down) {
          if (e.target.tagName === 'TD') {
            e.target.style.backgroundColor = null;
          }
        }
      });
    });
    // Enables single-cell erase while in erase mode
    pixelCanvas.addEventListener('mousedown', function(e) {
      e.target.style.backgroundColor = null;
    });

  }else{

    // DRAW MODE
    document.getElementById("text4slider").innerHTML = "Draw Mode";

    //pasted
    pixelCanvas.addEventListener('mousedown', function(e) {
  	down = true;
  	pixelCanvas.addEventListener('mouseup', function() {
  		down = false;
  	});
    // Ensures cells won't be colored if grid is left while pointer is held down
    pixelCanvas.addEventListener('mouseleave', function() {
      down = false;
    });
    pixelCanvas.addEventListener('mouseover', function(e) {
      const color = document.querySelector('.color-picker').value;
      // While mouse pointer is pressed and within grid boundaries, fills cell with selected color. Inner if statement fixes bug that fills in entire grid
    	if (down) {
        if (e.target.tagName === 'TD') {
        	e.target.style.backgroundColor = color;
        }
      }
    });
  });
  // Enables single-cell coloring while in draw mode
  pixelCanvas.addEventListener('mousedown', function(e) {
    if (e.target.tagName !== 'TD') return;
    const color = document.querySelector('.color-picker').value;
    e.target.style.backgroundColor = color;
  });
    
  }

}