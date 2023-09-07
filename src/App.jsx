import { useEffect, useState } from "react";
import {
  useConnectors,
  useAccount,
  useNetwork,
} from "@starknet-react/core";
import "./App.css";

const NFT_ADDRESS =
  "0x06fba4abcca41b2ae445f6c97d1da9e71567a560be908bc2df7606635c9057f8";

function App() {
  const { connect,connectors, disconnect, available, refresh } =
    useConnectors();

  const [minted, setMinted] = useState(false);

  const { chain } = useNetwork()

  const { account, address, status } = useAccount();

  useEffect(() => {
    // refresh all available connectors every 5 seconds
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, [refresh]);

  const renderConnectContainer = () => (
    <div>
      <ul>
        {available.map((connector) => (
          <div key={connector.id()}>
            <button key={connector.id()} onClick={() => connect(connector)}>
              Connect {connector.id()}
            </button>
          </div>
        ))}
      </ul>
    </div>
  );

  const renderMint = () => {
    console.log(chain)
    if (chain.name !== "StarkNet Görli")
      return (
        <div className="connect-wallet-container">
          <p>Please Switch to Starknet Goerli Testnet</p>
        </div>
      );
    return (
      <div className="form-container">
        <button className="cta-button mint-button" onClick={claimNFT}>
          Mint
        </button>
      </div>
    );
  };

  const claimNFT = async () => {
    try {
      const tx = await account.execute({
        contractAddress: NFT_ADDRESS,
        entrypoint: "mint",
        calldata: [],
      });
      const status = await account.waitForTransaction(tx.transaction_hash);

      if (status === "PENDING") setMinted(true);
    } catch (error) {
      console.log(error);
    }
  };

  const mintedTip = () => (
    <p>Minted Successfuly!</p>
  )

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <header>
            <div className="left">
              <p className="title">✨ Dapp Sample</p>
              <br></br>
              <p className="subtitle">
                This is a sample DAPP which alows you to mint an NFT on
                Starknet!
              </p>
            </div>
            <div className="right">
              {status == "connected" ? (
                <button onClick={disconnect} className="ru-button">
                  Wallet:{address.slice(0, 6)}...{address.slice(-4)}
                </button>
              ) : (
                <p> Not Connected </p>
              )}
            </div>
          </header>
        </div>

        {!(status == 'connected') && renderConnectContainer()}
        {(status == 'connected') && renderMint()}

        {minted && mintedTip}
      </div>
    </div>
  );
}

export default App;
