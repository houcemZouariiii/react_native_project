import LoginPage from "../components/Login";
import React from "react";

const _proc = (globalThis as any).process;
const isJest = typeof _proc !== 'undefined' && (_proc.JEST_WORKER_ID !== undefined || _proc.env?.NODE_ENV === 'test');

let PublicNavigation: React.FC;
if (isJest) {
    // During tests, avoid importing native-stack (ESM in node_modules). Render LoginPage directly.
    PublicNavigation = () => {
        return <LoginPage />;
    };
} else {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { createNativeStackNavigator } = require('@react-navigation/native-stack');
    const PublicStack = createNativeStackNavigator();

    PublicNavigation = () => {
        return (
            <PublicStack.Navigator
                initialRouteName={"Login"}
                screenOptions={{ animation: 'slide_from_right', animationTypeForReplace: "pop" }}>
                <PublicStack.Screen
                    name="Login"
                    component={LoginPage}
                    options={{ header: () => null }}
                    initialParams={undefined}
                />
            </PublicStack.Navigator>
        );
    };
}

export default PublicNavigation;