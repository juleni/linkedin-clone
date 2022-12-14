import React from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import AreaLeft from "./AreaLeft";
import AreaMiddle from "./AreaMiddle";
import AreaRight from "./AreaRight";

const Home = (props) => {
  const navigate = useNavigate();
  return (
    <Container>
      {!props.user && navigate("/")}
      <Section>
        <h5>
          <a>Hiring in a hurry?</a>
        </h5>
        <p>
          &nbsp;Find talented pros in record time with Upwork and keep business
          moving.
        </p>
      </Section>
      <Layout>
        <AreaLeft />
        <AreaMiddle />
        <AreaRight />
      </Layout>
    </Container>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
  };
};

/* ----------- STYLED COMPONENTS  ----------- */

const Container = styled.div`
  padding-top: 52px;
  max-width: 100%;
`;

const Section = styled.section`
  min-height: 50px;
  padding: 16px 0;
  box-sizing: content-box;
  text-align: center;
  text-decoration: underline;
  display: flex;
  justify-content: center;
  h5 {
    color: #0a66c2;
    font-size: 14px;
    a {
      font-weight: 700;
    }
  }

  p {
    font-size: 14px;
    color: #434649;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 0 5px;
  }
`;

const Layout = styled.div`
  display: grid;
  grid-template-areas: "area-left area-middle area-right";
  grid-template-columns: minmax(80px, 5fr) minmax(80px, 12fr) minmax(180px, 5fr);
  column-gap: 25px;
  row-gap: 25px;
  grid-template-rows: auto;
  margin: 25px 0;
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    padding: 0 5px;
  }
`;

export default connect(mapStateToProps)(Home);
