import { rootStoreContext } from '@stores/index';
import { useContext } from 'react';

export const useStores = () => useContext(rootStoreContext);
