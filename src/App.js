import React, { useState } from 'react';
import './App.css'; // قم بإنشاء هذا الملف لتنسيق CSS

function App() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadFile = async () => {
    if (!file) {
      setStatus('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setStatus(`File translated successfully! Download: ${result.file}`);
      } else {
        setStatus(`Error: ${result.error}`);
      }
    } catch (error) {
      setStatus('Error uploading file');
      console.error('Error:', error);
    }
  };

  return (
    <div className="App">
      <h1>ترجمة بالذكاء</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadFile}>رفع وترجمة</button>
      <p>{status}</p>
    </div>
  );
}

export default App;
