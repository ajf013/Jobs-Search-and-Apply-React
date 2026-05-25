import React, { useState } from 'react';
import { Card, Form, Button, TextArea, Icon, Message } from 'semantic-ui-react';
import './ResumeMatcher.css';

export default function ResumeMatcher({ resumeText, onResumeChange }) {
  const [inputText, setInputText] = useState(resumeText || '');
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onResumeChange(inputText);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  const handleClear = () => {
    setInputText('');
    onResumeChange('');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      setInputText(text);
      onResumeChange(text);
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
    };
    reader.readAsText(file);
  };

  return (
    <Card className="glass-panel w-100 mb-4 resume-matcher-card" data-aos="fade-down">
      <Card.Content>
        <Card.Header className="text-white d-flex align-items-center mb-2">
          <Icon name="file alternate outline" className="mr-2 text-cyan" /> 
          Local Resume Matcher (Tailoring Helper)
        </Card.Header>
        <Card.Description className="text-white-70 mb-3">
          Paste your resume skills/details or upload a <code>.txt</code> file. The app will locally score each job card based on overlapping terms, helping you tailor your applications in real-time.
        </Card.Description>

        <Form onSubmit={handleSubmit}>
          <Form.Field>
            <TextArea
              rows={4}
              placeholder="Paste your resume content, list of skills, or previous job titles here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="glass-textarea"
            />
          </Form.Field>
          
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <Button 
                primary 
                type="submit" 
                disabled={!inputText.trim()}
                className="btn-cyan-gradient"
              >
                <Icon name="check" /> Apply Resume
              </Button>
              {resumeText && (
                <Button 
                  color="red" 
                  basic 
                  onClick={handleClear}
                  type="button"
                >
                  Clear
                </Button>
              )}
            </div>

            <Button as="label" htmlFor="resume-upload" className="btn-upload-glass" type="button">
              <Icon name="upload" /> Upload .txt Resume
              <input 
                type="file" 
                id="resume-upload" 
                hidden 
                accept=".txt" 
                onChange={handleFileUpload} 
              />
            </Button>
          </div>
        </Form>

        {successMsg && (
          <Message positive size="mini" className="mt-3 success-glass">
            <Message.Header>Resume Updated!</Message.Header>
            <p>Your resume keywords have been loaded. Job match percentages will update automatically below.</p>
          </Message>
        )}
      </Card.Content>
    </Card>
  );
}
