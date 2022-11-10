// populating DOM
const appContainer = document.getElementById('apps-container');
const numOfRows = 3; // must be odd
const minIconInRow = 1;
const midRow = Math.round(numOfRows / 2);
const colorChoices = ['red', 'purple', 'green', 'blue'];
// const colorChoices = ['red'];

function addNewIcon(parentNode) {
  const appIcon = document.createElement('div');
  appIcon.className = `app-icon ${colorChoices[Math.floor((Math.random() * colorChoices.length))]}`;

  // // DEBUG ONLY
  // const debugContainer = document.createElement('div');
  // debugContainer.className = 'debug-container';
  // debugContainer.append(appIcon);
  parentNode.append(appIcon);
}
for (i = minIconInRow; i <= midRow; i++) {
  const appRow = document.createElement('div');
  appRow.className = 'app-row';
  for (x = 1; x <= i; x++) {
    addNewIcon(appRow);
  }
  appContainer.append(appRow);
}

for (i = numOfRows; i >= midRow + minIconInRow; i--) {
  const appRow = document.createElement('div');
  appRow.className = 'app-row';

  for (x = i - midRow - 1; x >= 0; x--) {
    addNewIcon(appRow);
  }
  appContainer.append(appRow);
}

// Dragging Event
const watchFace = document.getElementById('watch-face');
watchFace.addEventListener("mousedown", e => {
  document.addEventListener("mousemove", draggingHandler)
})

document.addEventListener('mouseup', e => {
  document.removeEventListener('mousemove', draggingHandler);
})
scaleToFit();

function draggingHandler(e) {
  e.preventDefault();
  // Move icon according to mouse movement
  appContainer.style.top = (Number(appContainer.style.top.substring(0, appContainer.style.top.length - 2)) + e.movementY) + 'px';
  appContainer.style.left = (Number(appContainer.style.left.substring(0, appContainer.style.left.length - 2)) + e.movementX) + 'px';

  // // DEVELOPMENT
  // const debugMovementX = document.getElementById('movementX');
  // const debugMovementY = document.getElementById('movementY');
  // debugMovementX.innerText = e.movementX;
  // debugMovementY.innerText = e.movementY;


  scaleToFit();
}

