import CSVReader, { Entry } from './CSVReader';
import './Dashboard.scss';
import DataTable from './DataTable';
import { ParseResult } from 'papaparse';
import { useState } from 'react';
import { Container, ListGroup, Modal } from 'react-bootstrap';

const Dashboard = () => {
  const [data, setData] = useState<Entry[]>([]);
  const [files, setFiles] = useState<string[]>([]);
  const [error, setError] = useState('');

  const onUploadAccepted = (results: ParseResult<string[]>, file?: File) => {
    if (file?.name) {
      const { name } = file;

      setFiles([name, ...files]);
    }

    const newData = [...data, ...results.data.filter((r) => Object.keys(r).length > 1).map((r) => new Entry(r))];

    setData(newData);
  };

  const validator = (file: File) => {
    if (files.includes(file.name)) {
      setError(`File ${file.name} already exists`);

      return true;
    }

    return false;
  };

  const onErrorClose = () => setError('');

  const dataTable = () => {
    if (data.length === 0) {
      return <></>;
    }

    return (
      <Container className="mb-3 section">
        <DataTable data={data} />
      </Container>
    );
  };

  const filesList = () => {
    if (files.length === 0) {
      return <></>;
    }

    const items = files.map((f) => <ListGroup.Item key={f}>{f}</ListGroup.Item>);

    return (
      <Container className="mb-3 section">
        <div>Selected files:</div>
        <ListGroup>{items}</ListGroup>
      </Container>
    );
  };

  return (
    <div className="dashboard">
      <div className="mb-3 section">
        <CSVReader onUploadAccepted={onUploadAccepted} validator={validator} />
      </div>

      {filesList()}

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
