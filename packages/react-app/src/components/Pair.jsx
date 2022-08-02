import React, { useEffect, useState } from "react";
import Token from "./Token";
import { useContractLoader } from "eth-hooks";
import styled from "styled-components";

const LineContainer = styled("div")`
  font-size: 20px;
  display: flex;
  justify-content: space-between;
  text-align: left;
  margin-left: 30%;
  margin-right: 30%;
  padding: 15px;
  border: 1px #808080;
  border-top-style: solid;
`;

const ToggleFlatFeeButton = styled("Button")`
  font-size: 14px;
  width: 150px;
  height: 40px;
  color: white;
  border-color: white;
  background-color: #212121;
  cursor: pointer;
`;

const Text = styled("div")`
  font-size: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
`;

const Title = styled("div")`
  font-size: 24px;
  text-align: center;
  padding: 15px;
  border-top: 2px solid white;
  margin-top: 20px;
`;

const Pair = props => {
  const { userSigner, contractConfig, localChainId, address, factory, contractRegistry, poolAddress } = props;
  const [token1_address, setToken1_address] = useState();
  const [token2_address, setToken2_address] = useState();
  const [flatFee, setFlatFee] = useState();

  const pool = useContractLoader(
    userSigner,
    {
      ...contractConfig,
      customAddresses: {
        Pair: poolAddress,
      },
    },
    localChainId,
  )?.Pair;

  // console.log("####################################### POOL CONTRACT", pool);
  // console.log("####################################### Token0", token1_address);

  const toggleFlatFeeCaller = async () => {
    try {
      const oldAddress = await contractRegistry.getAddress("governance.experts.DEX.parametersVoting");
      await contractRegistry.setAddress("governance.experts.DEX.parametersVoting", address);
      await factory.toggleFlatFee(poolAddress);
      await contractRegistry.setAddress("governance.experts.DEX.parametersVoting", oldAddress);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    Promise.all([factory.checkForFlatFee(poolAddress), pool?.token0(), pool?.token1()]).then(props => {
      const [flatFee, token1_address, token2_address] = props;
      setFlatFee(flatFee);
      setToken1_address(token1_address);
      setToken2_address(token2_address);
    });
  }, [factory, pool, poolAddress]);

  return (
    <>
      {" "}
      <Title>{poolAddress}</Title>
      <Token
        tokenAddress={token1_address}
        userSigner={userSigner}
        contractConfig={contractConfig}
        localChainId={localChainId}
        address={address}
        poolAddress={poolAddress}
      />
      <Token
        tokenAddress={token2_address}
        userSigner={userSigner}
        contractConfig={contractConfig}
        localChainId={localChainId}
        address={address}
        poolAddress={poolAddress}
      />
      <Token
        tokenAddress={poolAddress}
        userSigner={userSigner}
        contractConfig={contractConfig}
        localChainId={localChainId}
        address={address}
        poolAddress={poolAddress}
      />
      <LineContainer>
        <Text>Flat Fee: {flatFee ? "✔️" : "❌"} </Text>
        <Text>
          <ToggleFlatFeeButton onClick={toggleFlatFeeCaller}>TOGGLE FLAT FEE</ToggleFlatFeeButton>
        </Text>
      </LineContainer>
    </>
  );
};

export default Pair;
