import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import styles from '../Assets/gestion_empleados.module.css';

const GestionRecepcion = () => {
  const { user } = useAuth();
  const [recepciones, setRecepciones] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [paquetes, setPaquetes] = useState([]);
  const [newRecepcion, setNewRecepcion] = useState({
    nro: '',
    fechaRecepcion: '',
    horaRecepcion: '',
    precioEstimado: '',
    idUsuarioRecepcion: user ? user.id : '',
    codigoCliente: '',
    codigoPaquete: ''
  });
  const [editRecepcion, setEditRecepcion] = useState(null);
  const [showTable, setShowTable] = useState(false);

  const backendUrl = 'https://proyecto2-production-ba5b.up.railway.app';

  const fetchRecepciones = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/recepciones`);
      setRecepciones(response.data);
      setShowTable(true);
    } catch (error) {
      console.error('Error al obtener las recepciones:', error);
    }
  };

  const fetchClientes = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/clientes`);
      setClientes(response.data);
    } catch (error) {
      console.error('Error al obtener los clientes:', error);
    }
  };

  const fetchPaquetes = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/paquetes`);
      setPaquetes(response.data);
    } catch (error) {
      console.error('Error al obtener los paquetes:', error);
    }
  };

  useEffect(() => {
    fetchRecepciones();
    fetchClientes();
    fetchPaquetes();
  }, []);

  const handleChange = (e) => {
    setNewRecepcion({ ...newRecepcion, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editRecepcion) {
        await axios.put(`${backendUrl}/api/recepciones/${editRecepcion.NRO}`, newRecepcion);
        setEditRecepcion(null);
      } else {
        await axios.post(`${backendUrl}/api/recepciones`, newRecepcion);
      }
      setNewRecepcion({
        nro: '',
        fechaRecepcion: '',
        horaRecepcion: '',
        precioEstimado: '',
        idUsuarioRecepcion: user ? user.id : '',
        codigoCliente: '',
        codigoPaquete: ''
      });
      fetchRecepciones();
    } catch (error) {
      console.error('Error al registrar la recepción:', error);
    }
  };

  const handleEdit = (recepcion) => {
    setNewRecepcion({
      nro: recepcion.NRO,
      fechaRecepcion: recepcion.FECHARECEPCION,
      horaRecepcion: recepcion.HORARECEPCION,
      precioEstimado: recepcion.PRECIOESTIMADO,
      idUsuarioRecepcion: recepcion.IDUSUARIORECEPCION,
      codigoCliente: recepcion.CODIGOCLIENTE,
      codigoPaquete: recepcion.CODIGOPAQUETE
    });
    setEditRecepcion(recepcion);
  };

  const handleDelete = async (nro) => {
    try {
      await axios.delete(`${backendUrl}/api/recepciones/${nro}`);
      fetchRecepciones();
    } catch (error) {
      console.error('Error al eliminar la recepción:', error);
    }
  };

  return (
    <div className={styles.gestionContainer}>
      <Container className="mt-5">
        <Row className="mb-5">
          <Col xs={12}>
            <h3>{editRecepcion ? 'Editar Recepción' : 'Registrar Nueva Recepción'}</h3>
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label htmlFor="nro">Número de Nota de Entrega</Form.Label>
                <Form.Control type="text" id="nro" name="nro" value={newRecepcion.nro} onChange={handleChange} placeholder="Ingrese el número de la nota de entrega" />
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor="fechaRecepcion">Fecha de Recepción</Form.Label>
                <Form.Control type="date" id="fechaRecepcion" name="fechaRecepcion" value={newRecepcion.fechaRecepcion} onChange={handleChange} />
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor="horaRecepcion">Hora de Recepción</Form.Label>
                <Form.Control type="time" id="horaRecepcion" name="horaRecepcion" value={newRecepcion.horaRecepcion} onChange={handleChange} />
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor="precioEstimado">Precio Estimado</Form.Label>
                <Form.Control type="text" id="precioEstimado" name="precioEstimado" value={newRecepcion.precioEstimado} onChange={handleChange} placeholder="Ingrese el precio estimado" />
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor="codigoCliente">Cliente</Form.Label>
                <Form.Control as="select" id="codigoCliente" name="codigoCliente" value={newRecepcion.codigoCliente} onChange={handleChange}>
                  <option value="">Seleccione un cliente</option>
                  {clientes.map(cliente => (
                    <option key={cliente.CODIGO} value={cliente.CODIGO}>{cliente.NOMBRES} {cliente.APELLIDOS}</option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor="codigoPaquete">Paquete</Form.Label>
                <Form.Control as="select" id="codigoPaquete" name="codigoPaquete" value={newRecepcion.codigoPaquete} onChange={handleChange}>
                  <option value="">Seleccione un paquete</option>
                  {paquetes.map(paquete => (
                    <option key={paquete.CODIGO} value={paquete.CODIGO}>{paquete.CODIGO}</option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Button type="submit" variant="primary" className="mb-3">{editRecepcion ? 'Actualizar' : 'Registrar'}</Button>
            </Form>
          </Col>
        </Row>

        {showTable && (
          <Row>
            <Col xs={12}>
              <h3>Lista de Recepciones</h3>
              <div className="table-responsive">
                <Table bordered>
                  <thead className="thead-light">
                    <tr>
                      <th>Número de Nota de Entrega</th>
                      <th>Fecha de Recepción</th>
                      <th>Hora de Recepción</th>
                      <th>Precio Estimado</th>
                      <th>Cliente</th>
                      <th>Paquete</th>
                      <th>ID del Usuario</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recepciones.map(recepcion => (
                      <tr key={recepcion.NRO}>
                        <td>{recepcion.NRO}</td>
                        <td>{recepcion.FECHARECEPCION}</td>
                        <td>{recepcion.HORARECEPCION}</td>
                        <td>{recepcion.PRECIOESTIMADO}</td>
                        <td>{clientes.find(cliente => cliente.CODIGO === recepcion.CODIGOCLIENTE)?.NOMBRES}</td>
                        <td>{paquetes.find(paquete => paquete.CODIGO === recepcion.CODIGOPAQUETE)?.CODIGO}</td>
                        <td>{recepcion.IDUSUARIORECEPCION}</td>
                        <td>
                          <Button variant="warning" size="sm" onClick={() => handleEdit(recepcion)}>Editar</Button>
                          <Button variant="danger" size="sm" onClick={() => handleDelete(recepcion.NRO)}>Eliminar</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default GestionRecepcion;
