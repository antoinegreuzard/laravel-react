import PropTypes from 'prop-types'

function InputError({ message, className = '', ...props }) {
    return message ? (
        <p {...props} className={`text-sm text-red-600 ${className}`}>
            {message}
        </p>
    ) : null
}

// Définir les PropTypes pour le composant
InputError.propTypes = {
    message: PropTypes.string,
    className: PropTypes.string,
}

InputError.defaultProps = {
    message: '',
    className: '',
}

export default InputError
