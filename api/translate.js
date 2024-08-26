const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { Translate } = require('@google-cloud/translate').v2;

const app = express();
const upload = multer({ dest: 'uploads/' });
const translate = new Translate();

app.post('/api/translate', upload.single('file'), async (req, res) => {
  if (!req.file || path.extname(req.file.originalname) !== '.srt') {
    return res.status(400).json({ error: 'Invalid file format' });
  }

  const filePath = path.join(__dirname, req.file.path);
  const outputFilePath = path.join(__dirname, 'translated', `translated_${req.file.originalname}`);
  
  fs.readFile(filePath, 'utf8', async (err, data) => {
    if (err) return res.status(500).json({ error: 'Error reading file' });

    const lines = data.split('\n');
    const translatedLines = [];

    for (const line of lines) {
      if (line.trim() && !line.match(/^\d+$/)) {
        const [translation] = await translate.translate(line, 'ar');
        translatedLines.push(translation);
      } else {
        translatedLines.push(line);
      }
    }

    fs.writeFile(outputFilePath, translatedLines.join('\n'), (err) => {
      if (err) return res.status(500).json({ error: 'Error writing file' });

      res.json({ file: `/${outputFilePath}` });
    });
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
