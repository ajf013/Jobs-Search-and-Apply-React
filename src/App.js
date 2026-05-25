import React, { useState, useEffect } from 'react';
import useFetchJobs from './useFetchJobs';
import { Container, Button } from 'react-bootstrap';
import Job from './Job';
import SearchForm from './SearchForm';
import Footer from './Footer/Footer';
import SplashScreen from './SplashScreen/SplashScreen';
import SearchInsights from './Insights/SearchInsights';
import ResumeMatcher from './Matcher/ResumeMatcher';
import SavedJobsTracker from './Tracker/SavedJobsTracker';
import { Icon } from 'semantic-ui-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './App.css';

function App() {
  const [params, setParams] = useState({ country: 'in', sort_by: 'relevance' });
  const [page, setPage] = useState(1);
  const { jobs, loading, error, hasNextPage } = useFetchJobs(params, page);

  // Client-side relevance sorting: rank exact title matches higher
  const sortedJobs = React.useMemo(() => {
    if (!jobs || jobs.length === 0) return [];
    if (!params.description) return jobs;
    const query = params.description.toLowerCase().trim();
    if (!query) return jobs;

    return [...jobs].sort((a, b) => {
      const aTitleMatch = a.title.toLowerCase().includes(query);
      const bTitleMatch = b.title.toLowerCase().includes(query);
      if (aTitleMatch && !bTitleMatch) return -1;
      if (!aTitleMatch && bTitleMatch) return 1;
      return 0;
    });
  }, [jobs, params.description]);
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('search'); // 'search' | 'tracker' | 'ats'
  const [showResumePanel, setShowResumePanel] = useState(false);

  // Load Saved Jobs state from LocalStorage
  const [savedJobs, setSavedJobs] = useState(() => {
    const saved = localStorage.getItem('saved_jobs');
    return saved ? JSON.parse(saved) : [];
  });

  // Load user resume text state from LocalStorage
  const [resumeText, setResumeText] = useState(() => {
    return localStorage.getItem('user_resume') || '';
  });

  // Dark mode state: default to system preference
  const [darkMode, setDarkMode] = useState(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });

    // Hide splash screen after 3 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Apply theme class to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
    }
  }, [darkMode]);

  // Refresh AOS animations when jobs, tab, or panels toggle
  useEffect(() => {
    if (!showSplash) {
      const timer = setTimeout(() => {
        AOS.refresh();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [jobs, loading, activeTab, showSplash, showResumePanel]);

  // Sync saved jobs list to LocalStorage
  useEffect(() => {
    localStorage.setItem('saved_jobs', JSON.stringify(savedJobs));
  }, [savedJobs]);

  // Sync resume text to LocalStorage
  useEffect(() => {
    localStorage.setItem('user_resume', resumeText);
  }, [resumeText]);

  function handleParamChange(e) {
    const target = e.target;
    const name = target.name;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    
    setPage(1);
    setParams(prevParams => {
      return { ...prevParams, [name]: value };
    });
  }

  const handleToggleSave = (job) => {
    setSavedJobs(prev => {
      const isAlreadySaved = prev.some(sj => sj.id === job.id);
      if (isAlreadySaved) {
        return prev.filter(sj => sj.id !== job.id);
      } else {
        const newSave = {
          ...job,
          bookmarkedAt: new Date().toISOString(),
          status: 'Bookmarked',
          notes: ''
        };
        return [...prev, newSave];
      }
    });
  };

  const handleUpdateJobStatus = (id, status) => {
    setSavedJobs(prev => prev.map(job => job.id === id ? { ...job, status } : job));
  };

  const handleUpdateJobNotes = (id, notes) => {
    setSavedJobs(prev => prev.map(job => job.id === id ? { ...job, notes } : job));
  };

  const handleRemoveJob = (id) => {
    setSavedJobs(prev => prev.filter(job => job.id !== id));
  };

  return (
    <div>
      {showSplash ? (
        <SplashScreen />
      ) : (
        <>
          {/* Theme Toggle */}
          <button
            className="theme-toggle"
            onClick={() => setDarkMode(prev => !prev)}
            aria-label="Toggle Theme"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          <Container className="my-4 main-portal-container">
            <h1 className="mb-2 text-center header-title">Jobs Portal</h1>
            <p className="text-center text-white-60 mb-4 subtitle-desc">Find, analyze, and track your next career move</p>

            {/* Glassmorphic Tabs Navigation */}
            <div className="nav-tabs-glass mb-4 d-flex justify-content-center gap-3">
              <button 
                className={`nav-tab-btn ${activeTab === 'search' ? 'active' : ''}`}
                onClick={() => setActiveTab('search')}
              >
                <Icon name="search" /> Find Jobs
              </button>
              <button 
                className={`nav-tab-btn ${activeTab === 'tracker' ? 'active' : ''}`}
                onClick={() => setActiveTab('tracker')}
              >
                <Icon name="bookmark" /> Saved Tracker
              </button>
              <button 
                className={`nav-tab-btn ${activeTab === 'ats' ? 'active' : ''}`}
                onClick={() => setActiveTab('ats')}
              >
                <Icon name="sliders" /> ATS Analyzer
              </button>
            </div>

            {/* SEARCH VIEW */}
            {activeTab === 'search' && (
              <div className="tab-pane-view">
                <SearchForm 
                  params={params} 
                  onParamChange={handleParamChange} 
                  showResumePanel={showResumePanel}
                  onToggleResumePanel={() => setShowResumePanel(p => !p)}
                />

                {showResumePanel && (
                  <ResumeMatcher 
                    resumeText={resumeText} 
                    onResumeChange={setResumeText} 
                  />
                )}

                {/* Search Insights / Statistics */}
                {!loading && !error && jobs.length > 0 && (
                  <SearchInsights jobs={jobs} country={params.country || 'in'} darkMode={darkMode} />
                )}

                {loading && page === 1 && <h1 className="loading"><Icon loading name="spinner" /> Loading Jobs...</h1>}
                {error && <h1 className="error"><Icon name="warning sign" /> Error. Try Refreshing.</h1>}
                
                <div className="job-cards-list mt-3">
                  {sortedJobs.map(job => {
                    const isSaved = savedJobs.some(sj => sj.id === job.id);
                    return (
                      <Job 
                        key={job.id} 
                        job={job} 
                        isSaved={isSaved}
                        onToggleSave={handleToggleSave}
                        resumeText={resumeText}
                      />
                    );
                  })}
                  {!loading && !error && jobs.length === 0 && (
                    <div className="text-center mt-5 no-results-box p-5">
                      <Icon name="search minus" size="huge" className="text-white-40 mb-3" />
                      <h3 className="text-white">No jobs found</h3>
                      <p className="text-white-60">Try adjusting your keywords, location, or dynamic filters.</p>
                    </div>
                  )}
                </div>

                {/* Loading indicator for load-more actions */}
                {loading && page > 1 && (
                  <div className="text-center my-4 py-3">
                    <h3 className="text-cyan"><Icon loading name="spinner" /> Loading more jobs...</h3>
                  </div>
                )}

                {/* Load More Button */}
                {!loading && hasNextPage && jobs.length > 0 && (
                  <div className="text-center my-4 py-3">
                    <Button 
                      onClick={() => setPage(prev => prev + 1)}
                      className="btn-cyan-gradient px-5 py-3"
                    >
                      <Icon name="plus" /> Load More Jobs
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* TRACKER VIEW */}
            {activeTab === 'tracker' && (
              <SavedJobsTracker 
                savedJobs={savedJobs}
                onUpdateJobStatus={handleUpdateJobStatus}
                onUpdateJobNotes={handleUpdateJobNotes}
                onRemoveJob={handleRemoveJob}
              />
            )}

            {/* ATS ANALYZER VIEW */}
            {activeTab === 'ats' && (
              <div className="ats-iframe-container" data-aos="fade-up">
                <iframe 
                  src="https://atsscore.fcruz.org/" 
                  title="AI Resume Analyzer"
                  className="ats-iframe"
                  sandbox="allow-scripts allow-same-origin allow-forms"
                />
              </div>
            )}
          </Container>
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;
