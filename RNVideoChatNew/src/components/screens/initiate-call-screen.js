import React, { useState } from 'react';
import { SafeAreaView, StatusBar, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import ConnectyCube from 'react-native-connectycube';

import { CallService } from '../../services';
import { getUserById, showToast } from '../../utils'

export default function VideoIncomingCallScreen ({ route, navigation }) {

  const opponents = route.params?.opponents

  const [selectedOpponents, setSelectedOpponents] = useState([])

  const selectUser = opponent => {
    setSelectedOpponents([...selectedOpponents, opponent]);
  };

  const unselectUser = opponent => {
    setSelectedOpponents(selectedOpponents.filter(op => op.id !== opponent.id));
  };

  const startCall = async () => {
    if (selectedOpponents.length === 0) {
      showToast("Please select at least one user")
      return;
    }
    
    await CallService.startCall(selectedOpponents.map(op => op.id), ConnectyCube.videochat.CallType.VIDEO)

    // const callUDID = uuidv4()
    // const callType = "video" // "voice"

    // // sendd push notitification
    // const pushParams = {
    //   message: `Incoming call from ${currentUser.name}`,
    //   ios_voip: 1,
    //   callerName: currentUser.name,
    //   handle: currentUser.name,
    //   uuid: callUDID,
    //   callType
    // };
    // PushNotificationsService.sendPushNotification(selectedUsersIds, pushParams);

    // // report to CallKit
    // let opponentsNamesString = ""
    // for (let i = 0; i < selectedUsersIds.length; ++i) {
    //   opponentsNamesString += getUserById(selectedUsersIds[i]).name
    //   if (i !== (selectedUsersIds.length - 1)) {
    //     opponentsNamesString += ", "
    //   }
    // }
    // //
    // CallKitService.reportStartCall(
    //   callUDID,
    //   currentUser.name,
    //   opponentsNamesString,
    //   "generic",
    //   callType === "video"
    // );

    navigation.push('VideoScreen', { });
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>
      <StatusBar backgroundColor="black" barStyle="light-content" />
      <View style={styles.container}>
        <Text style={styles.title}>Select users to start a video call</Text>
        {opponents.map(opponent => {
          const id = opponent.id;
          const user = getUserById(id);
          const selected = selectedOpponents.some(opponent => id === opponent.id);
          const type = selected
            ? 'radio-button-checked'
            : 'radio-button-unchecked';
          const onPress = selected ? unselectUser : selectUser;

          return (
            <TouchableOpacity
              key={id}
              style={styles.userLabel(user.color)}
              onPress={() => onPress(opponent)}>
              <Text style={styles.userName}>{user.name}</Text>
              <MaterialIcon name={type} size={20} color="white" />
            </TouchableOpacity>
          );
        })}
        <TouchableOpacity
          style={[styles.buttonStartCall]}
          onPress={startCall}>
          <MaterialIcon name={'call'} size={32} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    color: '#1198d4',
    padding: 20,
  },
  userLabel: backgroundColor => ({
    backgroundColor,
    width: 150,
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 5,
  }),
  userName: {color: 'white', fontSize: 20},
  buttonStartCall: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginHorizontal: 25,
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green',
  },
});