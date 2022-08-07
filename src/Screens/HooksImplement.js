import React, { useContext, useEffect, useState } from 'react';
import {
    Button,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ToastAndroid,
    PermissionsAndroid

} from 'react-native';
import { Context1 } from '../App';
const color = require('../Utils/Colors.js');


function Screen1({ navigation }) {
    const context = useContext(Context1);
    const {
        kgValue,
        meterValue,
        selectedTab,
        feetValue,
        inchValue
    } = context
    const [currentTab, setCurrentTab] = useState('Metric');
    var RNFS = require('react-native-fs');
    var path = RNFS.DocumentDirectoryPath + '/test.txt';

    useEffect(() => {
        // Update the document title using the browser API
        requestCameraPermission();
        readLocalFile();
    }, []);

    // WRITE THE FILE in Local Storage
    const writeFileContent = async () => {
        var valueSaved = {
            kgValue: kgValue,
            meterValue: meterValue,
            feetValue: feetValue,
            inchesValue: inchValue
        };

        // New Code
        RNFS.writeFile(path, JSON.stringify(valueSaved), 'utf8').then(res => {
            console.log("Save File");
            ToastAndroid.showWithGravity(
                "FILE WRITTEN!",
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM
            );
        })
            .catch(err => {
                console.log(err.message, err.code);

            });


    }

    // Getting Local Storage Permisiion
    const requestCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.MANAGE_EXTERNAL_STORAGE,
                {
                    title: "Local Storage Permission",
                    message:
                        "App is going t get the Local Storage Permission" +
                        "so you can save files on Storage and then access",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("Done");
            } else {
                console.log("denied");
            }
        } catch (err) {
            console.warn(err);
        }
    };


    // READ FILE
    const readLocalFile = () => {
        RNFS.readDir(RNFS.DocumentDirectoryPath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
            .then((result) => {
                // stat the first file
                return Promise.all([RNFS.stat(result[0].path), result[0].path]);
            })
            .then((statResult) => {
                if (statResult[0].isFile()) {
                    // if we have a file, read it
                    return RNFS.readFile(statResult[1], 'utf8');
                }
                return 'no file';
            })
            .then((contents) => {
                // log the file contents
                console.log(contents);
                var obj = JSON.parse(contents);
                context.setFeetValue(obj.feetValue);
                context.setInchValue(obj.inchesValue);
                context.setKgValue(obj.kgValue);
                context.setMeterValue(obj.meterValue);
            })
            .catch((err) => {
                console.log(err.message, err.code);
            });
    }

    // REMARKS:  Render Metric Form
    const renderMetricForm = () => {
        return (
            <View style={{ flexDirection: 'column' }}>
                {renderKGInput()}
                <View style={{
                    flexDirection: 'row', padding: 5,
                    justifyContent: 'space-between'
                }}>
                    <TextInput
                        style={styles.largeInputTextStyle}
                        onChangeText={(text) => {
                            context.setMeterValue(text)
                        }}
                        defaultValue={meterValue}
                        keyboardType={'number-pad'}
                    />
                    <Text style={styles.smallLabelStyle}>m</Text>
                </View>
            </View>
        );
    }

    const renderKGInput = () => {
        return (
            <View style={{
                flexDirection: 'row', padding: 5,
                justifyContent: 'space-between'
            }}>
                <TextInput
                    style={{ borderWidth: 1, width: '90%', borderRadius: 30, borderColor: '#fff', color: '#fff' }}
                    onChangeText={(text) => {
                        context.setKgValue(text)
                    }}
                    defaultValue={kgValue}
                    keyboardType={'number-pad'}

                />
                <Text style={styles.smallLabelStyle}>Kg</Text>
            </View>
        )
    }

    // REMARKS: Render Imperial Form
    const renderImperialForm = () => {
        return (
            <View style={{ flexDirection: 'column' }}>
                <View style={{ flexDirection: 'column' }}>
                    {renderKGInput()}

                    <View style={{
                        flexDirection: 'row', borderColor: '#fff',
                        marginVertical: 10,
                    }}>
                        <View style={{ flexDirection: 'row', flex: 0.5, borderWidth: 1, justifyContent: 'center' }}>
                            <TextInput
                                style={{ borderWidth: 1, width: '80%', borderRadius: 20, borderColor: '#fff', height: '80%', color: '#fff' }}
                                onChangeText={(text) => {
                                    context.setFeetValue(text)
                                }}
                                defaultValue={feetValue}
                                keyboardType={'number-pad'}

                            />
                            <Text style={styles.smallLabelStyle}>ft</Text>
                        </View>

                        {/*Second Columns*/}
                        <View style={{ flexDirection: 'row', flex: 0.5, justifyContent: 'center', justifyContent: 'center' }}>
                            <TextInput
                                style={{ borderWidth: 1, width: '80%', height: '80%', borderRadius: 20, borderColor: '#fff', color: '#fff' }}
                                onChangeText={(text) => {
                                    context.setInchValue(text)
                                }}
                                defaultValue={inchValue}
                                keyboardType={'number-pad'}
                            />
                            <Text style={styles.smallLabelStyle}>in</Text>
                        </View>

                    </View>
                </View>

            </View>
        );
    }


    const renderTabs = () => {
        return (
            <View style={styles.tabContainer}>
                <TouchableOpacity style={[styles.tabItemStyle, { backgroundColor: currentTab == 'Imperial' ? 'green' : 'white', borderBottomLeftRadius: 20, borderTopLeftRadius: 20 }]}
                    onPress={() => setCurrentTab('Imperial')}
                >
                    <Text style={{ alignSelf: 'center', color: currentTab == 'Imperial' ? '#fff' : '#000' }}>Imperial</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.tabItemStyle, { backgroundColor: currentTab == 'Metric' ? 'green' : 'white', borderBottomRightRadius: 20, borderTopRightRadius: 20 }]}
                    onPress={() => setCurrentTab('Metric')}
                >
                    <Text style={{ alignSelf: 'center', color: currentTab == 'Metric' ? '#fff' : '#000' }}>Metric</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // render Button
    const renderButton = () => {
        return (
            <View style={{ flexDirection: 'column' }}>

                <TouchableOpacity
                    style={styles.buttonStyle}
                    onPress={() => writeFileContent()}
                //onPress={() => readLocalFile()}
                >
                    <Text style={{ color: '#fff' }}>Save to Disk</Text>

                </TouchableOpacity>


            </View>
        )
    }

    return (
        <View style={styles.container}>

            <Text style={{ alignSelf: 'center', color: color.whiteColor }}>Unit converter (With Hooks) </Text>
            <View style={{ flexDirection: 'column' }}>
                {currentTab == "Metric" ? renderMetricForm() : renderImperialForm()}
            </View>
            {/*Rendering Tabs*/}
            {renderTabs()}
            {renderButton()}


        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
        flexDirection: 'column',
        backgroundColor: color.blackColor,
    },
    tabItemStyle: {
        backgroundColor: color.blackColor,
        color: color.blackColor,
        flex: 0.5,
        paddingVertical: 15
    },
    tabContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: 20,
        marginVertical: 10
    },
    buttonStyle: {
        alignSelf: 'center',
        paddingHorizontal: 45,
        paddingVertical: 15,
        borderRadius: 30,
        marginVertical: 20,
        backgroundColor: color.greenColor
    },
    largeInputTextStyle: {
        padding: 10,
        borderWidth: 1,
        width: '90%',
        borderRadius: 30,
        borderColor: color.whiteColor,
        color: color.whiteColor
    },
    smallLabelStyle: {
        alignSelf: 'center',
        color: color.whiteColor,
        marginHorizontal: 10,
    }
})

export default Screen1;