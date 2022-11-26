import CSVReader from './CSVReader';
import './Dashboard.scss';
import { ParseResult } from 'papaparse';
import { useState } from 'react';
import { Container, Modal } from 'react-bootstrap';

const Dashboard = () => {
  const [data, setData] = useState<string[][]>([]);
  const [error, setError] = useState('');

  const onUploadAccepted = (results: ParseResult<string[]>) => {
    setData(results.data);
  };

  const onErrorClose = () => setError('');

  return (
    <div className="dashboard">
      <div className="mb-3 section">
        <CSVReader onUploadAccepted={onUploadAccepted} />
      </div>

      <Container className="mb-3 section">{data}</Container>

      <Modal show={!!error} onHide={onErrorClose} className="error">
        <Modal.Header closeButton className="alert alert-danger">
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{error}</Modal.Body>
      </Modal>
    </div>
  );
};

export default Dashboard;
