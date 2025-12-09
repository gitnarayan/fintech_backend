import express from 'express';
import validate from '../middlewares/validate.js';
import auth from '../middlewares/auth.js';
import sipValidation from '../validations/sipValidation.js';
import sipController from '../controllers/sipController.js';

const router = express.Router();

router
  .route('/')
  .post(auth('manageSIP'), validate(sipValidation.createSIP), sipController.createSIP)
  .get(auth('manageSIP'), sipController.getUserSIPs);

router
  .route('/:sipId')
  .get(auth('manageSIP'), validate(sipValidation.getSIP), sipController.getSIP)
  .patch(auth('manageSIP'), validate(sipValidation.updateSIP), sipController.updateSIP);

router
  .route('/:sipId/cancel')
  .post(auth('manageSIP'), validate(sipValidation.getSIP), sipController.cancelSIP);

router
  .route('/:sipId/pause')
  .post(auth('manageSIP'), validate(sipValidation.getSIP), sipController.pauseSIP);

router
  .route('/:sipId/resume')
  .post(auth('manageSIP'), validate(sipValidation.getSIP), sipController.resumeSIP);

export default router;