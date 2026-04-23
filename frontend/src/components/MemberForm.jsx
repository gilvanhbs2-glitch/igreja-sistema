import { useEffect, useState } from 'react';

const initialState = {
  full_name: '',
  birth_date: '',
  cpf: '',
  rg: '',
  baptism_date: '',
  address: '',
  marital_status: '',
  congregation: '',
  role: '',
  photo_data: '',
};

export default function MemberForm({ initialValues, onSubmit, submitLabel = 'Salvar membro', onCancel, livePreview }) {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    setForm(initialValues ? { ...initialState, ...initialValues } : initialState);
  }, [initialValues]);

  useEffect(() => {
    if (livePreview) livePreview(form);
  }, [form, livePreview]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, photo_data: String(reader.result || '') }));
    };
    reader.readAsDataURL(file);
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(form);
  }

  return (
    <form className="card form-grid" onSubmit={handleSubmit}>
      <div className="field full">
        <label>Nome completo</label>
        <input name="full_name" value={form.full_name} onChange={handleChange} required />
      </div>
      <div className="field">
        <label>Data de nascimento</label>
        <input type="date" name="birth_date" value={form.birth_date} onChange={handleChange} />
      </div>
      <div className="field">
        <label>CPF</label>
        <input name="cpf" value={form.cpf} onChange={handleChange} />
      </div>
      <div className="field">
        <label>Função</label>
        <input name="role" value={form.role} onChange={handleChange} placeholder="Ex.: Membro, Secretário, Obreiro" />
      </div>
      <div className="field">
        <label>Congregação</label>
        <input name="congregation" value={form.congregation} onChange={handleChange} />
      </div>
      <div className="field full">
        <label>Foto do membro</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <small className="muted">A foto sai no crachá junto com o QR Code.</small>
      </div>
      <div className="field">
        <label>RG</label>
        <input name="rg" value={form.rg} onChange={handleChange} />
      </div>
      <div className="field">
        <label>Data de batismo</label>
        <input type="date" name="baptism_date" value={form.baptism_date} onChange={handleChange} />
      </div>
      <div className="field full">
        <label>Endereço</label>
        <input name="address" value={form.address} onChange={handleChange} />
      </div>
      <div className="field">
        <label>Estado civil</label>
        <input name="marital_status" value={form.marital_status} onChange={handleChange} />
      </div>
      <div className="actions full">
        {onCancel && <button type="button" className="btn ghost" onClick={onCancel}>Cancelar</button>}
        <button type="submit" className="btn primary">{submitLabel}</button>
      </div>
    </form>
  );
}
