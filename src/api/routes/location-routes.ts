import { NextFunction, Request, Response, Router } from 'express';
import { validationResult } from 'express-validator';
import PassportService from '../services/passport-services';
import { LocationValidation } from '../validators/location-validators';
import { handleValidationErrors } from '../utils/functions';
import LocationController from '../controllers/requests/location.requests';

const router = Router();

router.post(
  '/add',
  PassportService.authenticate('jwt'),
  LocationValidation.addLocation(),
  handleValidationErrors,
  LocationController.add.bind(LocationController)
);

export default router;
