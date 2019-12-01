/* eslint-disable class-methods-use-this */
import * as Yup from 'yup';
import jwt from 'jsonwebtoken';
import User from '../schemas/User';

class UserController {
  async index(req, res) {
    const users = await User.find({});

    return res.json(users);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string()
        .required()
        .min(2),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
      phone: Yup.object().shape(
        {
          number: Yup.number()
            .min(8)
            .required(),
        },
        {
          ddd: Yup.number()
            .min(4)
            .required(),
        },
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails' });
    }

    const { name, email, password } = req.body;
    const { ddd, number } = req.body.phone;

    // check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    // check if phone exists
    const phoneExists = await User.findOne({
      $and: [{ 'phone.number': number }, { 'phone.ddd': ddd }],
    });

    if (phoneExists) {
      return res.status(400).json({ error: 'Phone already exists.' });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone: {
        ddd,
        number,
      },
    });

    return res.json(user);
  }
}

export default new UserController();
