import * as Yup from "yup";
import User from "../schemas/User";

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6)
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validations Fails" });
    }
    const { name, email, password } = req.body;

    const user = await User.create({
      name,
      email,
      password
    });

    return res.json(user);
  }
}

export default new UserController();
