import PropTypes from 'prop-types'

export default function InputLabel({
    value,
    className = '',
    children,
    htmlFor,
    ...props
}) {
    return (
        <label
            {...props}
            htmlFor={htmlFor}
            className={`block font-medium text-sm text-gray-700 ${className}`}
        >
            {value || children}
        </label>
    )
}

InputLabel.propTypes = {
    value: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.node,
    htmlFor: PropTypes.string.isRequired,
}

InputLabel.defaultProps = {
    className: '',
    value: '',
    children: null,
}
