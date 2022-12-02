import CSVReader, { Entry } from './CSVReader';
import './Dashboard.scss';
import DataTable from './DataTable';
import { ParseResult } from 'papaparse';
import { useState } from 'react';
import { Badge, Container, ListGroup, Modal } from 'react-bootstrap';

interface IndexFile {
  name: string;
  count: number;
  label: string;
}

const Dashboard = () => {
  const [data, setData] = useState<Entry[]>([]);
  const [files, setFiles] = useState<IndexFile[]>([]);
  const [error, setError] = useState('');

  const onUploadAccepted = (results: ParseResult<string[]>, file?: File) => {
    try {
      const newData = results.data.map((r) => new Entry(r));

      if (file?.name) {
        const { name } = file;

        // Extract the label from the path of the first entry, since all entries have the same label in any case
        const path = newData[0].path;
        const label = path.split('/')[0] || path.split('\\')[0];

        setFiles([{ name, count: results.data.length, label }, ...files]);
      }

      setData([...data, ...newData]);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);

        return;
      }

      setError('Unexpected error');
    }
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

    const items = files.map((f) => (
      <ListGroup.Item key={f.name}>
        {f.name}{' '}
        <Badge bg="primary" pill>
          {f.count}
        </Badge>
        <Badge bg="success" pill>
          {f.label}
        </Badge>
      </ListGroup.Item>
    ));

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
        <CSVReader onUploadAccepted={onUploadAccepted} />
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
