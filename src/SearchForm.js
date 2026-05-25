import React from 'react';
import { Form, Col, Button } from 'react-bootstrap';
import { Icon } from 'semantic-ui-react';
import useTypewriter from './useTypewriter';

const countries = [
  { code: 'in', label: '🇮🇳 India' },
  { code: 'us', label: '🇺🇸 United States' },
  { code: 'gb', label: '🇬🇧 United Kingdom' },
  { code: 'ca', label: '🇨🇦 Canada' },
  { code: 'au', label: '🇦🇺 Australia' },
  { code: 'de', label: '🇩🇪 Germany' },
  { code: 'fr', label: '🇫🇷 France' }
];

export default function SearchForm({ params, onParamChange, showResumePanel, onToggleResumePanel }) {
  const rolePlaceholder = useTypewriter(['Software Engineer', 'Full Stack Developer', 'Data Scientist', 'Designer', 'Cloud Engineer']);

  return (
    <Form className="mb-4 search-form-glass" data-aos="fade-down">
      <Form.Row className="align-items-end">
        {/* Role Search */}
        <Form.Group as={Col} md={4} sm={6} xs={12}>
          <Form.Label className="glass-label">Job Role / Expertise</Form.Label>
          <Form.Control
            onChange={onParamChange}
            value={params.description || ''}
            name="description"
            type="text"
            placeholder={rolePlaceholder}
            className="glass-input"
          />
        </Form.Group>

        {/* Location Search */}
        <Form.Group as={Col} md={3} sm={6} xs={12}>
          <Form.Label className="glass-label">Location</Form.Label>
          <Form.Control
            onChange={onParamChange}
            value={params.location || ''}
            name="location"
            type="text"
            placeholder="e.g. Chennai, Remote"
            className="glass-input"
          />
        </Form.Group>

        {/* Country Selector */}
        <Form.Group as={Col} md={2} sm={4} xs={6}>
          <Form.Label className="glass-label">Country</Form.Label>
          <Form.Control
            as="select"
            onChange={onParamChange}
            value={params.country || 'in'}
            name="country"
            className="glass-input glass-select"
          >
            {countries.map(c => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        {/* Minimum Salary */}
        <Form.Group as={Col} md={2} sm={4} xs={6}>
          <Form.Label className="glass-label">Min Salary</Form.Label>
          <Form.Control
            onChange={onParamChange}
            value={params.salary_min || ''}
            name="salary_min"
            type="number"
            placeholder="Min Salary"
            className="glass-input"
          />
        </Form.Group>

        {/* Full-time Checkbox */}
        <Form.Group as={Col} md={1} sm={4} xs={12} className="text-center">
          <Form.Check 
            onChange={onParamChange} 
            checked={!!params.full_time} 
            name="full_time" 
            id="full-time" 
            label="Full Time" 
            type="checkbox" 
            className="mb-2 glass-checkbox text-white font-weight-bold" 
          />
        </Form.Group>
      </Form.Row>

      <Form.Row className="align-items-center mt-3 pt-3 border-top-glass-thin justify-content-between flex-wrap gap-2">
        <Col md="auto" xs={12} className="d-flex align-items-center gap-3">
          {/* Sort selection */}
          <div className="d-flex align-items-center sort-select-container">
            <span className="text-white-60 mr-2 font-size-small"><Icon name="sort" /> Sort:</span>
            <Form.Control
              as="select"
              onChange={onParamChange}
              value={params.sort_by || 'relevance'}
              name="sort_by"
              className="glass-input-small glass-select"
            >
              <option value="relevance">Relevance</option>
              <option value="date">Date Published</option>
            </Form.Control>
          </div>
        </Col>

        <Col md="auto" xs={12} className="text-right">
          <Button 
            variant="link" 
            onClick={onToggleResumePanel}
            className={`btn-resume-toggle ${showResumePanel ? 'active' : ''}`}
          >
            <Icon name="file alternate" /> {showResumePanel ? 'Hide Resume panel' : 'Upload Resume for Match Score'}
          </Button>
        </Col>
      </Form.Row>
    </Form>
  );
}
