import { Image } from 'react-native';

const Logo = () => {
  const logo = require('@/../assets/images/vitalpath-logo.png');
  return <Image source={logo} alt="Logo" className="w-20 h-20" />;
};

export default Logo;
