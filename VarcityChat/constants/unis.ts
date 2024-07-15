const lcuImage = require("../assets/images/unis/lcu.png");
const oouImage = require("../assets/images/unis/oou.png");
const lasuImage = require("../assets/images/unis/lasu.png");

export const universities = [
  {
    id: 1,
    name: "LCU",
    location: "Ibadan, Oyo",
    image: lcuImage,
  },
  {
    id: 2,
    name: "OOU",
    location: "Ago-iwoye, Ogun",
    image: oouImage,
  },
  {
    id: 3,
    name: "Tasued",
    location: "Ijebu ode, Ogun",
    image: require("../assets/images/unis/tasued.png"),
  },
  {
    id: 4,
    name: "Unilag",
    location: "Yaba, Lagos",
    image: require("../assets/images/unis/unilag.png"),
  },
  {
    id: 5,
    name: "LASU",
    location: "Ojo, Lagos",
    image: lasuImage,
  },
  { id: 6, name: "OAU", location: "Ile-Ife, Osun" },
  { id: 7, name: "AAP", location: "Abeokuta, Ogun", image: lcuImage },
  { id: 8, name: "LasuTech", location: "Ikorodu, Lagos" },
  { id: 9, name: "YabaTech", location: "Yaba, Lagos", image: lcuImage },
  { id: 10, name: "Convenant", location: "Ile, Ogun", image: lcuImage },
];
