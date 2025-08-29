import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

export const Chip: React.FC<{ label: string; onPress?: () => void }>=({ label, onPress }) =>{
  const { colors } = useTheme();
  return (
    <TouchableOpacity style={[styles.chip, { backgroundColor: colors.surfaceAlt }]} onPress={onPress}>
      <Text style={{ color: colors.text }}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 9999 },
});


