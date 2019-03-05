'use strict';
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Platform,
  Alert,
  ScrollView,
  Modal,
  AsyncStorage,
} from "react-native";
import QRCodeScanner from "react-native-qrcode-scanner";
import {
    Button,
    Icon
} from "native-base";

class LogoTitle extends React.Component {
    render() {
        return <View style={styles.headerbar}>
            <StatusBar 
                barStyle="light-content" 
                hidden={false} 
                backgroundColor="#2196F3" 
                translucent={true} 
                networkActivityIndicatorVisible={true}  
            />
            <Text style={styles.headerText}>Program Kasir</Text>
        </View>;
    }
}
class Home extends Component {
    static navigationOptions = {
        headerTitle: <LogoTitle />,
        headerLeft: null
    };
    constructor(props) { 
        super(props);
        this.state = {
            kode: '',
            jumlah: '',
            harga: '',
            total: null,
            hide: true,
            bayar: "",
            kembalian: "",
            ActivityIndicator_Loading: false,
            modalVisible: false,
            dataqr: '',
            status: 'Ready'
        };
    }
    toggleModal(visible) {
        this.setState({ modalVisible: visible });
    }
    componentDidMount() {
        this.setState({ ActivityIndicator_Loading: true }, () => {
            this.setState({ refreshing: true });
            const url =
                "https://nukeninkonoha.000webhostapp.com/mobile/getData.php";
            //this.setState({ loading: true });
            fetch(url)
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log("comp");
                    console.log(responseJson);
                    this.setState({
                        hide: true,
                        error: responseJson.error || null,
                        loading: false,
                        refreshing: false,
                        ActivityIndicator_Loading: false,
                    });
                }
                );
        });
    }
    cariData = () => {
        this.setState({ ActivityIndicator_Loading: true },
            () => {
                this.setState({ refreshing: true, hide: true });
                fetch(
                    "https://nukeninkonoha.000webhostapp.com/mobile/caribarang.php",
                    {
                        method: "POST",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            kode: this.state.kode
                        })
                    }
                )
                    .then(response => response.json())
                    .then(responseJson => {
                        console.log("comp");
                        console.log(responseJson);
                        this.setState({
                            harga: responseJson,
                            error: responseJson.error || null,
                            loading: false,
                            refreshing: false,
                            ActivityIndicator_Loading: false
                        });
                    });
            }
        );
    };
    //_keyExtractor = (item, index) => index.toString();
    hitung = () => {
        let total = this.state.jumlah * this.state.harga;
        this.setState({
          hide: false,
          total: total,
        });
        //AsyncStorage.setItem("total", total);
    }
    kembali = () => {
        let kembalian = this.state.bayar - this.state.total;
               this.setState({
                 kembalian: kembalian
               });
        if (this.state.bayar >= this.state.total) {
            Alert.alert('Kembalian anda sebesar Rp. ' + this.state.kembalian);
        } else if (this.state.bayar < this.state.total) {
            Alert.alert('Uang anda kurang!');
        }
    }
    onSuccess(e) {
        this.cariData();
        this.setState({
            kode: e.data ,
            status: 'Coba Lagi'
        })
        this.toggleModal(!this.state.modalVisible);
    }
    render() {
        return (
            <ScrollView>
                <View style={styles.container}>
                    <Modal animationType={"slide"} transparent={false}
                        visible={this.state.modalVisible}
                        onRequestClose={() => { console.log("Modal has been closed.") }}>
                        <View style={styles.container}>
                            <View style={styles.conQR}>
                                <QRCodeScanner
                                    cameraStyle={styles.cameraContainer}
                                    reactivateTimeout={5000}
                                    onRead={this.onSuccess.bind(this)}
                                    ref={(node) => { this.scanner = node }}
                                />
                            </View>
                        </View>
                    </Modal>
                    <View style={styles.box1}>
                        <Text>Kode Barang</Text>
                        <TextInput
                            style={styles.textInputKode}
                            onChangeText={TextInputText =>
                                this.setState({ kode: TextInputText })
                            }
                            ref={input => {
                                this.kode = input;
                            }}
                            onChange={this.cariData}
                            value={this.state.kode}
                        />
                        <Button iconLeft
                            style={styles.ButtonQR}
                            onPress={() => {
                                this.toggleModal(!this.state.modalVisible)
                            }}>

                            <Icon name='camera' />
                            <Text></Text>
                        </Button>
                    </View>
                    <View style={styles.box1}>
                        <Text>Jumlah Beli </Text>
                        <TextInput
                            style={styles.textInput}
                            onChangeText={TextInputText =>
                                this.setState({ jumlah: TextInputText })
                            }
                            ref={input => {
                                this.jumlah = input;
                            }}
                        />
                    </View>
                    <View style={styles.box1}>
                        <Text>Harga Barang </Text>
                        <Text style={styles.textHarga}
                            >{this.state.harga}
                        </Text>
                           
                            
                    </View>
                    <View style={styles.box2}>
                        <Button
                            activeOpacity={0.5}
                            style={styles.buttonStyle}
                            onPress={() => this.hitung()}
                        >
                            <Text style={styles.buttonText}>Hitung</Text>
                        </Button>
                    </View>
                    <Text>Total Belanja : Rp. {this.state.total}</Text>
                    {
                        this.state.hide ? null : 
                            <View style={styles.box1}>
                                <Text>Uang Bayar</Text>
                                <TextInput
                                    style={styles.textInput}
                                    onChangeText={TextInputText =>
                                        this.setState({ bayar: TextInputText })
                                    }
                                    ref={input => {
                                        this.bayar = input;
                                    }}
                                />
                            </View>
                    }
                    {
                        this.state.hide ? null :
                            <View style={styles.box2}>
                                <Button
                                    activeOpacity={0.5}
                                    style={styles.buttonStyle}
                                    onPress={() => this.kembali()}>
                                    <Text style={styles.buttonText}>Hitung</Text>
                                </Button>
                            </View>

                    }
                    {
                        this.state.hide ? null :
                            <Text>Kembalian : Rp. {this.state.kembalian}</Text>
                    }
                </View>
            </ScrollView>
        );
    }
}
// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    flexDirection: "column",
    alignItems: "center"
  },
  headerbar: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#2196F3",
    justifyContent: "center",
    height: 80,
    width: "100%",
    marginTop: Platform.OS == "ios" ? 20 : 15
  },
  headerText: {
    color: "white",
    fontSize: 24
  },
  buttonText: {
    textAlign: "center",
    height: 40,
    width: "100%",
    marginTop: 10,
    color: "#FFFFFF",
    fontSize: 20
  },
  buttonStyle: {
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2196F3",
    marginTop: 20,
    marginBottom: 20,
    height: 40,
    width: "70%",
    borderRadius: 7
  },
  ButtonQR: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2196F3",
    height: 40,
    paddingRight: 15,
    borderRadius: 7,
    marginTop: 5
  },
  box1: {
    flex: 0.5,
    width: "90%",
    paddingTop: 20,
    marginTop: 10,
    marginLeft: 2,
    justifyContent: "space-between",
    flexDirection: "row"
  },
  box2: {
    flex: 0.4,
    marginLeft: 10,
    marginRight: 10,
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center"
  },
  textInput: {
    width: 170,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderRadius: 7,
    borderColor: "#2196F3"
  },
  textInputKode: {
    width: 100,
    height: 50,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderRadius: 7,
    marginLeft: 55,
    marginRight: 10,
    borderColor: "#2196F3"
  },
  conQR: {
    flex: 5
  },
  cameraContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 250,
    width: 250,
    marginLeft: 55,
    marginTop: 40
  },
  textHarga: {
      width: 170,
      height: 50,
      paddingTop: 15,
      paddingLeft: 5,
      backgroundColor: "#fff",
      borderWidth: 1,
      borderRadius: 7,
      borderColor: "#2196F3"
  }
});
export default Home;
