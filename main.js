document.addEventListener("DOMContentLoaded", function () {
  //   Setup with firebase connection

  var firebaseConfig = {
    apiKey: "AIzaSyCgkjk9hPKgGIJOfjLNotj46_J4ViNT5Zs",
    authDomain: "codepen-chatterbox.firebaseapp.com",
    databaseURL: "https://codepen-chatterbox.firebaseio.com",
    projectId: "codepen-chatterbox",
    storageBucket: "codepen-chatterbox.appspot.com",
    messagingSenderId: "73501066368",
    appId: "1:73501066368:web:ae74ab2e3f91ae97751265",
    measurementId: "G-5FBB9TH8Q5",
  };

  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
  const db = firebase.database();
  const usersRef = db.ref("users");
  const roomsRef = db.ref("rooms");

  // Schemas
  class User {
    constructor(name) {
      this.name = name;
      this.room = "Main";
      this.firstEntrance = true;
      login(this);
      enterRoom(this, this.room);
    }

    logout() {
      logout(this);
    }
    enterRoom(destinationRoom) {
      enterRoom(this, destinationRoom);
    }
    sendMessage(message) {
      sendMessage(this, message);
    }
  }

  // Actions

  //    Add user to global users collection, add key to user object as id
  const login = (user) => {
    user.id = usersRef.push(user).getKey();
  };

  //    Find and remove user from users collection
  let logout = ({ id, room, name }) => {
    //    remove the user from the list of users
    usersRef.child(id).remove();
    //    do the same for the room they occupied
    roomsRef.child(`${room}/users/${id}`).remove();
    //    send message to room
    message = {
      user: "ChatterBox",
      message: `${name} has left the room!`,
    };
    roomsRef.child(`${room}/messages`).push(message);
  };

  //    Find and remove a room from rooms collection

  let closeRoom = (name) => {
    roomsRef.child(name).remove();
  };

  //    User send message

  let sendMessage = ({ name, room }, message) => {
    //    make a message object
    let userMessage = { user: name, message };
    //    push the message to the room's messages array
    roomsRef.child(`${room}/messages`).push(userMessage);
  };

  //    Change room

  const enterRoom = (user, destinationRoom) => {
    //    remove user from previous room
    roomsRef.child(`${user.room}/users/${user.id}`).remove();
    //    Send a message to the room as the App bot about departure
    if (!user.firstEntrance) {
      let message = {
        user: "ChatterBox",
        message: `${user.name} has left the room!`,
      };
      roomsRef.child(`${user.room}/messages`).push(message);
    }
    user.firstEntrance = false;

    //    update the user object
    user.room = destinationRoom;
    //    Add user to destination room
    roomsRef.child(`${destinationRoom}/users/${user.id}`).update(user);
    //    Send a message to the room as the App bot about arrival
    message = {
      user: "ChatterBox",
      message: `${user.name} has entered the room!`,
    };
    roomsRef.child(`${destinationRoom}/messages`).push(message);
    //    update the user information
    usersRef.child(`${user.id}`).update(user);
  };

  let user;

  // setTimeout(() => {
  //   user = new User("Jeff");
  // }, 2000);
  // setTimeout(() => {
  //   user.sendMessage("Sup");
  //   user.enterRoom("Balls");
  // }, 4000);
  // setTimeout(() => {
  //   user.sendMessage("Eyyyyy");
  //   user.logout();
  // }, 6000);
});
