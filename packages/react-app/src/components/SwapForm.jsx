import React, { useState } from "react";
import { useContractLoader } from "eth-hooks";
import styled from "styled-components";

const InputContainer = styled("div")`
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-content: center;
  text-align: center;
  width: 400px;
  border: 1px solid;
`;

const SendButton = styled("Button")`
  font-size: 14px;
  width: 80px;
  height: 30px;
  color: white;
  border-color: white;
  background-color: #212121;
  cursor: pointer;
`;

const InputText = styled("label")`
  display: flex;
  justify-content: space-between;
  text-align: left;
`;

const Input = styled("input")`
  margin: 5px;
  color: white;
  background-color: #212121;
  border: 1px solid white;
  text-align: left;
`;

const Param = styled("span")`
  text-align: left;
  padding: 5px;
`;

const DivForCenter = styled("div")`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`;

const MultiplyButton = styled("button")`
  background-color: #212121;
  cursor: pointer;
  padding: 0px;
  border: none;
  margin-left: 5px;
`;

const SwapForm = props => {
  const { contract, userSigner, contractConfig, localChainId, address, factory } = props;
  const [tokenA, setTokenA] = useState();
  const [tokenB, setTokenB] = useState();
  const [amountIn, setAmountIn] = useState();
  const [amountOutMin, setAmountOutMin] = useState();
  const deadline = 99999999999999;
  const [poolAddress, setPoolAddress] = useState();

  const handleSubmit = event => {
    event.preventDefault();
  };

  const tokenAcontract = useContractLoader(
    userSigner,
    {
      ...contractConfig,
      customAddresses: {
        WQ: tokenA,
      },
    },
    localChainId,
  )?.WQ;

  const getPoolAddress = async () => {
    setPoolAddress(await factory.getPair(tokenA, tokenB));
  };
  getPoolAddress();

  const addZeros = letter => {
    if (letter === "A") {
      setAmountIn(amountIn * 10 ** 18);
    } else if (letter === "B") {
      setAmountOutMin(amountOutMin * 10 ** 18);
    }
  };

  // console.log("############################# TOKEN A CONTRACT", contractTokenA);

  const swap = async () => {
    const path = [tokenA, tokenB];
    await tokenAcontract.approve(poolAddress, amountIn);
    await contract.swapExactTokensForTokens(amountIn, amountOutMin, path, address, deadline);
    alert("Function swap deployed!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <DivForCenter>
        <InputContainer>
          <InputText>
            <Param>tokenA :</Param>
            <Input type="text" value={tokenA} onChange={e => setTokenA(e.target.value)} />
          </InputText>
          <InputText>
            <Param>tokenB :</Param>
            <Input type="text" value={tokenB} onChange={e => setTokenB(e.target.value)} />
          </InputText>
          <InputText>
            <Param>Amount A in :</Param>
            <div>
              {" "}
              <Input type="number" value={amountIn} onChange={e => setAmountIn(e.target.value)} />
              <MultiplyButton onClick={() => addZeros("A")}>🚀</MultiplyButton>
            </div>
          </InputText>
          <InputText>
            <Param>Amount B out min :</Param>
            <div>
              {" "}
              <Input type="number" value={amountOutMin} onChange={e => setAmountOutMin(e.target.value)} />
              <MultiplyButton onClick={() => addZeros("B")}>🚀</MultiplyButton>
            </div>
          </InputText>
          <SendButton onClick={swap}> SEND💸</SendButton>
        </InputContainer>
      </DivForCenter>
    </form>
  );
};

export default SwapForm;
