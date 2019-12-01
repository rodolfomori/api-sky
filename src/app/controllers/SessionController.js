/* eslint-disable class-methods-use-this */
/* eslint-disable object-curly-newline */
import * as Yup from 'yup';
import bcrypt from 'bcryptjs';
import { differenceInMinutes, addMinutes, isAfter } from 'date-fns';
import User from '../schemas/User';

class SessionController {
  async show(req, res) {
    const user = await User.findById(req.params.id, (err) => {
      if (err) {
        res.status(400).json({ error: 'User not found' });
      }
    });

    const { name, email, phone, last_login: lastLogin } = user;

    const addMin = addMinutes(lastLogin, 30);

    if (isAfter(addMin, new Date())) {
      const timeForLogin = differenceInMinutes(addMin, new Date());
      return res.status(401).json({
        error: `You can't login now! Wait ${timeForLogin} more minutes `,
      });
    }

    return res.json({
      name,
      email,
      phone,
      lastLogin,
    });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails' });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).send({ error: 'Password does not match' });
    }

    await User.update(
      { email },
      { $set: { last_login: new Date() } },
      { upsert: true },
    );

    const { name, phone, id } = user;

    return res.json({
      user: {
        id,
        name,
        email,
        phone,
        last_login: new Date(),
      },
    });
  }
}

export default new SessionController();