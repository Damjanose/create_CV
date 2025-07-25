import React from 'react';
import { View, TouchableOpacity, ScrollView, Text, StyleProp, ViewStyle, TextStyle, Dimensions } from 'react-native';

const CARD_WIDTH = 220;
const CARD_HEIGHT = 165; // 4:3 aspect ratio

interface Template {
  id: string;
  name: string;
  description: string;
  preview?: React.ReactNode;
}

interface TemplateSelectStepProps {
  templates: Template[];
  selectedTemplate: string;
  setSelectedTemplate: (id: string) => void;
  styles: { [key: string]: StyleProp<ViewStyle | TextStyle> };
  isDark: boolean;
}

const TemplateSelectStep: React.FC<TemplateSelectStepProps> = ({
  templates,
  selectedTemplate,
  setSelectedTemplate,
  styles,
  isDark,
}) => (
  <View style={{ paddingVertical: 32, alignItems: 'center' }}>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ alignItems: 'center', paddingHorizontal: 24 }}
      style={{ width: '100%', marginTop: 32 }}
    >
      {templates.map((template) => {
        const isSelected = selectedTemplate === template.id;
        return (
          <TouchableOpacity
            key={template.id}
            style={{
              marginHorizontal: 16,
              borderWidth: isSelected ? 3 : 0,
              borderColor: isSelected ? (isDark ? '#4F8EF7' : '#1976D2') : 'transparent',
              borderRadius: 18,
              backgroundColor: isDark ? '#23262F' : '#fff',
              shadowOpacity: isSelected ? 0.25 : 0.08,
              elevation: isSelected ? 8 : 2,
              shadowColor: isDark ? '#4F8EF7' : '#1976D2',
              shadowOffset: { width: 0, height: 4 },
              shadowRadius: 12,
              width: CARD_WIDTH,
              height: CARD_HEIGHT,
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              padding: 0,
            }}
            onPress={() => setSelectedTemplate(template.id)}
            activeOpacity={0.85}
          >
            {/* Image fills the card, no stretching, rounded corners */}
            <View style={{ width: '100%', height: '100%', borderRadius: 16, overflow: 'hidden', backgroundColor: '#f2f4f8', justifyContent: 'center', alignItems: 'center' }}>
              {template.preview}
            </View>
            {isSelected && (
              <View style={{ position: 'absolute', top: 12, right: 12, backgroundColor: isDark ? '#4F8EF7' : '#1976D2', borderRadius: 12, padding: 2, paddingHorizontal: 7, zIndex: 2 }}>
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  </View>
);

export default TemplateSelectStep; 