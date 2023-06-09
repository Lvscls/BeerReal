import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import beersData from "../data/beers.json";
import * as Notifications from "expo-notifications";

const HomePage = () => {
  const navigation = useNavigation();
  const beers = beersData.beers;
  const [randomBeer, setRandomBeer] = useState(null);
  const [isRandomBeerEnabled, setIsRandomBeerEnabled] = useState(true);
  const [countdown, setCountdown] = useState(30);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [randomBeerName, setRandomBeerName] = useState("");

  useEffect(() => {
    registerForPushNotifications();
  }, []);

  const registerForPushNotifications = async () => {
    // Vérifier les permissions de notification
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission de notification refusée");
      return;
    }

    // Gérer l'appui sur la notification
    Notifications.addNotificationResponseReceivedListener(
      handleNotificationPress
    );

    scheduleNotification();
  };

  const scheduleNotification = () => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });

    Notifications.scheduleNotificationAsync({
      content: {
        title: "C'est l'heure du BeerReal 🍻",
        body: "Prends en photo ta bière ! 🍺",
      },
      trigger: {
        seconds: 600, // Envoyer la notification toutes les 10 minutes
        repeats: true, // Répéter la notification
      },
    });
  };

  const handleNotificationPress = () => {
    navigation.navigate("TakeBeerReal"); // Naviguer vers la page "TakeBeerReal"
    console.log("Notification appuyée");
  };

  useEffect(() => {
    let timer;
    if (!isRandomBeerEnabled && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (!isRandomBeerEnabled && countdown === 0) {
      setIsRandomBeerEnabled(true);
      setCountdown(30);
    }
    return () => clearTimeout(timer);
  }, [isRandomBeerEnabled, countdown]);

  const navigateToBeerList = () => {
    navigation.navigate("BeerList");
  };

  const handleRandomBeer = () => {
    if (isRandomBeerEnabled) {
      setIsRandomBeerEnabled(false);
      setRandomBeer(null);
      setCountdown(30);
      const randomIndex = Math.floor(Math.random() * beers.length);
      const selectedBeer = beers[randomIndex];
      setRandomBeer(selectedBeer);
      setRandomBeerName(selectedBeer.name);
      setIsModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../img/bouteilles-verre-biere-verre-glace-fond-sombre.jpg")}
        style={styles.backgroundImage}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Bienvenue chez La Binouze</Text>
          <View style={styles.subtitleContainer}>
            <Text style={styles.subtitle}>
              Trouvez les meilleures bières de Rouen dans notre auberge du
              XIXème siècle
            </Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={navigateToBeerList}>
            <Text style={styles.buttonText}>Découvrir nos bières 🍻</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.randomBeerButton,
              !isRandomBeerEnabled && { backgroundColor: "gray" },
            ]}
            onPress={handleRandomBeer}
            disabled={!isRandomBeerEnabled}
          >
            <Text style={styles.buttonText}>Un peu de fun ?</Text>
            <Text style={styles.randomBeerDescription}>
              Récupérer une bière mystère à 4€ la pinte
            </Text>
          </TouchableOpacity>

          {!isRandomBeerEnabled && (
            <Text style={styles.countdownText}>
              Prochaine bière aléatoire dans {countdown} secondes
            </Text>
          )}
          <View style={styles.hpContainer}>
            <Text style={styles.subtitle}>
              Happy Hours tous les jours de 17h à 19h 🎉 Toutes les pintes à 4€
            </Text>
          </View>
        </View>
      </ImageBackground>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{randomBeerName}</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  contentContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
    textAlign: "center",
  },
  subtitleContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 16,
    color: "black",
    textAlign: "center",
  },
  hpContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    position: "absolute",
    bottom: -150,
  },
  button: {
    backgroundColor: "#FFC107",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  randomBeerButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  randomBeerDescription: {
    fontSize: 10,
    color: "white",
    textAlign: "center",
  },
  randomBeerContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderRadius: 8,
    marginBottom: 10,
    width: "100%",
  },
  randomBeerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  countdownText: {
    fontSize: 16,
    color: "white",
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
});

export default HomePage;
