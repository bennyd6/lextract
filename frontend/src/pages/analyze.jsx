import React, { useState, useRef, useEffect } from 'react';
import './analyze.css';
import su from '../assets/submit.png';
import d from '../assets/download.png';
import e from '../assets/email.png';
import c from '../assets/chatbot.png';
import { useTranslation } from 'react-i18next';
import axios from 'axios';


export default function Analyze() {
    const [image, setImage] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [currentStage, setCurrentStage] = useState(-1);
    const [resultJson, setResultJson] = useState(null);
    const [animateTitle, setAnimateTitle] = useState(false);
    const { t } = useTranslation();


    const inputRef = useRef(null);

    const stages = ['Extracting', 'Detecting', 'Parsing', 'Structuring', 'Analyzing'];

    useEffect(() => {
        setAnimateTitle(true);
    }, []);

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            setImage(URL.createObjectURL(file));
        }
    };

    const handleDragOver = (e) => e.preventDefault();
    const handleClick = () => inputRef.current.click();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setImage(URL.createObjectURL(file));
        }
    };

    const handleClear = () => {
        setImage(null);
        inputRef.current.value = null;
        setAnalyzing(false);
        setCurrentStage(-1);
        setResultJson(null);
    };

    const handleAnalyze = async () => {
        setAnalyzing(true);
        setCurrentStage(0);
        let stageIndex = 0;

        const interval = setInterval(() => {
            stageIndex++;
            if (stageIndex < stages.length) {
                setCurrentStage(stageIndex);
            } else {
                clearInterval(interval);
            }
        }, 1400);

        setTimeout(async () => {
            const fileInput = inputRef.current;
            const file = fileInput.files[0];
            const formData = new FormData();
            formData.append('file', file);

            try {
                const res = await fetch("http://localhost:5000/analyze", {
                    method: "POST",
                    body: formData,
                });
                const data = await res.json();
                setResultJson(data.json);
            } catch (error) {
                console.error("Error analyzing image:", error);
                setResultJson("Something went wrong. Try again.");
            }
        }, 1000);
    };
    const handleDownload = () => {
        if (!resultJson) return;
        
        let dataToExport;
        
        try {
            const cleaned =
                typeof resultJson === 'string'
                    ? resultJson.replace(/json|```/g, '').trim()
                    : JSON.stringify(resultJson);
    
            dataToExport = JSON.parse(cleaned);
        } catch (err) {
            console.error("Failed to parse JSON:", err);
            return;
        }
    
        // Create a simple CSV from key-value pairs
        const rows = [
            ['Field', 'Value'],
            ['Client Name', dataToExport['Client name'] || 'N/A'],
            ['PAN', dataToExport['PII data']?.PAN?.join(', ') || 'N/A'],
            ['AADHAAR', dataToExport['PII data']?.AADHAAR?.join(', ') || 'N/A'],
            ['GSTIN', dataToExport['PII data']?.GSTIN?.join(', ') || 'N/A'],
            ['Nature of Notice', dataToExport['Nature of notice'] || 'N/A'],
            ['Deadlines and Penalties', dataToExport['Deadlines and penalties'] || 'N/A'],
            ['Reporting Officer/Office', dataToExport['Reporting officer/office'] || 'N/A'],
            ['Relevant Legal Sections', dataToExport['Relevant legal sections'] || 'N/A'],
        ];
    
        const csvContent = rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
        
        // Create a blob and trigger download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'analyzed_data.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const handleChat = () => {
        window.location.href = '/chat';
    }
    
    const handleEmail = async () => {
        if (!resultJson) return;
    
        try {
            const token = localStorage.getItem('token'); // Make sure your token is stored in localStorage or wherever you're keeping it
    
            const cleaned =
                typeof resultJson === 'string'
                    ? resultJson.replace(/json|```/g, '').trim()
                    : JSON.stringify(resultJson);
    
            const parsedData = JSON.parse(cleaned);
    
            const response = await axios.post(
                'http://localhost:3000/api/auth/msg',
                { data: parsedData },
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );
    
            alert('📧 Email sent successfully!');
        } catch (error) {
            console.error('Error sending email:', error.message);
            alert('❌ Failed to send email');
        }
    };
    

    return (
        <div className="analyze-main">
            <div className="a-top">
                <div className={`hero-title ${animateTitle ? 'animate' : ''}`}>
                    <h1>Document Analysis</h1>
                    {/* <p className="tagline">Extract structured data from legal documents in multiple languages</p> */}
                </div>
            </div>

            <div className={`a-1-wrapper ${image ? 'uploaded' : ''}`}>
                <div
                    className={`a-1 ${image ? 'shrink-left' : ''}`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={!image ? handleClick : undefined}
                >
                    {image ? (
                        <img src={image} alt="Uploaded Preview" className="preview-img" />
                    ) : (
                        <>
                            <div className="a-1-1">
                                <img src={su} alt="upload-icon" />
                            </div>
                            <div className="divider"></div>
                            <div className="a-1-2">
                            <p>{t('documentAnalysis.imageUpload.dragDrop')}</p>
                            <p>{t('documentAnalysis.imageUpload.clickToUpload')}</p>
                            </div>
                        </>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        ref={inputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                </div>

                {image && (
                    <div className="button-group">
                        <button className="action-btn analyze" onClick={handleAnalyze}>
                            <span>Analyze Image</span>
                            {/* <img src={su} alt="analyze" className="btn-icon" /> */}
                        </button>
                        <button className="action-btn clear" onClick={handleClear}>
                            <span>Clear Image</span>
                        </button>
                    </div>
                )}
            </div>

            {analyzing && (
                <div className="a-2">
                    <div className="stage-progress">
                        {stages.map((stage, index) => (
                            <div
                                key={index}
                                className={`stage ${index === currentStage ? 'active' : index < currentStage ? 'done' : ''}`}
                            >
                                <div className="dot"></div>
                                <span className="label">{stage}</span>
                            </div>
                        ))}
                        <div className="progress-line">
                            <div
                                className="line-fill"
                                style={{ width: `${((currentStage + 1) / stages.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            )}

            {resultJson && (
                <>
                    <div className="a-3">
                        <h3>Extracted Information</h3>
                        {(() => {
                            try {
                                const cleaned = typeof resultJson === 'string'
                                    ? resultJson.replace(/json|```/g, '').trim()
                                    : JSON.stringify(resultJson);

                                const data = JSON.parse(cleaned);

                                return (
                                    <table className="structured-table">
    <tbody>
        {Object.entries(data).map(([key, value]) => (
            <tr key={key}>
                <th>{key}</th>
                <td>
                    {typeof value === 'object' && value !== null
                        ? Array.isArray(value)
                            ? value.join(', ')
                            : Object.entries(value).map(([subKey, subVal]) => (
                                <div key={subKey}>
                                    <strong>{subKey}:</strong> {Array.isArray(subVal) ? subVal.join(', ') : subVal || 'N/A'}
                                </div>
                              ))
                        : value || 'N/A'
                    }
                </td>
            </tr>
        ))}
    </tbody>
</table>
                                );
                            } catch (error) {
                                return <p style={{ color: 'red' }}>Error Analyzing the Document: {error.message}</p>;
                            }
                        })()}
                    </div>
                    <div className="a-4">
                        <img src={d} alt="Download results" title="Download results" onClick={handleDownload}/>
                        <img src={e} alt="Email results" title="Email results" onClick={handleEmail} />
                        <img src={c} alt="Chat with AI" title="Chat with AI" onClick={handleChat}/>
                    </div>
                </>
            )}
        </div>
    );
}
