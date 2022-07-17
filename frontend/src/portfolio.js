import { React, useRef } from "react";
import DynamicNavbar from "./navbar";
import { Button, Container, Row, Col, Accordion } from "react-bootstrap";
import styled from './portfolio.module.css';
import Section from "./section"
import Flow from "./architecture"
import { BsInfoCircle } from "react-icons/bs";
import JupyterContent from "./jupyterContent";
import FeatureCardGroup from "./featureCardGroups";


const skillsInPortfolio = [
  {
    "title": "Kubernetes",
    "body": "여러 오픈 소스(ex. Istio, CertManager 등) 을 기반으로 서버와 여러 설정들(ex. Routing, SSL 인증서 등) 관리를 편리하게 해주는 역할을 하였습니다."
  },
  {
    "title": "Golang",
    "body": "User로 부터 Web UI를 통하여 오는 요청(ex. Jupyter 생성, 삭제, 상태 가져오기 등) 을 Kubernetes Go Client 패키지를 사용하여 처리하는 역할을 하였습니다.",
  },
  {
    "title": "Ory",
    "body": "인증 / 인가에 필요한 여러 기능(ex. 로그인, 로그아웃, 회원가입, 인증, 인가 등) 을 제공하는 역할을 하였습니다.",
  },
  {
    "title": "React",
    "body": "User가 백엔드(Golang)의 여러 기능들을 사용자 친화적이게 더욱 쉽고 간편하게 사용할 수 있도록 Web UI를 구성하는 역할을 하였습니다.",
  },
];
const Cka = () => <a style={{ "color": "#D1B2FF" }} href="https://artistic-toad-312.notion.site/CKA-131c8555aa124c3fb0eeacd3790e956a" target="_blank">CKA</a>;
const featureItems = [{
  title: "학습과 성장",
  moreInfo: {
    title: "학습과 성장",
    body: <span>학습과 성장을 즐기고 행복해합니다. 학습을 즐기기 때문에 빠르게 성장하고 그 성장을 통해서 뿌듯함과 행복을 찾으며 이는 더 많은 학습을 할 원동력이 됩니다. 이러한 선순환이 반복됨으로써 빠르게 변화하고 발전해 나아가는 기술 속에서 끊임없이 성장하며 살아남을 수 있습니다.</span>,
  },
}, {
  title: "소통과 공유",
  moreInfo: {
    title: "소통과 공유",
    body: <span>생각하는 것과 말하는 것, 듣는 것을 좋아합니다. 끊임없이 생각하며 그 생각들을 공유하고 그에 대한 사람들의 답변을 통해 생각의 폭과 깊이를 확장시키는 것을 좋아합니다. 이러한 과정의 반복은 최고의 결과를 위한 최선의 방법에 한 걸음 더 다가갈 수 있게 해주는 원동력이 됩니다.</span>,
  }
}, {
  title: "열정과 자신감",
  moreInfo: {
    title: "열정과 자신감",
    body: <span>뜨거운 열정과 지치지 않는 체력이 만나 지속적인 노력이 되고 이러한 노력들이 쌓여 자신감이 되었습니다. 모든 것을 안다는 자신감이 아닌 지금 당장은 몰라도 노력을 통하여 결과적으로 나는 이해할 수 있고 해낼 수 있다는 자신감은 다시 뜨거운 열정의 연료가 되어 끊임없이 성장해 나아갈 수 있습니다.</span>,
  }
},]
const skillItems = [{
  title: "Kubernetes",
  body: <div>
    <p>다양한 기술 중 가장 관심있는 기술로 Kubernetes 국제 자격증인 <Cka />도 취득하였습니다.</p>
    <p>수준 : 상</p>
  </div>,
  moreInfo: {
    title: "Kubernetes",
    body: <div>
      <p>현재 재직 중인 회사 온프래미스 GPU Kubernetes(with. Containerd Nvidia Runtime) 클러스터 운영 중에 있으며 AWS EKS with GPU Auto Scaling Instance 환경에서 최대 80대의 GPU instance 클러스터 운영 경험이 있습니다.</p>
      <p>업무 외적으로 Kubernetes 자체에도 관심이 많아 <Cka /> 도 별도로 취득하였습니다.</p>
    </div>,
  }
}, {
  title: "오픈 소스",
  body: <div>
    <p>다양한 오픈 소스들을 설치 혹은 사용하여 시스템을 구축해본 경험이 있습니다.</p>
    <p>수준 : 상</p>
    <p>{"( 필요한 오픈 소스를 찾고 문서를 읽고 적용하는 능력을 수준으로 판단하였습니다 )"}</p>
  </div>,
  moreInfo: {
    title: "오픈 소스",
    body: <div>
      <p>다양한 오픈 소스들을 설치 혹은 사용하여 시스템을 구축해본 경험이 있습니다.</p>
      <hr />
      <p>사용해본 오픈소스<br />Kubernetes, Nvidia Container Runtime, Containerd, Istio, CertManager, MetalLB, Prometheus, Thanos, VictoriaMetrics, Grafana, Ory 등</p>
    </div>,
  }
}, {
  title: "Golang",
  body: <div>
    <p>언어 중 제일 자신있는 언어로 Kubernetes Go Client 등 다양한 패키지들을 사용해 Kubernetes Operator 등의 개발 경험이 있습니다.</p>
    <p>수준 : 중상</p>
  </div>,
  moreInfo: {
    title: "Golang",
    body: <div>
      <p>Golang과 함께 Kubernetes Go Client, MongoDB Go Client, Prometheus Go Client 등 다른 다양한 컴포넌트들과 통신하는 Client 패키지들을 사용하여 다양한 컴포넌트들을 개발해보았습니다.</p>
    </div>,
  }
}, {
  title: "React",
  body: <div>
    <p>React Bootstrap, React Flow 등의 React Component 들을 이용하여 원하는 프론트 엔드 디자인과 기능을 구현할 수 있습니다.</p>
    <p>수준 : 중</p>
  </div>,
}, {
  title: "C",
  body: <div>
    <p>언어 자체 중에서는 제일 좋아하는 언어로 Signal을 이용한 프로세스 간 통신 구현, miniLibx를 통한 그래픽 구현, 자료 구조 구현 등 다양한 구현을 경험해보았습니다.</p>
    <p>수준 : 중상</p>
  </div>,
}, {
  title: "Marchine Learning",
  body: <div>
    <p>최근에 관심을 가지게 되어 공부를 시작하여 간단한 예제를 따라해보며 이론 공부 중에 있습니다.</p>
    <p>수준 : 하</p>
  </div>,
}]

