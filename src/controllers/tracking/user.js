import { Customer, DeliveryPartner } from "../../models/user.js";

export const updatedUser = async (req, reply) => {
  try {
    const { userId } = req.user;
    const updateData = req.body;

    let user =
      (await Customer.findById(userId)) ||
      (await DeliveryPartner.findById(userId));

    if (!user) {
      return reply.status(400).send({ message: "User not found" });
    }
    let userModel;

    if (user.role === "Customer") {
      userModel = DeliveryPartner;
    } else if (user.role === "DeliveryPartner") {
      userModel = DeliveryPartner;
    } else {
      return reply
        .status(400)
        .send({ message: "Failed to update user", error });
    }
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return reply.status(404).send({ message: "user not found" });
    }
    return reply.send({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return reply.status(500).send({ message: "Failed to update user", error });
  }
};
