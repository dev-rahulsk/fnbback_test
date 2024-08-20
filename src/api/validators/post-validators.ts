import { body } from 'express-validator';

export class PostValidation {
  static addPost() {
    return [
      body('media').isArray().withMessage('Media must be an array'),
      body('media.*.type').isIn(['image', 'video']).withMessage('Invalid media type'),
      body('media.*.storage').notEmpty().withMessage('Storage URL is required'),
    ];
  }
}
