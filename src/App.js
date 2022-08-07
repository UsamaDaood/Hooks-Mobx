import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
export const Context1 = React.createContext(null);
// Screens
import Screen1 from './Screens/HooksImplement'; // Hooks Screen
import Screen3 from './Screens/MobX'; // Mobx Screen


function StackNavA() {
    //Context 1
    const context1InitialState = {
        kgValue: '',
        meterValue: '',
        selectedTab: '',
        feetValue: '',
        inchValue: ''
    };

    const [measureValues, setMeasureValues] = useState(context1InitialState);
    function setKgValue(kgValue) {
        const newState = { ...measureValues, kgValue };
        setMeasureValues(newState);
    }
    function setMeterValue(meterValue) {
        const newState = { ...measureValues, meterValue };
        setMeasureValues(newState);
    }
    // set Feet
    function setFeetValue(feetValue) {
        const newState = { ...measureValues, feetValue };
        setMeasureValues(newState);
    }
    function setInchValue(inchValue) {
        const newState = { ...measureValues, inchValue };
        setMeasureValues(newState);
    }
    function setSelectedTab(selectedTab) {
        const newState = { ...measureValues, selectedTab };
        setMeasureValues(newState);
    }

    const context1Setters = {
        setKgValue,
        setMeterValue,
        setFeetValue,
        setInchValue,
        setSelectedTab
    }
    return (
        <Context1.Provider value={{ ...measureValues, ...context1Setters }}>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false
                }}
            >
                <Stack.Screen name="Screen 1" component={Screen1}
                    options={{ tabBarLabel: "MOBX" }}
                    screenOptions={{

                    }}
                />
            </Stack.Navigator>
        </Context1.Provider>
    )
}

function StackNavB() {

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name="Screen 3" component={Screen3} />
        </Stack.Navigator>
    )
}

function App(props) {

    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIconStyle: { display: "none" },
                    labelStyle: {
                        fontSize: 20,
                        textAlignVertical: 'center',
                    },

                })}
            >
                <Tab.Screen name="Hooks" component={StackNavA}
                    options={{ tabBarLabel: "Hooks" }}
                />
                <Tab.Screen name="MOBX" component={StackNavB}
                    options={{ tabBarLabel: "MOBX" }}

                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
export default App;

