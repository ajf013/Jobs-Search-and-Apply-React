import React from 'react';
import { Card, Grid, Icon, Statistic } from 'semantic-ui-react';
import './SearchInsights.css';

export default function SearchInsights({ jobs, country, darkMode }) {
  if (!jobs || jobs.length === 0) return null;

  // Calculate salary stats
  const salaries = jobs
    .map(job => (job.salary_min + (job.salary_max || job.salary_min)) / 2)
    .filter(val => !isNaN(val) && val > 0);

  const avgSalary = salaries.length > 0
    ? Math.round(salaries.reduce((sum, val) => sum + val, 0) / salaries.length)
    : null;

  const maxSalary = salaries.length > 0
    ? Math.round(Math.max(...salaries))
    : null;

  // Top hiring companies
  const companyCounts = {};
  jobs.forEach(job => {
    const name = job.company || 'N/A';
    companyCounts[name] = (companyCounts[name] || 0) + 1;
  });

  const topCompanies = Object.entries(companyCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  // Top locations
  const locationCounts = {};
  jobs.forEach(job => {
    const loc = job.location ? job.location.split(',')[0].trim() : 'Remote';
    locationCounts[loc] = (locationCounts[loc] || 0) + 1;
  });

  const topLocations = Object.entries(locationCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  // Currency symbol
  let currencySymbol = '₹';
  switch ((country || 'in').toLowerCase()) {
    case 'us': currencySymbol = '$'; break;
    case 'gb': currencySymbol = '£'; break;
    case 'ca': currencySymbol = 'C$'; break;
    case 'au': currencySymbol = 'A$'; break;
    case 'de':
    case 'fr': currencySymbol = '€'; break;
    default: currencySymbol = '₹'; break;
  }

  const formatVal = (val) => {
    if (!val) return 'N/A';
    const isIndia = (country || 'in').toLowerCase() === 'in';
    
    if (isIndia) {
      if (val >= 10000000) return `${currencySymbol}${(val / 10000000).toFixed(1)}Cr`;
      if (val >= 100000) return `${currencySymbol}${(val / 100000).toFixed(1)}L`;
      if (val >= 1000) return `${currencySymbol}${Math.round(val / 1000)}k`;
      return `${currencySymbol}${val}`;
    }

    if (val >= 1000000) return `${currencySymbol}${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${currencySymbol}${Math.round(val / 1000)}k`;
    return `${currencySymbol}${val}`;
  };

  return (
    <div className="insights-container" data-aos="fade-down">
      <Card className="glass-panel w-100 mb-4 insights-card">
        <Card.Content>
          <Card.Header className="text-white d-flex align-items-center mb-3">
            <Icon name="chart line" className="mr-2 text-cyan" /> Search Insights & Analytics
          </Card.Header>
          <Grid stackable columns={3}>
            <Grid.Row>
              <Grid.Column>
                <div className="insight-section text-center">
                  <span className="insight-label">Estimated Salary</span>
                  <div className="stats-row mt-2">
                    <Statistic size="tiny" inverted={darkMode} color="teal">
                      <Statistic.Value>{formatVal(avgSalary)}</Statistic.Value>
                      <Statistic.Label className="text-muted-cyan">Average</Statistic.Label>
                    </Statistic>
                    <Statistic size="tiny" inverted={darkMode} color="blue">
                      <Statistic.Value>{formatVal(maxSalary)}</Statistic.Value>
                      <Statistic.Label className="text-muted-cyan">Max</Statistic.Label>
                    </Statistic>
                  </div>
                </div>
              </Grid.Column>

              <Grid.Column>
                <div className="insight-section">
                  <span className="insight-label text-center d-block"><Icon name="building" /> Top Employers</span>
                  <ul className="insights-list mt-2">
                    {topCompanies.map(([name, count], idx) => (
                      <li key={name} className="d-flex justify-content-between text-white-80">
                        <span>{idx + 1}. {name}</span>
                        <span className="font-weight-bold text-cyan">{count} {count === 1 ? 'job' : 'jobs'}</span>
                      </li>
                    ))}
                    {topCompanies.length === 0 && <li className="text-center text-muted">No company data</li>}
                  </ul>
                </div>
              </Grid.Column>

              <Grid.Column>
                <div className="insight-section">
                  <span className="insight-label text-center d-block"><Icon name="map marker alternate" /> Top Locations</span>
                  <ul className="insights-list mt-2">
                    {topLocations.map(([loc, count], idx) => (
                      <li key={loc} className="d-flex justify-content-between text-white-80">
                        <span>{idx + 1}. {loc}</span>
                        <span className="font-weight-bold text-indigo">{count} {count === 1 ? 'job' : 'jobs'}</span>
                      </li>
                    ))}
                    {topLocations.length === 0 && <li className="text-center text-muted">No location data</li>}
                  </ul>
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Card.Content>
      </Card>
    </div>
  );
}