function scaleToFit() {
  // COLLISION DETECTION
  const iconList = Array.from(document.getElementsByClassName('app-icon'));
  const parentBounds = watchFace.getBoundingClientRect();
  iconList.forEach(icon => {
    const iconBound = icon.getBoundingClientRect();
    const currentScale = parseFloat(icon.style.transform.substring(6)) || 1;
    const currentIconWidth = icon.getBoundingClientRect().width;
    const iconTrueWidth = currentIconWidth / currentScale;
    const newIconMiddlePoint = {
      x: iconBound.left + (iconBound.width / 2),
      y: iconBound.top + (iconBound.height / 2)
    }




    // // ============== DEVELOPMENT ONLY ==============
    // document.getElementsByClassName('left-cord')[0].innerText = `${Math.round(parentBounds.left * 10000) / 10000}px`;
    // document.getElementsByClassName('right-cord')[0].innerText = `${Math.round(parentBounds.right * 10000) / 10000}px`;
    // document.getElementsByClassName('top-cord')[0].innerText = `${Math.round(parentBounds.top * 10000) / 10000}px`;
    // document.getElementsByClassName('bottom-cord')[0].innerText = `${Math.round(parentBounds.bottom * 10000) / 10000}px`;

    // const iconLeftCord = document.getElementsByClassName('icon-left-cord')[0];
    // const yCord = document.getElementsByClassName('y-cord')[0];
    // const xCord = document.getElementsByClassName('x-cord')[0];
    // iconLeftCord.innerText = iconBound.left;
    // yCord.innerText = Math.round(newIconMiddlePoint.y * 1000) / 1000;
    // xCord.innerText = Math.round(newIconMiddlePoint.x * 1000) / 1000;




    // If icon is visible inside canvas
    if (newIconMiddlePoint.x > parentBounds.left
      && newIconMiddlePoint.x < parentBounds.right
      && newIconMiddlePoint.y > parentBounds.top
      && newIconMiddlePoint.y < parentBounds.bottom) {

      const shouldLeftScale = newIconMiddlePoint.x <= parentBounds.left + iconTrueWidth / 2;
      const shouldTopScale = newIconMiddlePoint.y <= parentBounds.top + iconTrueWidth / 2;
      const shouldRightScale = newIconMiddlePoint.x >= parentBounds.right - iconTrueWidth / 2;
      const shouldBottomScale = newIconMiddlePoint.y >= parentBounds.bottom - iconTrueWidth / 2;

      let newScale,
        horizontalScale,
        verticalScale;

      if (shouldLeftScale) {
        // need scale down
        if (iconBound.left < parentBounds.left) {
          horizontalScale = iconScale(parentBounds.left, iconBound.left, "down");
        }
        else {
          horizontalScale = iconScale(parentBounds.left, iconBound.left, "up");
        }
      }
      if (shouldTopScale) {
        // need scale down
        if (iconBound.top < parentBounds.top) {
          verticalScale = iconScale(parentBounds.top, iconBound.top, "down");
        }
        else {
          verticalScale = iconScale(parentBounds.top, iconBound.top, "up");
        }
      }
      if (shouldRightScale) {
        // need scale down
        if (iconBound.right > parentBounds.right) {
          horizontalScale = iconScale(parentBounds.right, iconBound.right, "down");
        }
        else {
          horizontalScale = iconScale(parentBounds.right, iconBound.right, "up");
        }
      }
      if (shouldBottomScale) {
        // need scale down
        if (iconBound.bottom > parentBounds.bottom) {
          verticalScale = iconScale(parentBounds.bottom, iconBound.bottom, "down");
        }
        else {
          verticalScale = iconScale(parentBounds.bottom, iconBound.bottom, "up");
        }
      }

      const newBoundAfterHorizontalScale = {
        left: newIconMiddlePoint.x - (iconTrueWidth * horizontalScale / 2),
        top: newIconMiddlePoint.y - (iconTrueWidth * horizontalScale / 2),
        right: newIconMiddlePoint.x + (iconTrueWidth * horizontalScale / 2),
        bottom: newIconMiddlePoint.y + (iconTrueWidth * horizontalScale / 2)
      };
      const newBoundAfterVerticalScale = {
        left: newIconMiddlePoint.x - (iconTrueWidth * verticalScale / 2),
        top: newIconMiddlePoint.y - (iconTrueWidth * verticalScale / 2),
        right: newIconMiddlePoint.x + (iconTrueWidth * verticalScale / 2),
        bottom: newIconMiddlePoint.y + (iconTrueWidth * verticalScale / 2)
      };

      if (horizontalScale && verticalScale) {
        if (
          newBoundAfterHorizontalScale.left >= parentBounds.left
          && newBoundAfterHorizontalScale.right <= parentBounds.right
          && newBoundAfterHorizontalScale.top >= parentBounds.top
          && newBoundAfterHorizontalScale.bottom <= parentBounds.bottom
        ) {
          newScale = horizontalScale;
        }
        else {
          newScale = verticalScale;
        }
      }
      else {
        newScale = horizontalScale || verticalScale;
      }



      // If all 4 shouldScale are false -> no scale (Basically when icon is in the middle of canvas and isn't close to any edge, then automatically scale to full size)
      // This prevents iconScale() from behaving weirdly when it's supposed to calculate scale when icon is at full scale (1)
      // Mouse Event sucks.
      if (!shouldLeftScale && !shouldTopScale && !shouldRightScale && !shouldBottomScale) {
        newScale = 1;
      }
      icon.style.transform = `scale(${newScale})`;
    }
    else {
      icon.style.transform = `scale(0.01)`;
    }


    function iconScale(baseParentBound, baseIconBound, scaleDirection) {
      let newScale, distance;
      distance = Math.abs(baseParentBound - baseIconBound);
      if (scaleDirection == 'up') {
        newScale = (1 + ((distance * 2 / currentIconWidth))) * currentScale;
      }
      else if (scaleDirection == 'down') {
        newScale = (1 - ((distance * 2 / currentIconWidth))) * currentScale;
      }
      if (newScale > 1) { newScale = 1 }
      else if (newScale <= 0.001) { newScale = 0.001 };
      // icon.style.transform = `scale(${newScale})`;
      return newScale;
    }
  })
}

