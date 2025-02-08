import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import './css/link.module.css';

export default function Link({ to, state, children, styles = '' }) {
  return (
    <RouterLink to={to} state={state} className={`${styles}`}>
      {children}
    </RouterLink>
  );
}

Link.propTypes = {
  to: PropTypes.string.isRequired,
  state: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  styles: PropTypes.string,
  children: PropTypes.node.isRequired,
};
