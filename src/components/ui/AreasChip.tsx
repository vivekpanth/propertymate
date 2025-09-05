import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { haptics } from '../../utils/haptics';

interface AreasChipProps {
  roomCount: number;
  onPress: () => void;
}

export const AreasChip: React.FC<AreasChipProps> = ({ roomCount, onPress }) => {
  const { colors, typography } = useTheme();

  const handlePress = () => {
    haptics.light();
    onPress();
  };

  return (
    <TouchableOpacity
      style={[styles.chip, { backgroundColor: colors.primary }]}
      onPress={handlePress}
    >
      <Text style={[styles.chipText, typography.captionBold, { color: '#fff' }]}>
        Areas • {roomCount}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  chipText: {
    color: '#fff',
  },
});
