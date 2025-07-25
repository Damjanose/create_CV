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
} from "react-native";

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
      <View style={{ flexDirection: "row", gap: 8 }}>
        <TouchableOpacity
          style={{
            backgroundColor: isDark ? "#4F8EF7" : "#1976D2",
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 8,
            marginRight: 8,
          }}
          onPress={launchImageLibrary}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>
            Upload Photo
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: isDark ? "#4F8EF7" : "#1976D2",
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 8,
          }}
          onPress={launchCamera}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Take Photo</Text>
        </TouchableOpacity>
      </View>
    </View>
    <Text style={styles.label}>First Name</Text>
    <TextInput
      style={styles.input}
      placeholder="First Name"
      value={contact.name}
      onChangeText={(name) => setContact((prev: any) => ({ ...prev, name }))}
      placeholderTextColor={"#ffffff3b"}
    />
    <Text style={styles.label}>Last Name</Text>
    <TextInput
      style={styles.input}
      placeholder="Last Name"
      value={contact.lastname}
      onChangeText={(lastname) =>
        setContact((prev: any) => ({ ...prev, lastname }))
      }
      placeholderTextColor={"#ffffff3b"}
    />
    <Text style={styles.label}>Phone</Text>
    <TextInput
      style={styles.input}
      placeholder="Phone"
      value={contact.phone}
      onChangeText={(phone) => setContact((prev: any) => ({ ...prev, phone }))}
      keyboardType="phone-pad"
      placeholderTextColor={"#ffffff3b"}
    />
    <Text style={styles.label}>Email</Text>
    <TextInput
      style={styles.input}
      placeholder="Email"
      value={contact.email}
      onChangeText={(email) => setContact((prev: any) => ({ ...prev, email }))}
      keyboardType="email-address"
      autoCapitalize="none"
      placeholderTextColor={"#ffffff3b"}
    />
    <Text style={styles.label}>Country</Text>
    <TextInput
      style={styles.input}
      placeholder="Country"
      value={address.countryName}
      onChangeText={(countryName) =>
        setAddress((prev: any) => ({ ...prev, countryName }))
      }
      placeholderTextColor={"#ffffff3b"}
    />
    <Text style={styles.label}>City</Text>
    <TextInput
      style={styles.input}
      placeholder="City"
      value={address.cityName}
      onChangeText={(cityName) =>
        setAddress((prev: any) => ({ ...prev, cityName }))
      }
      placeholderTextColor={"#ffffff3b"}
    />
    <Text style={styles.label}>Address Line 1</Text>
    <TextInput
      style={styles.input}
      placeholder="Address Line 1"
      value={address.address1}
      onChangeText={(address1) =>
        setAddress((prev: any) => ({ ...prev, address1 }))
      }
      placeholderTextColor={"#ffffff3b"}
    />
    <Text style={styles.label}>Address Line 2 (optional)</Text>
    <TextInput
      style={styles.input}
      placeholder="Address Line 2 (optional)"
      value={address.address2}
      onChangeText={(address2) =>
        setAddress((prev: any) => ({ ...prev, address2 }))
      }
      placeholderTextColor={"#ffffff3b"}
    />
    <Text style={styles.label}>Summary</Text>
    <TextInput
      style={[styles.input, { height: 100 }]}
      placeholder="Write something about yourself..."
      value={aboutMe.summary}
      onChangeText={(summary) =>
        setAboutMe((prev: any) => ({ ...prev, summary }))
      }
      multiline
      placeholderTextColor={"#ffffff3b"}
    />
  </View>
);

export default AboutMeStep;
