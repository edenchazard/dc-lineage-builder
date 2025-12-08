import type { DirectiveBinding } from 'vue';
import './style.css';

type LongPressEvent<T extends Event = Event> = T;

const noSelectClass = 'long-press-no-select';

let timeout: number;
let longPressActivated: boolean = false;

function prevent(event: Event) {
  event.preventDefault();
}

function isRightMouseButton(e: PointerEvent): boolean {
  return e.pointerType === 'mouse' && e.button === 2;
}

function clearPress() {
  clearTimeout(timeout);
  longPressActivated = false;
}

export default {
  beforeMount(
    el: HTMLElement,
    binding: DirectiveBinding<{
      wait?: number;
      disableRightClickMenu?: boolean;
      onLongPress?: (e: LongPressEvent) => void;
      onClick?: (e: LongPressEvent) => void;
      onPress?: (e: LongPressEvent) => void;
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

      if (e instanceof PointerEvent && isRightMouseButton(e)) return;

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
      if (e instanceof PointerEvent && isRightMouseButton(e)) return;

      // it's a click if the threshold for a long press hasn't been
      // activated
      clearTimeout(timeout);

      if (!longPressActivated && onClick) {
        setTimeout(() => onClick(e), 20);
      }
    }

    el.addEventListener('pointerdown', handleDown);
    el.addEventListener('pointerup', handleUp);
    el.addEventListener('pointerout', clearPress);
    el.addEventListener('keyup', (e: KeyboardEvent) => {
      if (e.code === 'Space') handleUp<KeyboardEvent>(e);
    });

    if (disableRightClickMenu) {
      el.addEventListener('contextmenu', prevent);
    }

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
