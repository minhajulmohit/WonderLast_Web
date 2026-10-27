export interface TravelPackage {
  _id?: string;
  id?: string;
  destinationName: string;
  country: string;
  category: string;
  price: number;
  duration: string;
  departureDate: string;
  image?: string;
  imageUrl?: string;
  description: string;
  rating?: number;
}
