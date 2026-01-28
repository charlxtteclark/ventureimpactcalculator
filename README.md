# VC Deal Screener

A comprehensive venture capital deal evaluation and ranking tool designed for impact investing. Score startups across multiple weighted criteria and automatically generate rankings to streamline your investment decision-making process.

🔗 **Live Demo:** [https://charlotteclark.io/ventureimpactcalculator/](https://charlotteclark.io/ventureimpactcalculator/)

## Features

- **Multi-Criteria Scoring:** Evaluate startups across 7 key dimensions:
  - Founder/Team (20%)
  - Market Size (20%)
  - Additionality (15%)
  - Product/Solution (15%)
  - Impact Alignment (15%)
  - Traction/Validation (10%)
  - Business Model (5%)

- **Weighted Ranking System:** Automatically calculates and ranks deals based on weighted scores
- **Interactive Sliders:** Intuitive scoring interface with visual feedback
- **Local Storage:** All data is automatically saved in your browser and persists between sessions
- **CSV Export:** Download your complete evaluation data for further analysis
- **Responsive Design:** Works seamlessly on desktop and mobile devices

## Data Storage

Your startup evaluations are automatically saved to your browser's local storage. This means:
- ✅ Data persists between sessions
- ✅ No account or login required
- ✅ Works offline after first load
- ⚠️ Data is browser-specific (won't sync across devices)
- ⚠️ Clearing browser data will delete saved startups

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/charlxtteclark/ventureimpactcalculator.git
cd ventureimpactcalculator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## Deployment

To deploy updates to GitHub Pages:
```bash
npm run deploy
```

## Built With

- React
- Tailwind CSS
- Lucide React (icons)
- Browser Local Storage API
- GitHub Pages

## License

This project is open source and available under the MIT License.
