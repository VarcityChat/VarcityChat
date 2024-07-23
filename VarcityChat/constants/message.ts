export const messages = [
  {
    _id: 1,
    text: "Hello Developer",
    createdAt: new Date(),
    user: {
      _id: 2,
      name: "React Native",
      avatar: "https://placeimg.com/140/140/any",
    },
    from: 2,
  },
  {
    _id: 2,
    text: "Hi Man",
    createdAt: new Date(),
    from: 1,
    user: {
      _id: 1,
      name: "Grimin",
      avatar: "https://placeimg.com/140/140/any",
    },
  },
  {
    _id: 3,
    text: "I knew your text was gonna come in now",
    createdAt: new Date(),
    user: {
      _id: 1,
      name: "Grimin",
      avatar: "https://placeimg.com/140/140/any",
    },
    from: 1,
  },
  {
    _id: 4,
    text: "Hello Developer",
    createdAt: new Date(),
    user: {
      _id: 2,
      name: "React Native",
      avatar: "https://placeimg.com/140/140/any",
    },
    from: 2,
  },
];
