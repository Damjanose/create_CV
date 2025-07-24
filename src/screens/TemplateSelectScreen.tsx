import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';

interface Template {
  id: string;
  name: string;
  description: string;
}

const TEMPLATES: Template[] = [
  { id: 'classic', name: 'Classic', description: 'A clean, traditional layout.' },
  { id: 'modern', name: 'Modern', description: 'A stylish, contemporary look.' },
  { id: 'minimal', name: 'Minimal', description: 'Simple and elegant.' },
];

interface Props {
  selected: string;
  setSelected: (id: string) => void;
  isWizard?: boolean;
}

const TemplateSelectScreen: React.FC<Props> = ({ selected, setSelected, isWizard }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);

  return (
    <View style={{ alignItems: 'center', flex: 1, justifyContent: isWizard ? 'flex-start' : 'center' }}>
      <Text style={styles.title}>Choose a CV Template</Text>
      <ScrollView horizontal contentContainerStyle={styles.templatesList} showsHorizontalScrollIndicator={false}>
        {TEMPLATES.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.templateCard, selected === item.id && styles.selectedTemplate]}
            onPress={() => setSelected(item.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.templateName}>{item.name}</Text>
            <Text style={styles.templateDesc}>{item.description}</Text>
            {selected === item.id && (
              <Text style={styles.selectedLabel}>Selected</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const getStyles = (isDark: boolean) => StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: isDark ? '#fff' : '#222',
  },
  templatesList: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
    gap: 16,
  },
  templateCard: {
    width: 140,
    height: 180,
    backgroundColor: isDark ? '#181A20' : '#f7f9fa',
    borderRadius: 12,
    marginHorizontal: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: isDark ? '#000' : '#aaa',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  selectedTemplate: {
    borderColor: isDark ? '#4F8EF7' : '#1976D2',
    shadowOpacity: 0.18,
    elevation: 4,
  },
  templateName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDark ? '#fff' : '#222',
    marginBottom: 8,
  },
  selectedLabel: {
    color: isDark ? '#4F8EF7' : '#1976D2',
    fontWeight: 'bold',
    marginTop: 8,
  },
  templateDesc: {
    fontSize: 14,
    color: isDark ? '#aaa' : '#555',
    textAlign: 'center',
    marginBottom: 12,
  },
});

export default TemplateSelectScreen; 