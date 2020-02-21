switch (process.env.REACT_APP_ADIANTA_ENV) {
  case "development":
  case "develop":
  case "dev":
    module.exports = require("./alt.develop");
    break;
  default:
    module.exports = require("./alt.prod");
    break;
}
