import React, { useState, useMemo, useRef, useCallback } from "react";
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
  fieldErrors?: Record<string, string>;
  validateField?: (field: string) => void;
  clearFieldError?: (field: string) => void;
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
  fieldErrors = {},
  validateField,
  clearFieldError,
}) => {
  const errorBorder = { borderColor: "#E53935", borderWidth: 1.5 };
  const renderFieldError = (key: string) =>
    fieldErrors[key] ? (
      <Text style={{ color: "#E53935", fontSize: 12, marginTop: 2, marginBottom: 4, marginLeft: 32 }}>
        {fieldErrors[key]}
      </Text>
    ) : null;

  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const countryListRef = useRef<FlatList>(null);
  const cityListRef = useRef<FlatList>(null);

  const ITEM_HEIGHT = 49; // paddingVertical 14 * 2 + borderBottom 1 + ~20 text

  const getItemLayout = useCallback((_: any, index: number) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  }), []);

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

  // Filtered lists
  const filteredCountries = useMemo(() => {
    if (!countrySearch.trim()) return countries;
    const q = countrySearch.toLowerCase();
    return countries.filter((c) => c.toLowerCase().includes(q));
  }, [countries, countrySearch]);

  const filteredCities = useMemo(() => {
    if (!citySearch.trim()) return cities;
    const q = citySearch.toLowerCase();
    return cities.filter((c) => c.toLowerCase().includes(q));
  }, [cities, citySearch]);

  const handleCountrySelect = (country: string) => {
    clearFieldError?.("countryName");
    clearFieldError?.("cityName");
    setAddress((prev: any) => ({
      ...prev,
      countryName: country,
      cityName: "",
    }));
    setCountrySearch("");
    setShowCountryPicker(false);
  };

  const handleCitySelect = (city: string) => {
    clearFieldError?.("cityName");
    setAddress((prev: any) => ({ ...prev, cityName: city }));
    setCitySearch("");
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
          style={[styles.input, formStyles.input, fieldErrors.name && errorBorder]}
          placeholder="First Name"
          value={contact.name}
          onChangeText={(name) => { clearFieldError?.("name"); setContact((prev: any) => ({ ...prev, name })); }}
          onBlur={() => validateField?.("name")}
          placeholderTextColor={isDark ? "#888" : "#999"}
        />
      </View>
      {renderFieldError("name")}
      <View style={formStyles.inputContainer}>
        <MaterialCommunityIcons
          name="account"
          size={20}
          color={isDark ? "#4F8EF7" : "#1976D2"}
          style={formStyles.inputIcon}
        />
        <TextInput
          style={[styles.input, formStyles.input, fieldErrors.lastname && errorBorder]}
          placeholder="Last Name"
          value={contact.lastname}
          onChangeText={(lastname) => { clearFieldError?.("lastname"); setContact((prev: any) => ({ ...prev, lastname })); }}
          onBlur={() => validateField?.("lastname")}
          placeholderTextColor={isDark ? "#888" : "#999"}
        />
      </View>
      {renderFieldError("lastname")}
      <View style={formStyles.inputContainer}>
        <MaterialCommunityIcons
          name="phone"
          size={20}
          color={isDark ? "#4F8EF7" : "#1976D2"}
          style={formStyles.inputIcon}
        />
        <TextInput
          style={[styles.input, formStyles.input, fieldErrors.phone && errorBorder]}
          placeholder="Phone"
          value={contact.phone}
          onChangeText={(phone) => { clearFieldError?.("phone"); setContact((prev: any) => ({ ...prev, phone })); }}
          keyboardType="phone-pad"
          onBlur={() => validateField?.("phone")}
          placeholderTextColor={isDark ? "#888" : "#999"}
        />
      </View>
      {renderFieldError("phone")}
      <View style={formStyles.inputContainer}>
        <MaterialCommunityIcons
          name="email"
          size={20}
          color={isDark ? "#4F8EF7" : "#1976D2"}
          style={formStyles.inputIcon}
        />
        <TextInput
          style={[styles.input, formStyles.input, fieldErrors.email && errorBorder]}
          placeholder="Email"
          value={contact.email}
          onChangeText={(email) => { clearFieldError?.("email"); setContact((prev: any) => ({ ...prev, email })); }}
          keyboardType="email-address"
          autoCapitalize="none"
          onBlur={() => validateField?.("email")}
          placeholderTextColor={isDark ? "#888" : "#999"}
        />
      </View>
      {renderFieldError("email")}
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
          style={[styles.input, formStyles.input, formStyles.pickerButton, fieldErrors.countryName && errorBorder]}
          onPress={() => setShowCountryPicker(true)}
        >
          <Text
            style={[
              formStyles.pickerText,
              { color: isDark ? "#FFF" : "#222" },
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
      {renderFieldError("countryName")}
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
            fieldErrors.cityName && errorBorder,
          ]}
          onPress={() => address.countryName && setShowCityPicker(true)}
          disabled={!address.countryName}
        >
          <Text
            style={[
              formStyles.pickerText,
              { color: isDark ? "#FFF" : "#222" },
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
      {renderFieldError("cityName")}
      <View style={formStyles.inputContainer}>
        <MaterialCommunityIcons
          name="home"
          size={20}
          color={isDark ? "#4F8EF7" : "#1976D2"}
          style={formStyles.inputIcon}
        />
        <TextInput
          style={[styles.input, formStyles.input, fieldErrors.address1 && errorBorder]}
          placeholder="Address Line 1"
          value={address.address1}
          onChangeText={(address1) => { clearFieldError?.("address1"); setAddress((prev: any) => ({ ...prev, address1 })); }}
          onBlur={() => validateField?.("address1")}
          placeholderTextColor={isDark ? "#888" : "#999"}
        />
      </View>
      {renderFieldError("address1")}
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
        style={[styles.input, formStyles.textArea, fieldErrors.summary && errorBorder]}
        placeholder="Write something about yourself..."
        value={aboutMe.summary}
        onChangeText={(summary) => { clearFieldError?.("summary"); setAboutMe((prev: any) => ({ ...prev, summary })); }}
        multiline
        textAlignVertical="top"
        onBlur={() => validateField?.("summary")}
        placeholderTextColor={isDark ? "#888" : "#999"}
      />
      {renderFieldError("summary")}
    </View>

    {/* Country Picker Modal */}
    <Modal
      visible={showCountryPicker}
      transparent={true}
      animationType="slide"
      onRequestClose={() => { setCountrySearch(""); setShowCountryPicker(false); }}
    >
      <View style={formStyles.modalOverlay}>
        <View
          style={[
            formStyles.modalContent,
            { backgroundColor: isDark ? "#2A2D35" : "#FFF" },
          ]}
        >
          <View style={formStyles.modalHandle}>
            <View style={[formStyles.handleBar, { backgroundColor: isDark ? "#555" : "#D0D0D0" }]} />
          </View>
          <View style={[formStyles.modalHeader, { borderBottomColor: isDark ? "#3A3D45" : "#ECECEC" }]}>
            <Text
              style={[
                formStyles.modalTitle,
                { color: isDark ? "#FFF" : "#1A1A1A" },
              ]}
            >
              Select Country
            </Text>
            <TouchableOpacity
              style={[formStyles.closeButton, { backgroundColor: isDark ? "#3A3D45" : "#F0F0F0" }]}
              onPress={() => { setCountrySearch(""); setShowCountryPicker(false); }}
            >
              <MaterialCommunityIcons
                name="close"
                size={18}
                color={isDark ? "#AAA" : "#666"}
              />
            </TouchableOpacity>
          </View>
          <View style={[formStyles.searchContainer, { backgroundColor: isDark ? "#1E2028" : "#F5F5F5" }]}>
            <MaterialCommunityIcons name="magnify" size={20} color={isDark ? "#666" : "#999"} />
            <TextInput
              style={[formStyles.searchInput, { color: isDark ? "#FFF" : "#222" }]}
              placeholder="Search countries..."
              placeholderTextColor={isDark ? "#666" : "#999"}
              value={countrySearch}
              onChangeText={setCountrySearch}
              autoCorrect={false}
            />
            {countrySearch.length > 0 && (
              <TouchableOpacity onPress={() => setCountrySearch("")}>
                <MaterialCommunityIcons name="close-circle" size={18} color={isDark ? "#666" : "#999"} />
              </TouchableOpacity>
            )}
          </View>
          <FlatList
            ref={countryListRef}
            data={filteredCountries}
            keyExtractor={(item, index) => `${item}-${index}`}
            getItemLayout={getItemLayout}
            onLayout={() => {
              if (!countrySearch && address.countryName) {
                const idx = filteredCountries.indexOf(address.countryName);
                if (idx > 0) {
                  countryListRef.current?.scrollToIndex({ index: idx, animated: false, viewPosition: 0.3 });
                }
              }
            }}
            renderItem={({ item }) => {
              const isSelected = address.countryName === item;
              return (
                <TouchableOpacity
                  style={[
                    formStyles.modalItem,
                    { borderBottomColor: isDark ? "#2A2D35" : "#F0F0F0" },
                    isSelected && { backgroundColor: isDark ? "#1a2a4a" : "#E3F2FD" },
                  ]}
                  onPress={() => handleCountrySelect(item)}
                >
                  <Text
                    style={[
                      formStyles.modalItemText,
                      { color: isDark ? "#E0E0E0" : "#333" },
                      isSelected && {
                        color: isDark ? "#4F8EF7" : "#1976D2",
                        fontWeight: "600",
                      },
                    ]}
                  >
                    {item}
                  </Text>
                  {isSelected && (
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={22}
                      color={isDark ? "#4F8EF7" : "#1976D2"}
                    />
                  )}
                </TouchableOpacity>
              );
            }}
            style={formStyles.modalList}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <View style={formStyles.modalEmpty}>
                <MaterialCommunityIcons name="map-search" size={40} color={isDark ? "#444" : "#CCC"} />
                <Text style={{ color: isDark ? "#666" : "#999", marginTop: 12, fontSize: 15 }}>
                  No countries found
                </Text>
              </View>
            }
          />
        </View>
      </View>
    </Modal>

    {/* City Picker Modal */}
    <Modal
      visible={showCityPicker}
      transparent={true}
      animationType="slide"
      onRequestClose={() => { setCitySearch(""); setShowCityPicker(false); }}
    >
      <View style={formStyles.modalOverlay}>
        <View
          style={[
            formStyles.modalContent,
            { backgroundColor: isDark ? "#2A2D35" : "#FFF" },
          ]}
        >
          <View style={formStyles.modalHandle}>
            <View style={[formStyles.handleBar, { backgroundColor: isDark ? "#555" : "#D0D0D0" }]} />
          </View>
          <View style={[formStyles.modalHeader, { borderBottomColor: isDark ? "#3A3D45" : "#ECECEC" }]}>
            <Text
              style={[
                formStyles.modalTitle,
                { color: isDark ? "#FFF" : "#1A1A1A" },
              ]}
            >
              Select City
            </Text>
            <TouchableOpacity
              style={[formStyles.closeButton, { backgroundColor: isDark ? "#3A3D45" : "#F0F0F0" }]}
              onPress={() => { setCitySearch(""); setShowCityPicker(false); }}
            >
              <MaterialCommunityIcons
                name="close"
                size={18}
                color={isDark ? "#AAA" : "#666"}
              />
            </TouchableOpacity>
          </View>
          <View style={[formStyles.searchContainer, { backgroundColor: isDark ? "#1E2028" : "#F5F5F5" }]}>
            <MaterialCommunityIcons name="magnify" size={20} color={isDark ? "#666" : "#999"} />
            <TextInput
              style={[formStyles.searchInput, { color: isDark ? "#FFF" : "#222" }]}
              placeholder="Search cities..."
              placeholderTextColor={isDark ? "#666" : "#999"}
              value={citySearch}
              onChangeText={setCitySearch}
              autoCorrect={false}
            />
            {citySearch.length > 0 && (
              <TouchableOpacity onPress={() => setCitySearch("")}>
                <MaterialCommunityIcons name="close-circle" size={18} color={isDark ? "#666" : "#999"} />
              </TouchableOpacity>
            )}
          </View>
          {filteredCities.length > 0 || citySearch.length > 0 ? (
            <FlatList
              ref={cityListRef}
              data={filteredCities}
              keyExtractor={(item, index) => `${item}-${index}`}
              getItemLayout={getItemLayout}
              onLayout={() => {
                if (!citySearch && address.cityName) {
                  const idx = filteredCities.indexOf(address.cityName);
                  if (idx > 0) {
                    cityListRef.current?.scrollToIndex({ index: idx, animated: false, viewPosition: 0.3 });
                  }
                }
              }}
              renderItem={({ item }) => {
                const isSelected = address.cityName === item;
                return (
                  <TouchableOpacity
                    style={[
                      formStyles.modalItem,
                      { borderBottomColor: isDark ? "#2A2D35" : "#F0F0F0" },
                      isSelected && { backgroundColor: isDark ? "#1a2a4a" : "#E3F2FD" },
                    ]}
                    onPress={() => handleCitySelect(item)}
                  >
                    <Text
                      style={[
                        formStyles.modalItemText,
                        { color: isDark ? "#E0E0E0" : "#333" },
                        isSelected && {
                          color: isDark ? "#4F8EF7" : "#1976D2",
                          fontWeight: "600",
                        },
                      ]}
                    >
                      {item}
                    </Text>
                    {isSelected && (
                      <MaterialCommunityIcons
                        name="check-circle"
                        size={22}
                        color={isDark ? "#4F8EF7" : "#1976D2"}
                      />
                    )}
                  </TouchableOpacity>
                );
              }}
              style={formStyles.modalList}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={
                <View style={formStyles.modalEmpty}>
                  <MaterialCommunityIcons name="map-search" size={40} color={isDark ? "#444" : "#CCC"} />
                  <Text style={{ color: isDark ? "#666" : "#999", marginTop: 12, fontSize: 15 }}>
                    No cities found
                  </Text>
                </View>
              }
            />
          ) : (
            <View style={formStyles.modalEmpty}>
              <MaterialCommunityIcons name="map-marker-off" size={40} color={isDark ? "#444" : "#CCC"} />
              <Text style={{ color: isDark ? "#666" : "#999", marginTop: 12, fontSize: 15 }}>
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
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "85%",
    paddingBottom: 34,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: -4 },
    shadowRadius: 12,
    elevation: 10,
  },
  modalHandle: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 4,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    padding: 0,
  },
  modalList: {
    flexGrow: 0,
  },
  modalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
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
