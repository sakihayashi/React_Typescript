import AppState from './appState';

/**
 * A method decorator to ensure isLoading is true until the first 'isLoading' method is done.
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function isLoading(
  target: object,
  propertyName: string,
  propertyDescriptor: PropertyDescriptor): PropertyDescriptor {
  const method = propertyDescriptor.value;
  propertyDescriptor.value = function(...args: any[]) {
    let isLoadingInitiator: boolean = false;
    const appState = (this instanceof AppState) ? this : this.appState;
    if (!appState.isLoading) {
      appState.setIsLoading(true);
      isLoadingInitiator = true;
    }
    return method.apply(this, args)
      .then((result: any) => {
        if (isLoadingInitiator) {
          appState.setIsLoading(false);
        }
        return result;
      });
  };
  return propertyDescriptor;
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function handleErrorResponse(
  target: object,
  propertyName: string,
  propertyDescriptor: PropertyDescriptor): PropertyDescriptor {
  const method = propertyDescriptor.value;
  propertyDescriptor.value = function(...args: any[]) {
    const appState = (this instanceof AppState) ? this : this.appState;
    return method.apply(this, args)
      .then((response: any) => appState.notificationOnError(response));
  };
  return propertyDescriptor;
}
