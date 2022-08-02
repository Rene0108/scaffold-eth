import React from "react";
import styled from "styled-components";

const Title = styled("div")`
  font-size: 36px;
  padding: 30px;
`;

const ContractTitle = props => {
  const { title } = props;
  return <Title>{title}</Title>;
};

export default ContractTitle;
