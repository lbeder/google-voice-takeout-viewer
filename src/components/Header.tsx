import googleVoice from '../images/google-voice.png';
import './Header.scss';
import { Col, Image, Row } from 'react-bootstrap';

const Header = () => {
  return (
    <header>
      <div className="container-fluid">
        <div className="header-body">
          <Row>
            <Col md="auto">
              <div className="avatar">
                <Image src={googleVoice} className="avatar-img" />
              </div>
            </Col>
            <Col md="auto">
              <h1 className="header-title">Google Voice Merger App</h1>
              <h6 className="header-version">{process.env.REACT_APP_VERSION}</h6>
            </Col>
          </Row>
        </div>
      </div>
    </header>
  );
};

export default Header;
