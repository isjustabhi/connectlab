# ConnectLab

ConnectLab is a Vite + React research analytics platform for behavioral science and health psychology workflows. It supports CSV upload, JavaScript-based profiling, AI-assisted interpretation, manuscript drafting, and reproducible export artifacts.

## Getting Started

```bash
npm install
cp .env.example .env
npm run dev
```

Set `VITE_OPENAI_API_KEY` before running AI analysis and insights generation.

## Features

- CSV upload with drag-and-drop and a built-in sample social connectedness dataset
- Automatic profiling with descriptive statistics, missingness, and Pearson correlation heatmap
- AI-assisted modeling summaries, group comparisons, and manuscript-ready insights
- Recharts-based figures for distributions, scatter plots, and group mean charts
- Exportable statistical report, R analysis script, and manuscript draft

## Deployment

The app deploys to Vercel with zero additional configuration.
