import jwt from "jsonwebtoken";
import { jwtKey } from "../../server.js";
export const GenrateTokenAuth = (userData, successMessage,errorMessage,resp) => {
    console.log(userData,85)

  jwt.sign({userData }, jwtKey, (err, token) => {
    if (err) {
      resp.send({ error: errorMessage });
    }
    resp.send({
      status: 200,
      data: userData,
      message: successMessage,
      token: token,
    });
  });
};
