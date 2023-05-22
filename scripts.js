
// populating DOM
const appContainer = document.getElementById('apps-container');
const numOfRows = 11; // must be odd
const minIconInRow = 1;
const midRow = Math.round(numOfRows / 2);
const colorChoices = ['red', 'purple', 'green', 'blue'];

function addNewIcon(parentNode) {
  const appIcon = document.createElement('div');
  appIcon.className = `app-icon `;
  const appIconImg = document.createElement('img');
  appIconImg.setAttribute('src', `./assets/icons/icon_${Math.floor(Math.random() * 55)}.svg`)
  appIconImg.setAttribute('width', '100%');
  appIconImg.setAttribute('height', '100%');
  appIcon.append(appIconImg);
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
const iconList = Array.from(document.getElementsByClassName('app-icon'));

requestAnimationFrame(() => scaleToFit(watchFace, iconList));
scaleToFit(watchFace, iconList);

watchFace.addEventListener("mousedown", dragStart);
document.addEventListener('mouseup', dragStop);

function dragStart(e) {
  // resets 
  const tempTop = appContainer.getBoundingClientRect().top - watchFace.getBoundingClientRect().top;
  const tempLeft = appContainer.getBoundingClientRect().left - watchFace.getBoundingClientRect().left;
  setPosition(tempTop, tempLeft, appContainer);

  document.addEventListener("mousemove", draggingHandler);
}

function dragStop(e) {
  // If middle point of container is outside of watch face, gradually transition back to center
  fitBoundInCanvas2(appContainer, watchFace);

  document.removeEventListener('mousemove', draggingHandler);
}


function fitBoundInCanvas(container, parent) {
  const containerBound = container.getBoundingClientRect();
  const parentBound = parent.getBoundingClientRect();

  container.style.transition = 'top 200ms, left 200ms';

  if (containerBound.right < parentBound.left + parentBound.width / 2) {
    setPosition(null, (0 - containerBound.width) + (parentBound.width / 2), container);
  }
  if (containerBound.left > parentBound.left + parentBound.width / 2) {
    setPosition(null, parentBound.width / 2, container);
  }
  if (containerBound.bottom < parentBound.top + parentBound.height / 2) {
    setPosition((0 - containerBound.height) + (parentBound.height / 2), null, container);
  }
  if (containerBound.top > parentBound.top + parentBound.height / 2) {
    setPosition(parentBound.height / 2, null, container);
  }

  setTimeout(() => {
    container.style.transition = 'none';
  }, 200);

}

function fitBoundInCanvas2(container, parent) {
  const containerBound = container.getBoundingClientRect();
  const parentBound = parent.getBoundingClientRect();

  container.style.transition = 'top 200ms, left 200ms';
  console.log(parentBound.left);
  console.log(containerBound.width);
  console.log(parentBound.width);
  if (containerBound.right < parentBound.right) {

    setPosition(null, 0 - (containerBound.width - parentBound.width), container);
  }
  if (containerBound.left > parentBound.left) {
    setPosition(null, 0, container);
  }
  if (containerBound.bottom < parentBound.bottom) {
    setPosition(0 - (containerBound.height - parentBound.height), null, container);
  }
  if (containerBound.top > parentBound.top) {
    setPosition(0, null, container);
  }

  setTimeout(() => {
    container.style.transition = 'none';
  }, 200);

}


function draggingHandler(e) {
  e.preventDefault();
  // Move icon according to mouse movement
  const tempTop = Number(appContainer.style.top.substring(0, appContainer.style.top.length - 2)) + e.movementY;
  const tempLeft = Number(appContainer.style.left.substring(0, appContainer.style.left.length - 2)) + e.movementX;
  setPosition(tempTop, tempLeft, appContainer);
}

function setPosition(top, left, element) {
  if (top !== null) {
    element.style.top = top + 'px';
  }
  if (left !== null) {
    element.style.left = left + 'px';
  }
}

function scaleToFit(parentContainer, iconList) {
  requestAnimationFrame(() => scaleToFit(watchFace, iconList));
  // COLLISION DETECTION
  const parentBounds = parentContainer.getBoundingClientRect();

  iconList.forEach(icon => {
    const iconBound = icon.getBoundingClientRect();
    const currentScale = parseFloat(icon.style.transform.substring(6)) || 1;
    const currentIconWidth = icon.getBoundingClientRect().width;
    const iconTrueWidth = currentIconWidth / currentScale;
    const newIconMiddlePoint = {
      x: iconBound.left + (iconBound.width / 2),
      y: iconBound.top + (iconBound.height / 2)
    }

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
        horizontalScale = iconScale(parentBounds.left, iconBound.left, iconBound.left < parentBounds.left ? "down" : "up");
      }
      if (shouldTopScale) {
        verticalScale = iconScale(parentBounds.top, iconBound.top, iconBound.top < parentBounds.top ? "down" : "up");
      }
      if (shouldRightScale) {
        horizontalScale = iconScale(parentBounds.right, iconBound.right, iconBound.right > parentBounds.right ? "down" : "up");
      }
      if (shouldBottomScale) {
        verticalScale = iconScale(parentBounds.bottom, iconBound.bottom, iconBound.bottom > parentBounds.bottom ? "down" : "up");
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

      return newScale;
    }
  })
}