import PropTypes from 'prop-types';

export default function Input({
  type,
  name,
  autoComplete,
  uncontrolled = false,
  isDisabled = false,
  checked = false,
  value = '',
  styles = '',
  placeholder = '',
  src = '',
  alt = '',
  width = '',
  height = '',

  onChange = () => {},
  onClick = () => {},
  onKeyDown = () => {},
  onBlur = () => {},
}) {
  if (type.toLowerCase() === 'image') {
    return (
      <input
        className={`${styles}`}
        type={type}
        src={src}
        alt={alt}
        width={width}
        height={height}
        onBlur={onBlur}
        onChange={onChange}
        onClick={onClick}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        disabled={isDisabled}
        autoComplete={autoComplete}
        required
      />
    );
  }

  if (uncontrolled) {
    return (
      <input
        className={`${styles}`}
        type={type}
        name={name}
        onBlur={onBlur}
        onChange={onChange}
        onClick={onClick}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        disabled={isDisabled}
        autoComplete={autoComplete}
        required
        checked={checked}
      />
    );
  }

  return (
    <input
      className={`${styles}`}
      type={type}
      name={name}
      value={value}
      onBlur={onBlur}
      onChange={onChange}
      onClick={onClick}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      autoComplete={autoComplete}
      disabled={isDisabled}
      required
      checked={checked}
    />
  );
}

Input.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
  checked: PropTypes.bool,
  autoComplete: PropTypes.string.isRequired,
  styles: PropTypes.string,
  placeholder: PropTypes.string,
  src: PropTypes.string,
  alt: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  uncontrolled: PropTypes.bool,
  isDisabled: PropTypes.bool,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  onClick: PropTypes.func,
  onBlur: PropTypes.func,
};
