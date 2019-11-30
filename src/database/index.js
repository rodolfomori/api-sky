import mongoose from "mongoose";

class Database {
  constructor() {
    this.mongo();
  }

  mongo() {
    this.mongoConnection = mongoose.connect("mongodb://localhost:27017/sky", {
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true // inibir falha
    });
  }
}

export default new Database();
