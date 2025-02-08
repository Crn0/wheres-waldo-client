import PropTypes from 'prop-types';
import style from './css/index.module.css';

export default function Header({ children, styles = '' }) {
  return <header className={`${styles} ${style.header_dark}`}>{children}</header>;
}

Header.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element])
    .isRequired,
  styles: PropTypes.string,
};
