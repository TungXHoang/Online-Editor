
import express, { Router } from "express";
import { RequestHandler } from "express-serve-static-core";
import { uploadImage } from "../aws-s3/index";
import {registerUser, loginUser, logoutUser, authenticateUser,fetchUser} from "../controllers/users";
import { validateRegister } from "../middleware";

const router: Router = express.Router();
 
router
    .route("/register")
    .post(
        uploadImage.single("image"),
        validateRegister,
        registerUser as RequestHandler
    );

router.route("/login").post(loginUser as RequestHandler);
router.route("/logout").post(logoutUser as RequestHandler);
router.route("/auth").post(authenticateUser as RequestHandler);
router.route("/:userId/:thumbnailDim").get(fetchUser as RequestHandler);

export = router;
