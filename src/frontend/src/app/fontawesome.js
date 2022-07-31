import { library } from '@fortawesome/fontawesome-svg-core';
import { faMinus, faSave, faFileCode, faArrowLeft, faArrowRight,
          faSyncAlt, faArrowUp, faClone, faPaste, faSearch, faFont, faExclamationTriangle,
        faLink, faCopy, faCut, faMars, faVenus, faTimes, faDragon, faCaretDown, faRandom,
        faItalic, faTag, faExchangeAlt
     } from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faMinus, faSave, faFileCode, faArrowLeft, faArrowRight,
            faClone, faPaste, faSyncAlt, faArrowUp, faSearch, faFont, faExclamationTriangle,
            faLink, faCopy, faCut, faMars, faVenus, faTimes, faDragon,
            faCaretDown, faRandom, faItalic, faTag, faExchangeAlt);

export {
    library,
    FontAwesomeIcon
};