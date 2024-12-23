import React, { useState } from "react";
import axios from "axios";

function App() {
    const [file, setFile] = useState(null);
    const [downloadLink, setDownloadLink] = useState("");
    const [fileId, setFileId] = useState("");

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Please select a file.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post("http://localhost:5000/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setDownloadLink(response.data.fileUrl);
            setFileId(response.data.id);
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.box}>
                <h1 style={styles.title}>Linkify</h1>
                <div style={styles.uploadSection}>
                    <input type="file" onChange={handleFileChange} style={styles.fileInput} />
                    <button onClick={handleUpload} style={styles.uploadButton}>Upload</button>
                </div>
                {downloadLink && (
                    <div style={styles.resultSection}>
                        <p>
                            <strong>Download Link:</strong>{" "}
                            <a href={downloadLink} target="_blank" rel="noopener noreferrer" style={styles.link}>
                                {downloadLink}
                            </a>
                        </p>
                    </div>
                )}
                {fileId && (
                    <div style={styles.resultSection}>
                        <p><strong>File ID:</strong> {fileId}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor:"purple",
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: "Arial, sans-serif",
    },
    box: {
        
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        textAlign: "center",  
        maxWidth: "700px", 
        maxHeight: "1500px",
        backgroundColor:"white",
    },
    title: {
        fontSize: "2rem",
        color: "#333",
        marginBottom: "20px",
    },
    uploadSection: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
    },
    fileInput: {
        padding: "10px",
        fontSize: "1rem",
        border: "1px solid #ccc",
        borderRadius: "4px",
    },
    uploadButton: {
        padding: "10px 20px",
        fontSize: "1rem",
        color: "#fff",
        backgroundColor: "#6a0dad", 
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        transition: "background-color 0.3s",
    },
    uploadButtonHover: {
        backgroundColor: "#4b0082", // darker purple
    },
    resultSection: {
        marginTop: "20px",
        padding: "10px 20px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    link: {
        color: "#6a0dad",
        textDecoration: "none",
    },
};

export default App;

