import { statusLabel } from '../constants.js';

const ApplicationList = ({ items, onEdit, onDelete }) => {
  if (!items.length) {
    return <p className="empty-state">Belum ada data lamaran. Tambahkan lamaran pertamamu!</p>;
  }

  return (
    <table className="app-table">
      <thead>
        <tr>
          <th>Perusahaan</th>
          <th>Posisi</th>
          <th>Status</th>
          <th>Tanggal Lamar</th>
          <th>Interview</th>
          <th>Catatan</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td>{item.companyName}</td>
            <td>{item.position}</td>
            <td>
              <span className={`status-badge status-${item.status.toLowerCase()}`}>
                {statusLabel(item.status)}
              </span>
            </td>
            <td>{item.appliedDate ? new Date(item.appliedDate).toLocaleDateString('id-ID') : '-'}</td>
            <td>{item.interviewDate ? new Date(item.interviewDate).toLocaleDateString('id-ID') : '-'}</td>
            <td className="notes-cell">{item.notes || '-'}</td>
            <td className="actions-cell">
              <button onClick={() => onEdit(item)}>Edit</button>
              <button className="btn-danger" onClick={() => onDelete(item.id)}>
                Hapus
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ApplicationList;
