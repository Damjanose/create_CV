import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  FlatList,
  StyleSheet,
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Template {
  id: string;
  preview?: React.ReactNode;
}

interface TemplateSelectStepProps {
  templates: Template[];
  selectedTemplate: string;
  setSelectedTemplate: (id: string) => void;
  styles: any;
  isDark: boolean;
}

const ITEM_GAP = 16;
const ITEM_WIDTH = SCREEN_WIDTH * 0.9;

const TemplateSelectStep: React.FC<TemplateSelectStepProps> = ({
  templates,
  selectedTemplate,
  setSelectedTemplate,
}) => {
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const idx = templates.findIndex(t => t.id === selectedTemplate);
    if (idx >= 0 && flatListRef.current) {
      flatListRef.current.scrollToIndex({ index: idx, animated: true });
    }
  }, [selectedTemplate]);

  return (
    <View style={{ flex: 1 }}>
      <Text style={stylesContainer.title}>Choose Your CV Template</Text>

      <FlatList
        ref={flatListRef}
        data={templates}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        snapToInterval={ITEM_WIDTH + ITEM_GAP}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 0,
        }}
        getItemLayout={(_, index) => ({
          length: ITEM_WIDTH + ITEM_GAP,
          offset: (ITEM_WIDTH + ITEM_GAP) * index,
          index,
        })}
        renderItem={({ item, index }) => {
          const isSelected = item.id === selectedTemplate;

          const isFirst = index === 0;
          const isLast = index === templates.length - 1;

          return (
            <View
              style={{
                width: ITEM_WIDTH - 5,
                marginLeft: isFirst ? 0 : ITEM_GAP / 2,
                marginRight: isLast ? 0 : ITEM_GAP / 2,
              }}
            >
              <TouchableOpacity
                onPress={() => setSelectedTemplate(item.id)}
                activeOpacity={0.95}
                style={[
                  {
                    borderRadius: 12,
                    overflow: 'hidden',
                    borderWidth: isSelected ? 3 : 0,
                    borderColor: isSelected ? '#4F8EF7' : 'transparent',
                  },
                ]}
              >
                <View style={stylesContainer.imageContainer}>
                  {item.preview}
                </View>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
};

const stylesContainer = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 12,
    color: '#fff',
  },
  imageContainer: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.52,
  },
});

export default TemplateSelectStep;
