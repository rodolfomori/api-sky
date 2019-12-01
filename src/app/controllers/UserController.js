/* eslint-disable object-curly-newline */
/* eslint-disable class-methods-use-this */
import * as Yup from 'yup';
import jwt from 'jsonwebtoken';
import User from '../schemas/User';
import authConfig from '../config/auth';

class UserController {
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
        }
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

    const { id, createdAt, updatedAt, lastLogin } = user;

    return res.json({
      name,
      email,
      phone: {
        ddd,
        number,
      },
      createdAt,
      updatedAt,
      lastLogin,
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new UserController();
