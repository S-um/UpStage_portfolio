import { React, useContext, useEffect, useRef, useState } from "react";
import DynamicNavbar from "./navbar";
import { Button, Container, Row, Col, Accordion, AccordionContext, useAccordionButton } from "react-bootstrap";
import styled from './portfolio.module.css';



function App() {
  const sections = {
    "#home": useRef(null),
    /*
    "#jupyternotebook": useRef(null),
    "#architecture": useRef(null),
    "#more_skills": useRef(null),
    */
  }
  const skillsInPortfolio = [
    {
      "title": "Kubernetes",
      "body": "쿠버네티스"
    },
    {
      "title": "Golang",
      "body": "고랭",
    },
    {
      "title": "Ory",
      "body": "고랭",
    },
    {
      "title": "React",
      "body": "고랭",
    },
  ];
  const navbar = useRef(null);
  const [navbarHeight, setNavbarHeight] = useState(0);
  useEffect(() => {
    setNavbarHeight(navbar.current.clientHeight);
  }, []);
  return (
    <div>
      <DynamicNavbar navbarRef={navbar} sections={sections}></DynamicNavbar>
      <Container style={{ "height": 150 }}></Container>
      <Container>
        <Row ref={sections["#home"]}>
          <h3 style={{ "letterSpacing": "5px" }} className={styled.title}>MyeongSuk's Portfolio</h3>
        </Row>
        <Row>
          <hr className={styled.divider}></hr>
        </Row>
        <Row>
          <Button className={styled.btn}>Look for MyeongSuk</Button>
        </Row>
        <Row style={{ "height": "15vh" }}></Row>
        <Row>
          <Col>
            <h5 className={styled.subtitle}>About Portfolio</h5>
            <p className={styled.innerText}>해당 포트폴리오는 React 로 구성된 프론트엔드, Golang 으로 개발된 백엔드, Jupyter Notebook Container 를 관리하는 Kubernetes 등의윤명석이 지닌 다양한 기술들이 집약적으로 반영된 포트폴리오입니다.</p>
            <p className={styled.innerText}>홀로 구상, 디자인부터 개발, 배포까지 총 2일에 걸쳐 만든 업스테이지만을 위한 포트폴리오입니다.</p>
          </Col>
          <Col>
            <h5 className={styled.subtitle}>Skills in Portfolio</h5>
            <Accordion flush bsPrefix={styled.accordianElem}>
              <hr></hr>
              {skillsInPortfolio.map((elem, index) => <Accordion.Item eventKey={index}>
                <Accordion.Header bsPrefix={styled.skillTitle}><span style={{ "textAlign": "right" }}>{elem.title}</span></Accordion.Header>
                <Accordion.Body className={[styled.innerText, styled.skillBody]}>{elem.body}</Accordion.Body>
                <hr></hr>
              </Accordion.Item>)}
            </Accordion>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
