import React from 'react';
import { ISnackbarConfig } from '../hooks/useSnackbar';

const SnackbarContext = React.createContext<
  ((config: Partial<ISnackbarConfig>) => void) | null
>(null);

export default SnackbarContext;
