import * as chai from "chai";

// const chaiAsPromised = require("chai-as-promised");
const dirtyChai = require("dirty-chai");

export default () => {
  //   chai.config.includeStack = true;
  chai.use(dirtyChai);
  // chai.use(chaiAsPromised);
  chai.should();
};
