import { useState, createContext, useContext, Fragment, useMemo } from 'react'
import { Link } from '@inertiajs/react'
import { Transition } from '@headlessui/react'
import PropTypes from 'prop-types'

const DropDownContext = createContext()

function Dropdown({ children }) {
    const [open, setOpen] = useState(false)

    const toggleOpen = () => setOpen(prev => !prev)

    const contextValue = useMemo(() => ({ open, setOpen, toggleOpen }), [open])

    return (
        <DropDownContext.Provider value={contextValue}>
            <div className="relative">{children}</div>
        </DropDownContext.Provider>
    )
}

function Trigger({ children }) {
    const { toggleOpen } = useContext(DropDownContext)

    // Handling keyboard events, specifically "Enter" key
    const handleKeyDown = event => {
        if (event.key === 'Enter') {
            toggleOpen()
        }
    }

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={toggleOpen}
            onKeyDown={handleKeyDown} // Adding keyboard listener
            className="cursor-pointer" // Adding cursor pointer for better UX
        >
            {children}
        </div>
    )
}

function Content({
    align = 'right',
    width = '48',
    contentClasses = 'py-1 bg-white',
    children,
}) {
    const { open, setOpen } = useContext(DropDownContext)

    const alignmentClasses =
        align === 'left'
            ? 'ltr:origin-top-left rtl:origin-top-right start-0'
            : 'ltr:origin-top-right rtl:origin-top-left end-0'

    const widthClasses = width === '48' ? 'w-48' : ''

    return (
        <Transition
            as={Fragment}
            show={open}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
        >
            {/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */}
            <div
                role="dialog"
                className={`absolute z-50 mt-2 rounded-md shadow-lg ${alignmentClasses} ${widthClasses}`}
                onKeyDown={event => {
                    if (event.key === 'Enter' || event.key === 'Space') {
                        setOpen(false)
                    }
                }}
                onClick={event => {
                    event.stopPropagation()
                    setOpen(false)
                }}
            >
                {/* eslint-disable jsx-a11y/no-static-element-interactions */}
                {/* eslint-disable jsx-a11y/click-events-have-key-events */}
                <div
                    className={`rounded-md ring-1 ring-black ring-opacity-5 ${contentClasses}`}
                    onClick={event => event.stopPropagation()}
                >
                    {children}
                </div>
            </div>
        </Transition>
    )
}

function DropdownLink({ className = '', children, ...props }) {
    return (
        <Link
            {...props}
            className={`block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out ${className}`}
        >
            {children}
        </Link>
    )
}

Dropdown.propTypes = {
    children: PropTypes.node,
}
Content.propTypes = {
    children: PropTypes.node,
    align: PropTypes.string,
    width: PropTypes.string,
    contentClasses: PropTypes.string,
}
DropdownLink.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
}
Trigger.propTypes = {
    children: PropTypes.node,
}

Dropdown.defaultProps = {
    children: null,
}

Content.defaultProps = {
    align: 'right',
    width: '48',
    contentClasses: 'py-1 bg-white',
    children: null,
}

DropdownLink.defaultProps = {
    className: '',
    children: null,
}

Trigger.defaultProps = {
    children: null,
}

Content.propTypes = {
    align: PropTypes.string,
    width: PropTypes.string,
    contentClasses: PropTypes.string,
    children: PropTypes.node,
}

Content.defaultProps = {
    align: 'right',
    width: '48',
    contentClasses: 'py-1 bg-white',
}

Dropdown.Trigger = Trigger
Dropdown.Content = Content
Dropdown.Link = DropdownLink

export default Dropdown
