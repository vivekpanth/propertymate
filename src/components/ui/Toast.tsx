import React from 'react';
import { Animated, Text, StyleSheet } from 'react-native';

export const Toast: React.FC<{ message: string }>=({ message })=>{
  return (
    <Animated.View style={styles.toast}>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: { position: 'absolute', bottom: 24, left: 16, right: 16, backgroundColor: '#111827', padding: 12, borderRadius: 12 },
  text: { color: '#fff' },
});