function Review({ feature, requested, more }) {
  return <div>
    <p>
      <h5 style={{ "color": "#d4c3f7" }}>기능</h5>
      <hr></hr>
      <span>- {feature}</span>
    </p>
    <p>
      <h5 style={{ "color": "#d4c3f7" }}>더 필요한 것 (이 것이 있었다면 구현했을텐데)</h5>
      <hr></hr>
      <span>- {requested}</span>
    </p>
    <p>
      <h5 style={{ "color": "#d4c3f7" }}>아쉬웠던 내용</h5>
      <hr></hr>
      {
        more.map((elem, _idx) => <span key={_idx}>- {elem}<br /></span>)
      }
    </p>
  </div>
}
// TODO 내용 채우기
const portfolioReview = [{
  title: "More Freedom",
  body: <span>사용자 정의대로 컨테이너, 데이터셋을 생성, 삭제하며 관리할 수 있는 기능</span>,
  moreInfo: {
    title: "자유도",
    body: <Review
      feature="데이터셋을 사용자 정의(ex. 용량 등)에 따라 생성하고 관리하며 해당 데이터셋을 사용자 정의(ex. 자원 할당, image 등)에 따라 생성된 컨테이너 내부에 자유롭게 마운트할 수 있는 기능"
      requested="구현 시간, 컴퓨터 자원"
      more={
        [
          "컨테이너 부분 : 컴퓨터 자원의 제한으로 인하여 하나의 컨테이너 밖에 제공할 수 없었던 부분이 아쉽습니다.",
          "데이터셋 부분 : 완전한 시스템 구축보다는 현재의 실력과 가능성, 그리고 열정을 표현하는 것이 우선 시 되어 해당 부분은 workspace 내로 제한하였습니다."
        ]}></Review>,
  },
}, {
  title: "Pipeline",
  body: <span>Airflow 등과 같은 데이터 엔지니어링 파이프라인을 컨테이너와 엮어 관리할 수 있는 기능</span>,
  moreInfo: {
    title: "Pipeline",
    body: <Review
      feature="Airflow 등과 같은 데이터 엔지니어링 파이프라인을 컨테이너와 엮어 관리할 수 있는 기능"
      requested="구현 시간, 자료 탐색 시간"
      more={
        ["Airflow 의 파이프라인 설정 파일을 위 Architecture 에서 사용했던 기술과 엮어서 Web UI 를 통해 관리할 수 있는 기능을 제공해보고싶습니다."]
      }></Review>
  }
}]

