import Web3Modal from "web3modal";
import {  ethers } from "ethers";
import Pool from "../../artifacts/contracts/SheeshaPool.sol/SheeshaPool.json";
import Erc20Token from "../abi/Erc20Token.json";
import WalletConnectProvider from "@walletconnect/web3-provider";
import {useState} from "react";

const contractAddress = "0xA4899D35897033b927acFCf422bc745916139776";
const tokenAddress = "0x367761085BF3C12e5DA2Df99AC6E1a824612b8fb";


function HomePage() {

  const [provider,setProvider] = useState();

  const connect = async (e) => {
    const web3Modal = new Web3Modal({
      cacheProvider: true,
      providerOptions:{
        walletconnect: {
          package: WalletConnectProvider, // required
          options: {
            infuraId: "INFURA_ID" // required
          }
        }
      }
    });
    const connection = await web3Modal.connect();
    const myProvider = new ethers.providers.Web3Provider(connection);
    setProvider(myProvider)
  }

  const getBalance = async (e) => {
    try {

      console.log(provider);
      const accounts = await provider.listAccounts();
      const signer =  provider.getSigner();

      const contract = new ethers.Contract(contractAddress, Pool.abi, signer);
      const balance = await contract.balance();
      console.log(ethers.utils.formatUnits(balance.toString(), 18));

      const tokenContract = new ethers.Contract(
          tokenAddress,
          Erc20Token.abi,
          signer
      );
      const mBalance = await tokenContract.balanceOf(accounts[0]);
      console.log(mBalance.toString());
    }catch(error){
      console.log(error)
    }
  }

  const invest = async (e) => {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const accounts = await provider.listAccounts();
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, Pool.abi, signer);

      const value = ethers.utils.parseUnits("5", 18);
      console.log(value.toString());

      const tokenContract = new ethers.Contract(
        tokenAddress,
        Erc20Token.abi,
        signer
      );

      const approval = await tokenContract.approve(contractAddress, value, {
        from: accounts[0],
        gasLimit: 3500000,
      });
      await approval.wait();

      const tx = await contract.invest(value, {
        from: accounts[0],
        gasLimit: 3500000,
      });
      console.log(tx);
    } catch (error) {
      console.log(error);
    }
  };

  const claim = async (e) => {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const accounts = await provider.listAccounts();
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, Pool.abi, signer);
      const value = ethers.utils.parseUnits("2", 18);

      const tx = await contract.claim(value, {
        from: accounts[0],
        gasLimit: 3500000,
      });
      console.log(tx);
      await tx.wait();
    } catch (error) {
      console.log(error);
    }
  };



  return (
    <div>
      <p>
        <button onClick={connect}>Connect</button>
      </p>
      <p>
        <button onClick={getBalance}>Get Balance</button>
      </p>
      <p>
        <button onClick={invest}>Invest</button>
      </p>

      <p>
        <button onClick={claim}>Claim</button>
      </p>

    </div>
  );
}

export default HomePage;
