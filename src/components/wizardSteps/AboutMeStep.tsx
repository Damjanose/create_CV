import React from "react";
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
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

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
}) => (
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
        <TextInput
          style={[styles.input, formStyles.input]}
          placeholder="Country"
          value={address.countryName}
          onChangeText={(countryName) =>
            setAddress((prev: any) => ({ ...prev, countryName }))
          }
          placeholderTextColor={isDark ? "#888" : "#999"}
        />
      </View>
      <View style={formStyles.inputContainer}>
        <MaterialCommunityIcons
          name="city"
          size={20}
          color={isDark ? "#4F8EF7" : "#1976D2"}
          style={formStyles.inputIcon}
        />
        <TextInput
          style={[styles.input, formStyles.input]}
          placeholder="City"
          value={address.cityName}
          onChangeText={(cityName) =>
            setAddress((prev: any) => ({ ...prev, cityName }))
          }
          placeholderTextColor={isDark ? "#888" : "#999"}
        />
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
  </View>
);

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
});

export default AboutMeStep;
