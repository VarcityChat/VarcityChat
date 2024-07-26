import { userImg } from "@/ui/images";
import { IUser } from "@/types";

export const users: IUser[] = [
  {
    id: 1,
    fullName: "Ebuka Varcity",
    hobbies: ["Baseabll", "Football", "Tennis", "Reading", "Blogging"],
    isNew: true,
    lookingFor: "Relationship",
    images: [userImg, userImg],
  },
  {
    id: 2,
    fullName: "Jeniffer Johnson",
    hobbies: ["Baseball", "Football", "Reading"],
    isNew: false,
    lookingFor: "Friendship",
    images: [userImg],
  },
  {
    id: 3,
    fullName: "Promise Sheggsmann",
    hobbies: ["Coding", "Football", "Reading"],
    isNew: false,
    lookingFor: "Friendship",
    images: [userImg],
  },
  {
    id: 4,
    fullName: "Jay Stance",
    hobbies: ["Coding", "Football", "Reading"],
    isNew: true,
    lookingFor: "Friendship",
    images: [userImg],
  },
  {
    id: 5,
    fullName: "Japan",
    hobbies: ["Coding", "Football", "Reading"],
    isNew: false,
    lookingFor: "Friendship",
    images: [userImg],
  },
  {
    id: 6,
    fullName: "Timi",
    hobbies: ["Coding", "Football", "Reading"],
    isNew: false,
    lookingFor: "Friendship",
    images: [userImg],
  },
  {
    id: 7,
    fullName: "Glory Ade",
    hobbies: ["Coding", "Football", "Reading"],
    isNew: false,
    lookingFor: "Friendship",
    images: [userImg],
  },
];
