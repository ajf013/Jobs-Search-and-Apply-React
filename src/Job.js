import React, { useState } from 'react';
import { Card, Badge, Button, Collapse } from 'react-bootstrap';
import { Icon, Grid } from 'semantic-ui-react';
import ReactMarkdown from 'react-markdown';
import { calculateMatchScore } from './Matcher/matchAlgorithm';

export default function Job({ job, isSaved, onToggleSave, resumeText }) {
  const [open, setOpen] = useState(false);

  const getLogo = () => {
    if (job.company_url) {
      try {
        const url = new URL(job.company_url);
        return `https://logo.clearbit.com/${url.hostname}`;
      } catch (e) {
        return 'https://img.icons8.com/color/48/000000/office.png';
      }
    }
    return 'https://img.icons8.com/color/48/000000/office.png';
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${job.title} at ${job.company}`,
          text: `Check out this job opportunity for ${job.title} in ${job.location}!`,
          url: job.url
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(job.url);
      alert('Job URL copied to clipboard!');
    }
  };

  const formatSalary = (min, max, country) => {
    if (!min && !max) return null;
    let symbol = '₹';
    let locale = 'en-IN';
    switch ((country || 'in').toLowerCase()) {
      case 'us': symbol = '$'; locale = 'en-US'; break;
      case 'gb': symbol = '£'; locale = 'en-GB'; break;
      case 'ca': symbol = 'C$'; locale = 'en-CA'; break;
      case 'au': symbol = 'A$'; locale = 'en-AU'; break;
      case 'de': symbol = '€'; locale = 'de-DE'; break;
      case 'fr': symbol = '€'; locale = 'fr-FR'; break;
      default: symbol = '₹'; locale = 'en-IN'; break;
    }
    const formatNum = (num) => `${symbol}${Math.round(num).toLocaleString(locale)}`;

    if (min && max) {
      if (min === max) return formatNum(min);
      return `${formatNum(min)} - ${formatNum(max)}`;
    }
    if (min) return `From ${formatNum(min)}`;
    return `Up to ${formatNum(max)}`;
  };

  const matchDetails = resumeText ? calculateMatchScore(resumeText, job.description) : null;

  const getMatchColorClass = (score) => {
    if (score >= 75) return 'match-high';
    if (score >= 40) return 'match-medium';
    return 'match-low';
  };

  return (
    <Card className="mb-3 glass-panel job-card" data-aos="fade-up">
      <Card.Body>
        {/* Resume Match Score Header Banner */}
        {matchDetails && (
          <div className={`match-banner ${getMatchColorClass(matchDetails.score)} mb-3`}>
            <Icon name="rocket" /> <strong>Resume Fit Score:</strong> {matchDetails.score}% Match
          </div>
        )}

        <div className="d-flex justify-content-between align-items-start">
          <div className="flex-grow-1">
            <Card.Title className="job-card-title d-flex align-items-center flex-wrap gap-2 text-white font-weight-bold">
              {job.title}
              <span className="company-text text-cyan ml-2">@ {job.company}</span>
            </Card.Title>
            
            <Card.Subtitle className="text-white-60 mb-3 d-flex align-items-center flex-wrap gap-3 font-size-small">
              <span><Icon name="calendar alternate outline" /> {new Date(job.created_at).toLocaleDateString()}</span>
              <span><Icon name="map marker alternate" /> {job.location}</span>
              {formatSalary(job.salary_min, job.salary_max, job.country) && (
                <span className="text-green font-weight-bold">
                  <Icon name="money bill alternate outline" /> {formatSalary(job.salary_min, job.salary_max, job.country)}
                </span>
              )}
            </Card.Subtitle>

            <div className="mb-3 d-flex gap-2 align-items-center">
              <Badge variant="info" className="badge-glass px-3 py-2 mr-2">{job.type}</Badge>
              <Badge variant="secondary" className="badge-glass-location px-3 py-2">{job.location.split(',')[0]}</Badge>
            </div>
            
            <div style={{ wordBreak: 'break-all' }} className="how-to-apply-area mb-3 text-white-80">
              <ReactMarkdown source={job.how_to_apply} escapeHtml={false} />
            </div>
          </div>

          <div className="d-flex flex-column align-items-center ml-3 logo-bookmark-container">
            <img
              className="d-none d-md-block company-logo-img mb-3"
              height="50"
              width="50"
              alt={`${job.company} logo`}
              src={getLogo()}
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://img.icons8.com/color/48/000000/office.png'; }}
            />
            
            <div className="action-buttons-stack d-flex gap-2">
              <Button 
                variant="link" 
                onClick={(e) => { e.stopPropagation(); onToggleSave(job); }} 
                className={`bookmark-btn p-1 ${isSaved ? 'text-yellow' : 'text-white-40'}`}
                aria-label={isSaved ? "Remove bookmark" : "Add bookmark"}
              >
                <Icon name={isSaved ? "star" : "star outline"} size="large" />
              </Button>

              <Button 
                variant="link" 
                onClick={handleShare} 
                className="share-btn p-1 text-white-60"
                aria-label="Share Job Link"
              >
                <Icon name="share alternate" size="large" />
              </Button>
            </div>
          </div>
        </div>

        <Card.Text className="mt-3">
          <Button
            onClick={() => setOpen(prevOpen => !prevOpen)}
            className="btn-details-glass"
          >
            {open ? 'Hide Details' : 'View Details'}
          </Button>
        </Card.Text>

        <Collapse in={open}>
          <div className="mt-4 details-drawer border-top-glass pt-3 text-white-90">
            {matchDetails && (
              <div className="match-keyword-breakdown mb-4 p-3 rounded bg-glass-small border-glass">
                <h5 className="text-white mb-2"><Icon name="sliders" /> Keyword Analysis</h5>
                <Grid stackable columns={2}>
                  <Grid.Row>
                    <Grid.Column className="mb-2">
                      <strong className="text-green d-block mb-1"><Icon name="check circle" /> Matched Skills</strong>
                      {matchDetails.matchedKeywords.length > 0 ? (
                        <div className="d-flex flex-wrap gap-1 mt-1">
                          {matchDetails.matchedKeywords.map(kw => (
                            <Badge key={kw} variant="success" className="mr-1 mb-1 font-weight-normal px-2 py-1">{kw}</Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-white-40 font-size-small italic">No matching keywords found yet.</span>
                      )}
                    </Grid.Column>
                    <Grid.Column>
                      <strong className="text-orange d-block mb-1"><Icon name="warning sign" /> Suggested Key Terms</strong>
                      {matchDetails.missingKeywords.length > 0 ? (
                        <div className="d-flex flex-wrap gap-1 mt-1">
                          {matchDetails.missingKeywords.map(kw => (
                            <Badge key={kw} variant="warning" className="mr-1 mb-1 font-weight-normal px-2 py-1">{kw}</Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-white-40 font-size-small italic">Excellent! You cover the major tech keywords.</span>
                      )}
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </div>
            )}
            
            <h5 className="text-white"><Icon name="align left" /> Job Description</h5>
            <div className="markdown-desc">
              <ReactMarkdown source={job.description} escapeHtml={false} />
            </div>
          </div>
        </Collapse>
      </Card.Body>
    </Card>
  );
}
