import mongoose from "mongoose";

mongoose.Promise = global.Promise;

mongoose
  .connect("mongodb://localhost/javascriptNote", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("success"))
  .catch((error) => console.log(error));
