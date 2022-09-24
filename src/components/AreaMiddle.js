import React from "react";
import styled from "styled-components";

const AreaMiddle = (props) => {
  return (
    <Container>
      <div>Area Middle</div>
    </Container>
  );
};

const Container = styled.div`
  grid-area: area-middle;
`;

export default AreaMiddle;
