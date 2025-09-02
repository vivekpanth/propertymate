import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { supabase } from '../../services/supabase';

export const SignInScreen: React.FC = () => {
  const [email, setEmail] = useState('');

  const sendMagicLink = async () => {
    if (!email) {
      Alert.alert('Enter your email');
      return;
    }
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: 'propertymate://auth-callback' },
    });
    if (error) {
      Alert.alert('Error', error.message);
      return;
    }
    Alert.alert('Check your email for the magic link');
  };

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
      <TextInput
        placeholder="you@example.com"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, marginBottom: 12 }}
      />
      <Button title="Send magic link" onPress={sendMagicLink} />
    </View>
  );
};