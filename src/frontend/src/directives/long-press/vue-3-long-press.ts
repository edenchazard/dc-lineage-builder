import type { DirectiveBinding } from 'vue';
import './style.css';

const noSelectClass = 'long-press-no-select';

let timeout: number;
let longPressActivated: boolean = false;

const prevent = (event: Event) => event.preventDefault();

function isRightMouseButton(e: Event) {
  return (
    'pointerType' in e &&
    e.pointerType === 'mouse' &&
    'button' in e &&
    e.button === 2
  );
}
export default {
  beforeMount(
    el: HTMLElement,
    binding: DirectiveBinding<{
      wait?: number;
      disableRightClickMenu?: boolean;
    }>,
  ) {
    const {
      // callbacks
      onLongPress,
      onClick,
      onPress,
      // options
      wait = 500,
      disableRightClickMenu,
    } = binding.value;

    function handleDown<T extends Event>(e: T) {
      longPressActivated = false;

      if (isRightMouseButton(e)) {
        return;
      }

      timeout = window.setTimeout(() => {
        longPressActivated = true;
        if (onLongPress) {
          onLongPress(e);
        }
      }, wait);

      if (onPress) {
        onPress(e);
      }
    }

    function handleUp<T extends Event>(e: T) {
      if (isRightMouseButton(e)) {
        return;
      }

      // it's a click if the threshold for a long press hasn't been
      // activated
      clearTimeout(timeout);

      if (!longPressActivated && onClick) {
        setTimeout(() => onClick(e), 20);
      }
    }

    const events = [
      ['pointerdown', handleDown<PointerEvent>],
      ['pointerup', handleUp<PointerEvent>],
      [
        'pointerout',
        () => {
          clearTimeout(timeout);
          longPressActivated = false;
        },
      ],
      [
        'keyup',
        (e: KeyboardEvent) => {
          if (e.code === 'Space') handleUp<KeyboardEvent>(e);
        },
      ],
    ];

    if (disableRightClickMenu) {
      events.push(['contextmenu', prevent]);
    }

    events.forEach((event) => el.addEventListener(...event));

    el.classList.add(noSelectClass);
  },

  updated(el: HTMLElement) {
    el.classList.add(noSelectClass);
  },

  // cleanup
  /*unbind(el){
        el.classList.remove(noSelectClass);
        el.events.forEach(event => el.removeEventListener(event[0], event[1]));
        el.events = null;
    }*/
};
