import mongoose, {
  Document,
  PassportLocalDocument,
  Model,
  PassportLocalModel,
  Schema,
} from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

// if (process.env.NODE_ENV !== "production") {
//   require("dotenv").config();
// }

import dotenv from "dotenv"

dotenv.config();

interface ThumbnailSize {
  width: number;
  height: number;
}

interface IUser extends PassportLocalDocument {
  _doc?: any;
  username: string; //?
  email: string;
  avatar: {
      url: string;
      filename: string;
  };
  _thumbnailSize?: ThumbnailSize; // Optional as it's set virtually
  thumbnail?: string; // This is the result of the virtual "thumbnail" property
}

const userSchema: Schema = new Schema({
  email: { type: String, require: true, unique: true },

  avatar: {
      url: { type: String, required: true },
      filename: { type: String, required: true },
  },
});

userSchema
  .virtual("thumbnailSize")
  .set(function (this: IUser, params: ThumbnailSize) {
      this._thumbnailSize = params;
  });

userSchema.virtual("thumbnail").get(function (this: IUser) {
  const width = this._thumbnailSize.width || 200;
  const height = this._thumbnailSize.height || 150;
  const url =
      process.env.ImageKit_Endpoint +
      this.avatar.filename +
      `?tr=w-${width},h-${height},f-png,lo-true`;
  return url;
});

interface UserModel<T extends Document> extends PassportLocalModel<T> {}

userSchema.plugin(passportLocalMongoose);

const User: UserModel<IUser> = mongoose.model<IUser>("User", userSchema);

export { IUser, User };