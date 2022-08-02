import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useContractLoader } from "eth-hooks";
import styled from "styled-components";

const CustomDIV = styled("div")`
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-item: left;
  margin: 10px;
  border: 1px #808080;
  border-top-style: solid;
`;

const TokenTitle = styled("span")`
  font-size: 20px;
  display: flex;
  justify-content: space-between;
  text-align: left;
  padding: 15px;
  margin-left: 25%;
  margin-right: 25%;
`;

const Text = styled("span")`
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  text-align: left;
  width: 350px;
  margin: 0 auto 0 auto;
  border: 1px #808080;
  border-top-style: solid;
`;

const Value = styled("span")`
  font-weight: bold;
`;

const CopyButton = styled("button")`
  background-color: #212121;
  cursor: pointer;
  padding: 0px;
  border: none;
  margin-left: 5px;
`;

const Title = styled("span")`
  font-size: 24px;
  font-weight: bold;
`;

const Token = props => {
  const { tokenAddress, userSigner, contractConfig, localChainId, address, poolAddress } = props;
  const [name, setName] = useState();
  const [symbol, setSymbol] = useState();
  const [yourBalance, setYourBalance] = useState(0);
  const [contractBalance, setContractBalance] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const [decimals, setDecimals] = useState(0);

  const token = useContractLoader(
    userSigner,
    {
      ...contractConfig,
      customAddresses: {
        WQ: tokenAddress,
      },
    },
    localChainId,
  )?.WQ;

  useEffect(() => {
    token?.name().then(name => {
      setName(name);
    });
    token?.symbol().then(symbol => {
      setSymbol(symbol);
    });
    token?.balanceOf(address).then(yourBalance => {
      setYourBalance(yourBalance);
    });
    token?.balanceOf(poolAddress).then(contractBalance => {
      setContractBalance(contractBalance);
    });
    token?.decimals().then(decimals => {
      setDecimals(decimals);
    });
    token?.totalSupply().then(totalSupply => {
      setTotalSupply(totalSupply);
    });
  }, [token, address, poolAddress]);
  // console.log("#######################################", contract.name);

  const copyAddress = () => {
    /* Copy the text inside the text field */
    navigator.clipboard.writeText(token?.address);
  };

  return (
    <CustomDIV>
      <TokenTitle>
        <Title>
          {name} ( {symbol} )
        </Title>
        <div>
          {" "}
          <span>{token?.address.substring(0, 10)}...</span>
          <CopyButton onClick={copyAddress}>📄</CopyButton>
        </div>
      </TokenTitle>
      <Text>
        <span>Your Balance: </span>
        <Value>{(yourBalance / 10 ** decimals)?.toString()}</Value>
      </Text>
      <Text>
        <span>Contract Balance: </span>
        <Value>{(contractBalance / 10 ** decimals)?.toString()}</Value>
      </Text>
      <Text>
        <span>Total Supply: </span>
        <Value>{(totalSupply / 10 ** decimals)?.toString()}</Value>
      </Text>
    </CustomDIV>
  );
};

export default Token;
