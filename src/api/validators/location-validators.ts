import { body } from 'express-validator';

export class LocationValidation {
  static addLocation() {
    return [
      body('address').notEmpty().withMessage('Address is required'),
      body('coordinates.latitude').isFloat().withMessage('Latitude must be a number'),
      body('coordinates.longitude').isFloat().withMessage('Longitude must be a number'),
    ];
  }
}
