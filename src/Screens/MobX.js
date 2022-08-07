import * as React from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ToastAndroid,
    PermissionsAndroid
} from 'react-native';
import { observer, inject, Provider } from "mobx-react"
import CountStore from '../Mobx/SimpleStore'
const color = require('../Utils/Colors.js');

var RNFS = require('react-native-fs');
var path = RNFS.DocumentDirectoryPath + '/test.txt';
@observer
export default class Screen3 extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            currentTab: 'Metric'
        }
    }

    // on Mounting
    componentDidMount() {
        this.readLocalFile()
    }

    // REMARKS READ FILE
    readLocalFile = () => {
        RNFS.readDir(RNFS.DocumentDirectoryPath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
            .then((result) => {
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
                var obj = JSON.parse(contents);
                CountStore.kgValue = obj.kgValue;
                CountStore.meterValue = obj.meterValue;
                CountStore.inchesValue = obj.inchesValue;
                CountStore.feetValue = obj.feetValue;
            })
            .catch((err) => {
                console.log(err.message, err.code);
            });
    }


    // WRITE THE FILE in Local Storage
    writeFileContent = async () => {

        var valueSaved = {
            kgValue: CountStore.kgValue,
            meterValue: CountStore.meterValue,
            feetValue: CountStore.feetValue,
            inchesValue: CountStore.inchesValue
        };
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


    // REMARKS:  Render Metric Form
    renderMetricForm = () => {
        return (
            <View style={{ flexDirection: 'column' }}>
                {this.renderKgValue()}
                <View style={{
                    flexDirection: 'row', padding: 5,
                    justifyContent: 'space-between'
                }}>
                    <TextInput
                        style={styles.largeInputText}
                        onChangeText={(text) => {
                            CountStore.meterValue = text
                        }}
                        defaultValue={CountStore.meterValue}
                        keyboardType={'number-pad'}
                    />
                    <Text style={styles.smallTextInputStyle}>m</Text>
                </View>
            </View>
        );
    }

    renderKgValue = () => {
        return (
            <View style={{
                flexDirection: 'row', padding: 5,
                justifyContent: 'space-between'
            }}>
                <TextInput
                    style={styles.largeInputText}
                    onChangeText={(text) => {
                        CountStore.kgValue = text
                    }}
                    defaultValue={CountStore.kgValue}
                    keyboardType={'number-pad'}
                />
                <Text style={styles.smallTextInputStyle}>Kg</Text>
            </View>
        )
    }

    // REMARKS: Render Imperial Form
    renderImperialForm = () => {
        return (
            <View style={{ flexDirection: 'column' }}>
                <View style={{ flexDirection: 'column' }}>
                    {this.renderKgValue()}

                    <View style={{
                        flexDirection: 'row', borderColor: color.whiteColor,
                        marginVertical: 10,
                    }}>
                        <View style={{ flexDirection: 'row', flex: 0.5, borderWidth: 1, justifyContent: 'center' }}>
                            <TextInput
                                style={styles.inputTextMeterInchesStyle}
                                onChangeText={(text) => {
                                    CountStore.feetValue = text
                                }}
                                defaultValue={CountStore.feetValue}
                                keyboardType={'number-pad'}
                            />
                            <Text style={styles.smallTextInputStyle}>ft</Text>
                        </View>

                        {/*Second Columns*/}
                        <View style={{ flexDirection: 'row', flex: 0.5, justifyContent: 'center', justifyContent: 'center' }}>
                            <TextInput
                                style={styles.inputTextMeterInchesStyle}
                                onChangeText={(text) => {
                                    CountStore.inchesValue = text
                                }}
                                defaultValue={CountStore.inchesValue}
                                keyboardType={'number-pad'}

                            />
                            <Text style={styles.smallTextInputStyle}>in</Text>
                        </View>

                    </View>
                </View>
            </View>
        );
    }


    renderTabs = () => {
        return (
            <View style={styles.tabContainer}>
                <TouchableOpacity style={[styles.tabItemStyle, { backgroundColor: this.state.currentTab == 'Imperial' ? color.greenColor : color.whiteColor, borderBottomLeftRadius: 20, borderTopLeftRadius: 20 }]}
                    onPress={() => this.setState({ currentTab: 'Imperial' })}
                >
                    <Text style={{ alignSelf: 'center', color: this.state.currentTab == 'Imperial' ? '#fff' : '#000' }}>Imperial</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.tabItemStyle, { backgroundColor: this.state.currentTab == 'Metric' ? color.greenColor : color.whiteColor, borderBottomRightRadius: 20, borderTopRightRadius: 20 }]}
                    onPress={() => this.setState({ currentTab: 'Metric' })}
                >
                    <Text style={{ alignSelf: 'center', color: this.state.currentTab == 'Metric' ? '#fff' : '#000' }}>Metric</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // render Button
    renderButton = () => {
        return (
            <View style={{ flexDirection: 'column' }}>

                <TouchableOpacity
                    style={styles.buttonStyle}
                    onPress={() => this.writeFileContent()}
                //onPress={() => readLocalFile()}
                >
                    <Text style={{ color: color.whiteColor }}>Save to Disk</Text>
                </TouchableOpacity>
            </View>
        )
    }

    render() {

        return (
            <View style={styles.container}>

                <Text style={{ alignSelf: 'center', color: color.whiteColor }}>Unit converter (With MobX) </Text>
                <View style={{ flexDirection: 'column' }}>
                    {this.state.currentTab == "Metric" ? this.renderMetricForm() : this.renderImperialForm()}
                </View>
                {/*Rendering Tabs*/}
                {this.renderTabs()}
                {this.renderButton()}

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
        flexDirection: 'column',
        backgroundColor: '#000',
    },
    tabItemStyle: {
        backgroundColor: '#000',
        color: '#000', flex: 0.5,
        //backgroundColor: 'green',
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
        backgroundColor: 'green'
    },
    smallTextInputStyle: {
        alignSelf: 'center',
        color: '#fff',
        marginHorizontal: 10,
    },
    largeInputText: {
        borderWidth: 1,
        width: '90%',
        borderRadius: 30,
        borderColor: '#fff',
        color: '#fff'
    },
    inputTextMeterInchesStyle: {
        borderWidth: 1,
        width: '80%',
        borderRadius: 20,
        borderColor: '#fff',
        height: '80%',
        color: '#fff'
    }

});
