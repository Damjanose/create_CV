import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface Template {
  id: string;
  preview: React.ReactNode;
}

interface TemplateSelectStepProps {
  templates: Template[];
  selectedTemplate: string;
  setSelectedTemplate: (id: string) => void;
}

const TemplateSelectStep: React.FC<TemplateSelectStepProps> = ({
  templates,
  selectedTemplate,
  setSelectedTemplate,
}) => {
  const ITEM_WIDTH = SCREEN_WIDTH * 0.9;
  const ITEM_HEIGHT = SCREEN_HEIGHT * 0.52;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your CV Template</Text>

      <Carousel
        width={ITEM_WIDTH}
        height={ITEM_HEIGHT}
        data={templates}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50,
        }}
        style={{ alignSelf: "center" }}
        scrollAnimationDuration={500}
        pagingEnabled
        renderItem={({ item }) => {
          const isSelected = item.id === selectedTemplate;

          return (
            <TouchableOpacity
              activeOpacity={0.95}
              onPress={() => setSelectedTemplate(item.id)}
              style={[styles.cardWrapper, isSelected && styles.selectedCard]}
            >
              <View style={styles.imageContainer}>{item.preview}</View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 16,
  },
  cardWrapper: {
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
    backgroundColor: "#1c1c1c",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  selectedCard: {
    borderColor: "#4F8EF7",
  },
  imageContainer: {
    width: "100%",
    height: "100%",
  },
});

export default TemplateSelectStep;
