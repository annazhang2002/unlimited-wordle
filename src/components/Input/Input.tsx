import React from "react";
import styled from "styled-components";
import { BG_COLOR } from "../style";

interface inputOwnProps {
  value: string;
  placeholder?: string;
  width?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input = (props: inputOwnProps): React.ReactElement => {
  const { value, onChange, placeholder, width } = props;

  return <InputMain value={value} onChange={onChange} placeholder={placeholder} style={{ width }} />;
};

export default Input;

const InputMain = styled.input`
  font-family: "Poppins", sans-serif;
  padding: 8px 12px;
  background-color: ${BG_COLOR};
  border: 1px solid white;
  font-size: 18px;
  color: white;
  box-sizing: border-box;
  border-radius: 12px;
`;
