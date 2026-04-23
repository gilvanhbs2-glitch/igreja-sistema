import { QRCodeSVG } from 'qrcode.react';

function maskCpf(cpf) {
  if (!cpf) return '-';
  const digits = String(cpf).replace(/\D/g, '');
  if (digits.length !== 11) return cpf;
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export default function BadgeCard({ member, compact = false, printId }) {
  if (!member) return null;

  const qrValue = JSON.stringify({ memberCode: member.member_code });
  const role = (member.role || 'MEMBRO').toUpperCase();
  const congregation = (member.congregation || 'CONGREGAÇÃO').toUpperCase();

  return (
    <div id={printId} className={`badge-card ${compact ? 'compact' : ''}`}>
      <div className="badge-rainbow-top" />

      <div className="badge-photo-wrap">
        {member.photo_data ? (
          <img src={member.photo_data} alt={member.full_name} className="badge-photo" />
        ) : (
          <div className="badge-photo placeholder">FOTO</div>
        )}
      </div>

      <div className="badge-name">{member.full_name || 'NOME DO MEMBRO'}</div>
      <div className="badge-role">{role}</div>
      <div className="badge-cpf">CPF: {maskCpf(member.cpf)}</div>

      <div className="badge-qr-wrap">
        <QRCodeSVG value={qrValue} size={compact ? 82 : 92} includeMargin={false} />
      </div>

      <div className="badge-congregation">{congregation}</div>

      <div className="badge-rainbow-bottom" />
    </div>
  );
}
