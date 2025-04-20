import { Link } from 'react-router-dom';
import './home.css';
import submitIcon from '../assets/submit.png';
import { useEffect, useState } from 'react';

export default function Home() {
    const [animateDoc, setAnimateDoc] = useState(false);

    useEffect(() => {
        setAnimateDoc(true);

        const scrollHandler = () => {
            const elements = document.querySelectorAll('.animate-on-scroll');
            elements.forEach(el => {
                const rect = el.getBoundingClientRect();
                const isVisible = rect.top <= window.innerHeight * 0.8;
                if (isVisible) {
                    el.classList.add('visible');
                }
            });
        };

        window.addEventListener('scroll', scrollHandler);
        setTimeout(scrollHandler, 300);

        return () => window.removeEventListener('scroll', scrollHandler);
    }, []);

    return (
        <div className="home-main">
            <div className="hero-section">
                <div className="hero-content">
                    <h1>Lextract</h1>
                    <p className="tagline">Multilingual Legal Document Analysis Made Simple</p>
                    <p className="description">
                        Extract structured data from legal documents in multiple Indian languages.
                        Save time and eliminate language barriers in your compliance workflow.
                    </p>
                    <Link to="/analyze" className="cta-button">
                        <span>Analyze Document</span>
                        <img src={submitIcon} alt="Upload" />
                    </Link>
                </div>

                <div className={`document-illustration ${animateDoc ? 'animate' : ''}`}>
                    <div className="doc-paper">
                        <div className="doc-line"></div>
                        <div className="doc-line"></div>
                        <div className="doc-line"></div>
                        <div className="doc-line short"></div>
                        <div className="doc-highlight"></div>
                        <div className="doc-line"></div>
                        <div className="doc-line short"></div>
                        <div className="doc-highlight"></div>
                        <div className="doc-line"></div>
                    </div>
                    <div className="doc-scan-line"></div>
                </div>
            </div>

            <div className="stats-section animate-on-scroll">
                <div className="stat-item">
                    <span className="stat-number">15+</span>
                    <span className="stat-label">Languages Supported</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">98%</span>
                    <span className="stat-label">Accuracy Rate</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">75%</span>
                    <span className="stat-label">Time Saved</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">6 Seconds</span>
                    <span className="stat-label">Average Process Time</span>
                </div>
            </div>

            <div className="features-section">
                <h2>How It Works</h2>
                <div className="features-grid">
                    <div className="feature-card animate-on-scroll">
                        <div className="feature-icon upload"></div>
                        <h3>Upload</h3>
                        <p>Upload your legal document in any format — PDF, image, or scanned copy.</p>
                    </div>
                    <div className="feature-card animate-on-scroll">
                        <div className="feature-icon analyze"></div>
                        <h3>Analyze</h3>
                        <p>Our AI extracts text in multiple languages including Hindi, Telugu, Tamil, and more.</p>
                    </div>
                    <div className="feature-card animate-on-scroll">
                        <div className="feature-icon structure"></div>
                        <h3>Structure</h3>
                        <p>Get a structured breakdown of key information from your legal document.</p>
                    </div>
                </div>
            </div>

            <div className="info-section">
                <div className="info-card animate-on-scroll">
                    <h2>What We Extract</h2>
                    <ul className="extraction-list">
                        <li><span>✓</span> Client Name</li>
                        <li><span>✓</span> PII Data (PAN, GSTIN)</li>
                        <li><span>✓</span> Nature of Notice</li>
                        <li><span>✓</span> Deadlines and Penalties</li>
                        <li><span>✓</span> Reporting Officer/Office</li>
                        <li><span>✓</span> Relevant Legal Sections</li>
                    </ul>
                </div>
                <div className="info-card support-card animate-on-scroll">
                    <h2>Supported Languages</h2>
                    <div className="language-grid">
                        <span className="language-tag">English</span>
                        <span className="language-tag">Hindi</span>
                        <span className="language-tag">Telugu</span>
                        <span className="language-tag">Tamil</span>
                        <span className="language-tag">Kannada</span>
                        <span className="language-tag">Bengali</span>
                    </div>
                </div>
            </div>

            {/* <div className="testimonials-section">
                <h2>What Professionals Say</h2>
                <div className="testimonials-container">
                    <div className="testimonial-card animate-on-scroll">
                        <div className="quote-mark">"</div>
                        <p className="testimonial-text">Lextract has transformed how our firm handles multilingual tax notices. What used to take hours now takes minutes.</p>
                        <div className="testimonial-author">
                            <p className="author-name">Priya Sharma</p>
                            <p className="author-title">Tax Consultant, Delhi</p>
                        </div>
                    </div>
                    <div className="testimonial-card animate-on-scroll">
                        <div className="quote-mark">"</div>
                        <p className="testimonial-text">The accuracy with which it extracts information from Telugu documents is remarkable. A game-changer for our regional practice.</p>
                        <div className="testimonial-author">
                            <p className="author-name">Ravi Kumar</p>
                            <p className="author-title">Legal Advisor, Hyderabad</p>
                        </div>
                    </div>
                    <div className="testimonial-card animate-on-scroll">
                        <div className="quote-mark">"</div>
                        <p className="testimonial-text">I can finally process notices from multiple states without language barriers. The structured output is clear and comprehensive.</p>
                        <div className="testimonial-author">
                            <p className="author-name">Ananya Patel</p>
                            <p className="author-title">Compliance Officer, Mumbai</p>
                        </div>
                    </div>
                </div>
            </div> */}

            <div className="cta-section">
                <h2>Ready to streamline your document processing?</h2>
                <Link to="/analyze" className="cta-button-large">Get Started Now</Link>
            </div>
        </div>
    );
}
