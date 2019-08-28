import { TransitionDirectionMap, DefaultTransitionDelay } from './constants';

export function getTransitionDirection(anchorOrigin) {
  if (anchorOrigin.horizontal !== 'center') {
    return TransitionDirectionMap[anchorOrigin.horizontal];
  }

  return TransitionDirectionMap[anchorOrigin.vertical];
}

export function getTransitionDelay(transitionProps) {
  let transitionDelay = DefaultTransitionDelay;
  if (transitionProps !== undefined) transitionDelay = transitionProps.timeout;

  return transitionDelay;
}
