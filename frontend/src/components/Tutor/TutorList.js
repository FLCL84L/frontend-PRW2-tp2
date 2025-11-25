import React, { useState, useEffect } from 'react';
import { tutorService } from '../../services/api';

const TutorList = () => {
  const [tutores, setTutores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTutor, setEditingTutor] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    data_nascimento: '',
    endereco: '',
    cidade: '',
    uf: '',
    telefone: '',
    email: ''
  });

  useEffect(() => {
    loadTutores();
  }, []);

  const loadTutores = async () => {
    try {
      const response = await tutorService.getAll();
      setTutores(response.data);
      setLoading(false);
    } catch (err) {
      setError('Erro ao carregar tutores');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTutor) {
        await tutorService.update(editingTutor.id, formData);
      } else {
        await tutorService.create(formData);
      }
      setShowForm(false);
      setEditingTutor(null);
      setFormData({
        nome: '', cpf: '', data_nascimento: '', endereco: '', 
        cidade: '', uf: '', telefone: '', email: ''
      });
      loadTutores();
    } catch (err) {
      setError(err.response?.data?.msg || 'Erro ao salvar tutor');
    }
  };

  const handleEdit = (tutor) => {
    setEditingTutor(tutor);
    setFormData({
      nome: tutor.nome,
      cpf: tutor.cpf,
      data_nascimento: tutor.data_nascimento,
      endereco: tutor.endereco,
      cidade: tutor.cidade,
      uf: tutor.uf,
      telefone: tutor.telefone,
      email: tutor.email
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este tutor?')) {
      try {
        await tutorService.delete(id);
        loadTutores();
      } catch (err) {
        setError('Erro ao excluir tutor');
      }
    }
  };

  if (loading) return <div className="loading">Carregando...</div>;

  return (
    <div className="component-container">
      <div className="component-header">
        <h2>Tutores</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Novo Tutor
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingTutor ? 'Editar' : 'Novo'} Tutor</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowForm(false);
                  setEditingTutor(null);
                  setFormData({
                    nome: '', cpf: '', data_nascimento: '', endereco: '', 
                    cidade: '', uf: '', telefone: '', email: ''
                  });
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Nome *</label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>CPF *</label>
                  <input
                    type="text"
                    value={formData.cpf}
                    onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Data de Nascimento</label>
                <input
                  type="date"
                  value={formData.data_nascimento}
                  onChange={(e) => setFormData({...formData, data_nascimento: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Endereço</label>
                <input
                  type="text"
                  value={formData.endereco}
                  onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Cidade</label>
                  <input
                    type="text"
                    value={formData.cidade}
                    onChange={(e) => setFormData({...formData, cidade: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>UF</label>
                  <input
                    type="text"
                    value={formData.uf}
                    onChange={(e) => setFormData({...formData, uf: e.target.value})}
                    maxLength={2}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Telefone</label>
                  <input
                    type="text"
                    value={formData.telefone}
                    onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <button type="submit" className="btn btn-primary">
                  {editingTutor ? 'Atualizar' : 'Cadastrar'}
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
              <th>CPF</th>
              <th>Telefone</th>
              <th>Email</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {tutores.map((tutor) => (
              <tr key={tutor.id}>
                <td>{tutor.nome}</td>
                <td>{tutor.cpf}</td>
                <td>{tutor.telefone}</td>
                <td>{tutor.email}</td>
                <td>
                  <button 
                    className="btn btn-edit"
                    onClick={() => handleEdit(tutor)}
                  >
                    Editar
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDelete(tutor.id)}
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

export default TutorList;