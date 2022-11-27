import CSVReader, { Entry } from './CSVReader';
import './Dashboard.scss';
import DataTable from './DataTable';
import { ParseResult } from 'papaparse';
import { useState } from 'react';
import { Container, Modal } from 'react-bootstrap';

const Dashboard = () => {
  const [data, setData] = useState<Entry[]>([]);
  const [error, setError] = useState('');

  const onUploadAccepted = (results: ParseResult<string[]>) => {
    setData(results.data.map((r) => new Entry(r)));
  };

  const onErrorClose = () => setError('');

  const dataTable = () => {
    if (data.length > 0) {
      return (
        <Container className="mb-3 section">
          <DataTable data={data} />
        </Container>
      );
    }

    return <></>;
  };

  return (
    <div className="dashboard">
      <div className="mb-3 section">
        <CSVReader onUploadAccepted={onUploadAccepted} />
      </div>

      {dataTable()}

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
