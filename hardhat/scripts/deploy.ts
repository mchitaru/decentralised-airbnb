const hre = require("hardhat");
const fs = require('fs');

async function main() {
  // const Reservation = await hre.ethers.getContractFactory("Reservation");
  // const reservation = await Reservation.deploy();
  // await reservation.deployed();
  // console.log("reservation deployed to:", reservation.address);

  const Calendar = await hre.ethers.getContractFactory("Calendar");
  const calendar = await Calendar.deploy();
  await calendar.deployed();
  console.log("calendar deployed to:", calendar.address);

  fs.writeFileSync('../src/artifacts/config.js', `export const marketplaceAddress = "${calendar.address}"`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });