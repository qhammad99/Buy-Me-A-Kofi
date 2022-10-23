const hre = require("hardhat");

async function main() {
  const BuyMeAKofi = await hre.ethers.getContractFactory("BuyMeAKofi");
  const buyMeAKofi = await BuyMeAKofi.deploy();
  await buyMeAKofi.deployed();
  console.log(`Buy Me A Kofi deployed to: ${buyMeAKofi.address}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
