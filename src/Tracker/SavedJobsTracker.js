import React, { useState } from 'react';
import { Card, Button, Dropdown, Form, TextArea, Icon } from 'semantic-ui-react';
import './SavedJobsTracker.css';

const statusOptions = [
  { key: 'bookmarked', text: 'Bookmarked ⭐️', value: 'Bookmarked', label: { color: 'grey', empty: true, circular: true } },
  { key: 'applied', text: 'Applied 📨', value: 'Applied', label: { color: 'blue', empty: true, circular: true } },
  { key: 'interviewing', text: 'Interviewing 👥', value: 'Interviewing', label: { color: 'orange', empty: true, circular: true } },
  { key: 'offer', text: 'Offer Received 🎉', value: 'Offer Received', label: { color: 'green', empty: true, circular: true } },
  { key: 'rejected', text: 'Rejected ❌', value: 'Rejected', label: { color: 'red', empty: true, circular: true } }
];

export default function SavedJobsTracker({ savedJobs, onUpdateJobStatus, onUpdateJobNotes, onRemoveJob }) {
  const [activeNotesId, setActiveNotesId] = useState(null);
  const [tempNotesText, setTempNotesText] = useState('');

  const handleNotesEditStart = (id, currentNotes) => {
    setActiveNotesId(id);
    setTempNotesText(currentNotes || '');
  };

  const handleNotesSave = (id) => {
    onUpdateJobNotes(id, tempNotesText);
    setActiveNotesId(null);
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Applied': return 'blue';
      case 'Interviewing': return 'orange';
      case 'Offer Received': return 'green';
      case 'Rejected': return 'red';
      default: return 'grey';
    }
  };

  if (!savedJobs || savedJobs.length === 0) {
    return (
      <div className="empty-tracker text-center mt-5" data-aos="fade-up">
        <Icon name="bookmark outline" size="massive" className="text-white-40 mb-4" />
        <h2 className="text-white">Your Job Hunt Tracker is Empty</h2>
        <p className="text-white-60 max-w-500 mx-auto">
          Navigate to the <strong>Find Jobs</strong> tab, search for listings, and click the star icon on any card to save it here and track your application progress.
        </p>
      </div>
    );
  }

  return (
    <div className="tracker-container" data-aos="fade-up">
      <h2 className="text-white mb-4 d-flex align-items-center">
        <Icon name="bookmark" color="teal" className="mr-2" /> 
        Job Hunt Tracker ({savedJobs.length} Saved)
      </h2>

      <div className="saved-jobs-grid">
        {savedJobs.map(job => (
          <Card key={job.id} className="glass-panel w-100 mb-4 tracker-job-card">
            <Card.Content>
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
                <div>
                  <Card.Header className="text-white font-weight-bold" style={{ fontSize: '1.25rem' }}>
                    {job.title}
                  </Card.Header>
                  <Card.Meta className="text-white-60 mt-1">
                    <Icon name="building" /> {job.company} | <Icon name="map marker alternate" /> {job.location}
                  </Card.Meta>
                </div>
                
                <div className="d-flex align-items-center gap-2">
                  <Dropdown
                    inline
                    options={statusOptions}
                    value={job.status || 'Bookmarked'}
                    onChange={(_, { value }) => onUpdateJobStatus(job.id, value)}
                    className={`status-dropdown status-badge-${getStatusBadgeColor(job.status || 'Bookmarked')}`}
                  />
                  <Button 
                    icon 
                    color="red" 
                    basic 
                    size="small" 
                    onClick={() => onRemoveJob(job.id)}
                    title="Remove Bookmark"
                    className="btn-delete"
                  >
                    <Icon name="trash" />
                  </Button>
                </div>
              </div>

              <div className="text-white-80 my-3 font-size-small">
                <strong>Saved on:</strong> {new Date(job.bookmarkedAt).toLocaleDateString()}
              </div>

              {job.redirect_url && (
                <div className="my-3">
                  <a href={job.redirect_url} target="_blank" rel="noopener noreferrer" className="btn-apply-direct">
                    Apply on Adzuna <Icon name="external alternate" size="small" />
                  </a>
                </div>
              )}

              {/* Notes Area */}
              <div className="notes-section mt-3 pt-3 border-top-glass">
                {activeNotesId === job.id ? (
                  <Form onSubmit={() => handleNotesSave(job.id)}>
                    <Form.Field>
                      <label className="text-white-70 font-weight-bold font-size-small mb-1">Application Notes</label>
                      <TextArea
                        rows={2}
                        value={tempNotesText}
                        onChange={(e) => setTempNotesText(e.target.value)}
                        placeholder="Add details like contact person, interview times, or application logs..."
                        className="glass-textarea"
                      />
                    </Form.Field>
                    <div className="mt-2 d-flex gap-2">
                      <Button positive size="mini" type="submit">Save Notes</Button>
                      <Button basic inverted size="mini" type="button" onClick={() => setActiveNotesId(null)}>Cancel</Button>
                    </div>
                  </Form>
                ) : (
                  <div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-white-70 font-weight-bold font-size-small">
                        <Icon name="sticky note outline" /> Notes
                      </span>
                      <Button 
                        size="mini" 
                        basic 
                        inverted 
                        onClick={() => handleNotesEditStart(job.id, job.notes)}
                      >
                        {job.notes ? 'Edit' : 'Add Notes'}
                      </Button>
                    </div>
                    {job.notes ? (
                      <p className="text-white-80 mt-2 bg-glass-small p-2 rounded notes-preview">
                        {job.notes}
                      </p>
                    ) : (
                      <p className="text-white-40 mt-2 italic font-size-small">No notes added yet.</p>
                    )}
                  </div>
                )}
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>
    </div>
  );
}
