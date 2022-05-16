import "./style.css";

const noSelectClass = 'long-press-no-select';

let timeout = null;

const clear = () => {
    clearTimeout(timeout);
    timeout = null;
}

const prevent = (event) => event.preventDefault(); 

export default {
    bind(el, binding) {
        const {
            longPress, click, press, // callbacks
            wait, disableRightClickMenu // options
        } = binding.value;

        const onPress = (event) => {
            event.stopPropagation();

            // only left click or touch
            if(event.which > 1){
                return;
            }
            
            timeout = setTimeout(() => {
                timeout = null;

                longPress && longPress();
            }, wait || 300); // default 300ms

            press && press();
        };

        const onClick = () => {
            if(timeout){
                click && click();
            }

            clear();
        };

        const outOfBoundsClear = (event) => {
            // no need to continue if timeout is already expired
            if(!timeout){
                return;
            }

            const
                touch = event.targetTouches[0],
                elementAtPoint = document.elementFromPoint(touch.pageX, touch.pageY);

            // check if the element under the pointer is the binded element
            // or a descendent
            if (!el.isSameNode(elementAtPoint) && !el.contains(elementAtPoint)) {
                clear();
            }
        };
    
        // touch browser
        if('ontouchstart' in document.documentElement){
            el.addEventListener('touchstart', onPress);
            el.addEventListener('touchend', clear);
            el.addEventListener('touchcancel', clear);

            // if the input leaves the area, cancel long press
            el.addEventListener('touchmove', outOfBoundsClear);
        }

        // mousey browser
        if('onmousedown' in document.documentElement){
            el.addEventListener('mousedown', onPress);
            el.addEventListener('mouseleave', clear);
        }

        disableRightClickMenu && el.addEventListener('contextmenu', prevent);

        el.addEventListener('click', onClick);
        el.classList.add(noSelectClass);
    },

    update(el){
        el.classList.add(noSelectClass);
    },

    unbind(el){
        el.classList.remove(noSelectClass);
    }
};
