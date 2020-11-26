import React, { useEffect, useState } from "react";
import {
  Alert,
  ActivityIndicator,
  Button,
  TextInput,
  View,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";

import { useDispatch } from "react-redux";
import Colors from "../../constants/colors";

import { LinearGradient } from "expo-linear-gradient";

import Card from "../../components/ui/Card";

import * as authActions from "../../store/actions/auth";

const AuthScreen = ({ route, navigation }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [email, setEmail] = useState("");
  const [emailIsValid, setEmailIsValid] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordIsValid, setPasswordIsValid] = useState(false);

  const dispatch = useDispatch();

  const inputChangeHandler = (text, input) => {
    switch (input) {
      case "email": {
        if (!text.includes("@")) {
          setEmailIsValid(false);
        } else {
          setEmailIsValid(true);
        }
        setEmail(text);

        return;
      }
      case "password": {
        if (text.trim().length < 6) {
          setPasswordIsValid(false);
        } else {
          setPasswordIsValid(true);
        }
        setPassword(text);
        return;
      }
    }
  };

  const authHandler = async () => {
    if (!emailIsValid) {
      Alert.alert("Eroare", "Adresa de email nu este valida.");
    } else if (!passwordIsValid) {
      Alert.alert("Eroare", "Parola este prea scurta.");
    } else {
      let action = isSignup
        ? authActions.signup(email, password)
        : authActions.login(email, password);
      setError(null);
      setIsLoading(true);
      try {
        await dispatch(action);
        //setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (error) {
      Alert.alert("Eroare", error);
    }
  }, [error]);

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS == "android" ? "height" : "padding"}
      keyboardVerticalOffset={Platform.OS === "android" ? 90 : 50}
    >
      <LinearGradient colors={["#ffeddf", "#ffe3ff"]} style={styles.gradient}>
        <Card style={styles.authContainer}>
          <ScrollView keyboardShouldPersistTaps={"handled"}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={(text) => inputChangeHandler(text, "email")}
            />
            {/* {!emailIsValid && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Email invalid.</Text>
              </View>
            )} */}

            <Text style={styles.label}>Parola</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              value={password}
              onChangeText={(text) => inputChangeHandler(text, "password")}
            />
            {/*    {!passwordIsValid && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Parolă invalidă.</Text>
              </View>
            )} */}

            {isLoading && (
              <ActivityIndicator size="small" color={Colors.primaryColor} />
            )}
            <View style={styles.buttonContainer}>
              <View style={styles.button}>
                <Button
                  title={isSignup ? "Înregistrare" : "Logare"}
                  color={Colors.primaryColor}
                  onPress={authHandler}
                />
              </View>
              <View style={styles.button}>
                <Button
                  title={isSignup ? "Ai deja cont?" : "Nu ai cont?"}
                  color={Colors.accentColor}
                  onPress={() => setIsSignup((prevState) => !prevState)}
                />
              </View>
            </View>
          </ScrollView>
        </Card>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  authContainer: {
    width: "80%",
    maxWidth: 400,
    maxHeight: 400,
    padding: 20,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: "50%",
    marginTop: 10,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  label: {
    fontFamily: "open-sans-bold",
    marginVertical: 8,
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AuthScreen;
