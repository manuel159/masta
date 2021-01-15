module.exports = {
  port: process.env.PORT || 3000,

  db: process.env.MONGODB || "mongodb+srv://mani:1234@cluster0.twgse.mongodb.net/crud?retryWrites=true&w=majority",

  urlParser: {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
};
