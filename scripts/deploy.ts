// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  const [deployer, addr1, addr2, addr3, addr4, addr5] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const SheeshaToken = await ethers.getContractFactory("SheeshaToken");
  const sheeshaToken = await SheeshaToken.deploy();

  await sheeshaToken.deployed();

  console.log("Sheeesha Token address:", sheeshaToken.address);

  console.log("Sheeesha Token balance deployer:", (await sheeshaToken.balanceOf(deployer.address)).toString());

  const transferAmount = ethers.utils.parseUnits('100',18);
  await sheeshaToken.transfer(addr1.address,transferAmount);
  console.log(`${addr1.address} Sheeesha Token Balance `, (await sheeshaToken.balanceOf(addr1.address)).toString());

  await sheeshaToken.transfer(addr2.address,transferAmount);
  console.log(`${addr2.address} Sheeesha Token Balance `, (await sheeshaToken.balanceOf(addr2.address)).toString());

  await sheeshaToken.transfer(addr3.address,transferAmount);
  console.log(`${addr3.address} Sheeesha Token Balance `, (await sheeshaToken.balanceOf(addr3.address)).toString());

  await sheeshaToken.transfer(addr4.address,transferAmount);
  console.log(`${addr4.address} Sheeesha Token Balance `, (await sheeshaToken.balanceOf(addr4.address)).toString());

  await sheeshaToken.transfer(addr5.address,transferAmount);
  console.log(`${addr5.address} Sheeesha Token Balance `, (await sheeshaToken.balanceOf(addr5.address)).toString());


  const SheeshaPool = await ethers.getContractFactory("SheeshaPool");
  const sheeshaPool = await SheeshaPool.deploy(sheeshaToken.address);

  await sheeshaPool.deployed();
  console.log("Sheeesha Pool Deployed at: ", sheeshaPool.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
