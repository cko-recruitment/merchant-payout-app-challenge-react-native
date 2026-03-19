import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

interface HeaderTitleProps {
  title: string;
}
export function HeaderTitle({ title = "hello" }: Readonly<HeaderTitleProps>) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" accessibilityRole="header">
        {title}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    justifyContent: "center",
    marginLeft: 8,
  },
});
