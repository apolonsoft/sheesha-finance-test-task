import {ethers} from "ethers";
import Pool from "../../artifacts/contracts/SheeshaPool.sol/SheeshaPool.json";
import Erc20Token from "../abi/Erc20Token.json";
import {useState} from "react";

const contractAddress = "0x0Ac583087f1160f21a110e71aC0834726f7812Da"; // Sheeesha Pool Contract Address
const tokenAddress = "0xFab46E002BbF0b4509813474841E0716E6730136"; // Sheeesha Token Contract Address


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
                <button onClick={connect} style={{ padding: "8px 12px", background: "transparent", border: "1px solid red", borderRadius: 8}}>Connect</button>
            </p>
            {account &&
            <div>

                <p>
                    Token Balance in Pool Contract : {tokenBalanceInPool}
                </p>
                <p>
                    Token Balance in Wallet : {tokenBalanceInWallet}
                </p>

                <p>
                    <button onClick={getBalance} style={{ background: "#f70000", border: "none", borderRadius: 8, padding: "8px 10px", boxShadow: "0px 0px 10px 0px #f700007a", color: "white"}}>Get Balance</button>
                </p>
                <p>
                    <input type="text" value={investAmount} style={{border: "none", borderRadius: 8, boxShadow: "0 0 10px 0 #cccccc8f", padding: "8px 12px"}} onChange={(e) => {
                        setInvestAmount(e.target.value);
                    }} />
                    <button onClick={invest} style={{ background: "#f70000", border: "none", borderRadius: 8, padding: "8px 12px", boxShadow: "0px 0px 10px 0px #f700007a", color: "white"}}>Invest</button>
                </p>

                <p>
                    <input type="text" value={claimAmount} style={{border: "none", borderRadius: 8, boxShadow: "0 0 10px 0 #cccccc8f", padding: "8px 12px"}} onChange={(e) => {
                        setClaimAmount(e.target.value);
                    }} />
                    <button onClick={claim} style={{ background: "#f70000", border: "none", borderRadius: 8, padding: "8px 10px", boxShadow: "0px 0px 10px 0px #f700007a", color: "white"}}>Claim</button>
                </p>
            </div>}
        </div>
    );
}

export default HomePage;
