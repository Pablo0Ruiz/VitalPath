import { Image } from 'react-native';

const Logo = () => {
  const logo = require('@/../assets/images/vitalpath-logo.png');
  return <Image source={logo} alt="Logo" className="w-40 h-40" />;
};

export default Logo;
