export const keys = {
  left: {
    pressed: false,
  },
  right: {
    pressed: false,
  },
  up: {
    pressed: false,
  },
  down: {
    pressed: false,
  },
  front: {
    pressed: false,
  },
  back: {
    pressed: false,
  },
};

export const keyDown = (code) => {
  switch (code) {
    case "KeyA":
      keys.left.pressed = true;
      break;

    case "ArrowLeft":
      keys.left.pressed = true;
      break;

    case "KeyD":
      keys.right.pressed = true;
      break;

    case "ArrowRight":
      keys.right.pressed = true;
      break;

    case "Space":
      keys.up.pressed = true;
      break;

    case "ArrowUp":
      keys.front.pressed = true;
      break;

    case "KeyW":
      keys.front.pressed = true;
      break;

    case "ArrowDown":
      keys.back.pressed = true;
      break;

    case "KeyS":
      keys.back.pressed = true;
      break;
  }
};

export const keyUp = (code) => {
  switch (code) {
    case "KeyA":
      keys.left.pressed = false;
      break;

    case "ArrowLeft":
      keys.left.pressed = false;
      break;

    case "KeyD":
      keys.right.pressed = false;
      break;

    case "ArrowRight":
      keys.right.pressed = false;
      break;

    case "Space":
      keys.up.pressed = false;
      break;

    case "ArrowUp":
      keys.front.pressed = false;
      break;

    case "KeyW":
      keys.front.pressed = false;
      break;

    case "ArrowDown":
      keys.back.pressed = false;
      break;

    case "KeyS":
      keys.back.pressed = false;
      break;
  }
};

//start movement event listener
window.addEventListener("keydown", (event) => {
  // console.log(event.code);
  keyDown(event.code);
});

//stop movement event listener
window.addEventListener("keyup", (event) => {
  // console.log(event.code);
  keyUp(event.code);
});

// const jumpButton = document.querySelector("button.jump");
// const frontButton = document.querySelector("button.front");
// const backButton = document.querySelector("button.back");
// const leftButton = document.querySelector("button.left");
// const rightButton = document.querySelector("button.right");

// jumpButton.onmousedown = () => {
//   keys.up.pressed = true;
// };
// jumpButton.onmouseup = () => {
//   keys.up.pressed = false;
// };
// frontButton.onmousedown = () => {
//   keys.front.pressed = true;
// };
// frontButton.onmouseup = () => {
//   keys.front.pressed = false;
// };
// backButton.onmousedown = () => {
//   keys.back.pressed = true;
// };
// backButton.onmouseup = () => {
//   keys.back.pressed = false;
// };
// leftButton.onmousedown = () => {
//   keys.left.pressed = true;
// };
// leftButton.onmouseup = () => {
//   keys.left.pressed = false;
// };
// rightButton.onmousedown = () => {
//   keys.right.pressed = true;
// };
// rightButton.onmouseup = () => {
//   keys.right.pressed = false;
// };

const mouseActions = {
  jump: "up",
  front: "front",
  back: "back",
  left: "left",
  right: "right",
};

Object.entries(mouseActions).forEach(([buttonName, keyName]) => {
  const button = document.querySelector(`button.${buttonName}`);

  if (button) {
    button.onmousedown = () => {
      keys[keyName].pressed = true;
    };

    button.onmouseup = () => {
      keys[keyName].pressed = false;
    };

    button.ontouchstart = () => {
      keys[keyName].pressed = true;
    };

    button.ontouchend = () => {
      keys[keyName].pressed = false;
    };
  }
});
