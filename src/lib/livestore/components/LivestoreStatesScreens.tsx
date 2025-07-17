import { AboveContextThemeProvider } from "@/components/react-native-paper/AboveContextThemeProvider";
import { LoadingFallback } from "@/components/screens/state-screens/LoadingFallback";
import { View } from "react-native";
import { Button, Card, Surface, Text, useTheme } from "react-native-paper";

export function LivestoreLoadingScreen() {

  return (
    <AboveContextThemeProvider>
      <LoadingFallback />
    </AboveContextThemeProvider>
  );
}

interface LivestoreErrorScreenProps {
  error: string;
}
export function LivestoreErrorScreen({ error }: LivestoreErrorScreenProps) {
  return (
    <AboveContextThemeProvider>
      <Surface style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
        <View style={{ maxWidth: 400, width: "100%" }}>
          <Card mode="contained" style={{ padding: 24 }}>
            <Card.Content style={{ alignItems: "center" }}>
              {/* Error Icon */}
              <View 
                style={{ 
                  width: 64, 
                  height: 64, 
                  borderRadius: 32,
                  justifyContent: "center", 
                  alignItems: "center",
                  marginBottom: 16
                }}
              >
                <Text style={{ fontSize: 32}}>
                  ⚠️
                </Text>
              </View>
              
              {/* Title */}
              <Text 
                variant="headlineSmall" 
                style={{ 
                  marginBottom: 8, 
                  textAlign: "center",
                }}
              >
                Something went wrong
              </Text>
              
              {/* Error Message */}
              <Text 
                variant="bodyMedium" 
                style={{ 
                  textAlign: "center",
                  marginBottom: 24,
                  lineHeight: 20
                }}
              >
                {error}
              </Text>
              
              {/* Retry Button */}
              <Button 
                mode="contained" 
                onPress={() => {
                  // Optionally add retry logic here
                }}
                style={{ minWidth: 120 }}
              >
                Try Again
              </Button>
            </Card.Content>
          </Card>
        </View>
      </Surface>
    </AboveContextThemeProvider>
  );
}
