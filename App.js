import React, {useEffect, useState} from 'react';
import messaging from '@react-native-firebase/messaging';
import {Button, PermissionsAndroid, Text, View} from 'react-native';
import NfcManager, { NfcTech, Ndef, NfcEvents } from 'react-native-nfc-manager';
import crashlytics from '@react-native-firebase/crashlytics'
// Hàm đọc dữ liệu từ thẻ NFC

const App = () => {
  const [nfcEnable, setnfcEnable] = useState('');
  const [tagData, setTagData] = useState(null);

  const readNfcTag = async () => {
    try {
      // Yêu cầu quyền truy cập NFC
      await NfcManager.requestTechnology([NfcTech.Ndef, NfcTech.NfcA]); // Đọc dữ liệu từ thẻ
      const tag = await NfcManager.getTag();
      setTagData(tag);
      alert('Dữ liệu từ thẻ NFC', JSON.stringify(tag));
    } catch (ex) {
      console.warn(ex);
    } finally {
      // Kết thúc giao tiếp với NFC
      NfcManager.cancelTechnologyRequest();
    }
  };

  useEffect(() => {
    //For NFC
    NfcManager.isSupported().then(supported => {
      setnfcEnable(supported == true ? 'Có hỗ trợ' : 'Không hỗ trợ');
    });

    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATION,
    );
    const requestUserPermission = async () => {
      getFCMDeviceToken();
      /*
      //For iOS
      const authStatus = await messaging.requestPermission();
      const enabled =
        authStatus == messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus == messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization Status', authStatus);
        getFCMDeviceToken();
      } else {
        console.log('Push notification is not enabled');
      }
      */
    };

    //Get device token
    const getFCMDeviceToken = async () => {
      try {
        const fcmToken = await messaging().getToken();
        if (fcmToken) {
          console.log('FCM Token', fcmToken);
        } else {
          console.log('Cant get device token');
        }
      } catch (ex) {
        console.error('Error getting token', ex);
      }
    };

    requestUserPermission();

    crashlytics().recordError(new Error('An unexpected error occurred'));
    crashlytics().crash();

  }, []);
  return (
    <View>
      <Text>This is push notification sample</Text>
      <Text>NFC: {nfcEnable != null ? nfcEnable : '-'}</Text>
      <Button title="Đọc thẻ NFC" onPress={readNfcTag} />
    </View>
  );
};

export default App;
