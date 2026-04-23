import { useMemo, useState } from 'react';
import { api } from '../services/api';
import MemberForm from '../components/MemberForm';
import BadgeCard from '../components/BadgeCard';

const previewInitial = {
  full_name: '',
  cpf: '',
  role: '',
  congregation: 'IPDA MARIA ANTONIETA',
  member_code: 'PREVIEW',
  photo_data: '',
};

const PRINT_STYLE = `
  html, body {
    margin: 0;
    padding: 0;
    background: white;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  body {
    width: 60mm;
    height: 92mm;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: Arial, Helvetica, sans-serif;
  }
  .badge-print-sheet {
    width: 60mm;
    height: 92mm;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
  }
  .badge-card {
    position: relative;
    overflow: hidden;
    width: 54mm;
    height: 86mm;
    background: linear-gradient(180deg, #ffffff 0%, #f7faff 100%) !important;
    border: 0.25mm solid #dbe2f0;
    border-radius: 3mm;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 4mm 3.4mm 0;
    box-sizing: border-box;
  }
  .badge-rainbow-top, .badge-rainbow-bottom {
    background: linear-gradient(90deg, #f53c3c 0%, #ff9322 24%, #ebdf1f 48%, #34b44a 72%, #3f51b5 100%) !important;
  }
  .badge-rainbow-top {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1.2mm;
  }
  .badge-rainbow-bottom {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1.8mm;
  }
  .badge-photo-wrap {
    margin-top: 4mm;
    width: 20mm;
    height: 20mm;
    border-radius: 2.2mm;
    border: 0.7mm solid #1a73d9;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #eef4ff !important;
  }
  .badge-photo { width: 100%; height: 100%; object-fit: cover; }
  .badge-photo.placeholder { color: #5370aa; font-weight: 700; font-size: 3mm; }
  .badge-name {
    margin-top: 3mm;
    font-size: 3.4mm;
    line-height: 1.15;
    font-weight: 800;
    text-transform: uppercase;
    color: #101a4c;
    text-align: center;
    max-width: 42mm;
  }
  .badge-role {
    margin-top: 2.1mm;
    font-size: 3mm;
    color: #1e2238;
    text-transform: uppercase;
  }
  .badge-cpf {
    margin-top: 1.8mm;
    font-size: 2.9mm;
    color: #202b59;
  }
  .badge-qr-wrap {
    margin-top: 3.6mm;
    background: #fff !important;
    padding: 1.1mm;
    border-radius: 1.4mm;
  }
  .badge-congregation {
    margin-top: auto;
    margin-bottom: 4.2mm;
    color: #22356d;
    font-size: 2.7mm;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: .02em;
    text-align: center;
    max-width: 44mm;
  }
  svg { display: block; }
  @page { size: 60mm 92mm; margin: 0; }
`;

export default function CadastroPage() {
  const [message, setMessage] = useState('');
  const [createdMember, setCreatedMember] = useState(null);
  const [previewMember, setPreviewMember] = useState(previewInitial);

  const badgeMember = useMemo(() => createdMember || previewMember, [createdMember, previewMember]);

  function handlePrintBadge() {
    const badgeElement = document.getElementById('badge-print-target');
    if (!badgeElement) return;

    const printWindow = window.open('', '_blank', 'width=500,height=800');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Crachá</title>
          <style>${PRINT_STYLE}</style>
        </head>
        <body>
          <div class="badge-print-sheet">${badgeElement.outerHTML}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 350);
  }

  async function handleSubmit(payload) {
    try {
      const member = await api.createMember(payload);
      setCreatedMember(member);
      setPreviewMember(member);
      setMessage(`Membro ${member.full_name} cadastrado com sucesso. Crachá gerado automaticamente.`);
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <div className="page-stack">
      <div className="page-header refined-header">
        <span className="eyebrow">Novo membro</span>
        <h1>Cadastro</h1>
        <p>Cadastre o membro com foto e gere o crachá automaticamente ao lado.</p>
      </div>
      {message && <div className="notice">{message}</div>}
      <div className="cadastro-layout modern-cadastro-layout">
        <MemberForm
          onSubmit={handleSubmit}
          submitLabel="Cadastrar membro"
          livePreview={(form) => setPreviewMember((prev) => ({ ...prev, ...form }))}
        />
        <div className="side-column sticky-column">
          <div className="card preview-card">
            <div className="section-head">
              <div>
                <span className="eyebrow">Prévia do crachá</span>
                <h2>Crachá gerado do membro</h2>
              </div>
            </div>
            <BadgeCard member={badgeMember} printId="badge-print-target" />
            <div className="actions top-gap">
              <button type="button" className="btn primary" onClick={handlePrintBadge}>Imprimir crachá</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
