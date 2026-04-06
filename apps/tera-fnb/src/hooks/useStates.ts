import { rootStoreContext } from 'src/states/index';
import { useContext } from 'react';

export const useStates = () => useContext(rootStoreContext);
