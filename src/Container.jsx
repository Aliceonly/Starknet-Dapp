
import App from './App';
import { StarknetConfig, InjectedConnector } from "@starknet-react/core";

const Container = ({ Component,pageProps }) => {
  const connectors = [
    new InjectedConnector({ options: { id: "braavos" } }),
    new InjectedConnector({ options: { id: "argentX" } }),
  ];
  return (
    <StarknetConfig connectors={connectors}>
      <App {...pageProps} />
    </StarknetConfig>
  );
};

export default Container;
