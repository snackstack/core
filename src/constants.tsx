import React from 'react';
import { Slide, SlideProps, SnackbarOrigin, SvgIcon } from '@material-ui/core';
import { SnackProviderOptions } from './types/snackProviderOptions';
import { ErrorIcon, InfoIcon, SuccessIcon, WarningIcon } from './icons';

export const defaultMaxSnacks = 3;

export const defaultSpacing = 12;

export const defaultAutoHideDuration = 2500;

export const defaultTransitionDelay = 500;

export const startOffset = 20;

// todo: this is all Material-UI specific
export const defaultAnchorOrigin: Exclude<SnackProviderOptions['anchorOrigin'], undefined> = {
  horizontal: 'left',
  vertical: 'bottom',
};

const TransitionDirectionMap: { [key: string]: SlideProps['direction'] } = {
  top: 'down',
  bottom: 'up',
  left: 'right',
  right: 'left',
};

export function getTransitionDirection(anchorOrigin: SnackbarOrigin) {
  if (anchorOrigin.horizontal !== 'center') {
    return TransitionDirectionMap[anchorOrigin.horizontal];
  }

  return TransitionDirectionMap[anchorOrigin.vertical];
}

export const DefaultTransitionComponent: Exclude<
  SnackProviderOptions['TransitionComponent'],
  undefined
> = anchorOrigin => props => <Slide {...props} direction={getTransitionDirection(anchorOrigin)} />;

export const VariantIcons: { [key: string]: typeof SvgIcon | null } = {
  default: null,
  success: SuccessIcon,
  info: InfoIcon,
  warning: WarningIcon,
  error: ErrorIcon,
};
