import './style.css';

const noSelectClass = 'long-press-no-select';

let timeout = null;

const clear = () => {
  clearTimeout(timeout);
  timeout = null;
};

const prevent = (event) => event.preventDefault();

export default {
  beforeMount(el, binding) {
    const {
      longPress,
      click,
      press, // callbacks
      wait,
      disableRightClickMenu, // options
    } = binding.value;

    const onPress = (event) => {
      event.stopPropagation();

      // only left click or touch
      if (event.which > 1) return;

      timeout = setTimeout(() => {
        timeout = null;

        longPress && longPress();
      }, wait || 300); // default 300ms

      press && press();
    };

    const onClick = () => {
      if (timeout) {
        click && click();
      }

      clear();
    };

    const outOfBoundsClear = (event) => {
      // no need to continue if timeout is already expired
      if (!timeout) return;

      const touch = event.targetTouches[0],
        elementAtPoint = document.elementFromPoint(touch.pageX, touch.pageY);

      // check if the element under the pointer is the binded element
      // or a descendent
      if (!el.isSameNode(elementAtPoint) && !el.contains(elementAtPoint)) {
        clear();
      }
    };

    let events = [];

    // touch browser
    if ('ontouchstart' in document.documentElement) {
      events = [
        ...events,
        ['touchstart', onPress],
        ['touchend', clear],
        ['touchcancel', clear],
        // if the input leaves the area, cancel long press
        ['touchmove', outOfBoundsClear],
      ];
    }

    // mousey browser
    if ('onmousedown' in document.documentElement) {
      events = [...events, ['mousedown', onPress], ['mouseleave', clear]];
    }

    events.push(['click', onClick]);

    disableRightClickMenu && events.push(['contextmenu', prevent]);

    events.forEach((event) => el.addEventListener(event[0], event[1]));
    // for removing them later
    //el.events = events;
    el.classList.add(noSelectClass);
  },

  updated(el) {
    el.classList.add(noSelectClass);
  },

  // cleanup
  /*unbind(el){
        el.classList.remove(noSelectClass);
        el.events.forEach(event => el.removeEventListener(event[0], event[1]));
        el.events = null;
    }*/
};
