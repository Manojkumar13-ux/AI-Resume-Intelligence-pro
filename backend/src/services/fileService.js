import fs from 'fs';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export const extractTextFromFile = async (filePath, mimetype) => {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    let text = '';

    if (mimetype === 'application/pdf' || filePath.endsWith('.pdf')) {
      const data = await pdfParse(fileBuffer);
      text = data.text;
    } else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
               filePath.endsWith('.docx')) {
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      text = result.value;
    } else {
      text = fileBuffer.toString('utf-8');
    }

    return text;
  } catch (error) {
    console.error('Error extracting text:', error);
    throw new Error('Failed to extract text from file');
  }
};

export const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};