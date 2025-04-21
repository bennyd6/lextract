import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';  // Import the useTranslation hook
import './navbar.css';

export default function Navbar() {
    const [userName, setUserName] = useState('User');
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [languageDropdownVisible, setLanguageDropdownVisible] = useState(false);  // For language dropdown visibility
    const dropdownRef = useRef(null);
    const location = useLocation();
    const { i18n } = useTranslation();  // Hook to access i18n for language change

    // Fetch user name from backend
    const fetchUser = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        try {
            const response = await fetch('https://lextract-1.onrender.com/api/auth/getuser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({})
            });

            if (!response.ok) throw new Error('Failed to fetch user');

            const data = await response.json();
            setUserName(data || 'User');
        } catch (error) {
            console.error('Error fetching user:', error.message);
            setUserName('Error');
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    // Scroll effect
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Hide dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    // Handle language change
    const handleLanguageChange = (lang) => {
        i18n.changeLanguage(lang);  // Change the language
        setLanguageDropdownVisible(false); // Hide dropdown after selecting a language
    };

    return (
        <div className={`nav-main ${scrolled ? 'nav-scrolled' : ''}`}>
            <a href="/" className="logo">lextract .</a>
            <a href="/" className={location.pathname === "/" ? "active-link" : ""}>Home</a>
            <Link to="/analyze" className={location.pathname === "/analyze" ? "active-link" : ""}>Analyze</Link>

            <div className="user-dropdown" onClick={() => setDropdownVisible(!dropdownVisible)} ref={dropdownRef}>
                <span>{userName}</span>
                {dropdownVisible && (
                    <div className="dropdown-menu">
                        <button className="dropdown-btn" onClick={handleLogout}>Logout</button>
                    </div>
                )}
            </div>

            {/* Language Switcher Dropdown */}
            <div className="language-switcher" onClick={() => setLanguageDropdownVisible(!languageDropdownVisible)}>
                <span>Language</span>
                {languageDropdownVisible && (
                    <div className="language-dropdown-menu">
                        <button onClick={() => handleLanguageChange('en')}>English</button>
                        <button onClick={() => handleLanguageChange('hi')}>हिंदी</button>
                        <button onClick={() => handleLanguageChange('te')}>తెలుగు</button>
                        <button onClick={() => handleLanguageChange('ta')}>தமிழ்</button>
                        <button onClick={() => handleLanguageChange('kn')}>ಕನ್ನಡ</button>
                        <button onClick={() => handleLanguageChange('bn')}>বাংলা</button>
                    </div>
                )}
            </div>
        </div>
    );
}
