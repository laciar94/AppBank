const Transfer = require('../models/transfer.models');
const User = require('../models/user.model');

exports.transferAmount = async (req, res) => {
  try {
    const { amount, accountNumber, senderUserId } = req.body;

    const userReceiver = await User.findOne({
      where: {
        status: true,
        accountNumber,
      },
    });

    if (!userReceiver) {
      console.error(
        `Receiver user not found for account number: ${accountNumber}`
      );
      return res.status(404).json({
        status: 'failed',
        message: 'Receiver user not found',
      });
    }

    const userSender = await User.findOne({
      where: {
        status: true,
        id: senderUserId,
      },
    });

    if (!userSender) {
      return res.status(404).json({
        status: 'failed',
        message: 'Sender user not found',
      });
    }

    if (userSender.amount < amount) {
      return res.status(400).json({
        status: 'failed',
        message: 'Sender user does not have enough funds',
      });
    }

    if (userSender.id === userReceiver.id) {
      return res.status(400).json({
        status: 'failed',
        message: 'Cannot transfer funds to the same user',
      });
    }

    await User.update(
      { amount: userSender.amount - amount },
      { where: { id: userSender.id } }
    );
    await User.update(
      { amount: userReceiver.amount + amount },
      { where: { id: userReceiver.id } }
    );

    const newTransfer = {
      senderUserId: userSender.id,
      receiverUserId: userReceiver.id,
      amount,
    };
    await Transfer.create(newTransfer);

    res.status(201).json({
      status: 'success',
      message: 'Transfer created successfully',
      newTransfer,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'failed',
      message: 'Internal Server Error',
    });
  }
};
