import React, { useCallback, useState } from 'react';
import { Text } from 'react-native';
import { Snackbar } from 'react-native-paper';

export interface ISnackbarConfig {
  visible?: boolean;
  action?: { label: string; accessibilityLabel?: string; onPress: () => void };
  duration?: number;
  message: string;
}

function useSnackbar(
  initConfig?: Partial<ISnackbarConfig>,
): [JSX.Element, (config: Partial<ISnackbarConfig>) => void] {
  const [config, setConfig] = useState({
    visible: initConfig?.visible || false,
    action: initConfig?.action || {
      label: 'OK',
      accessibilityLabel: 'OK',
      onPress: () => setValues(),
    },
    duration: initConfig?.duration || 3000,
    message: initConfig?.message || '',
  });

  const handleClose = useCallback(() => {
    setConfig((conf) => ({ ...conf, visible: false, message: '' }));
  }, []);

  const setValues = useCallback((value?: Partial<ISnackbarConfig>) => {
    setConfig((conf) => ({
      visible: value?.visible || false,
      message: value?.message || '',
      action: value?.action || conf.action,
      duration: value?.duration || 3000,
    }));
  }, []);

  return [
    <Snackbar
      visible={config.visible}
      action={config.action}
      duration={config.duration}
      onDismiss={handleClose}
    >
      <Text>{config.message}</Text>
    </Snackbar>,
    setValues,
  ];
}

export default useSnackbar;
