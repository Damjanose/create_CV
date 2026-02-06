import React, { useState, useMemo } from "react";
import {
  Image,
  StyleProp,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
  StyleSheet,
  Modal,
  FlatList,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import countriesData from "../../constants/countriesAndCities";

interface AboutMeStepProps {
  aboutMe: {
    summary: string;
    image?: string;
    imageBase64?: string;
  };
  contact: {
    name: string;
    lastname: string;
    phone: string;
    email: string;
  };
  address: {
    countryName: string;
    cityName: string;
    address1: string;
    address2: string;
  };
  setAboutMe: (cb: (prev: any) => any) => void;
  setContact: (cb: (prev: any) => any) => void;
  setAddress: (cb: (prev: any) => any) => void;
  styles: { [key: string]: StyleProp<ViewStyle | TextStyle> };
  isDark: boolean;
  launchImageLibrary: () => Promise<void>;
  launchCamera: () => Promise<void>;
}

const AboutMeStep: React.FC<AboutMeStepProps> = ({
  aboutMe,
  contact,
  address,
  setAboutMe,
  setContact,
  setAddress,
  styles,
  isDark,
  launchImageLibrary,
  launchCamera,
}) => {
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);

  // Extract countries from the data
  const countries = useMemo(() => {
    return countriesData.data?.map((country) => country.name) || [];
  }, []);

  // Get cities for selected country
  const cities = useMemo(() => {
    if (!address.countryName) return [];
    const selectedCountry = countriesData.data?.find(
      (country) => country.name === address.countryName
    );
    return selectedCountry?.states?.map((state) => state.name) || [];
  }, [address.countryName]);

  const handleCountrySelect = (country: string) => {
    setAddress((prev: any) => ({
      ...prev,
      countryName: country,
      cityName: "", // Reset city when country changes
    }));
    setShowCountryPicker(false);
  };

  const handleCitySelect = (city: string) => {
    setAddress((prev: any) => ({ ...prev, cityName: city }));
    setShowCityPicker(false);
  };

  return (
  <View>
    <Text style={styles.title}>About Me, Contact & Address</Text>
    <View style={{ alignItems: "center", marginVertical: 16 }}>
      <Image
        source={
          aboutMe.image
            ? { uri: aboutMe.image }
            : require("../../assets/images/user.png")
        }
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: "#eee",
          marginBottom: 8,
        }}
      />
      <View style={formStyles.photoButtonsContainer}>
        <TouchableOpacity
          style={[
            formStyles.photoButton,
            { backgroundColor: isDark ? "#4F8EF7" : "#1976D2" },
          ]}
          onPress={launchImageLibrary}
        >
          <MaterialCommunityIcons name="upload" size={18} color="#fff" />
          <Text style={formStyles.photoButtonText}>Upload Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            formStyles.photoButton,
            { backgroundColor: isDark ? "#4F8EF7" : "#1976D2" },
          ]}
          onPress={launchCamera}
        >
          <MaterialCommunityIcons name="camera" size={18} color="#fff" />
          <Text style={formStyles.photoButtonText}>Take Photo</Text>
        </TouchableOpacity>
      </View>
    </View>
    <View style={formStyles.section}>
      <Text style={[styles.label, formStyles.sectionTitle]}>Contact Information</Text>
      <View style={formStyles.inputContainer}>
        <MaterialCommunityIcons
          name="account"
          size={20}
          color={isDark ? "#4F8EF7" : "#1976D2"}
          style={formStyles.inputIcon}
        />
        <TextInput
          style={[styles.input, formStyles.input]}
          placeholder="First Name"
          value={contact.name}
          onChangeText={(name) => setContact((prev: any) => ({ ...prev, name }))}
          placeholderTextColor={isDark ? "#888" : "#999"}
        />
      </View>
      <View style={formStyles.inputContainer}>
        <MaterialCommunityIcons
          name="account"
          size={20}
          color={isDark ? "#4F8EF7" : "#1976D2"}
          style={formStyles.inputIcon}
        />
        <TextInput
          style={[styles.input, formStyles.input]}
          placeholder="Last Name"
          value={contact.lastname}
          onChangeText={(lastname) =>
            setContact((prev: any) => ({ ...prev, lastname }))
          }
          placeholderTextColor={isDark ? "#888" : "#999"}
        />
      </View>
      <View style={formStyles.inputContainer}>
        <MaterialCommunityIcons
          name="phone"
          size={20}
          color={isDark ? "#4F8EF7" : "#1976D2"}
          style={formStyles.inputIcon}
        />
        <TextInput
          style={[styles.input, formStyles.input]}
          placeholder="Phone"
          value={contact.phone}
          onChangeText={(phone) => setContact((prev: any) => ({ ...prev, phone }))}
          keyboardType="phone-pad"
          placeholderTextColor={isDark ? "#888" : "#999"}
        />
      </View>
      <View style={formStyles.inputContainer}>
        <MaterialCommunityIcons
          name="email"
          size={20}
          color={isDark ? "#4F8EF7" : "#1976D2"}
          style={formStyles.inputIcon}
        />
        <TextInput
          style={[styles.input, formStyles.input]}
          placeholder="Email"
          value={contact.email}
          onChangeText={(email) => setContact((prev: any) => ({ ...prev, email }))}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={isDark ? "#888" : "#999"}
        />
      </View>
    </View>

    <View style={formStyles.section}>
      <Text style={[styles.label, formStyles.sectionTitle]}>Address</Text>
      <View style={formStyles.inputContainer}>
        <MaterialCommunityIcons
          name="map-marker"
          size={20}
          color={isDark ? "#4F8EF7" : "#1976D2"}
          style={formStyles.inputIcon}
        />
        <TouchableOpacity
          style={[styles.input, formStyles.input, formStyles.pickerButton]}
          onPress={() => setShowCountryPicker(true)}
        >
          <Text
            style={[
              formStyles.pickerText,
              !address.countryName && {
                color: isDark ? "#888" : "#999",
              },
            ]}
          >
            {address.countryName || "Select Country"}
          </Text>
          <MaterialCommunityIcons
            name="chevron-down"
            size={20}
            color={isDark ? "#888" : "#999"}
          />
        </TouchableOpacity>
      </View>
      <View style={formStyles.inputContainer}>
        <MaterialCommunityIcons
          name="city"
          size={20}
          color={
            address.countryName
              ? isDark
                ? "#4F8EF7"
                : "#1976D2"
              : isDark
              ? "#444"
              : "#ccc"
          }
          style={formStyles.inputIcon}
        />
        <TouchableOpacity
          style={[
            styles.input,
            formStyles.input,
            formStyles.pickerButton,
            !address.countryName && formStyles.pickerButtonDisabled,
          ]}
          onPress={() => address.countryName && setShowCityPicker(true)}
          disabled={!address.countryName}
        >
          <Text
            style={[
              formStyles.pickerText,
              !address.cityName && {
                color: isDark ? "#888" : "#999",
              },
              !address.countryName && {
                color: isDark ? "#444" : "#ccc",
              },
            ]}
          >
            {address.cityName || "Select City"}
          </Text>
          <MaterialCommunityIcons
            name="chevron-down"
            size={20}
            color={
              address.countryName
                ? isDark
                  ? "#888"
                  : "#999"
                : isDark
                ? "#444"
                : "#ccc"
            }
          />
        </TouchableOpacity>
      </View>
      <View style={formStyles.inputContainer}>
        <MaterialCommunityIcons
          name="home"
          size={20}
          color={isDark ? "#4F8EF7" : "#1976D2"}
          style={formStyles.inputIcon}
        />
        <TextInput
          style={[styles.input, formStyles.input]}
          placeholder="Address Line 1"
          value={address.address1}
          onChangeText={(address1) =>
            setAddress((prev: any) => ({ ...prev, address1 }))
          }
          placeholderTextColor={isDark ? "#888" : "#999"}
        />
      </View>
      <View style={formStyles.inputContainer}>
        <MaterialCommunityIcons
          name="home-variant"
          size={20}
          color={isDark ? "#4F8EF7" : "#1976D2"}
          style={formStyles.inputIcon}
        />
        <TextInput
          style={[styles.input, formStyles.input]}
          placeholder="Address Line 2 (optional)"
          value={address.address2}
          onChangeText={(address2) =>
            setAddress((prev: any) => ({ ...prev, address2 }))
          }
          placeholderTextColor={isDark ? "#888" : "#999"}
        />
      </View>
    </View>

    <View style={formStyles.section}>
      <Text style={[styles.label, formStyles.sectionTitle]}>About Me</Text>
      <TextInput
        style={[styles.input, formStyles.textArea]}
        placeholder="Write something about yourself..."
        value={aboutMe.summary}
        onChangeText={(summary) =>
          setAboutMe((prev: any) => ({ ...prev, summary }))
        }
        multiline
        textAlignVertical="top"
        placeholderTextColor={isDark ? "#888" : "#999"}
      />
    </View>

    {/* Country Picker Modal */}
    <Modal
      visible={showCountryPicker}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowCountryPicker(false)}
    >
      <View style={formStyles.modalOverlay}>
        <View
          style={[
            formStyles.modalContent,
            { backgroundColor: isDark ? "#2A2D35" : "#FFF" },
          ]}
        >
          <View style={formStyles.modalHeader}>
            <Text
              style={[
                formStyles.modalTitle,
                { color: isDark ? "#FFF" : "#222" },
              ]}
            >
              Select Country
            </Text>
            <TouchableOpacity onPress={() => setShowCountryPicker(false)}>
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={isDark ? "#FFF" : "#222"}
              />
            </TouchableOpacity>
          </View>
          <FlatList
            data={countries}
            keyExtractor={(item, index) => `${item}-${index}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  formStyles.modalItem,
                  address.countryName === item && formStyles.modalItemSelected,
                  { backgroundColor: isDark ? "#23262F" : "#F5F5F5" },
                ]}
                onPress={() => handleCountrySelect(item)}
              >
                <Text
                  style={[
                    formStyles.modalItemText,
                    { color: isDark ? "#FFF" : "#222" },
                    address.countryName === item && {
                      color: isDark ? "#4F8EF7" : "#1976D2",
                      fontWeight: "600",
                    },
                  ]}
                >
                  {item}
                </Text>
                {address.countryName === item && (
                  <MaterialCommunityIcons
                    name="check"
                    size={20}
                    color={isDark ? "#4F8EF7" : "#1976D2"}
                  />
                )}
              </TouchableOpacity>
            )}
            style={formStyles.modalList}
          />
        </View>
      </View>
    </Modal>

    {/* City Picker Modal */}
    <Modal
      visible={showCityPicker}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowCityPicker(false)}
    >
      <View style={formStyles.modalOverlay}>
        <View
          style={[
            formStyles.modalContent,
            { backgroundColor: isDark ? "#2A2D35" : "#FFF" },
          ]}
        >
          <View style={formStyles.modalHeader}>
            <Text
              style={[
                formStyles.modalTitle,
                { color: isDark ? "#FFF" : "#222" },
              ]}
            >
              Select City
            </Text>
            <TouchableOpacity onPress={() => setShowCityPicker(false)}>
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={isDark ? "#FFF" : "#222"}
              />
            </TouchableOpacity>
          </View>
          {cities.length > 0 ? (
            <FlatList
              data={cities}
              keyExtractor={(item, index) => `${item}-${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    formStyles.modalItem,
                    address.cityName === item && formStyles.modalItemSelected,
                    { backgroundColor: isDark ? "#23262F" : "#F5F5F5" },
                  ]}
                  onPress={() => handleCitySelect(item)}
                >
                  <Text
                    style={[
                      formStyles.modalItemText,
                      { color: isDark ? "#FFF" : "#222" },
                      address.cityName === item && {
                        color: isDark ? "#4F8EF7" : "#1976D2",
                        fontWeight: "600",
                      },
                    ]}
                  >
                    {item}
                  </Text>
                  {address.cityName === item && (
                    <MaterialCommunityIcons
                      name="check"
                      size={20}
                      color={isDark ? "#4F8EF7" : "#1976D2"}
                    />
                  )}
                </TouchableOpacity>
              )}
              style={formStyles.modalList}
            />
          ) : (
            <View style={formStyles.modalEmpty}>
              <Text style={{ color: isDark ? "#888" : "#666" }}>
                No cities available. Please select a country first.
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  </View>
  );
};

const formStyles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    marginTop: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  photoButtonsContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  photoButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  photoButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  pickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 12,
  },
  pickerButtonDisabled: {
    opacity: 0.5,
  },
  pickerText: {
    flex: 1,
    fontSize: 16,
    color: "#222",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  modalList: {
    maxHeight: 400,
  },
  modalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  modalItemSelected: {
    backgroundColor: "#E3F2FD",
  },
  modalItemText: {
    fontSize: 16,
    flex: 1,
  },
  modalEmpty: {
    padding: 40,
    alignItems: "center",
  },
});

export default AboutMeStep;
