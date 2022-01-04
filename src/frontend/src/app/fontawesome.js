import { library } from '@fortawesome/fontawesome-svg-core';
import {  faMinus, faVenusMars, faSave, faFileCode, faArrowLeft, faArrowRight,
          faSyncAlt, faArrowUp, faTimes, faClone, faPaste, faSearch, faFont, faExclamationTriangle,
        faLink, faCopy} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(faMinus, faVenusMars, faSave, faFileCode, faArrowLeft, faArrowRight,
            faClone, faPaste, faSyncAlt, faArrowUp, faTimes, faSearch, faFont, faExclamationTriangle,
            faLink, faCopy);

export {
    library as library,
    FontAwesomeIcon as FontAwesomeIcon
};