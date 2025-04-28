import { Router } from "express";
import { auth } from "../../middleware/auth";
import { USER_ROLE } from "../../constant";
import { BidController } from "./bid.controller";

const router = Router();

router.post("/create", auth(USER_ROLE.dealer), BidController.createBid).get("/" , auth(USER_ROLE.private_user), BidController.getBidList); 


export const BidRoutes = router;