function App() {
  const sections = {
    "#home": useRef(null),
    "#jupyternotebook": useRef(null),
    "#architecture": useRef(null),
    "#more": useRef(null),
    "#skills": useRef(null),
    "#feature": useRef(null),
    "#review": useRef(null),
  }
  const navbar = useRef(null);
  return (
    <div>
      <DynamicNavbar navbarRef={navbar} sections={sections}></DynamicNavbar>
      <Container style={{ "height": 100 }}></Container>
      <Container>
        <Section title="MyeongSuk's Portfolio" sections={sections} hash="#home">
          <Row>
            <Button className={styled.btn} onClick={() => { window.location.href = "#more"; window.location.reload() }}>Look for MyeongSuk</Button>
          </Row>
          <Row style={{ "height": "15vh" }}></Row>
          <Row>
            <Col>
              <h5 className={styled.subtitle}>About Portfolio</h5>
              <p className={styled.innerText}>해당 포트폴리오는 React 로 구성된 프론트엔드, Golang 으로 개발된 백엔드, Jupyter Notebook Container 를 관리하는 Kubernetes 등의 윤명석이 지닌 다양한 기술들이 집약적으로 반영된 포트폴리오입니다.</p>
              <p className={styled.innerText}>홀로 구상, 디자인부터 개발, 배포까지 총 30 시간에 걸쳐 만든 업스테이지만을 위한 포트폴리오입니다.</p>
              <p className={styled.innerText}>디자인은 <a style={{ "color": "#D1B2FF" }} href="https://www.upstage.ai/careers">upstage.ai/careers</a> 를 참고하였습니다.</p>
            </Col>
            <Col>
              <h5 className={styled.subtitle}>Skills in Portfolio</h5>
              <Accordion flush bsPrefix={styled.accordianElem}>
                <hr></hr>
                {skillsInPortfolio.map((elem, index) => <Accordion.Item key={index} eventKey={index}>
                  <Accordion.Header bsPrefix={styled.skillTitle}> + {elem.title}</Accordion.Header>
                  <Accordion.Body className={[styled.innerText, styled.skillBody]}>{elem.body}</Accordion.Body>
                  <hr></hr>
                </Accordion.Item>)}
              </Accordion>
            </Col>
          </Row>
        </Section>
        <Section title="Jupyter Notebook" sections={sections} hash="#jupyternotebook" description="Web UI 를 통하여 쿠버네티스에서 동작하는 컨테이너 관리 / 접속">
          <Row>
            <JupyterContent name="upstage-notebook" notebook_id="upstage-notebook"></JupyterContent>
          </Row>
        </Section>
        <Section title="Architecture" sections={sections} hash="#architecture" description="포트폴리오 구성 아키텍쳐">
          <Row>
            <div style={{ "width": "80vw", "height": "50vh" }}>
              <Flow></Flow>
            </div>
          </Row>
          <Row style={{ "height": "5vh" }}></Row>
          <Row>
            <span><BsInfoCircle /><br /></span>
            <span>{"User <-> Ory"}<br /></span>
            <p style={{ "fontSize": 12 }}>
              <span>User의 요청 내용에 따라 인증 / 인가 단계를 거치며 인가가 성공했다면 다른 컴포넌트(ex. JupyterController, JupyterNotebook 등)로 라우팅</span>
            </p>
            <span>{"User <-> Jupyer Controller"}<br /></span>
            <p style={{ "fontSize": 12 }}>
              <span>User 가 직접적으로 Jupyter Notebook 의 생성, 삭제 등의 요청과 상태 확인 요청이 이루어지는 곳</span>
            </p>
            <span>{"User <-> Jupyer Notebook"}<br /></span>
            <p style={{ "fontSize": 12 }}>
              <span>생성된 Jupyter Notebook 을 User가 직접 접속하여 사용</span>
            </p>
            <span>{"Jupyter Controller <-> Kubernetes API Server"}<br /></span>
            <p style={{ "fontSize": 12 }}>
              <span>User의 요청에 따라 쿠버네티스 상의 여러 리소스들을 생성, 삭제, 상태 확인 요청이 이루어지는 곳</span>
            </p>
            <span>{"Kubernetes API Server <-> Jupyter Notebook"}<br /></span>
            <p style={{ "fontSize": 12 }}>
              <span>Jupyter Controller에 요청에 따라 Jupyter Notebook을 생성 및 삭제 처리가 이루어지는 곳</span>
            </p>
          </Row>
        </Section>
        <Section title="More" sections={sections} hash="#more" description="윤명석에 대하여">
        </Section>
        <Section title="특징" sections={sections} hash="#feature" emptyHeight="5vh" useDivider={false}>
          <Row style={{ "height": "5vh" }}></Row>
          <FeatureCardGroup items={featureItems}></FeatureCardGroup>
        </Section>
        <Section title="Skills" sections={sections} hash="#skills" description="기술 스택에 대한 설명으로 수준 비교는 남과의 비교가 아닌 스스로 지닌 기술들 사이의 상대적인 비교로 나타내었습니다." emptyHeight="5vh" useDivider={false}>
          <FeatureCardGroup items={skillItems}></FeatureCardGroup>
        </Section>
        <Section title="Portfolio Review" description="포트폴리오에 추가하고 싶었던 혹은 아쉬웠던 기능들" sections={sections} hash="#review" emptyHeight="5vh" useDivider={false}>
          <FeatureCardGroup items={portfolioReview}></FeatureCardGroup>
        </Section>
        <Row style={{ "height": "10vh" }}></Row>
      </Container>
    </div>
  );
}

export default App;
