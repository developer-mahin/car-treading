import { Router } from 'express';
import { CarController } from './car.controller';
import { auth } from '../../middleware/auth';
import { USER_ROLE } from '../../constant';
import validateRequest from '../../middleware/validation';
import { CarValidation } from './car.validation';
import parseFormData from '../../middleware/parsedData';
import fileUpload from '../../utils/uploadImage';

const upload = fileUpload('./public/uploads/brand/');

const router = Router();

router
  .post(
    '/sale_car',
    // auth(USER_ROLE.dealer, USER_ROLE.private_user),
    validateRequest(CarValidation.carListingValidationSchema),
    upload.fields([{ name: 'images', maxCount: 10 }]),
    parseFormData,
    CarController.carListing,
  )
  .post('/buy_car', auth(USER_ROLE.dealer), CarController.buyCar)
  .post(
    '/add_brand',
    upload.single("image"),
    parseFormData,
    CarController.addBrand,
  )
  .get('/get_brand', CarController.getBrand)
  .get(
    '/sale_car_list',
    // auth(USER_ROLE.dealer, USER_ROLE.private_user, USER_ROLE.admin),
    CarController.getCarList,
  )
  .get(
    '/total_purchased_cars',
    auth(USER_ROLE.dealer),
    CarController.getTotalPurchasedCars,
  )
  .get(
    '/car_details/:carId',
    auth(USER_ROLE.dealer),
    CarController.getCarDetails,
  )
  .get(
    '/contact_paper/:carId',
    auth(USER_ROLE.dealer, USER_ROLE.private_user, USER_ROLE.admin),
    CarController.getContactPaper,
  )
  .get(
    '/my_buyed_cars',
    auth(USER_ROLE.private_user),
    CarController.getMyBuyedCars,
  )
  .get(
    '/cvr',
    // auth(USER_ROLE.private_user, USER_ROLE.dealer),
    CarController.getCVR,
  )
  .get(
    '/car_info',
    // auth(USER_ROLE.private_user, USER_ROLE.dealer),
    CarController.getCarInfo,
  )
  .patch(
    '/update/:carId',
    auth(USER_ROLE.dealer, USER_ROLE.admin, USER_ROLE.private_user),
    upload.fields([{ name: 'images', maxCount: 10 }]),
    parseFormData,
    CarController.updateCar,
  )
  .delete(
    '/:carId',
    auth(USER_ROLE.dealer, USER_ROLE.admin, USER_ROLE.private_user),
    CarController.deleteCar,
  ).delete("/delete_brand/:brandId", CarController.deleteBrand);

export const CarRoutes = router;
