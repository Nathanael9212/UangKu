import { router } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to UangKu</Text>

        <View style={styles.iconContainer}>
          <Text style={styles.iconEmoji}>💰</Text>
        </View>

        <Text style={styles.subtitle}>Atur Keuanganmu{"\n"}Dengan Mudah</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(tabs)/index")}
      >
        <Text style={styles.buttonText}>Get Started !</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E3A5F",
    justifyContent: "space-between",
    paddingBottom: 48,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.5,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ffffff20",
    alignItems: "center",
    justifyContent: "center",
  },
  iconEmoji: {
    fontSize: 56,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    lineHeight: 30,
  },
  button: {
    marginHorizontal: 32,
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E3A5F",
  },
});
