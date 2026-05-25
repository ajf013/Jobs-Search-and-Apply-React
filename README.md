# Jobs Search and Apply React

[![Netlify Status](https://api.netlify.com/api/v1/badges/ed96682d-a518-473f-9738-ff2878101f35/deploy-status?branch=main)](https://app.netlify.com/projects/jobssearchandapply/deploys)

A premium, glassmorphic React portal for searching, tracking, and applying for jobs with intelligent resume matching and real-time analytics.

### 🌐 [Live Site](https://jobssearchandapply.netlify.app/)

---

## 🛠️ Tech Stack & Dependencies

| Technology | Logo / Icon | Version | Description |
| :--- | :---: | :---: | :--- |
| **React** | ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB) | `^16.13.1` | Core UI library for component-based modular rendering. |
| **React Bootstrap** | ![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=flat&logo=bootstrap&logoColor=white) | `^1.2.2` | Responsive grid layouts and basic mobile scaffolding. |
| **Semantic UI React** | ![Semantic UI](https://img.shields.io/badge/Semantic_UI-35BDB2?style=flat&logo=semanticuireact&logoColor=white) | `^2.1.5` | Premium interactive interface components (Icon, Statistic, Grid). |
| **AOS (Animate On Scroll)** | ![AOS](https://img.shields.io/badge/AOS-Animation-blueviolet?style=flat) | `^2.3.4` | Smooth transitions and layout animations triggered on scroll. |
| **Axios** | ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat&logo=axios&logoColor=white) | `^0.19.2` | Promise-based HTTP client to fetch data from the Adzuna API. |
| **React Markdown** | ![Markdown](https://img.shields.io/badge/Markdown-000000?style=flat&logo=markdown&logoColor=white) | `^4.3.1` | Safely parses and renders Markdown job descriptions. |

---

## 📂 Project Directory Structure

```text
Jobs-Search-and-Apply-React/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── Footer/
│   │   ├── Footer.jsx
│   │   └── Footer.css
│   ├── Insights/
│   │   ├── SearchInsights.js
│   │   └── SearchInsights.css
│   ├── Matcher/
│   │   ├── ResumeMatcher.js
│   │   ├── ResumeMatcher.css
│   │   └── matchAlgorithm.js
│   ├── SplashScreen/
│   │   ├── SplashScreen.jsx
│   │   └── SplashScreen.css
│   ├── Tracker/
│   │   ├── SavedJobsTracker.js
│   │   └── SavedJobsTracker.css
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   ├── Job.js
│   ├── useFetchJobs.js
│   ├── useTypewriter.js
│   └── serviceWorker.js
├── netlify.toml
├── package.json
└── README.md
```

---

## 📊 Application Flow Chart

```mermaid
graph TD
    A[Start App] --> B[Splash Screen]
    B --> C[Main Portal]
    C --> D[Search Jobs Panel]
    D -->|Enter Keyword/Loc| E[Adzuna API Call]
    E --> F[Fetch Jobs List]
    F --> G[Relevance Sorting: Title vs Description]
    G --> H[Render Jobs List]
    H -->|Click View Details| I[Keyword Match Score & Breakdown]
    H -->|Bookmark Job| J[Saved Tracker Board]
    H -->|Click ATS Analyzer Tab| K[AI Resume Analyzer Iframe]
```

---

## 🏗️ Architecture Design

```mermaid
graph LR
    subgraph Client [React SPA Client-Side]
        App[App.js Context & State]
        Search[SearchForm Component]
        Tracker[SavedJobsTracker Component]
        Matcher[ResumeMatcher & Jaccard Algo]
        Insights[SearchInsights Component]
        JobCard[Job Component]
    end

    subgraph External [External APIs & Sources]
        Adzuna[(Adzuna Jobs API)]
        ATS[ATS Score Analyzer Iframe]
    end

    subgraph Cache [Local Storage Cache]
        LS[(Local Storage: Resumes, Saved Jobs)]
    end

    App --> Search
    App --> Tracker
    App --> Matcher
    App --> Insights
    App --> JobCard

    Search -->|Query Params| Adzuna
    JobCard -->|Jaccard Similarity| Matcher
    JobCard -->|Sync Bookmark| LS
    Tracker -->|Sync Status & Notes| LS
    App -->|Embeds| ATS
```

---

## 🚀 Key Features

- **🎨 Premium Theme System**: Sleek glassmorphic dark theme and a soft, low-contrast, eye-friendly light theme designed to minimize eye strain.
- **💱 Dynamic Country & Currency Localization**: Automatically maps salary digits and currency denominations based on selected countries (e.g. correct lakh grouping `₹20,00,000` for India via `en-IN` locale).
- **📊 Real-time Search Insights**: High-level statistical summaries (Estimated average/max salaries, top hiring companies, and top employment locations) for active search results.
- **📄 Local Resume Matcher**: Paste or upload `.txt` resumes to run client-side Jaccard keyword matching, displaying a Rocket fit percentage score, matched skills, and suggested key terms to add.
- **💼 Saved Jobs Tracker Board**: A local kanban/log board to track job applications across statuses (`Bookmarked`, `Applied`, `Interviewing`, `Offer Received`, `Rejected`) with persistent custom notes.
- **🤖 Integrated ATS Resume Analyzer**: Seamless integration of the AI Resume Analyzer (`https://atsscore.fcruz.org/`) within a dedicated tab.
- **✨ Infinite Scroll / Load More**: Single-page rendering that appends results on demand instead of pagination.
- **🔍 Advanced Relevance Tuning**: Auto-ranks search outcomes, boosting exact keyword matches in titles above description matches.

---

## 📦 Installation & Setup

1. **Clone the repository**:
   ```sh
   git clone https://github.com/ajf013/Jobs-Search-and-Apply-React.git
   ```
2. **Navigate to the directory**:
   ```sh
   cd Jobs-Search-and-Apply-React
   ```
3. **Install dependencies**:
   ```sh
   npm install
   ```
4. **Start the development server**:
   ```sh
   npm start
   ```

*Note: The start and build scripts utilize `NODE_OPTIONS=--openssl-legacy-provider` to support compiling on Node 17+ environments.*

---

## ## Author

### 👤 Francis Ponnu Cruz I
> **Azure Cloud & DevOps Engineer | Microsoft Certified Trainer (MCT)**

#### 🌐 Connect with Me:
[![GitHub](https://img.shields.io/badge/GitHub-ajf013-181717?style=flat-square&logo=github)](https://github.com/ajf013)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Francis_Cruz-0A66C2?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/ajf013-francis-cruz/)
[![Twitter/X](https://img.shields.io/badge/X-@Itsme__Ajf013-000000?style=flat-square&logo=x)](https://x.com/Itsme_Ajf013)
[![Website](https://img.shields.io/badge/Website-fcruz.org-2D3748?style=flat-square&logo=googlechrome&logoColor=white)](https://fcruz.org)
[![Linktree](https://img.shields.io/badge/Linktree-AJF013-39E09B?style=flat-square&logo=linktree&logoColor=white)](https://linktr.ee/AJF013)
