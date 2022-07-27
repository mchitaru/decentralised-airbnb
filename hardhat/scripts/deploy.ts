const hre = require("hardhat");
const fs = require('fs');

async function main() {

  const Calendar = await hre.ethers.getContractFactory("Calendar");
  const calendar = await Calendar.deploy();
  await calendar.deployed();
  console.log("calendar deployed to:", calendar.address);

  const reservationAddress = await calendar.reservationContract();
  console.log("reservation deployed to:", reservationAddress);

  fs.writeFileSync('../src/artifacts/config.js', `export const calendarAddress = "${calendar.address}"`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });