import chaiSetup from "./utils/chai_setup";
import EVMRevert from "./utils/EVMRevert";
const { ethers, waffle } = require("hardhat");

chaiSetup();

describe("Calendar.sol", () => {

  const RATE = 1;
  const SECS = 3600*24;

  let ownerSig: any;
  let renter1Sig: any;
  let renter2Sig: any;

  let owner: string;
  let renter1: string;
  let renter2: string;
  
  let contractFactory: any;
  let calendar: any;
  const nullAddress = "0x0000000000000000000000000000000000000000";
  const URI = "https://pinepipe.com/wp-content/uploads/2020/11/1.-Client-1.png";

  before(async () => {

    [ownerSig, renter1Sig, renter2Sig] = await ethers.getSigners();

    owner = await ownerSig.getAddress();
    renter1 = await renter1Sig.getAddress();
    renter2 = await renter2Sig.getAddress();
    
    console.log(owner);
    console.log(renter1);
    console.log(renter2);
  });

  describe("availability", () => {
    beforeEach(async () => {

      contractFactory = await ethers.getContractFactory("Calendar");
      calendar = await contractFactory.deploy();
      
      await calendar.mint(URI);
      await calendar.mint(URI);
    });

    it("compute gas", async () => {

      const tr = await calendar.reserve(0, 1000*SECS, 2000*SECS, RATE, {value: 1});
      const receipt = await tr.wait();

      console.log(ethers.utils.formatEther(receipt.gasUsed));
    });

    it("requires stop time to be after start time", async () => {
      await calendar.reserve(0, 2000*SECS, 1000*SECS, RATE).should.be.rejectedWith(EVMRevert);
    });

    it("limits the reservation duration to 168 hours", async () => {
      const limit = 168 * 1000 * 3600;
      await calendar.reserve(1, 0, limit + 1, RATE, {value: 7}).should.be.rejectedWith(EVMRevert);
      await calendar.reserve(0, 0, limit, RATE, {value: 7}).should.not.be.rejectedWith(EVMRevert); // eslint-disable-line no-unused-expressions

      console.log(await calendar.provider.getBalance(calendar.reservationContract()));
    });

    it("maintains ownership of token to actual owner", async () => {
      (await calendar.ownerOf(0)).should.equal(owner);
    });

    it("only owner can burn a calendar", async () => {
      
      await calendar.connect(renter1Sig).burn(1).should.be.rejectedWith(EVMRevert);      
      await calendar.burn(1).should.not.be.rejectedWith(EVMRevert);
    });

    it("lets renter reserve and gain access", async () => {
      await calendar.connect(renter1Sig).reserve(0, 1000*SECS, 2000*SECS, RATE, {value: 1});

      (await calendar.renterOf(0, 500*SECS)).should.equal(nullAddress);
      (await calendar.renterOf(0, 1500*SECS)).should.equal(renter1);
    });

    it("blocks after reservation", async () => {
      // available by default
      (await calendar.isAvailable(0, 0, 5000*SECS)).should.equal(true);

      await calendar.connect(renter1Sig).reserve(0, 1000*SECS, 2000*SECS, RATE, {value: 1});
      await calendar.connect(renter1Sig).reserve(0, 3000*SECS, 4000*SECS, RATE, {value: 1});

      // block time range >> reservation 1 and 2
      //  |---------------------|
      //     |--1--|    |--2--|
      (await calendar.isAvailable(0, 0, 5000*SECS)).should.equal(false);
      // block time range >> reservation 1 but not 2
      //  |----------|
      //     |--1--|    |--2--|
      (await calendar.isAvailable(0, 500*SECS, 2500*SECS)).should.equal(false);
      // block time range >> reservation 2 but not 1
      //              |----------|
      //     |--1--|    |--2--|
      (await calendar.isAvailable(0, 2500*SECS, 4500*SECS)).should.equal(false);
      // block time range starts before reservation 1 and ends during 1
      //  |----|
      //     |--1--|    |--2--|
      (await calendar.isAvailable(0, 500*SECS, 1500*SECS)).should.equal(false);
      // block time range starts within reservation 1
      //       |--|
      //     |--1--|    |--2--|
      (await calendar.isAvailable(0, 1500*SECS, 1700*SECS)).should.equal(false);
      // block time range starts during reservation 1 and ends before 2
      //       |----|
      //     |--1--|    |--2--|
      (await calendar.isAvailable(0, 1500*SECS, 2500*SECS)).should.equal(false);
      // block time range starts after reservation 1 and ends during 2
      //             |---|
      //     |--1--|    |--2--|
      (await calendar.isAvailable(0, 2500*SECS, 3500*SECS)).should.equal(false);
      // block time range within reservation 2
      //                  |--|
      //     |--1--|    |--2--|
      (await calendar.isAvailable(0, 3500*SECS, 3700*SECS)).should.equal(false);
      // block time range starts during reservation 2
      //                    |---|
      //     |--1--|    |--2--|
      (await calendar.isAvailable(0, 3500*SECS, 4500*SECS)).should.equal(false);

      // available time range before reservation 1
      // |--|
      //     |--1--|    |--2--|
      (await calendar.isAvailable(0, 500*SECS, 800*SECS)).should.equal(true);
      // available time range between reservation 1 and 2
      //            |--|
      //     |--1--|    |--2--|
      (await calendar.isAvailable(0, 2200*SECS, 2500*SECS)).should.equal(true);
      // available time range after 2
      //                        |--|
      //     |--1--|    |--2--|
      (await calendar.isAvailable(0, 4500*SECS, 5000*SECS)).should.equal(true);
    });

    it("prevents double book", async () => {
      await calendar.connect(renter1Sig).reserve(0, 1000*SECS, 2000*SECS, RATE, {value: 1});
      (await calendar.isAvailable(0, 1000*SECS, 2000*SECS)).should.equal(false);

      // reserve revert
      // TODO: check revert message once there is test utils support
      await calendar
        .connect(renter2Sig)
        .reserve(0, 1000*SECS, 2000*SECS, RATE, {value: 1})
        .should.be.rejectedWith(EVMRevert);

      // reserve from renter2 has no effect
      (await calendar.renterOf(0, 1500*SECS)).should.equal(renter1);
    });
  });

  describe("cancellation", () => {
    before(async () => {
      
      contractFactory = await ethers.getContractFactory("Calendar");
      calendar = await contractFactory.deploy();

      await calendar.mint(URI);
      await calendar.mint(URI);

      await calendar.connect(renter1Sig).reserve(0, 1000*SECS, 2000*SECS, RATE, {value: 1});
      await calendar.connect(renter1Sig).reserve(0, 3000*SECS, 4000*SECS, RATE, {value: 1});
      await calendar.connect(renter1Sig).reserve(0, 4000*SECS, 5000*SECS, RATE, {value: 1});
      await calendar.connect(renter2Sig).reserve(0, 2000*SECS, 3000*SECS, RATE, {value: 1});
    });

    it("makes cancelled time period available again", async () => {
      await calendar.connect(renter1Sig).cancel(0, 0);

      (await calendar.isAvailable(0, 1000*SECS, 2000*SECS)).should.equal(true);

      (await calendar.renterOf(0, 1500*SECS)).should.equal(nullAddress);

      // can be reserved again
      await calendar.connect(renter1Sig).reserve(0, 1000*SECS, 2000*SECS, RATE, {value: 1});
    });

    it("reverts if requestor doesn't own the reservation", async () => {
      await calendar
        .connect(renter2Sig)
        .cancel(0, 1)
        .should.be.rejectedWith(EVMRevert);
    });

    it("reverts if the calendar id doesn't match", async () => {
      await calendar
        .connect(renter1Sig)
        .cancel(1, 0)
        .should.be.rejectedWith(EVMRevert);
    });

    it("reverts if the calendar id doesn't exist", async () => {
      await calendar
        .connect(renter1Sig)
        .cancel(2, 0)
        .should.be.rejectedWith(EVMRevert);
    });
  });

  describe("batch cancellation", () => {
    before(async () => {
      
      contractFactory = await ethers.getContractFactory("Calendar");
      calendar = await contractFactory.deploy();

      await calendar.mint(URI);

      await calendar.connect(renter1Sig).reserve(0, 1000*SECS, 2000*SECS, RATE, {value: 1});
      await calendar.connect(renter1Sig).reserve(0, 3000*SECS, 4000*SECS, RATE, {value: 1});
      await calendar.connect(renter1Sig).reserve(0, 4000*SECS, 5000*SECS, RATE, {value: 1});
      await calendar.connect(renter2Sig).reserve(0, 2000*SECS, 3000*SECS, RATE, {value: 1});

      await calendar.connect(renter1Sig).cancelAll(0, 1000*SECS, 4000*SECS);
    });

    it("makes cancelled time period available again", async () => {
      (await calendar.isAvailable(0, 1000*SECS, 2000*SECS)).should.equal(true);

      (await calendar.renterOf(0, 1500*SECS)).should.equal(nullAddress);
      (await calendar.renterOf(0, 3200*SECS)).should.equal(nullAddress);
    });

    it("skips reservations that requestor doesn't own", async () => {
      (await calendar.renterOf(0, 2600*SECS)).should.equal(renter2);
    });

    it("does not cancel reservations outside requested time range", async () => {
      (await calendar.renterOf(0, 4500*SECS)).should.equal(renter1);
    });
  });

  describe("getters", () => {
    before(async () => {
      
      contractFactory = await ethers.getContractFactory("Calendar");
      calendar = await contractFactory.deploy();

      await calendar.mint(URI);
      await calendar.mint(URI);

      await calendar.connect(renter1Sig).reserve(0, 1000*SECS, 2000*SECS, RATE, {value: 1});
      await calendar.connect(renter1Sig).reserve(0, 3000*SECS, 4000*SECS, RATE, {value: 1});
      await calendar.connect(renter1Sig).reserve(1, 4000*SECS, 5000*SECS, RATE, {value: 1});

      await calendar.connect(renter2Sig).reserve(0, 2000*SECS, 3000*SECS, RATE, {value: 1});
    });

    it("return number of reservations for a calendar", async () => {
      (await calendar.reservationBalanceOf(0)).should.be.equal(ethers.BigNumber.from(3));
      (await calendar.reservationBalanceOf(1)).should.be.equal(ethers.BigNumber.from(1));
    });

    it("return number of reservations for owner", async () => {
      (await calendar.reservationBalanceOfOwner(renter1)).should.be.equal(ethers.BigNumber.from(3));
      (await calendar.reservationBalanceOfOwner(renter2)).should.be.equal(ethers.BigNumber.from(1));
    });

    it("return reservation details for a calendar", async () => {
      const [
        reservationId,
        startTime,
        stopTime,
        renter,
      ] = await calendar.reservationOfCalendarByIndex(0, 1);

      reservationId.should.be.equal(ethers.BigNumber.from(3));
      startTime.should.be.equal(ethers.BigNumber.from(2000*SECS));
      stopTime.should.be.equal(ethers.BigNumber.from(3000*SECS));
      renter.should.equal(renter2);
    });

    it("reverts if the calendar request is out of bound", async () => {
      await calendar
        .reservationOfCalendarByIndex(0, 3)
        .should.be.rejectedWith(EVMRevert);
    });

    it("return reservation details for a renter", async () => {
      const [
        reservationId,
        startTime,
        stopTime,
        calendarId,
      ] = await calendar.reservationOfOwnerByIndex(renter1, 2);

      reservationId.should.be.equal(ethers.BigNumber.from(2));
      startTime.should.be.equal(ethers.BigNumber.from(4000*SECS));
      stopTime.should.be.equal(ethers.BigNumber.from(5000*SECS));
      calendarId.should.be.equal(ethers.BigNumber.from(1));
    });
  });
});