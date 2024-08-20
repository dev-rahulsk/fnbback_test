import { check } from "express-validator";
import { PreferredGender, Role } from "../enums/user.enum";

export class AuthValidation {
  // Validation rules for user registration
  static registerUser() {
    return [
      check('email').isEmail().withMessage('Invalid email format'),
      check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    ];
  }

  // Validation rules for user login
  static loginUser() {
    return [
      check('email').isEmail().withMessage('Invalid email format'),
      check('password').exists().withMessage('Password is required'),
    ];
  }
  static createLocation() {
    return [
     

      check('type')
        .notEmpty()
        .withMessage('Type is required')
        .isIn(['Home', 'Work'])
        .withMessage('Type must be one of Home, Work, or Other'),

      check('address')
        .notEmpty()
        .withMessage('Address is required')
        .isString()
        .withMessage('Address must be a string'),

      check('coordinates.latitude')
        .notEmpty()
        .withMessage('Latitude is required')
        .isFloat({ min: -90, max: 90 })
        .withMessage('Latitude must be a number between -90 and 90'),

      check('coordinates.longitude')
        .notEmpty()
        .withMessage('Longitude is required')
        .isFloat({ min: -180, max: 180 })
        .withMessage('Longitude must be a number between -180 and 180'),
    ];
  }
  // Validation rules for email verification
  static verifyEmail() {
    return [
      check('email').isEmail().withMessage('Invalid email format'),
      check('otp').exists().withMessage('otp is required'),
    ];
  }

  // Validation rules for selecting user role
  static selectRole() {
    return [
      check('role').isIn(Object.values(Role)).withMessage('Invalid role'),
    ];
  }

  // Validation rules for completing user profile
  static completeProfile() {
    return [
      check('firstName').notEmpty().withMessage('First Name is required'),
      check('lastName').notEmpty().withMessage('Last Name is required'),
      check('gender').isIn(Object.values(PreferredGender)).withMessage('Invalid gender'),
      check('dob').isDate().withMessage('Date of birth must be a valid date')
    ];
  }

  // Validation rules for selecting preferred gender
  static selectPreferredGender() {
    return [
      check('preferredGender').isIn(Object.values(PreferredGender)).withMessage('Invalid preferred gender'),
    ];
  }
  static adminRegister(){
    return[
      check('email').isEmail().withMessage('Invalid email format'),
      check('password').exists().withMessage('Password is required'),
      check('name').notEmpty().withMessage('First Name is required'),
    ]
  }
  static verifyEmailOnly() {
    return [
      check('email').isEmail().withMessage('Invalid email format'),
    ];
  }
  static VerifyPassword() {
    return [
      // Check if the password field is provided and validate it
      check('password')
        .isLength({ min: 8, max: 50 }).withMessage('Password must be between 8 and 50 characters long.')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter.')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter.')
        .matches(/[0-9]/).withMessage('Password must contain at least one numeric character.')
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character.')
        .trim() // Optionally trim whitespace
        .escape() // Optionally escape characters to prevent XSS
    ];
  }
}
