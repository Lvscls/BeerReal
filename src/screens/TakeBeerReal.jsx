import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import { Camera } from "expo-camera";
import * as FileSystem from "expo-file-system";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import * as Permissions from "expo-permissions";

const TakeBeerReal = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const navigation = useNavigation();

  const getCameraPermission = async () => {
    const { status } = await Camera.requestPermissionsAsync();
    setHasPermission(status === "granted");
  };

  useEffect(() => {
    getCameraPermission();
  }, []);

  const toggleCameraType = () => {
    setCameraType(
      cameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const takePicture = async () => {
    if (camera) {
      const photoData = await camera.takePictureAsync();
      setPhoto(photoData.uri);
    }
  };

  const savePhoto = async () => {
    if (photo) {
      const filename = "photo_" + Date.now() + ".jpg";
      const directory = FileSystem.documentDirectory + "assets/uploads/";
      const fileUri = directory + filename;
  
      const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY_WRITE_ONLY);
  
      if (status === "granted") {
        await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
        await FileSystem.moveAsync({
          from: photo,
          to: fileUri,
        });
        console.log("Photo enregistrée : " + fileUri);
        navigation.navigate("Home");
      } else {
        console.log("Permission denied to save photo.");
      }
    }
  };

  return (
    <View style={styles.container}>
      {hasPermission ? (
        <Camera
          style={styles.camera}
          type={cameraType}
          ref={(ref) => setCamera(ref)}
        >
          <View style={styles.cameraButtonsContainer}>
            <TouchableOpacity style={styles.cameraButton} onPress={toggleCameraType}>
              <MaterialIcons name="rotate-right" size={24} color="white" />
              <Text style={styles.cameraButtonText}>
                Changer de caméra ({cameraType === Camera.Constants.Type.back ? "Frontale" : "Arrière"})
              </Text>
            </TouchableOpacity>
          </View>
        </Camera>
      ) : (
        <Text>Permission to access camera denied.</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={takePicture}>
        <Text style={styles.buttonText}>Prendre une photo</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {photo && <Image source={{ uri: photo }} style={styles.previewImage} />}

        {photo && (
          <TouchableOpacity style={styles.button} onPress={savePhoto}>
            <Text style={styles.buttonText}>Enregistrer la photo</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    width: "100%",
    height: 400,
  },
  button: {
    marginTop: 10,
    backgroundColor: "#FFC107",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  scrollViewContainer: {
    alignItems: "center",
  },
  previewImage: {
    marginTop: 20,
    width: 200,
    height: 200,
  },
  cameraButtonsContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 16,
  },
  cameraButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  cameraButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 8,
  },
});

export default TakeBeerReal;
