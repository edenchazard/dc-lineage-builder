import { library } from '@fortawesome/fontawesome-svg-core';
import { faMinus, faVenusMars, faSave, faFileCode, faArrowLeft, faArrowRight,
          faSyncAlt, faArrowUp, faClone, faPaste, faSearch, faFont, faExclamationTriangle,
        faLink, faCopy, faCut, faMars, faVenus, faTimes, faDragon, faCaretDown, faRandom,
        faItalic
     } from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faMinus, faVenusMars, faSave, faFileCode, faArrowLeft, faArrowRight,
            faClone, faPaste, faSyncAlt, faArrowUp, faSearch, faFont, faExclamationTriangle,
            faLink, faCopy, faCut, faMars, faVenus, faTimes, faDragon,
            faCaretDown, faRandom, faItalic);

export {
    library,
    FontAwesomeIcon
};