import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { agentPropertiesApi } from '../../services/api/agentProperties';
import { useTheme } from '../../theme/ThemeProvider';
import { haptics } from '../../utils/haptics';

export const CreatePropertyScreen: React.FC = () => {
  const { colors, typography } = useTheme();
  const [title, setTitle] = useState('');
  const [suburb, setSuburb] = useState('');
  const [propertyType, setPropertyType] = useState<'apartment' | 'house' | 'studio' | 'townhouse' | 'other'>('apartment');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onCreate = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const created = await agentPropertiesApi.createProperty({
        title,
        suburb,
        property_type: propertyType,
        is_rental: false,
      });
      haptics.success();
      Alert.alert('Created', `Property created: ${created.title}`);
      setTitle('');
      setSuburb('');
      setPropertyType('apartment');
    } catch (e: unknown) {
      haptics.error();
      const message = e instanceof Error ? e.message : String(e);
      Alert.alert('Error', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surfaceAlt }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[typography.h2, { color: colors.text }]}>Create Property</Text>
        <Text style={[typography.body, { color: colors.muted }]}>Draft will be created</Text>
      </View>

      <View style={styles.form}>
        <Text style={[styles.label, typography.bodyBold, { color: colors.text }]}>Title</Text>
        <TextInput
          style={[styles.input, { borderColor: colors.muted + '40', color: colors.text }]}
          placeholder="e.g. Modern 2BR Apartment"
          placeholderTextColor={colors.muted}
          value={title}
          onChangeText={setTitle}
        />

        <Text style={[styles.label, typography.bodyBold, { color: colors.text }]}>Suburb</Text>
        <TextInput
          style={[styles.input, { borderColor: colors.muted + '40', color: colors.text }]}
          placeholder="e.g. Sydney CBD"
          placeholderTextColor={colors.muted}
          value={suburb}
          onChangeText={setSuburb}
        />

        <Text style={[styles.label, typography.bodyBold, { color: colors.text }]}>Property Type</Text>
        <View style={styles.typeRow}>
          {(['apartment', 'house', 'studio', 'townhouse', 'other'] as const).map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeChip,
                {
                  backgroundColor: propertyType === type ? colors.primary : colors.surface,
                  borderColor: colors.muted + '40',
                },
              ]}
              onPress={() => setPropertyType(type)}
            >
              <Text style={[typography.caption, { color: propertyType === type ? colors.surface : colors.text }]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={onCreate}
          style={[styles.submitButton, { backgroundColor: colors.primary }]}
          disabled={isSubmitting}
        >
          <Text style={[typography.bodyBold, { color: colors.surface }]}>{isSubmitting ? 'Creating…' : 'Create Draft'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  form: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  label: {
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  submitButton: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
});


