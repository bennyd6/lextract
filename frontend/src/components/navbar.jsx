import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import './navbar.css';
// import Logo from '../assets/emisor.png';

export default function Navbar() {
    const [userName] = useState('User'); // Static user name
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const dropdownRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

    const handleLogout = () => {
        window.location.href = '/login';
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className={`nav-main ${scrolled ? 'nav-scrolled' : ''}`}>
            {/* <a href="/"><img src={Logo} alt="Logo" /></a> */}
            <a href="/" className={location.pathname === "/" ? "logo" : "logo"} >lextract . </a>
            <a href="/" className={location.pathname === "/" ? "active-link" : ""}>Home</a>
            <Link to="/analyze" className={location.pathname === "/analyze" ? "active-link" : ""}>Analyze</Link>
            {/* <Link to="/about" className={location.pathname === "/about" ? "active-link" : ""}>About Us</Link> */}

            <div className="user-dropdown" onClick={toggleDropdown} ref={dropdownRef}>
                <span>{userName}</span>
                {dropdownVisible && (
                    <div className="dropdown-menu">
                        <button className="dropdown-btn" onClick={handleLogout}>Logout</button>
                    </div>
                )}
            </div>
        </div>
    );
}
