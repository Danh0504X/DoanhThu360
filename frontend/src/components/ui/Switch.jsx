export const Switch = ({ checked, onChange, disabled = false, label }) => (
  <label className={`inline-flex items-center gap-3 ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
    <span
      role="switch"
      aria-checked={checked}
      onClick={() => !disabled && onChange?.(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-brand ${
        checked ? 'bg-primary-600' : 'bg-bone-300'
      }`}
    >
      <span
        className={`inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-1 transition-brand ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </span>
    {label ? <span className="text-sm font-medium text-bone-700">{label}</span> : null}
  </label>
);
