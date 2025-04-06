import { NOT_FOUND, OK } from "../constants/statusCode";
import UserModel from "../models/user.model";
import appAssert from "../utils/appAssert";
import catchErrors from "../utils/catchErrors";

export const getUserHandler = catchErrors(async (req, res) => {
  //@ts-ignore
  const user = await UserModel.findById(req.userId);
  appAssert(user, NOT_FOUND, "User not found");
  // return res.status(OK).json(user.omitPassword());
  return res.status(OK).json(user.omitSensitive());
});
