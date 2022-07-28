import chaiSetup from "./utils/chai_setup";
import EVMRevert from "./utils/EVMRevert";

import {expect} from "chai";
import {ethers} from "hardhat";

chaiSetup();

describe("Reservation.sol", () => {

  let ownerSig: any;
  let nobodySig: any;
  let owner: string;
  let nobody: string;

  let contractFactory: any;
  let reservation: any;

  before(async () => {

    [ownerSig, nobodySig] = await ethers.getSigners();

    owner = await ownerSig.getAddress();
    nobody = await nobodySig.getAddress();
    
    console.log(owner);
    console.log(nobody);
  });

  describe("allows owner to", () => {
    beforeEach(async () => {

      contractFactory = await ethers.getContractFactory("Reservation");
      reservation = await contractFactory.deploy();
    });

    it("reserve and emits Creation Event", async () => {

      await expect(reservation.reserve(nobody, 0, 100, 200))
      .to.emit(reservation, 'Creation')
      .withArgs(nobody, 0, 0);     
    });

    it("cancel and emits Cancellation Event", async () => {

      await reservation.reserve(nobody, 0, 100, 200);

      await expect(reservation.cancel(nobody, 0))
      .to.emit(reservation, 'Cancellation')
      .withArgs(nobody, 0, 0);     

      // token no longer exists
      await reservation.ownerOf(0).should.be.rejectedWith(EVMRevert);
    });
  });

  describe("handles token id", () => {
    beforeEach(async () => {
      contractFactory = await ethers.getContractFactory("Reservation");
      reservation = await contractFactory.deploy();
    });

    it("incrementing the id every time", async () => {

      await expect(reservation.reserve(nobody, 0, 100, 200))
      .to.emit(reservation, 'Creation')
      .withArgs(nobody, 0, 0);     

      await expect(reservation.reserve(nobody, 0, 400, 600))
      .to.emit(reservation, 'Creation')
      .withArgs(nobody, 0, 1);     

      await expect(reservation.reserve(owner, 0, 600, 800))
      .to.emit(reservation, 'Creation')
      .withArgs(owner, 0, 2);     

      await expect(reservation.reserve(owner, 1, 600, 800))
      .to.emit(reservation, 'Creation')
      .withArgs(owner, 1, 3);     

    });

    it("not affected by cancellation", async () => {
      await reservation.reserve(nobody, 0, 100, 200);
      await reservation.cancel(nobody, 0);

      await expect(reservation.reserve(nobody, 0, 400, 600))
      .to.emit(reservation, 'Creation')
      .withArgs(nobody, 0, 1);     
    });
  });

  describe("does not allow non-owner to", () => {
    beforeEach(async () => {
      contractFactory = await ethers.getContractFactory("Reservation");
      reservation = await contractFactory.deploy();
    });

    it("reserve", async () => {
      await reservation
        .connect(nobodySig)
        .reserve(nobody, 0, 100, 200)
        .should.be.rejectedWith(EVMRevert);
    });

    it("cancel", async () => {
      await reservation.reserve(nobody, 0, 100, 200);

      // verify nobody owns the token now
      (await reservation.ownerOf(0)).should.equal(nobody);

      await reservation
        .connect(nobodySig)
        .cancel(nobody, 0)
        .should.be.rejectedWith(EVMRevert);
    });
  });
});
