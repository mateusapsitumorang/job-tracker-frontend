export const STATUS_OPTIONS = [
  { value: 'WISHLIST', label: 'Wishlist' },
  { value: 'APPLIED', label: 'Sudah Melamar' },
  { value: 'WAITING_REVIEW', label: 'Menunggu Review' },
  { value: 'INTERVIEW_HR', label: 'Interview HR' },
  { value: 'INTERVIEW_USER', label: 'Interview User' },
  { value: 'INTERVIEW_FINAL', label: 'Interview Final' },
  { value: 'OFFER', label: 'Offer' },
  { value: 'REJECTED', label: 'Ditolak' },
  { value: 'ACCEPTED', label: 'Diterima' },
  { value: 'WITHDRAWN', label: 'Dibatalkan' },
];

export const statusLabel = (value) =>
  STATUS_OPTIONS.find((s) => s.value === value)?.label || value;
