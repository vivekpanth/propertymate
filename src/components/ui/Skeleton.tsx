import React from 'react';
import { View, StyleSheet } from 'react-native';

export const Skeleton: React.FC<{ width?: number | string; height?: number; style?: object }>=({ width='100%', height=16, style })=>{
  return <View style={[styles.skel, { width, height }, style]} />;
};

const styles = StyleSheet.create({
  skel: { backgroundColor: '#E5E7EB', borderRadius: 8 },
});


