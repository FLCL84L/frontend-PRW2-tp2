import React, { useState, useEffect } from 'react';
import { consultaService, veterinarioService, petService } from '../../services/api';

const ConsultaList = () => {
  const [consultas, setConsultas] = useState([]);
  const [veterinarios, setVeterinarios] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingConsulta, setEditingConsulta] = useState(null);
  const [formData, setFormData] = useState({
    id_vet: '',
    id_pet: '',
    data_hora: '',
    valor: ''
  });

  useEffect(() => {
    loadConsultas();
    loadVeterinarios();
    loadPets();
  }, []);

  const loadConsultas = async () => {
    try {
      const response = await consultaService.getAll();
      setConsultas(response.data);
      setLoading(false);
    } catch (err) {
      setError('Erro ao carregar consultas');
      setLoading(false);
    }
  };

  const loadVeterinarios = async () => {
    try {
      const response = await veterinarioService.getAll();
      setVeterinarios(response.data);
    } catch (err) {
      console.error('Erro ao carregar veterinários');
    }
  };

  const loadPets = async () => {
    try {
      const response = await petService.getAll();
      setPets(response.data);
    } catch (err) {
      console.error('Erro ao carregar pets');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingConsulta) {
        await consultaService.update(editingConsulta.id, formData);
      } else {
        await consultaService.create(formData);
      }
      setShowForm(false);
      setEditingConsulta(null);
      setFormData({
        id_vet: '', id_pet: '', data_hora: '', valor: ''
      });
      loadConsultas();
    } catch (err) {
      setError(err.response?.data?.msg || 'Erro ao salvar consulta');
    }
  };

  const handleEdit = (consulta) => {
    setEditingConsulta(consulta);
    setFormData({
      id_vet: consulta.id_vet,
      id_pet: consulta.id_pet,
      data_hora: consulta.data_hora,
      valor: consulta.valor
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta consulta?')) {
      try {
        await consultaService.delete(id);
        loadConsultas();
      } catch (err) {
        setError('Erro ao excluir consulta');
      }
    }
  };

  const getVeterinarioNome = (idVet) => {
    const vet = veterinarios.find(v => v.id === idVet);
    return vet ? vet.nome : 'N/A';
  };

  const getPetNome = (idPet) => {
    const pet = pets.find(p => p.id === idPet);
    return pet ? pet.nome : 'N/A';
  };

  const formatDateTime = (dateTimeStr) => {
    return new Date(dateTimeStr).toLocaleString('pt-BR');
  };

  if (loading) return <div className="loading">Carregando...</div>;

  return (
    <div className="component-container">
      <div className="component-header">
        <h2>Consultas</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Nova Consulta
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingConsulta ? 'Editar' : 'Nova'} Consulta</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowForm(false);
                  setEditingConsulta(null);
                  setFormData({
                    id_vet: '', id_pet: '', data_hora: '', valor: ''
                  });
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Veterinário *</label>
                  <select
                    value={formData.id_vet}
                    onChange={(e) => setFormData({...formData, id_vet: e.target.value})}
                    required
                    disabled={editingConsulta}
                  >
                    <option value="">Selecione um veterinário</option>
                    {veterinarios.map(vet => (
                      <option key={vet.id} value={vet.id}>
                        {vet.nome} - {vet.crmv}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Pet *</label>
                  <select
                    value={formData.id_pet}
                    onChange={(e) => setFormData({...formData, id_pet: e.target.value})}
                    required
                    disabled={editingConsulta}
                  >
                    <option value="">Selecione um pet</option>
                    {pets.map(pet => (
                      <option key={pet.id} value={pet.id}>
                        {pet.nome} - {pet.especie}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Data e Hora *</label>
                  <input
                    type="datetime-local"
                    value={formData.data_hora}
                    onChange={(e) => setFormData({...formData, data_hora: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Valor (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.valor}
                    onChange={(e) => setFormData({...formData, valor: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <button type="submit" className="btn btn-primary">
                  {editingConsulta ? 'Atualizar' : 'Agendar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Veterinário</th>
              <th>Pet</th>
              <th>Data/Hora</th>
              <th>Valor</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {consultas.map((consulta) => (
              <tr key={consulta.id}>
                <td>{consulta.nome_vet} ({consulta.crmv})</td>
                <td>{consulta.nome_pet}</td>
                <td>{formatDateTime(consulta.data_hora)}</td>
                <td>
                  {consulta.valor ? 
                    `R$ ${parseFloat(consulta.valor).toFixed(2)}` : 
                    'Não informado'
                  }
                </td>
                <td>
                  <button 
                    className="btn btn-edit"
                    onClick={() => handleEdit(consulta)}
                  >
                    Editar
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDelete(consulta.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConsultaList;