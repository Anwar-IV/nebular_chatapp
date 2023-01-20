import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { userModel } from "../schema/userSchema.js";

type User = {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  password: string;
  refresh_token?: string | undefined;
};

export const authcontrol = (req: any, res: Response) => {
  //Check if there is a access token and it is valid and if there is a refresh token
  //If the access token is expired use the refresh token to generate a new one
  if (req.cookies.access && req.cookies.refresh) {
    jwt.verify(
      req.cookies.access,
      process.env.ACCESS_TOKEN_SECRET!,
      undefined,
      async (error, decoded) => {
        if (error) {
          if (error?.name === "TokenExpiredError") {
            console.log("Token Expired Error", {
              name: error.name,
              msg: error.message,
            });
            const isUser = await verifyRefresh(req.cookies.refresh);
            if (isUser === null) {
              return res.status(400).json({ msg: "Invalid Token" });
            }
            const new_access_token = renewAccess(isUser);
            if (new_access_token === "") {
              res.status(500).json({ msg: "New Access token is empty" });
              return;
            }
            res.cookie("access", new_access_token);
            res.status(200).json({
              _id: isUser._id,
              username: isUser.username,
              createdAt: isUser.createdAt,
              updatedAt: isUser.updatedAt,
            });
            return;
          } else {
            console.log({ name: error.name, message: error.message });
            res.status(500).json({ name: error.name, message: error.message });
            return;
          }
        }

        // If there is no error get user from db
        const user = await getUserFromDB(decoded as { username: string });

        //If there is no user...
        if (!user) {
          res.status(404).json("There is no user");
        }
        //Else...
        res.status(200).json({
          _id: user?._id,
          username: user?.username,
          createdAt: user?.createdAt,
          updatedAt: user?.updatedAt,
        });
      }
    );
  } else if (!req.cookies.access && req.cookies.refresh) {
    (async function verify() {
      const isUser = await verifyRefresh(req.cookies.refresh);
      if (!isUser) {
        res.status(404).json("No User Found");
        return;
      } else {
        const new_access_token = renewAccess(isUser);
        if (new_access_token === "") {
          res.status(500).json({ msg: "New Access token is empty" });
          return;
        }
        res.cookie("access", new_access_token);
        res.status(200).json({
          _id: isUser._id,
          username: isUser.username,
          createdAt: isUser.createdAt,
          updatedAt: isUser.updatedAt,
        });
        console.log("Renewed access token");
        return;
      }
    })();
  } else if (!req.refresh_token) {
    res.status(400).json("No refresh token");
    return;
  }
};

export const verifyRefresh = async (
  refresh_token: string
): Promise<null | User> => {
  //Set user variable that will be populated if the verification succeeds
  console.log("Entered verify refresh");
  // If there is no refresh token return null
  if (!refresh_token) {
    return null;
  }

  try {
    // Verify Refresh Token
    const decoded = jwt.verify(
      refresh_token,
      process.env.REFRESH_TOKEN_SECRET!
    );

    //Call getUserFromDB which returns the user or null if username doesn't match up
    const userFromDB = await getUserFromDB(decoded as { username: string });

    //If user is not found return null
    if (!userFromDB) {
      console.log("There is no user in db line 79 verifyRefresh");
      return null;
    }

    //Otherwise check the refresh token matches the refresh token in the db
    const isMatch = userFromDB.refresh_token === refresh_token;
    console.log({ isMatch });
    //If there is no match return null
    if (!isMatch) {
      return null;
    }

    //Otherwise return the user
    return userFromDB as User;
  } catch (error: any) {
    console.log("line 94 -- authController - authController.js", { error });
    console.log({ name: error?.name, message: error?.message });
    return null;
  }
};

export const renewAccess = (user: User): string => {
  try {
    const token = jwt.sign(
      { username: user.username },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: 60 }
    );
    return token;
  } catch (error: any) {
    if (error.message) {
      console.log(error.message);
      return "";
    }
    console.error("line 105 -- renewAccess - authController.js", error);
    return "";
  }
};

const getUserFromDB = async (decoded: {
  username: string;
}): Promise<User | null> => {
  try {
    //Destructure username from decoded payload
    const { username } = decoded;
    console.log("From getUserFromDB", { decoded });
    //Get user object from MongoDB
    const user = await userModel.findOne({ username });

    if (user) {
      return user as any;
    }
    return null;
  } catch (error) {
    console.log("getUserFromDB -- line 118 -- authController.ts", error);
    return null;
  }
};
