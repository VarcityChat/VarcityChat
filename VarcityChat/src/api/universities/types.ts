export interface IUniversity {
  location?: {
    location: {
      type: string;
      coordinates: number[];
    };
  };
  _id: string;
  name: string;
  image: string;
}
