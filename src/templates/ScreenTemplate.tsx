import React, { PropsWithChildren } from 'react';
import { View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ScreenTemplate(props: PropsWithChildren<{}>) {
    const insets = useSafeAreaInsets();

    return <View
        style={{
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right,
            backgroundColor: '#ffffff',
            flex: 1,
        }}>
        <ScrollView style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}>{props.children}</ScrollView>
    </View>

}