const jwt = require("jsonwebtoken");
const APP_SECRET = "GraphQL-is-aw3some";

function getTokenPayload(token) {
  try {
    const payload = jwt.verify(token, APP_SECRET);
    return payload;
  } catch (error) {
    throw new Error("Authentication Invalid");
  }
}

function getIdProfile(req, authToken) {
  if (req) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      throw new Error("Authentication Invalid");
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new Error("No token found");
    }
    if (authHeader) {
      const { idProfile } = getTokenPayload(token);
      return idProfile;
    }
  } else if (authToken) {
    const { idProfile } = getTokenPayload(authToken);
    return idProfile;
  }

  throw new Error("Not authenticated");
}

module.exports = {
  APP_SECRET,
  getIdProfile,
};
