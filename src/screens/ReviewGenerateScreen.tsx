import React from 'react';
import { View, Text, Button, StyleSheet, Alert, useColorScheme } from 'react-native';

const ReviewGenerateScreen = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);

  const handleGeneratePDF = () => {
    // TODO: Implement PDF generation
    Alert.alert('PDF generation coming soon!');
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Review & Generate CV</Text>
        {/* TODO: Show a preview of the CV here */}
        <View style={styles.buttonWrapper}>
          <Button title="Generate PDF" onPress={handleGeneratePDF} color={isDark ? '#4F8EF7' : '#1976D2'} />
        </View>
      </View>
    </View>
  );
};

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: isDark ? '#181A20' : '#f2f4f8',
  },
  card: {
    backgroundColor: isDark ? '#23262F' : '#fff',
    borderRadius: 16,
    padding: 32,
    shadowColor: isDark ? '#000' : '#aaa',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    marginVertical: 32,
    width: '100%',
    maxWidth: 420,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
    color: isDark ? '#fff' : '#222',
  },
  buttonWrapper: {
    marginTop: 24,
    borderRadius: 8,
    overflow: 'hidden',
  },
});

export default ReviewGenerateScreen; 