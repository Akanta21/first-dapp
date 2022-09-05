import { ethers } from "hardhat";

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
  const unlockTime = currentTimestampInSeconds + ONE_YEAR_IN_SECS;

  const lockedAmount = ethers.utils.parseEther("1");

  const MarketSentiment = await ethers.getContractFactory("MarketSentiment");
  const marketSentiment = await MarketSentiment.deploy(); // this will be used for constructor deployment

  await marketSentiment.deployed();

  console.log(`Lock with 1 ETH and unlock timestamp ${unlockTime} deployed to ${marketSentiment.address}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
    console.error(error);
    process.exitCode = 1;
    });
