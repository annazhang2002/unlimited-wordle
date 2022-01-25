import React from "react";
import styled from "styled-components";

interface buttonOwnProps {
  children: React.ReactNode;
  disabled?: boolean;
  width?: number;
  onClick?: () => void;
}

export const Button = (props: buttonOwnProps): React.ReactElement => {
  const { children, disabled, width, onClick } = props;

  return (
    <ButtonMaster onClick={onClick} style={{ width }}>
      {children}
    </ButtonMaster>
  );
};

export default Button;

interface ButtonMasterProps {
  disabled?: boolean;
}

const ButtonMaster = styled.div<ButtonMasterProps>`
  color: white;
  background-color: #212121;
  padding: 8px 12px;
  outline: none;
  border: 1px solid gray;
  border-radius: 12px;
  font-size: 18px;
  margin: 6px 0px;

  min-width: 100px;
  cursor: pointer;
  display: inline-block;
  text-align: center;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  &:hover {
  }
`;
