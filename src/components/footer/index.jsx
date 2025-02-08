import PropTypes from 'prop-types';
import style from './css/index.module.css';

export default function Footer({ children, styles }) {
  return <footer className={`${styles} ${style.margin_top_auto} ${style.dark}`}>{children}</footer>;
}

Footer.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element])
    .isRequired,
  styles: PropTypes.string,
};
