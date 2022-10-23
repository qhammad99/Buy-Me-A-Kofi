// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

// helper functions
// Returns the Ether balance of a given address.
async function getBalance(address) {
  const balanceBigInt = await hre.ethers.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

// Logs the Ether balances for a list of addresses.
async function printBalances(addresses) {
  let idx = 0;
  for (const address of addresses) {
    console.log(`Address ${idx} balance: `, await getBalance(address));
    idx ++;
  }
}

// Logs the memos stored on-chain from kofi purchases.
async function printMemos(memos) {
  for (const memo of memos) {
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const message = memo.message;
    console.log(`At ${timestamp}, ${tipper} (${tipperAddress}) said: "${message}"`);
  }
}

// main function
async function main() {
  // Get the example accounts we'll be working with.
  const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();

  // get the contracts to deploy & deploy.
  const BuyMeAKofi = await hre.ethers.getContractFactory("BuyMeAKofi");
  const buyMeAKofi = await BuyMeAKofi.deploy();
  await buyMeAKofi.deployed();
  console.log(`Buy Me A Kofi deployed to: ${buyMeAKofi.address}`)

  // check balances before the kofi purchase.
  const addresses = [owner.address, tipper.address, buyMeAKofi.address];
  console.log("== start ==");
  await printBalances(addresses);

  // buy the owner a few kofi's.
  const tip = {value: hre.ethers.utils.parseEther("1")};
  await buyMeAKofi.connect(tipper).buyKofi("Raja", "1 kaafi meri trf sy!", tip);
  await buyMeAKofi.connect(tipper2).buyKofi("Mesum", "meri trf sy b 1, yashi mar", tip);
  await buyMeAKofi.connect(tipper3).buyKofi("Ammad", "kia yaad kry ga, 1 meri trf sy b", tip);

  // check balances after the kofi purchase.
  console.log("== kofi bought ==");
  await printBalances(addresses);

  // withdraw funds
  await buyMeAKofi.connect(owner).withdrawTips();

  // Check balances after withdrawal.
  console.log("== withdrawTips ==");
  await printBalances(addresses);

  // read all the memos
  console.log("== memos ==");
  const memos = await buyMeAKofi.getMemos();
  printMemos(memos);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
