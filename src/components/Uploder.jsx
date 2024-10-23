import { useState } from 'react';
import './Card.css'
import { motion } from 'framer-motion';
import ChatBot from './ChatBot'
import { MdCloudUpload, MdDelete } from 'react-icons/md'
import { AiFillFileImage } from 'react-icons/ai'

const Uploder = ({ reference }) => {
    const [ocrResult, setOcrResult] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [chatResponse, setChatResponse] = useState([]);
    const [userMessage, setUserMessage] = useState('');
    const [image, setImage] = useState(null);
    const [fileName, setFileName] = useState("No file selected");

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const fileInput = document.getElementById('imageFile');
        const languageSelect = document.getElementById('language');

        const formData = new FormData();
        formData.append('image', fileInput.files[0]);
        formData.append('language', languageSelect.value); // Add selected language

        try {
            const response = await fetch('http://127.0.0.1:5000/upload', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                setOcrResult(data['OCR Result'] || 'No text found');
                setTranslatedText(
                    languageSelect.value === 'en' ? data['Translated to English'] :
                        languageSelect.value === 'hi' ? data['Translated to Hindi'] :
                            languageSelect.value === 'mr' ? data['Translated to Marathi'] :
                                'No translation available'
                );
            } else {
                const errorData = await response.json();
                setOcrResult(`Error: ${errorData.error}`);
            }
        } catch (error) {
            setOcrResult(`Error: ${error.message}`);
        }
    };

    const handleChatSubmit = async () => {
        try {
            const response = await fetch('/chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: userMessage })
            });

            const data = await response.json();
            setChatResponse([...chatResponse, { user: userMessage, bot: data.response }]);
            setUserMessage(''); // Clear input
        } catch (error) {
            setChatResponse([...chatResponse, { user: userMessage, bot: `Error: ${error.message}` }]);
        }
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', margin: '20px', backgroundColor: '#f4f4f4', color: '#333', maxWidth: '100%' }}>
            <h1 style={{ textAlign: 'center' }}>Upload an Image for OCR and Translation</h1>

            {/* <form onSubmit={handleFormSubmit} style={formStyle}>
                <label htmlFor="imageFile">Choose an image:</label>
                <input type="file" id="imageFile" name="image" accept="image/*" required style={inputStyle} />

                <label htmlFor="language">Select a language for translation:</label>
                <select id="language" name="language" style={inputStyle}>
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="mr">Marathi</option>
                </select>

                <button type="submit" style={buttonStyle}>Upload and Translate</button>
            </form> */}
            <div className="container">
                <form
                    className='upload'
                    onClick={() => document.querySelector(".input-field").click()}
                >
                    <input type="file"
                        className='input-field'
                        accept='image/*'
                        hidden
                        onChange={({ target: { files } }) => {
                            // files[0] && setFileName(files[0].name)
                            // if (files) {
                            //     setImage(URL.createObjectURL(files[0]))
                            // }
                            if (files && files[0]) {
                                setFileName(files[0].name);
                                setImage(URL.createObjectURL(files[0]));
                            }
                        }}
                    />
                    {image ?
                        <img src={image} width={120} height={120} alt={fileName} />
                        :
                        <>
                            <MdCloudUpload color='blue' size={60} />
                            <p>Browse files to upload</p>
                        </>
                    }

                </form>
                <div className='uploaded-row'>
                    <AiFillFileImage color='blue' />
                    <span>
                        {fileName}
                        <MdDelete
                            onClick={() => {
                                setImage(null);
                                setFileName("No file selected");
                            }}
                        />
                    </span>
                </div>

                <label htmlFor="language">Select a language for translation:</label>
                <select id="language" name="language" style={inputStyle}>
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="mr">Marathi</option>
                </select>

                <button type="submit" style={buttonStyle}>Upload and Translate</button>
            </div>
            {/* <div id="result" style={{...resultStyle, display: 'flex'}}>
                <div className="original">
                    <h2>OCR Result:</h2>
                    <pre>{ocrResult}</pre>
                </div>
                <div className="translated">
                    <h2>Translated Text:</h2>
                    <pre>{translatedText}</pre>
                </div>
            </div> */}

            <div className='card'>
                <motion.div
                    drag
                    dragConstraints={reference}
                    whileDrag={{ scale: 1.2 }}
                    dragElastic={0.2}
                    dragTransition={{ bounceStiffness: 600, bounceDamping: 10 }}
                    className='framer'
                >
                    <div className="layout" style={{ backgroundColor: 'rgba(24, 24, 27, 0.9)', color: 'white' }}>
                        <h2>OCR Result:</h2>
                        <pre className='content'>{ocrResult}</pre>
                    </div>
                </motion.div>
                <motion.div
                    drag
                    dragConstraints={reference}
                    whileDrag={{ scale: 1.2 }}
                    dragElastic={0.2}
                    dragTransition={{ bounceStiffness: 600, bounceDamping: 10 }}
                    className='framer'
                >
                    <div className="layout" style={{ border: '2px solid black' }}>
                        <h2>Translated Text:</h2>
                        <pre className='content'>{translatedText}</pre>
                    </div>
                </motion.div>
            </div>

            <ChatBot />
            {/* <div id="chat" style={chatStyle}>
                <h2>Chatbot:</h2>
                <input
                    type="text"
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    placeholder="Type your message here..."
                    style={inputStyle}
                />
                <button onClick={handleChatSubmit} style={buttonStyle}>Send</button>
                <div id="chatResponse">
                    {chatResponse.map((chat, index) => (
                        <div key={index}>
                            <p><strong>You:</strong> {chat.user}</p>
                            <p><strong>Bot:</strong> {chat.bot}</p>
                        </div>
                    ))}
                </div>
            </div> */}
        </div>
    );
};

const formStyle = {
    maxWidth: '600px',
    margin: 'auto',
    background: 'white',
    padding: '20px',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
};

const inputStyle = {
    width: '500px',
    padding: '10px',
    margin: '10px 0',
    border: '1px solid #ddd',
    borderRadius: '5px'
};

const buttonStyle = {
    width: '500px',
    padding: '10px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '5px'
};

const resultStyle = {
    maxWidth: '600px',
    margin: '20px auto',
    padding: '10px',
    background: '#fff',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'row'
};

const chatStyle = {
    maxWidth: '600px',
    margin: '20px auto',
    padding: '10px',
    background: '#fff',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
};

export default Uploder;
