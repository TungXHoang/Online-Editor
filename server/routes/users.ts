
import express, { Router } from "express";
import { RequestHandler } from "express-serve-static-core";
import { uploadImage } from "../aws-s3/index";
import {registerUser, loginUser, logoutUser, authenticateUser,fetchUser} from "../controllers/users";
import { validateRegister } from "../middleware";

const router: Router = express.Router();
 
router
    .route("/api/users/register")
    .post(
        uploadImage.single("image"),
        validateRegister,
        registerUser as RequestHandler
    );

router.route("/api/users/login").post(loginUser as RequestHandler);
router.route("/api/users/logout").post(logoutUser as RequestHandler);
router.route("/api/users/auth").post(authenticateUser as RequestHandler);
router.route("/api/users/:userId/:thumbnailDim").get(fetchUser as RequestHandler);

export = router;
