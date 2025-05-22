import { getWalletClient, getPublicClient } from "wagmi/actions";
import { abi, bytecode } from "../utils/contract"; // Adjust path if needed
import { parseAbi, parseEther } from "viem";

export async function deployRichestComparison({ alice, bob, eve }) {
  if (!alice || !bob || !eve) throw new Error("All three addresses (alice, bob, eve) are required");

  const walletClient = await getWalletClient();
  const publicClient = await getPublicClient();
  const [account] = walletClient.account ? [walletClient.account.address] : walletClient.addresses;

  const { contractAddress } = await walletClient.deployContract({
    abi,
    bytecode,
    args: [alice, bob, eve],
    account,
    chain: walletClient.chain,
  });

  await publicClient.waitForTransactionReceipt({ hash: contractAddress });

  return contractAddress;
}
