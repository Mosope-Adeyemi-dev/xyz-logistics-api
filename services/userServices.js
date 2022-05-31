// To get current url
const getUrl = () => {
  return process.env.NODE_ENV === "production"
    ? "https://xyz-api.herokuapp.com/"
    : "http://localhost:4000/";
};

module.exports = {
  getUrl,
};
