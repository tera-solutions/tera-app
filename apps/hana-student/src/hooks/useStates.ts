import { useContext } from 'react';

import { rootStoreContext } from 'src/states/index';

export const useStates = () => useContext(rootStoreContext);
