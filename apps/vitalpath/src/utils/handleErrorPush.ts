import { Alert } from 'react-native';

export function handleRegistrationError(errorMessage: string) {
  Alert.alert('Error', errorMessage);
  throw new Error(errorMessage);
}
