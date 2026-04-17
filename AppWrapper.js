import React, { useEffect } from 'react';
import { Text, TextInput } from 'react-native';
import App from './App';

const AppWrapper = () => {
  useEffect(() => {
    // 👇 Set default font for all Text & TextInput
    if (Text.defaultProps == null) Text.defaultProps = {};
    if (TextInput.defaultProps == null) TextInput.defaultProps = {};

    const oldTextStyle = Text.defaultProps.style || {};
    const oldInputStyle = TextInput.defaultProps.style || {};

    Text.defaultProps.style = [oldTextStyle, { fontFamily: 'Poppins-Regular' }];
    TextInput.defaultProps.style = [oldInputStyle, { fontFamily: 'Poppins-Regular' }];
  }, []);

  return <App />;
};

export default AppWrapper;
