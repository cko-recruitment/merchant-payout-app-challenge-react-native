import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useTranslation } from "react-i18next";

interface TabIconProps {
  color: string;
}

function HomeTabIcon({ color }: Readonly<TabIconProps>) {
  return <IconSymbol size={28} name="house.fill" color={color} />;
}

function PayoutsTabIcon({ color }: Readonly<TabIconProps>) {
  return <IconSymbol size={28} name="arrow.up.circle.fill" color={color} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tabIconSelected,
        tabBarInactiveTintColor: Colors[colorScheme ?? "light"].tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("tabs.home"),
          tabBarIcon: HomeTabIcon,
        }}
      />
      <Tabs.Screen
        name="payouts"
        options={{
          title: t("tabs.payouts"),
          tabBarIcon: PayoutsTabIcon,
        }}
      />
    </Tabs>
  );
}
