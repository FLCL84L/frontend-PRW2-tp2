import React, { useState, useEffect } from 'react';
import { veterinarioService } from '../../services/api';

const VeterinarioList = () => {
  const [veterinarios, setVeterinarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingVet, setEditingVet] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    crmv: '',
    data_nascimento: '',
    endereco: '',
    cidade: '',
    uf: '',
    telefone: '',
    email: ''
  });

  useEffect(() => {
    loadVeterinarios();
  }, []);

  const loadVeterinarios = async () => {
    try {
      const response = await veterinarioService.getAll();
      setVeterinarios(response.data);
      setLoading(false);
    } catch (err) {
      setError('Erro ao carregar veterinários');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingVet) {
        await veterinarioService.update(editingVet.id, formData);
      } else {
        await veterinarioService.create(formData);
      }
      setShowForm(false);
      setEditingVet(null);
      setFormData({
        nome: '', crmv: '', data_nascimento: '', endereco: '', 
        cidade: '', uf: '', telefone: '', email: ''
      });
      loadVeterinarios();
    } catch (err) {
      setError(err.response?.data?.msg || 'Erro ao salvar veterinário');
    }
  };

  const handleEdit = (vet) => {
    setEditingVet(vet);
    setFormData({
      nome: vet.nome,
      crmv: vet.crmv,
      data_nascimento: vet.data_nascimento,
      endereco: vet.endereco,
      cidade: vet.cidade,
      uf: vet.uf,
      telefone: vet.telefone,
      email: vet.email
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este veterinário?')) {
      try {
        await veterinarioService.delete(id);
        loadVeterinarios();
      } catch (err) {
        setError('Erro ao excluir veterinário');
      }
    }
  };

  if (loading) return <div className="loading">Carregando...</div>;

  return (
    <div className="component-container">
      <div className="component-header">
        <h2>Veterinários</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Novo Veterinário
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingVet ? 'Editar' : 'Novo'} Veterinário</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowForm(false);
                  setEditingVet(null);
                  setFormData({
                    nome: '', crmv: '', data_nascimento: '', endereco: '', 
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
                  <label>CRMV *</label>
                  <input
                    type="text"
                    value={formData.crmv}
                    onChange={(e) => setFormData({...formData, crmv: e.target.value})}
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
                  {editingVet ? 'Atualizar' : 'Cadastrar'}
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
              <th>CRMV</th>
              <th>Telefone</th>
              <th>Email</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {veterinarios.map((vet) => (
              <tr key={vet.id}>
                <td>{vet.nome}</td>
                <td>{vet.crmv}</td>
                <td>{vet.telefone}</td>
                <td>{vet.email}</td>
                <td>
                  <button 
                    className="btn btn-edit"
                    onClick={() => handleEdit(vet)}
                  >
                    Editar
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDelete(vet.id)}
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

export default VeterinarioList;