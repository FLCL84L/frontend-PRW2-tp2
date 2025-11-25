import React, { useState, useEffect } from 'react';
import { petService, tutorService } from '../../services/api';

const PetList = () => {
  const [pets, setPets] = useState([]);
  const [tutores, setTutores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    data_nascimento: '',
    especie: '',
    raca: '',
    id_tutor: ''
  });

  useEffect(() => {
    loadPets();
    loadTutores();
  }, []);

  const loadPets = async () => {
    try {
      const response = await petService.getAll();
      setPets(response.data);
      setLoading(false);
    } catch (err) {
      setError('Erro ao carregar pets');
      setLoading(false);
    }
  };

  const loadTutores = async () => {
    try {
      const response = await tutorService.getAll();
      setTutores(response.data);
    } catch (err) {
      console.error('Erro ao carregar tutores');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPet) {
        await petService.update(editingPet.id, formData);
      } else {
        await petService.create(formData);
      }
      setShowForm(false);
      setEditingPet(null);
      setFormData({
        nome: '', data_nascimento: '', especie: '', raca: '', id_tutor: ''
      });
      loadPets();
    } catch (err) {
      setError(err.response?.data?.msg || 'Erro ao salvar pet');
    }
  };

  const handleEdit = (pet) => {
    setEditingPet(pet);
    setFormData({
      nome: pet.nome,
      data_nascimento: pet.data_nascimento,
      especie: pet.especie,
      raca: pet.raca,
      id_tutor: pet.id_tutor
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este pet?')) {
      try {
        await petService.delete(id);
        loadPets();
      } catch (err) {
        setError('Erro ao excluir pet');
      }
    }
  };

  const getTutorNome = (idTutor) => {
    const tutor = tutores.find(t => t.id === idTutor);
    return tutor ? tutor.nome : 'N/A';
  };

  if (loading) return <div className="loading">Carregando...</div>;

  return (
    <div className="component-container">
      <div className="component-header">
        <h2>Pets</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Novo Pet
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingPet ? 'Editar' : 'Novo'} Pet</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowForm(false);
                  setEditingPet(null);
                  setFormData({
                    nome: '', data_nascimento: '', especie: '', raca: '', id_tutor: ''
                  });
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nome</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Data de Nascimento *</label>
                  <input
                    type="date"
                    value={formData.data_nascimento}
                    onChange={(e) => setFormData({...formData, data_nascimento: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Espécie *</label>
                  <input
                    type="text"
                    value={formData.especie}
                    onChange={(e) => setFormData({...formData, especie: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Raça</label>
                  <input
                    type="text"
                    value={formData.raca}
                    onChange={(e) => setFormData({...formData, raca: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Tutor *</label>
                  <select
                    value={formData.id_tutor}
                    onChange={(e) => setFormData({...formData, id_tutor: e.target.value})}
                    required
                  >
                    <option value="">Selecione um tutor</option>
                    {tutores.map(tutor => (
                      <option key={tutor.id} value={tutor.id}>
                        {tutor.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <button type="submit" className="btn btn-primary">
                  {editingPet ? 'Atualizar' : 'Cadastrar'}
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
              <th>Nome</th>
              <th>Espécie</th>
              <th>Raça</th>
              <th>Data Nasc.</th>
              <th>Tutor</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pets.map((pet) => (
              <tr key={pet.id}>
                <td>{pet.nome}</td>
                <td>{pet.especie}</td>
                <td>{pet.raca}</td>
                <td>{pet.data_nascimento}</td>
                <td>{getTutorNome(pet.id_tutor)}</td>
                <td>
                  <button 
                    className="btn btn-edit"
                    onClick={() => handleEdit(pet)}
                  >
                    Editar
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDelete(pet.id)}
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

export default PetList;