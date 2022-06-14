import {ethers} from "ethers";
import Pool from "../../artifacts/contracts/SheeshaPool.sol/SheeshaPool.json";
import Erc20Token from "../abi/Erc20Token.json";
import {useState} from "react";

const contractAddress = "0xA4899D35897033b927acFCf422bc745916139776";
const tokenAddress = "0x367761085BF3C12e5DA2Df99AC6E1a824612b8fb";


function HomePage() {
    const [account, setAccount] = useState(null);
    const [contract, setContract] = useState();
    const [tokenContract, setTokenContract] = useState();
    const [tokenBalanceInPool,setTokenBalanceInPool] = useState('0');
    const [tokenBalanceInWallet,setTokenBalanceInWallet] = useState('0');
    const [investAmount,setInvestAmount] = useState('0');
    const [claimAmount,setClaimAmount] = useState('0');

    const connect = async (e) => {
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const poolContract = new ethers.Contract(contractAddress, Pool.abi, signer);
        setContract(poolContract);
        const myTokenContract = new ethers.Contract(
            tokenAddress,
            Erc20Token.abi,
            signer
        );
        setTokenContract(myTokenContract);
        const accounts = await provider.listAccounts();
        setAccount(accounts && accounts.length > 0 ? accounts[0] : null);
    }

    const fetchBalances = async () => {
        try {
            const balance = await contract.balance();
            setTokenBalanceInPool(ethers.utils.formatUnits(balance, 18));
            const mBalance = await tokenContract.balanceOf(account);
            setTokenBalanceInWallet(ethers.utils.formatUnits(mBalance, 18));
        } catch (error) {
            console.log(error)
        }
    }


    const getBalance = async (e) => {
       await fetchBalances();
    }

    const invest = async (e) => {
        try {
            console.log(investAmount);
            const value = ethers.utils.parseUnits(investAmount, 18);
            const approval = await tokenContract.approve(contractAddress, value, {
                from: account,
                gasLimit: 3500000,
            });
            await approval.wait();

            const tx = await contract.invest(value, {
                from: account,
                gasLimit: 3500000,
            });
            await tx.wait();
            setInvestAmount('0');
            await fetchBalances();

        } catch (error) {
            console.log(error);
        }
    };

    const claim = async (e) => {
        try {
            const value = ethers.utils.parseUnits(claimAmount, 18);

            const tx = await contract.claim(value, {
                from: account,
                gasLimit: 3500000,
            });
            await tx.wait();
            await fetchBalances();
            setClaimAmount('0');
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <div>
            <p>
                <button onClick={connect}>Connect</button>
            </p>

            <div>

                <p>
                    Token Balance in Pool Contract : {tokenBalanceInPool}
                </p>
                <p>
                    Token Balance in Wallet : {tokenBalanceInWallet}
                </p>

                <p>
                    <button onClick={getBalance}>Get Balance</button>
                </p>
                <p>
                    <input type="text" value={investAmount} onChange={(e) => {
                        setInvestAmount(e.target.value);
                    }} />
                    <button onClick={invest}>Invest</button>
                </p>

                <p>
                    <input type="text" value={claimAmount} onChange={(e) => {
                        setClaimAmount(e.target.value);
                    }} />
                    <button onClick={claim}>Claim</button>
                </p>
            </div>
        </div>
    );
}

export default HomePage;
