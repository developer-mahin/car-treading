import { TAuthUser } from "../../interface/authUser";
import { MulterFile } from "../../middleware/imageConverter";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { OfferCarService } from "./offerCar.service";

const createOfferCar = catchAsync(async (req, res) => {
    const imagesFile = req.files as { [fieldname: string]: MulterFile[] };

    req.body.carImages = [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    imagesFile?.images?.forEach((image: any) => {
        req.body.carImages.push(image.path)
    })

    const result = await OfferCarService.createOfferCar(req.body, req.user as TAuthUser);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'OfferCar created successfully',
        data: result,
    });
});

export const OfferCarController = {
    createOfferCar,
};