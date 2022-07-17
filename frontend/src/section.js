import { Row } from "react-bootstrap";
import styled from './portfolio.module.css';

function Section({ title, description, sections, hash, children, emptyHeight = "15vh", useDivider = true }) {
    const divier = (
        <Row>
            <hr className={`${styled.divider} ${description ? null : styled.withoutDescription}`}></hr>
        </Row>);
    return (
        <>
            <Row style={{ "height": emptyHeight }}></Row>
            <Row ref={sections[hash]}>
                <h3 className={styled.title}>{title}</h3>
                {description ? <p className={styled.description}>{description}</p> : null}
            </Row>
            {useDivider ? divier : null}
            {children}
        </>
    )
}

export default Section;