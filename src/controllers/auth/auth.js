import { Customer, DeliveryPartner } from "../../models/user.js";

const generateTokens = (user) => {
  const accesTokens = jwt.sign(
    { userId: user._id, role: user._role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  const refreshToken = jwt.sign(
    { userId: user._id, role: user._role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  return { accesTokens, refreshToken };
};

export const loginCustomer = async (req, reply) => {
  try {
    const { phone } = req.body;
    let customer = await Customer.findOne({ phone });
    if (!customer) {
      customer = new Customer({
        phone,
        role: "Customer",
        isActivated: true,
      });
      await customer.save();
    }

    const { accesTokens, refreshToken } = generateTokens(customer);
    return reply.send({
      message: "Login Successfull",
      accesTokens,
      refreshToken,
      customer,
    });
  } catch (error) {
    return reply.status(500).send({ message: "An Error Occured", error });
  }
};

export const loginDeliveryPartner = async (req, reply) => {
  try {
    const { email, password } = req.body;
    const deliveryPartner = await DeliveryPartner.findOne({ email });
    if (!deliveryPartner) {
      return reply.status(404).send({ message: "Delivery Partner not Found" });
    }
    const isMatch = password === deliveryPartner.password;
    if (!isMatch) {
      return reply.status(400).send({ message: "Invalid Credentials" });
    }
    const { accesTokens, refreshToken } = generateTokens(deliveryPartner);
    return reply.send({
      message: "Login Successfull",
      accesTokens,
      refreshToken,
      deliveryPartner,
    });
  } catch (error) {
    return reply.status(500).send({ message: "An Error Occured", error });
  }
};

export const refreshToken = async (req, reply) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return reply.status(401).send({ message: "Refresh Token Required" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    let user;

    if (decoded.role === "Customer") {
      user = await Customer.findById(decoded.userId);
    } else if (decoded.role === "DeliveryPartner") {
      user = await DeliveryPartner.findById(decoded.userId);
    } else {
      return reply.status(403).send({ message: "Invalid Role" });
    }
    if (!user) {
      return reply.status(403).send({ message: "User not found" });
    }
    const { accesTokens, refreshToken: newRefreshToken } = generateTokens(user);

    return reply.send({
      message: "Token Refreshed",
      accesTokens,
      refreshToken:newRefreshToken,
    });
  } catch (error) {
    return reply.status(403).send({ message: "Invalid Refresh Token" });
  }
};
