export interface IUniversity {
  location?: {
    location: {
      type: string;
      coordinates: number[];
    };
    address: string;
  };
  _id: string;
  name: string;
  image: string;
}
