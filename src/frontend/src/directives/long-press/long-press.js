import "./style.css";

const noSelectClass = 'long-press-no-select';

const clear = () => clearTimeout(timeout);
const prevent = (event) => event.preventDefault(); 

let timeout = null;

export default {
    bind(el, binding) {
        const { longPress, wait, click, disableRightClickMenu } = binding.value;

        const onPress = (event) => {
            event.stopPropagation();

            // only left click or touch
            if(event.which > 1){
                return;
            }
            
            timeout = setTimeout(() => {
                longPress();
                timeout = null;
            }, wait || 300); // default 300ms
        };

        const onClick = () => {
            if(timeout){
                click();
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

            if (!el.isSameNode(elementAtPoint) && !el.contains(elementAtPoint)) {
                console.log('out of bands')
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
        else{
            el.addEventListener('mousedown', onPress);
            el.addEventListener('mouseleave', clear);
        }

        if(disableRightClickMenu){
            el.addEventListener('contextmenu', prevent);
        }

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
