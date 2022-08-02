import React, { useState, useEffect } from "react";
import ContractTitle from "./ContractTitle";
import styled from "styled-components";
import Pair from "./Pair";

const PairsContainer = styled("div")`
  font-size: 18px;
  display: grid;
  padding-bottom: 200px;
`;

const Title = styled("span")`
  font-size: 24px;
  text-align: center;
  margin-left: 30%;
  margin-right: 30%;
  padding: 15px;
`;

const DIVforTopLine = styled("div")`
  border-top: 2px solid white;
  padding-top: 5px;
  margin-top: 15px;
`;

const Factory = props => {
  const { contract, userSigner, contractConfig, localChainId, address, factory, contractRegistry } = props;
  const [pairs, setPairs] = useState();

  // console.log("#################################### FACTORY", contract);

  useEffect(() => {}, [pairs]);

  async function getPairs() {
    if (contract) {
      const arrayOfPairs = [];
      const numberOfPairs = await contract.allPairsLength();
      for (let i = 0; i < numberOfPairs; i++) {
        let pair = await contract.allPairs(i);
        arrayOfPairs.push(pair);
      }
      setPairs(arrayOfPairs);
    }
  }
  getPairs();

  const array = [];

  pairs?.forEach(pair => {
    array.push(
      <DIVforTopLine>
        <Title>{pair}</Title>
        <Pair
          userSigner={userSigner}
          contractConfig={contractConfig}
          localChainId={localChainId}
          address={address}
          factory={factory}
          contractRegistry={contractRegistry}
          poolAddress={pair}
        />
      </DIVforTopLine>,
    );
  });

  return (
    <>
      <ContractTitle title="Factory" />
      <PairsContainer>{array}</PairsContainer>
    </>
  );
};

export default Factory;
