import { ThemedText } from "@/components/themed-text";
import { AppColors } from "@/constants/theme";
import { ActivityIndicator, StyleSheet, View } from "react-native";

interface ActivityListFooterProps {
    loadingMore: boolean;
}

export function ActivityListFooter({loadingMore}: Readonly<ActivityListFooterProps>) {
    if (!loadingMore) return null;

    return (
        <View style={styles.footerLoader}>
            <ActivityIndicator 
            size="small"
                color={AppColors.primary} 
            />
            <ThemedText style={styles.footerText}>Loading more...</ThemedText>
        </View>
    );
}

const styles = StyleSheet.create({
    footerLoader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
    },
    footerText: {
        marginLeft: 8,
        color: AppColors.primary,
    },
});