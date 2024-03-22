import NodeGeocoder from 'node-geocoder';
import { MessageException } from "../exceptions/MessageException";

const geocoder = NodeGeocoder({
  provider: 'google',
  apiKey: 'AIzaSyDQlD3-cmPiepBAeHB4NYXdN12HIyCjhl4',
});

export const createPosition = async (address) => {
  try {
    const result = await geocoder.geocode(address);
    
    if (result.length > 0) {
      const location = result[0];
      return {
        lat: location.latitude,
        lng: location.longitude
      };
    } else {
      throw new MessageException({
        code: 422,
        message: 'Failed to retrieve coordinates for the given address.',
      });
    }
  } catch (error) {
    console.log(error);
    throw new MessageException({
      code: 500,
      message: 'Error during geocoding process.',
    });
  }
};