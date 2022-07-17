import { Card, Col, Row } from "react-bootstrap";
import MoreInfo from "./moreInfo";

function Elem({ title, body, moreInfo }) {
    const isMoreInfoExist = moreInfo != null;
    const cardStyle = isMoreInfoExist
        ? { "borderColor": "#D0C0F7", paddingTop: "10vh", paddingBottom: "5vh", paddingLeft: "1vw", paddingRight: "1vw", marginTop: "3vh", marginBottom: "8vh", marginLeft: "1.6vw", marginRight: "1.6vw" }
        : { "borderColor": "#D0C0F7", paddingTop: "10vh", paddingBottom: "10vh", paddingLeft: "1vw", paddingRight: "1vw", marginTop: "3vh", marginBottom: "8vh", marginLeft: "1.6vw", marginRight: "1.6vw" };

    return <Card bg="black" border="" style={cardStyle}>
        <Card.Body>
            <Card.Title><h2 style={{ "wordBreak": "keep-all" }}>{title}</h2></Card.Title>
            <p></p>
            <Card.Text style={{ "wordBreak": "keep-all" }}>
                {body}
            </Card.Text>
            {isMoreInfoExist ? <><Row style={{ "height": "3vh" }}></Row><MoreInfo title={moreInfo.title} body={moreInfo.body}></MoreInfo></> : null}
        </Card.Body>
    </Card>
}

function FeatureCardGroup({ items = [] }) {
    return <Row lg={3} className="g-4" style={{ "textAlign": "center" }}>
        {
            items.map((item, idx) => (
                <Col key={idx} style={{}}>
                    <Elem title={item.title} body={item.body} moreInfo={item.moreInfo}></Elem>
                </Col>
            ))
        }
    </Row>
}

export default FeatureCardGroup;
