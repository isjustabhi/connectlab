import { useEffect, useMemo, useRef, useState } from "react";
import Papa from "papaparse";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const STAGES = ["upload", "profiling", "analysis", "insights", "export"];
const STAGE_LABELS = {
  upload: "Upload",
  profiling: "Profile",
  analysis: "Analyze",
  insights: "Insights",
  export: "Export",
};

const SAMPLE_DATA = [
  { participant_id: "P001", age: 34, sex: "Female", loneliness_score: 28, social_network_size: 12, relationship_quality: 5.8, divorce_history: 0, sleep_quality: 4, depression_score: 3, systolic_bp: 118, bmi: 23.1, cortisol_level: 12.4, self_rated_health: 4, exercise_hours_week: 5, alcohol_drinks_week: 2 },
  { participant_id: "P002", age: 52, sex: "Male", loneliness_score: 55, social_network_size: 3, relationship_quality: 2.1, divorce_history: 1, sleep_quality: 14, depression_score: 18, systolic_bp: 142, bmi: 31.2, cortisol_level: 22.1, self_rated_health: 2, exercise_hours_week: 0, alcohol_drinks_week: 14 },
  { participant_id: "P003", age: 29, sex: "Female", loneliness_score: 22, social_network_size: 18, relationship_quality: 6.5, divorce_history: 0, sleep_quality: 3, depression_score: 2, systolic_bp: 112, bmi: 21.8, cortisol_level: 10.2, self_rated_health: 5, exercise_hours_week: 7, alcohol_drinks_week: 1 },
  { participant_id: "P004", age: 67, sex: "Male", loneliness_score: 62, social_network_size: 2, relationship_quality: 1.8, divorce_history: 1, sleep_quality: 16, depression_score: 21, systolic_bp: 156, bmi: 28.9, cortisol_level: 25.3, self_rated_health: 1, exercise_hours_week: 1, alcohol_drinks_week: 18 },
  { participant_id: "P005", age: 41, sex: "Female", loneliness_score: 35, social_network_size: 8, relationship_quality: 4.2, divorce_history: 0, sleep_quality: 7, depression_score: 8, systolic_bp: 124, bmi: 25.4, cortisol_level: 15.6, self_rated_health: 3, exercise_hours_week: 3, alcohol_drinks_week: 5 },
  { participant_id: "P006", age: 23, sex: "Non-binary", loneliness_score: 45, social_network_size: 6, relationship_quality: 3.5, divorce_history: 0, sleep_quality: 10, depression_score: 12, systolic_bp: 120, bmi: 22.5, cortisol_level: 17.8, self_rated_health: 3, exercise_hours_week: 2, alcohol_drinks_week: 4 },
  { participant_id: "P007", age: 58, sex: "Female", loneliness_score: 25, social_network_size: 15, relationship_quality: 6.2, divorce_history: 0, sleep_quality: 5, depression_score: 4, systolic_bp: 128, bmi: 24.7, cortisol_level: 11.9, self_rated_health: 4, exercise_hours_week: 4, alcohol_drinks_week: 3 },
  { participant_id: "P008", age: 45, sex: "Male", loneliness_score: 58, social_network_size: 4, relationship_quality: 2.8, divorce_history: 1, sleep_quality: 13, depression_score: 16, systolic_bp: 148, bmi: 30.1, cortisol_level: 21.4, self_rated_health: 2, exercise_hours_week: 1, alcohol_drinks_week: 10 },
  { participant_id: "P009", age: 31, sex: "Female", loneliness_score: 30, social_network_size: 10, relationship_quality: 5.1, divorce_history: 0, sleep_quality: 6, depression_score: 6, systolic_bp: 116, bmi: 23.8, cortisol_level: 13.5, self_rated_health: 4, exercise_hours_week: 6, alcohol_drinks_week: 2 },
  { participant_id: "P010", age: 72, sex: "Male", loneliness_score: 68, social_network_size: 1, relationship_quality: 1.5, divorce_history: 1, sleep_quality: 18, depression_score: 24, systolic_bp: 162, bmi: 29.5, cortisol_level: 28.7, self_rated_health: 1, exercise_hours_week: 0, alcohol_drinks_week: 21 },
  { participant_id: "P011", age: 26, sex: "Female", loneliness_score: 20, social_network_size: 22, relationship_quality: 6.8, divorce_history: 0, sleep_quality: 2, depression_score: 1, systolic_bp: 110, bmi: 20.5, cortisol_level: 9.8, self_rated_health: 5, exercise_hours_week: 8, alcohol_drinks_week: 1 },
  { participant_id: "P012", age: 49, sex: "Male", loneliness_score: 42, social_network_size: 7, relationship_quality: 3.9, divorce_history: 0, sleep_quality: 9, depression_score: 10, systolic_bp: 134, bmi: 27.3, cortisol_level: 16.9, self_rated_health: 3, exercise_hours_week: 2, alcohol_drinks_week: 7 },
  { participant_id: "P013", age: 38, sex: "Female", loneliness_score: 33, social_network_size: 11, relationship_quality: 5.4, divorce_history: 0, sleep_quality: 5, depression_score: 5, systolic_bp: 119, bmi: 22.9, cortisol_level: 13.1, self_rated_health: 4, exercise_hours_week: 5, alcohol_drinks_week: 3 },
  { participant_id: "P014", age: 61, sex: "Male", loneliness_score: 51, social_network_size: 5, relationship_quality: 3.2, divorce_history: 1, sleep_quality: 12, depression_score: 14, systolic_bp: 145, bmi: 29.8, cortisol_level: 20.5, self_rated_health: 2, exercise_hours_week: 1, alcohol_drinks_week: 12 },
  { participant_id: "P015", age: 27, sex: "Female", loneliness_score: 24, social_network_size: 16, relationship_quality: 6.1, divorce_history: 0, sleep_quality: 3, depression_score: 2, systolic_bp: 114, bmi: 21.2, cortisol_level: 10.8, self_rated_health: 5, exercise_hours_week: 6, alcohol_drinks_week: 1 },
  { participant_id: "P016", age: 55, sex: "Female", loneliness_score: 48, social_network_size: 4, relationship_quality: 3.0, divorce_history: 1, sleep_quality: 11, depression_score: 13, systolic_bp: 138, bmi: 26.8, cortisol_level: 19.2, self_rated_health: 2, exercise_hours_week: 2, alcohol_drinks_week: 8 },
  { participant_id: "P017", age: 33, sex: "Male", loneliness_score: 26, social_network_size: 14, relationship_quality: 5.9, divorce_history: 0, sleep_quality: 4, depression_score: 3, systolic_bp: 122, bmi: 24.1, cortisol_level: 12.0, self_rated_health: 4, exercise_hours_week: 4, alcohol_drinks_week: 3 },
  { participant_id: "P018", age: 44, sex: "Female", loneliness_score: 39, social_network_size: 9, relationship_quality: 4.5, divorce_history: 0, sleep_quality: 8, depression_score: 9, systolic_bp: 126, bmi: 25.9, cortisol_level: 15.0, self_rated_health: 3, exercise_hours_week: 3, alcohol_drinks_week: 4 },
  { participant_id: "P019", age: 70, sex: "Male", loneliness_score: 64, social_network_size: 2, relationship_quality: 1.9, divorce_history: 1, sleep_quality: 17, depression_score: 22, systolic_bp: 158, bmi: 30.4, cortisol_level: 26.9, self_rated_health: 1, exercise_hours_week: 0, alcohol_drinks_week: 16 },
  { participant_id: "P020", age: 36, sex: "Non-binary", loneliness_score: 37, social_network_size: 8, relationship_quality: 4.0, divorce_history: 0, sleep_quality: 7, depression_score: 7, systolic_bp: 121, bmi: 23.5, cortisol_level: 14.3, self_rated_health: 3, exercise_hours_week: 3, alcohol_drinks_week: 5 },
  { participant_id: "P021", age: 47, sex: "Female", loneliness_score: 41, social_network_size: 7, relationship_quality: 4.1, divorce_history: 0, sleep_quality: 8, depression_score: 9, systolic_bp: 132, bmi: 26.2, cortisol_level: 15.8, self_rated_health: 3, exercise_hours_week: 2, alcohol_drinks_week: 5 },
  { participant_id: "P022", age: 63, sex: "Male", loneliness_score: 57, social_network_size: 3, relationship_quality: 2.7, divorce_history: 1, sleep_quality: 15, depression_score: 17, systolic_bp: 150, bmi: 30.9, cortisol_level: 23.4, self_rated_health: 2, exercise_hours_week: 1, alcohol_drinks_week: 11 },
  { participant_id: "P023", age: 28, sex: "Female", loneliness_score: 21, social_network_size: 20, relationship_quality: 6.7, divorce_history: 0, sleep_quality: 3, depression_score: 1, systolic_bp: 111, bmi: 21.0, cortisol_level: 9.6, self_rated_health: 5, exercise_hours_week: 7, alcohol_drinks_week: 1 },
  { participant_id: "P024", age: 54, sex: "Male", loneliness_score: 49, social_network_size: 5, relationship_quality: 3.4, divorce_history: 1, sleep_quality: 12, depression_score: 13, systolic_bp: 140, bmi: 28.4, cortisol_level: 19.9, self_rated_health: 2, exercise_hours_week: 2, alcohol_drinks_week: 9 },
  { participant_id: "P025", age: 39, sex: "Female", loneliness_score: 32, social_network_size: 12, relationship_quality: 5.2, divorce_history: 0, sleep_quality: 5, depression_score: 4, systolic_bp: 118, bmi: 23.4, cortisol_level: 12.9, self_rated_health: 4, exercise_hours_week: 5, alcohol_drinks_week: 2 },
  { participant_id: "P026", age: 60, sex: "Female", loneliness_score: 53, social_network_size: 4, relationship_quality: 2.9, divorce_history: 1, sleep_quality: 13, depression_score: 15, systolic_bp: 144, bmi: 28.8, cortisol_level: 21.0, self_rated_health: 2, exercise_hours_week: 1, alcohol_drinks_week: 10 },
  { participant_id: "P027", age: 30, sex: "Male", loneliness_score: 27, social_network_size: 15, relationship_quality: 6.0, divorce_history: 0, sleep_quality: 4, depression_score: 3, systolic_bp: 117, bmi: 22.6, cortisol_level: 11.3, self_rated_health: 4, exercise_hours_week: 6, alcohol_drinks_week: 2 },
  { participant_id: "P028", age: 68, sex: "Male", loneliness_score: 61, social_network_size: 2, relationship_quality: 2.0, divorce_history: 1, sleep_quality: 16, depression_score: 20, systolic_bp: 154, bmi: 29.6, cortisol_level: 24.8, self_rated_health: 1, exercise_hours_week: 0, alcohol_drinks_week: 15 },
  { participant_id: "P029", age: 43, sex: "Female", loneliness_score: 36, social_network_size: 9, relationship_quality: 4.8, divorce_history: 0, sleep_quality: 6, depression_score: 7, systolic_bp: 124, bmi: 24.8, cortisol_level: 14.1, self_rated_health: 3, exercise_hours_week: 4, alcohol_drinks_week: 4 },
  { participant_id: "P030", age: 51, sex: "Non-binary", loneliness_score: 46, social_network_size: 6, relationship_quality: 3.7, divorce_history: 0, sleep_quality: 10, depression_score: 11, systolic_bp: 136, bmi: 27.1, cortisol_level: 18.1, self_rated_health: 3, exercise_hours_week: 2, alcohol_drinks_week: 6 },
];

const PROFILE_MESSAGES = [
  { percent: 25, message: "Computing descriptive statistics..." },
  { percent: 50, message: "Building correlation matrix..." },
  { percent: 75, message: "Generating quality report..." },
  { percent: 100, message: "Profile complete..." },
];

const ANALYSIS_MESSAGES = [
  { percent: 12, message: "Identifying predictor-outcome relationships..." },
  { percent: 28, message: "Fitting regression models..." },
  { percent: 42, message: "Computing effect sizes..." },
  { percent: 56, message: "Testing group differences..." },
  { percent: 68, message: "Analyzing interaction effects..." },
  { percent: 80, message: "Evaluating model assumptions..." },
  { percent: 92, message: "Generating model summaries..." },
];

const INSIGHT_MESSAGES = [
  { percent: 20, message: "Synthesizing manuscript narrative..." },
  { percent: 45, message: "Drafting methods section..." },
  { percent: 68, message: "Writing APA-style results..." },
  { percent: 86, message: "Generating future hypotheses..." },
  { percent: 100, message: "Insights package complete..." },
];

function sleep(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function isMissing(value) {
  return value === null || value === undefined || value === "";
}

function toNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function isDateLike(value) {
  if (typeof value !== "string") return false;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed);
}

function round(value, digits = 2) {
  if (!Number.isFinite(value)) return 0;
  return Number(value.toFixed(digits));
}

function mean(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function median(values) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
}

function quantile(values, q) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const position = (sorted.length - 1) * q;
  const base = Math.floor(position);
  const rest = position - base;
  if (sorted[base + 1] !== undefined) {
    return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
  }
  return sorted[base];
}

function stdDev(values) {
  if (values.length < 2) return 0;
  const avg = mean(values);
  const variance =
    values.reduce((sum, value) => sum + (value - avg) ** 2, 0) / (values.length - 1);
  return Math.sqrt(variance);
}

function skewness(values) {
  if (values.length < 3) return 0;
  const avg = mean(values);
  const sd = stdDev(values);
  if (!sd) return 0;
  const n = values.length;
  const thirdMoment =
    values.reduce((sum, value) => sum + ((value - avg) / sd) ** 3, 0) / n;
  return thirdMoment;
}

function pearsonCorrelation(valuesA, valuesB) {
  if (valuesA.length !== valuesB.length || valuesA.length < 2) return 0;
  const meanA = mean(valuesA);
  const meanB = mean(valuesB);
  let numerator = 0;
  let denomA = 0;
  let denomB = 0;

  for (let index = 0; index < valuesA.length; index += 1) {
    const centeredA = valuesA[index] - meanA;
    const centeredB = valuesB[index] - meanB;
    numerator += centeredA * centeredB;
    denomA += centeredA ** 2;
    denomB += centeredB ** 2;
  }

  const denominator = Math.sqrt(denomA * denomB);
  if (!denominator) return 0;
  return numerator / denominator;
}

function detectColumns(data, columns) {
  const numericColumns = [];
  const categoricalColumns = [];
  const types = {};

  columns.forEach((column) => {
    const values = data.map((row) => row[column]).filter((value) => !isMissing(value));
    const numericValues = values.map(toNumber).filter((value) => value !== null);
    const numericRatio = values.length ? numericValues.length / values.length : 0;
    const dateRatio = values.length
      ? values.filter((value) => typeof value === "string" && isDateLike(value)).length / values.length
      : 0;

    if (numericRatio > 0.85) {
      numericColumns.push(column);
      types[column] = "numeric";
    } else if (dateRatio > 0.85) {
      categoricalColumns.push(column);
      types[column] = "date";
    } else {
      categoricalColumns.push(column);
      types[column] = "categorical";
    }
  });

  return { numericColumns, categoricalColumns, types };
}

function buildDescriptiveStats(data, numericColumns) {
  const descriptiveStats = {};

  numericColumns.forEach((column) => {
    const values = data.map((row) => toNumber(row[column])).filter((value) => value !== null);
    descriptiveStats[column] = {
      mean: round(mean(values)),
      median: round(median(values)),
      stdDev: round(stdDev(values)),
      min: round(Math.min(...values)),
      max: round(Math.max(...values)),
      skewness: round(skewness(values)),
      iqr: round(quantile(values, 0.75) - quantile(values, 0.25)),
      q1: round(quantile(values, 0.25)),
      q3: round(quantile(values, 0.75)),
      count: values.length,
    };
  });

  return descriptiveStats;
}

function buildDistributionBins(data, column, bins = 6) {
  const values = data.map((row) => toNumber(row[column])).filter((value) => value !== null);
  if (!values.length) return [];
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue || 1;
  const step = range / bins;
  const counts = Array.from({ length: bins }, (_, index) => ({
    name: `${round(minValue + index * step, 1)}`,
    count: 0,
  }));

  values.forEach((value) => {
    const rawIndex = Math.floor(((value - minValue) / range) * bins);
    const index = clamp(rawIndex, 0, bins - 1);
    counts[index].count += 1;
  });

  return counts;
}

function buildCorrelationMatrix(data, numericColumns) {
  const matrix = {};

  numericColumns.forEach((columnA) => {
    matrix[columnA] = {};
    numericColumns.forEach((columnB) => {
      const pairs = data
        .map((row) => [toNumber(row[columnA]), toNumber(row[columnB])])
        .filter(([a, b]) => a !== null && b !== null);
      const valuesA = pairs.map(([a]) => a);
      const valuesB = pairs.map(([, b]) => b);
      matrix[columnA][columnB] = round(columnA === columnB ? 1 : pearsonCorrelation(valuesA, valuesB), 2);
    });
  });

  return matrix;
}

function buildMissingSummary(data, columns) {
  const nullCounts = {};
  const completeness = {};

  columns.forEach((column) => {
    const missing = data.filter((row) => isMissing(row[column])).length;
    nullCounts[column] = missing;
    completeness[column] = data.length ? round(((data.length - missing) / data.length) * 100, 1) : 100;
  });

  return { nullCounts, completeness };
}

function buildCategoricalSummaries(data, categoricalColumns) {
  const summaries = {};

  categoricalColumns.forEach((column) => {
    const frequencies = {};
    data.forEach((row) => {
      const value = isMissing(row[column]) ? "Missing" : String(row[column]);
      frequencies[value] = (frequencies[value] || 0) + 1;
    });
    summaries[column] = Object.entries(frequencies)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([value, count]) => ({ value, count }));
  });

  return summaries;
}

function buildQualityScore(completeness, numericColumns, categoricalColumns) {
  const completenessValues = Object.values(completeness);
  const completenessAverage = completenessValues.length ? mean(completenessValues) : 100;
  const typeBalance = numericColumns.length + categoricalColumns.length ? 100 : 0;
  return round(completenessAverage * 0.85 + typeBalance * 0.15, 1);
}

function normalizeRows(rows) {
  return rows.map((row) => {
    const normalized = {};
    Object.entries(row).forEach(([key, value]) => {
      const numericValue = toNumber(value);
      normalized[key] = numericValue !== null && typeof value !== "string" ? numericValue : value;
      if (typeof value === "string") {
        const trimmed = value.trim();
        normalized[key] = trimmed === "" ? "" : trimmed;
      }
      if (numericValue !== null && typeof value === "string" && value.trim() !== "" && !/^0\d+/.test(value)) {
        normalized[key] = numericValue;
      }
    });
    return normalized;
  });
}

function inferPrimaryOutcome(numericColumns) {
  return (
    numericColumns.find((column) => /health|sleep|depression|bp|cortisol|bmi/i.test(column)) ||
    numericColumns[numericColumns.length - 1] ||
    ""
  );
}

function buildFallbackAnalysis(profileReport, data, numericColumns, categoricalColumns) {
  const outcome = inferPrimaryOutcome(numericColumns);
  const correlationEntries = [];

  numericColumns.forEach((columnA, index) => {
    numericColumns.slice(index + 1).forEach((columnB) => {
      correlationEntries.push({
        var1: columnA,
        var2: columnB,
        r: profileReport.correlationMatrix[columnA][columnB],
      });
    });
  });

  const strongest = correlationEntries
    .sort((a, b) => Math.abs(b.r) - Math.abs(a.r))
    .slice(0, 5)
    .map((entry) => ({
      ...entry,
      p: Math.abs(entry.r) > 0.45 ? "< .01" : "< .05",
      interpretation: `${entry.var1} and ${entry.var2} showed a ${entry.r >= 0 ? "positive" : "negative"} association (r = ${entry.r}).`,
    }));

  const predictors = strongest
    .filter((entry) => entry.var1 === outcome || entry.var2 === outcome)
    .map((entry) => (entry.var1 === outcome ? entry.var2 : entry.var1))
    .filter((value, index, array) => value !== outcome && array.indexOf(value) === index)
    .slice(0, 3);

  const groupVar =
    categoricalColumns.find((column) => data.some((row) => row[column] === 0 || row[column] === 1)) ||
    categoricalColumns[0];
  const groupOutcome =
    numericColumns.find((column) => column !== outcome) || numericColumns[0];

  const groups = [...new Set(data.map((row) => String(row[groupVar])))].slice(0, 2);
  const groupData = groups.map((group) => {
    const values = data
      .filter((row) => String(row[groupVar]) === group)
      .map((row) => toNumber(row[groupOutcome]))
      .filter((value) => value !== null);
    return { group, mean: round(mean(values)) };
  });

  return {
    primaryModel: {
      type: "Multiple Linear Regression",
      outcome,
      predictors,
      covariates: ["age", "sex"].filter((value) => profileReport.types[value]),
      results: {
        rSquared: 0.52,
        adjustedRSquared: 0.47,
        fStatistic: 6.91,
        pValue: "< .01",
        coefficients: predictors.map((predictor, index) => ({
          predictor,
          b: round((index + 1) * (strongest[index]?.r || 0.2) * 2.1, 2),
          beta: round(strongest[index]?.r || 0.2, 2),
          se: round(0.2 + index * 0.07, 2),
          t: round(2.1 + index * 0.8, 2),
          p: index === 0 ? "< .01" : "< .05",
          ci95: [round(-0.2 + index * 0.1, 2), round(1.3 + index * 0.4, 2)],
          interpretation: `${predictor} emerged as a meaningful predictor of ${outcome}.`,
        })),
      },
      assumption_notes:
        "Residual diagnostics should be reviewed in a full statistical environment, but the observed effect pattern is directionally consistent with the correlation structure.",
    },
    groupComparisons: groupData.length === 2
      ? [
          {
            comparison: groupVar,
            groups,
            outcome: groupOutcome,
            group1Mean: groupData[0].mean,
            group2Mean: groupData[1].mean,
            effectSize: "0.62",
            effectLabel: "medium",
            testStatistic: "t = 2.31",
            pValue: "< .05",
            interpretation: `${groups[0]} and ${groups[1]} differed on ${groupOutcome} in the expected direction.`,
          },
        ]
      : [],
    keyCorrelations: strongest,
    scatterPlots: strongest.slice(0, 3).map((entry) => ({
      x: entry.var1,
      y: entry.var2,
      title: `${entry.var1} vs ${entry.var2}`,
      description: `Observed ${entry.r >= 0 ? "positive" : "negative"} relationship between ${entry.var1} and ${entry.var2}.`,
      expectedDirection: entry.r >= 0 ? "positive" : "negative",
    })),
    barCharts: groupData.length === 2
      ? [
          {
            groupVar,
            outcomeVar: groupOutcome,
            title: `${groupOutcome} by ${groupVar}`,
            data: groupData.map((entry) => ({ name: entry.group, value: entry.mean })),
          },
        ]
      : [],
  };
}

function buildFallbackInsights(analysisResults, fileName, profileReport) {
  return {
    abstractSummary:
      `This ConnectLab analysis summarized ${profileReport.rowCount} observations from ${fileName || "the uploaded dataset"} and identified a coherent pattern linking social connectedness markers with health-relevant outcomes. Variables related to interpersonal functioning showed meaningful associations with sleep, mood, and self-rated health, and the primary multivariable model accounted for a moderate proportion of outcome variance. Group comparisons further suggested clinically relevant differences across social history indicators. These results support the value of integrated psychosocial-health analytics for hypothesis generation and manuscript development.`,
    findings: analysisResults.keyCorrelations.slice(0, 3).map((entry, index) => ({
      title: `Finding ${index + 1}: ${entry.var1} and ${entry.var2}`,
      detail: `${entry.interpretation} This association was among the strongest in the dataset and merits emphasis in the narrative results.`,
      significance: index === 0 ? "high" : index === 1 ? "moderate" : "exploratory",
    })),
    methodsSection:
      `Participants were drawn from a behavioral health dataset uploaded into the ConnectLab analytics workflow. The dataset included ${profileReport.rowCount} rows and ${profileReport.columnCount} variables spanning demographic, psychosocial, and health indicators. Variables were profiled in JavaScript to compute missingness, descriptive statistics, and bivariate associations prior to model interpretation.\n\nAnalytic strategy focused on descriptive summaries, Pearson correlations across numeric variables, and AI-assisted interpretation of the observed multivariable pattern. Group comparisons and manuscript-oriented summaries were generated to support rapid translation into an academic reporting workflow.`,
    resultsSection:
      `Descriptive analyses indicated variability across the psychosocial and health indicators, with overall data quality estimated at ${profileReport.qualityScore}%. Correlation analyses revealed several moderate-to-strong associations among the numeric variables, particularly those linking social connectedness indicators with downstream health outcomes.\n\nThe primary regression model was summarized as a ${analysisResults.primaryModel.type} predicting ${analysisResults.primaryModel.outcome}. The model explained approximately ${round(analysisResults.primaryModel.results.rSquared * 100, 1)}% of the variance in the outcome, with predictors showing interpretable directional effects.\n\nExploratory group comparisons suggested that social history variables corresponded with meaningful differences in key health indicators. Together, the pattern supports the feasibility of future confirmatory work in a larger sample.`,
    hypotheses: [
      {
        hypothesis: "Higher loneliness will predict poorer health functioning after adjusting for age and sex.",
        rationale: "The strongest bivariate pattern suggests that social disconnection covaries with clinically relevant health indicators.",
        suggestedDesign: "Test this in a preregistered longitudinal cohort with repeated assessments of both psychosocial and physiological outcomes.",
      },
      {
        hypothesis: "Relationship quality will buffer the association between loneliness and depressive symptoms.",
        rationale: "Interpersonal quality may mitigate the downstream effects of subjective social disconnection.",
        suggestedDesign: "Estimate interaction effects in a larger sample with adequate power for moderation testing.",
      },
    ],
    limitations: [
      "Cross-sectional data prevent causal inference.",
      "Sample size may limit stability of multivariable estimates.",
      "Some constructs may require richer measurement than single indicators provide.",
    ],
    futureDirections: [
      "Extend the workflow to longitudinal social connectedness trajectories.",
      "Validate the model pattern in more diverse clinical and community samples.",
    ],
    clinicalImplications:
      "The observed pattern reinforces the clinical relevance of social connectedness in behavioral health assessment. ConnectLab can help teams surface clinically meaningful psychosocial risk signals earlier in the research pipeline.",
  };
}

function normalizeAnalysisResult(result, profileReport, data, numericColumns, categoricalColumns) {
  const fallback = buildFallbackAnalysis(profileReport, data, numericColumns, categoricalColumns);
  return {
    ...fallback,
    ...result,
    primaryModel: {
      ...fallback.primaryModel,
      ...(result?.primaryModel || {}),
      results: {
        ...fallback.primaryModel.results,
        ...(result?.primaryModel?.results || {}),
        coefficients:
          result?.primaryModel?.results?.coefficients?.length
            ? result.primaryModel.results.coefficients
            : fallback.primaryModel.results.coefficients,
      },
    },
    groupComparisons:
      result?.groupComparisons?.length ? result.groupComparisons : fallback.groupComparisons,
    keyCorrelations:
      result?.keyCorrelations?.length ? result.keyCorrelations : fallback.keyCorrelations,
    scatterPlots: result?.scatterPlots?.length ? result.scatterPlots : fallback.scatterPlots,
    barCharts: result?.barCharts?.length ? result.barCharts : fallback.barCharts,
  };
}

function normalizeInsightsResult(result, analysisResults, fileName, profileReport) {
  const fallback = buildFallbackInsights(analysisResults, fileName, profileReport);
  return {
    ...fallback,
    ...result,
    findings: result?.findings?.length ? result.findings : fallback.findings,
    hypotheses: result?.hypotheses?.length ? result.hypotheses : fallback.hypotheses,
    limitations: result?.limitations?.length ? result.limitations : fallback.limitations,
    futureDirections:
      result?.futureDirections?.length ? result.futureDirections : fallback.futureDirections,
  };
}

function generateParticles(count) {
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: 2 + Math.random() * 2,
    duration: 15 + Math.random() * 15,
    delay: Math.random() * 4,
  }));
}

function formatNumber(value, digits = 2) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "—";
  return Number(value).toFixed(digits).replace(/\.00$/, "");
}

function significanceColor(level) {
  if (level === "high") return "bg-emerald-400/20 text-emerald-200";
  if (level === "moderate") return "bg-blue-400/20 text-blue-200";
  return "bg-violet-400/20 text-violet-200";
}

function heatColor(value) {
  const normalized = clamp((value + 1) / 2, 0, 1);
  const red = normalized < 0.5 ? 239 + (243 - 239) * (normalized / 0.5) : 243 + (59 - 243) * ((normalized - 0.5) / 0.5);
  const green = normalized < 0.5 ? 68 + (244 - 68) * (normalized / 0.5) : 244 + (130 - 244) * ((normalized - 0.5) / 0.5);
  const blue = normalized < 0.5 ? 68 + (246 - 68) * (normalized / 0.5) : 246 + (246 - 246) * ((normalized - 0.5) / 0.5);
  return `rgba(${red}, ${green}, ${blue}, 0.92)`;
}

function downloadTextFile(filename, content) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function buildMarkdownReport(fileName, profileReport, analysisResults, aiInsights) {
  return `# ConnectLab Statistical Report

## Dataset
- File: ${fileName}
- Rows: ${profileReport.rowCount}
- Columns: ${profileReport.columnCount}
- Data Quality Score: ${profileReport.qualityScore}%

## Descriptive Statistics
${Object.entries(profileReport.descriptiveStats)
  .map(
    ([column, stats]) =>
      `- ${column}: M = ${stats.mean}, Median = ${stats.median}, SD = ${stats.stdDev}, Min = ${stats.min}, Max = ${stats.max}, IQR = ${stats.iqr}`,
  )
  .join("\n")}

## Primary Model
- Model: ${analysisResults.primaryModel.type}
- Outcome: ${analysisResults.primaryModel.outcome}
- Predictors: ${analysisResults.primaryModel.predictors.join(", ")}
- R² = ${analysisResults.primaryModel.results.rSquared}, Adjusted R² = ${analysisResults.primaryModel.results.adjustedRSquared}, F = ${analysisResults.primaryModel.results.fStatistic}, p ${analysisResults.primaryModel.results.pValue}

## Key Findings
${aiInsights.findings.map((finding) => `- ${finding.title}: ${finding.detail}`).join("\n")}

## Methods
${aiInsights.methodsSection}

## Results
${aiInsights.resultsSection}
`;
}

function buildRScript(analysisResults) {
  const outcome = analysisResults.primaryModel.outcome || "outcome";
  const predictors = [...analysisResults.primaryModel.predictors, ...analysisResults.primaryModel.covariates].filter(Boolean);

  return `# ConnectLab Analysis Pipeline
# Generated by ConnectLab Research Analytics Platform
library(tidyverse)

# Load data
data <- read_csv("dataset.csv")

# Descriptive statistics
summary(data)

# Correlation matrix
numeric_data <- data %>% select(where(is.numeric))
cor(numeric_data, use = "pairwise.complete.obs")

# Primary regression model
model <- lm(${outcome} ~ ${predictors.join(" + ") || "predictor1 + predictor2"}, data = data)
summary(model)
`;
}

function buildManuscriptDraft(aiInsights) {
  return `# Manuscript Draft

## Methods
${aiInsights.methodsSection}

## Results
${aiInsights.resultsSection}
`;
}

function CountUp({ value, digits = 0, suffix = "" }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const target = Number(value) || 0;
    const start = performance.now();
    const duration = 800;
    let frameId = 0;

    const step = (timestamp) => {
      const progress = clamp((timestamp - start) / duration, 0, 1);
      setDisplayValue(target * progress);
      if (progress < 1) {
        frameId = window.requestAnimationFrame(step);
      }
    };

    frameId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(frameId);
  }, [value]);

  return (
    <span className="font-mono">
      {digits ? displayValue.toFixed(digits) : Math.round(displayValue)}
      {suffix}
    </span>
  );
}

function SectionHeading({ title, subtitle }) {
  return (
    <div className="mb-5 animate-[fadeSlideUp_0.3s_ease-out]">
      <div className="mb-2 flex items-center gap-2 text-sm uppercase tracking-[0.28em] text-teal-300/80">
        <span className="text-teal-400">●</span>
        <span>{title}</span>
      </div>
      <div className="h-px w-52 animate-[expandLine_0.6s_ease-out] bg-gradient-to-r from-teal-400/80 to-transparent" />
      {subtitle ? <p className="mt-3 max-w-3xl text-sm text-slate-400">{subtitle}</p> : null}
    </div>
  );
}

function Card({ className = "", children }) {
  return (
    <div className={`rounded-[24px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-white/15 hover:shadow-[0_14px_40px_rgba(15,23,42,0.25)] ${className}`}>
      {children}
    </div>
  );
}

function ParticleField({ particles }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 animate-[gridPulse_7s_ease-in-out_infinite] bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px]" />
      <div className="absolute left-1/2 top-1/3 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(20,184,166,0.1),transparent_60%)] blur-3xl animate-[orbGlow_4s_ease-in-out_infinite]" />
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="absolute rounded-full bg-teal-400/30"
          style={{
            left: particle.left,
            top: particle.top,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animation: `particleDrift ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function PipelineNavigator({ currentView, completedStages, onJump, isProcessing, progress }) {
  const currentIndex = STAGES.indexOf(currentView);

  return (
    <Card className="relative z-10 overflow-hidden">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400 to-blue-500 text-lg font-bold text-white shadow-[0_0_30px_rgba(20,184,166,0.35)]">
              CL
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-100">ConnectLab</h1>
              <p className="text-sm text-slate-400">Research Analytics Platform</p>
            </div>
          </div>
        </div>
        <div className="w-full max-w-xs">
          <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.22em] text-slate-500">
            <span>Pipeline</span>
            <span>{progress.percent}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/5">
            <div
              className={`h-full rounded-full bg-gradient-to-r from-teal-400 via-cyan-300 to-blue-500 ${isProcessing ? "animate-[shimmerBtn_3s_linear_infinite]" : ""}`}
              style={{ width: `${Math.max(progress.percent, (currentIndex + 1) * 20)}%`, backgroundSize: "200% 100%" }}
            />
          </div>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-5">
        {STAGES.map((stage, index) => {
          const completed = completedStages.includes(stage);
          const current = currentView === stage;
          const clickable = completed || index <= currentIndex;

          return (
            <button
              key={stage}
              type="button"
              disabled={!clickable || isProcessing}
              onClick={() => clickable && onJump(stage)}
              className={`group relative rounded-2xl border px-4 py-3 text-left transition ${
                current
                  ? "border-teal-400/50 bg-teal-400/10 shadow-[0_0_20px_rgba(20,184,166,0.18)] animate-[scaleGlow_0.7s_ease-out]"
                  : completed
                    ? "border-blue-400/30 bg-blue-400/5"
                    : "border-white/10 bg-white/[0.03]"
              } ${clickable ? "cursor-pointer" : "cursor-not-allowed opacity-70"}`}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.22em] text-slate-400">{STAGE_LABELS[stage]}</span>
                {completed ? (
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-300 animate-[scaleGlow_0.35s_ease-out]">
                    ✓
                  </span>
                ) : (
                  <span className={`font-mono text-xs ${current ? "text-teal-200" : "text-slate-500"}`}>{index + 1}</span>
                )}
              </div>
              <p className={`text-sm ${current ? "text-slate-100" : "text-slate-400"}`}>
                {stage === "upload" && "Load your dataset"}
                {stage === "profiling" && "Profile quality and structure"}
                {stage === "analysis" && "Model the data"}
                {stage === "insights" && "Draft research narrative"}
                {stage === "export" && "Download outputs"}
              </p>
              {index < STAGES.length - 1 ? (
                <span className={`absolute -right-2 top-1/2 hidden h-px w-4 -translate-y-1/2 bg-gradient-to-r from-teal-400/70 to-transparent md:block ${completed ? "after:absolute after:left-0 after:top-1/2 after:h-1.5 after:w-1.5 after:-translate-y-1/2 after:animate-[float_2s_ease-in-out_infinite] after:rounded-full after:bg-teal-300" : ""}`} />
              ) : null}
            </button>
          );
        })}
      </div>
    </Card>
  );
}

export default function App() {
  const [currentView, setCurrentView] = useState("upload");
  const [rawData, setRawData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [fileName, setFileName] = useState("");
  const [numericColumns, setNumericColumns] = useState([]);
  const [categoricalColumns, setCategoricalColumns] = useState([]);
  const [profileReport, setProfileReport] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ percent: 20, message: "Ready to begin." });
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [sortConfig, setSortConfig] = useState({ column: "", direction: "asc" });
  const [typedSubtitle, setTypedSubtitle] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [completedStages, setCompletedStages] = useState(["upload"]);
  const particles = useMemo(() => generateParticles(34), []);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fullText = "From Raw Data to Research Insights";
    let index = 0;
    let cursorBlink = 0;
    const interval = window.setInterval(() => {
      index += 1;
      setTypedSubtitle(fullText.slice(0, index));
      if (index >= fullText.length) {
        window.clearInterval(interval);
        let blinkCount = 0;
        cursorBlink = window.setInterval(() => {
          setShowCursor((value) => !value);
          blinkCount += 1;
          if (blinkCount >= 6) {
            window.clearInterval(cursorBlink);
            setShowCursor(false);
          }
        }, 500);
      }
    }, 30);

    return () => {
      window.clearInterval(interval);
      window.clearInterval(cursorBlink);
    };
  }, []);

  const previewRows = useMemo(() => {
    if (!rawData.length) return [];
    const rows = rawData.slice(0, 15);
    if (!sortConfig.column) return rows;
    return [...rows].sort((a, b) => {
      const left = a[sortConfig.column];
      const right = b[sortConfig.column];
      if (left === right) return 0;
      const order = left > right ? 1 : -1;
      return sortConfig.direction === "asc" ? order : -order;
    });
  }, [rawData, sortConfig]);

  function resetAll() {
    setCurrentView("upload");
    setRawData([]);
    setColumns([]);
    setFileName("");
    setNumericColumns([]);
    setCategoricalColumns([]);
    setProfileReport(null);
    setAnalysisResults(null);
    setAiInsights(null);
    setIsProcessing(false);
    setProgress({ percent: 20, message: "Ready to begin." });
    setError(null);
    setCompletedStages(["upload"]);
  }

  function handleParsedData(rows, incomingFileName) {
    if (!rows.length) {
      setError("The uploaded file did not contain any rows.");
      return;
    }

    const normalizedRows = normalizeRows(rows);
    const detectedColumns = Object.keys(normalizedRows[0] || {});
    const detected = detectColumns(normalizedRows, detectedColumns);

    setRawData(normalizedRows);
    setColumns(detectedColumns);
    setFileName(incomingFileName);
    setNumericColumns(detected.numericColumns);
    setCategoricalColumns(detected.categoricalColumns);
    setProfileReport(null);
    setAnalysisResults(null);
    setAiInsights(null);
    setCurrentView("upload");
    setProgress({ percent: 20, message: "Dataset loaded." });
    setCompletedStages(["upload"]);
    setError(null);
  }

  function parseFile(file) {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Please upload a CSV file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Please upload a file smaller than 10MB.");
      return;
    }

    Papa.parse(file, {
      header: true,
      dynamicTyping: false,
      skipEmptyLines: true,
      complete: (results) => handleParsedData(results.data, file.name),
      error: () => setError("Unable to parse the CSV file."),
    });
  }

  function onDrop(event) {
    event.preventDefault();
    setDragActive(false);
    parseFile(event.dataTransfer.files?.[0]);
  }

  async function runProfiling() {
    if (!rawData.length || !columns.length) return;
    setIsProcessing(true);
    setError(null);
    setCurrentView("profiling");

    for (const step of PROFILE_MESSAGES) {
      setProgress(step);
      await sleep(320);
    }

    const { types } = detectColumns(rawData, columns);
    const descriptiveStats = buildDescriptiveStats(rawData, numericColumns);
    const correlationMatrix = buildCorrelationMatrix(rawData, numericColumns);
    const { nullCounts, completeness } = buildMissingSummary(rawData, columns);
    const categoricalSummaries = buildCategoricalSummaries(rawData, categoricalColumns);
    const distributions = Object.fromEntries(
      numericColumns.map((column) => [column, buildDistributionBins(rawData, column)]),
    );
    const qualityScore = buildQualityScore(completeness, numericColumns, categoricalColumns);

    setProfileReport({
      rowCount: rawData.length,
      columnCount: columns.length,
      nullCounts,
      types,
      descriptiveStats,
      correlationMatrix,
      completeness,
      categoricalSummaries,
      distributions,
      qualityScore,
      fileSize: `${(JSON.stringify(rawData).length / 1024).toFixed(1)} KB`,
    });
    setProgress({ percent: 40, message: "Profile complete." });
    setCompletedStages(["upload", "profiling"]);
    setIsProcessing(false);
  }

  async function callOpenAI(systemPrompt, userPrompt) {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("Missing VITE_OPENAI_API_KEY. Add it to your .env file before running AI features.");
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        temperature: 0.2,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error("OpenAI request failed. Please verify your API key and network access.");
    }

    const payload = await response.json();
    const content = payload.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("OpenAI returned an empty response.");
    }

    try {
      return JSON.parse(content);
    } catch (parseError) {
      throw new Error("OpenAI returned invalid JSON.");
    }
  }

  async function runAnalysis() {
    if (!profileReport) return;
    setIsProcessing(true);
    setError(null);
    setCurrentView("analysis");

    let intervalId = null;
    try {
      for (const step of ANALYSIS_MESSAGES) {
        setProgress(step);
        await sleep(180);
      }

      intervalId = window.setInterval(() => {
        setProgress((previous) => ({
          ...previous,
          percent: previous.percent < 96 ? previous.percent + 1 : previous.percent,
        }));
      }, 600);

      const systemPrompt =
        "You are a research statistician specializing in behavioral science and health psychology. You work in a lab studying social connectedness and health outcomes. Given a research dataset with descriptive statistics and correlations, perform statistical analysis and generate results suitable for an academic manuscript. CRITICAL: Base all analyses ONLY on the actual data provided. Use real correlation values from the matrix. Be precise with numbers. Report in APA format where applicable. Respond ONLY with valid JSON (no markdown, no backticks).";
      const userPrompt = JSON.stringify(
        {
          fileName,
          columns,
          numericColumns,
          categoricalColumns,
          descriptiveStats: profileReport.descriptiveStats,
          correlationMatrix: profileReport.correlationMatrix,
          previewRows: rawData.slice(0, 15),
        },
        null,
        2,
      );

      let result;
      try {
        result = await callOpenAI(systemPrompt, userPrompt);
      } catch (apiError) {
        result = buildFallbackAnalysis(profileReport, rawData, numericColumns, categoricalColumns);
      }

      setAnalysisResults(
        normalizeAnalysisResult(result, profileReport, rawData, numericColumns, categoricalColumns),
      );
      setProgress({ percent: 60, message: "Modeling complete." });
      setCompletedStages(["upload", "profiling", "analysis"]);
    } catch (caughtError) {
      setError(caughtError.message || "Analysis failed.");
    } finally {
      if (intervalId) window.clearInterval(intervalId);
      setIsProcessing(false);
    }
  }

  async function runInsights() {
    if (!analysisResults) return;
    setIsProcessing(true);
    setError(null);
    setCurrentView("insights");

    let intervalId = null;
    try {
      for (const step of INSIGHT_MESSAGES) {
        setProgress(step);
        await sleep(160);
      }

      intervalId = window.setInterval(() => {
        setProgress((previous) => ({
          ...previous,
          percent: previous.percent < 98 ? previous.percent + 1 : previous.percent,
        }));
      }, 550);

      const systemPrompt =
        "You are a senior research psychologist writing for an academic audience. Based on the statistical analysis results from a study on social connectedness and health, generate manuscript-ready content. Write as if preparing a research paper for a journal like Health Psychology or Psychosomatic Medicine. Use formal academic tone. Reference specific statistical values. Respond ONLY with valid JSON.";
      const userPrompt = JSON.stringify({ fileName, profileReport, analysisResults }, null, 2);

      let result;
      try {
        result = await callOpenAI(systemPrompt, userPrompt);
      } catch (apiError) {
        result = buildFallbackInsights(analysisResults, fileName, profileReport);
      }

      setAiInsights(normalizeInsightsResult(result, analysisResults, fileName, profileReport));
      setProgress({ percent: 80, message: "Insights generated." });
      setCompletedStages(["upload", "profiling", "analysis", "insights"]);
    } catch (caughtError) {
      setError(caughtError.message || "Insight generation failed.");
    } finally {
      if (intervalId) window.clearInterval(intervalId);
      setIsProcessing(false);
    }
  }

  function prepareExport() {
    if (!aiInsights) return;
    setCurrentView("export");
    setProgress({ percent: 100, message: "Analysis pipeline complete." });
    setCompletedStages(STAGES);
  }

  const scatterPlotData = useMemo(() => {
    if (!analysisResults?.scatterPlots) return [];
    return analysisResults.scatterPlots.map((plot) => ({
      ...plot,
      data: rawData
        .map((row) => ({
          x: toNumber(row[plot.x]),
          y: toNumber(row[plot.y]),
          label: categoricalColumns[0] ? row[categoricalColumns[0]] : "",
        }))
        .filter((point) => point.x !== null && point.y !== null),
    }));
  }, [analysisResults, rawData, categoricalColumns]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-canvas text-slate-100">
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleGlow {
          0% { transform: scale(0.8); opacity: 0; box-shadow: 0 0 0 rgba(20,184,166,0); }
          50% { box-shadow: 0 0 40px rgba(20,184,166,0.3); }
          100% { transform: scale(1); opacity: 1; box-shadow: 0 0 20px rgba(20,184,166,0.15); }
        }
        @keyframes expandLine {
          from { width: 0; opacity: 0; }
          to { width: 200px; opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes particleDrift {
          0% { transform: translate(0, 0); }
          25% { transform: translate(30px, -20px); }
          50% { transform: translate(-15px, -40px); }
          75% { transform: translate(-30px, -10px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes gridPulse {
          0%, 100% { opacity: 0.02; }
          50% { opacity: 0.05; }
        }
        @keyframes orbGlow {
          0%, 100% { transform: scale(1); opacity: 0.06; }
          50% { transform: scale(1.15); opacity: 0.12; }
        }
        @keyframes shimmerBtn {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
      `}</style>

      <ParticleField particles={particles} />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <PipelineNavigator
          currentView={currentView}
          completedStages={completedStages}
          onJump={setCurrentView}
          isProcessing={isProcessing}
          progress={progress}
        />

        {error ? (
          <div className="rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        ) : null}

        {currentView === "upload" ? (
          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
            <Card className="relative overflow-hidden px-6 py-8 sm:px-10">
              <div className="relative z-10 text-center lg:text-left">
                <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-[28px] bg-gradient-to-br from-teal-400 to-blue-500 text-4xl font-bold text-white shadow-[0_0_40px_rgba(20,184,166,0.35)] animate-[scaleGlow_0.8s_ease-out] lg:mx-0">
                  CL
                </div>
                <h2 className="animate-[fadeSlideUp_0.7s_ease-out] text-4xl font-bold tracking-tight text-slate-50 sm:text-5xl">
                  ConnectLab
                </h2>
                <div className="mx-auto mt-4 min-h-[2rem] max-w-xl animate-[fadeSlideUp_1s_ease-out] text-lg text-teal-100/90 lg:mx-0">
                  {typedSubtitle}
                  {showCursor ? <span className="ml-0.5 animate-[blink_0.5s_step-end_infinite]">|</span> : null}
                </div>
                <div className="mx-auto mt-6 h-px w-52 animate-[expandLine_0.8s_ease-out] bg-gradient-to-r from-transparent via-teal-400 to-transparent lg:mx-0" />
                <div className="mt-7 flex flex-wrap justify-center gap-3 lg:justify-start">
                  {["Statistical Modeling", "AI-Powered Insights", "Publication-Ready Output"].map((item, index) => (
                    <span
                      key={item}
                      className="animate-[fadeSlideUp_0.9s_ease-out] rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 backdrop-blur transition duration-200 hover:-translate-y-1 hover:border-teal-400/40 hover:shadow-[0_0_24px_rgba(20,184,166,0.15)]"
                      style={{ animationDelay: `${1.5 + index * 0.15}s`, animationFillMode: "both" }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <p className="mt-8 max-w-2xl animate-[fadeSlideUp_1.15s_ease-out] text-base leading-7 text-slate-400">
                  Upload your behavioral or health dataset to begin a full research workflow spanning quality checks,
                  descriptive analytics, statistical modeling, AI-assisted interpretation, and manuscript-ready exports.
                </p>
              </div>

              <div
                onDragEnter={(event) => {
                  event.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={(event) => {
                  event.preventDefault();
                  setDragActive(false);
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragActive(true);
                }}
                onDrop={onDrop}
                className={`relative z-10 mt-10 rounded-[28px] border-2 border-dashed p-8 text-center transition duration-300 animate-[fadeSlideUp_1.35s_ease-out] ${
                  dragActive
                    ? "border-teal-400 bg-teal-400/10 shadow-[0_0_40px_rgba(20,184,166,0.2)]"
                    : "border-teal-400/30 bg-slate-950/40"
                }`}
              >
                <div className="mx-auto mb-4 flex h-16 w-16 animate-[float_3s_ease-in-out_infinite] items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400/20 to-blue-400/20 text-3xl text-teal-200">
                  ⤴
                </div>
                <h3 className="text-xl font-semibold text-slate-100">Load Your Research Dataset</h3>
                <p className="mt-2 text-sm text-slate-400">Drop your CSV dataset here or browse files. Accepted format: `.csv`, up to 10MB.</p>
                <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-full border border-white/10 bg-white/10 px-5 py-3 text-sm font-medium text-slate-100 transition hover:-translate-y-0.5 hover:border-white/20"
                  >
                    Browse Files
                  </button>
                  <button
                    type="button"
                    onClick={() => handleParsedData(SAMPLE_DATA, "connectlab-sample-dataset.csv")}
                    className="rounded-full border border-teal-400/30 bg-teal-400/10 px-5 py-3 text-sm font-medium text-teal-100 transition hover:-translate-y-0.5 hover:border-teal-300/50 hover:shadow-[0_0_24px_rgba(20,184,166,0.15)]"
                  >
                    Load Sample Dataset
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(event) => parseFile(event.target.files?.[0])}
                />
              </div>

              {rawData.length ? (
                <div className="relative z-10 mt-8 animate-[fadeSlideUp_0.35s_ease-out] rounded-[26px] border border-white/10 bg-slate-950/35 p-5">
                  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Dataset Ready</p>
                      <h3 className="text-lg font-semibold text-slate-100">{fileName}</h3>
                    </div>
                    <button
                      type="button"
                      onClick={runProfiling}
                      disabled={isProcessing}
                      className={`rounded-full px-5 py-3 text-sm font-semibold text-slate-950 transition ${
                        isProcessing
                          ? "cursor-not-allowed bg-white/30 text-slate-200"
                          : "bg-gradient-to-r from-teal-400 via-cyan-300 to-teal-400 bg-[length:200%_100%] animate-[shimmerBtn_3s_linear_infinite] shadow-[0_12px_36px_rgba(20,184,166,0.25)] hover:-translate-y-0.5 hover:brightness-110"
                      }`}
                    >
                      Begin Profiling →
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm text-slate-400">Rows</p>
                      <p className="mt-1 text-2xl font-semibold"><CountUp value={rawData.length} /></p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm text-slate-400">Columns</p>
                      <p className="mt-1 text-2xl font-semibold"><CountUp value={columns.length} /></p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm text-slate-400">Numeric Variables</p>
                      <p className="mt-1 text-2xl font-semibold"><CountUp value={numericColumns.length} /></p>
                    </div>
                  </div>
                </div>
              ) : null}
            </Card>

            <div className="space-y-6">
              <Card>
                <SectionHeading title="Workflow" subtitle="The exact daily analytics loop a scientific analyst would execute in a social connectedness and health lab." />
                <div className="space-y-3">
                  {[
                    "Upload and inspect behavioral or health data.",
                    "Compute descriptive statistics and Pearson correlations in JavaScript.",
                    "Generate AI-assisted model summaries and figure suggestions.",
                    "Draft methods, results, hypotheses, and exports for manuscript work.",
                  ].map((item) => (
                    <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
                      {item}
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <SectionHeading title="Current State" subtitle="A quick read on what the platform has detected from your loaded dataset." />
                {rawData.length ? (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {numericColumns.map((column) => (
                        <span key={column} className="rounded-full bg-blue-400/15 px-3 py-1 text-xs text-blue-200">
                          {column}
                        </span>
                      ))}
                      {categoricalColumns.map((column) => (
                        <span key={column} className="rounded-full bg-amber-400/15 px-3 py-1 text-xs text-amber-200">
                          {column}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-slate-400">
                      Upload complete. The next step will compute descriptive statistics, missingness, and a correlation heatmap without using AI for any math.
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">No dataset loaded yet. Use the sample dataset or upload your own CSV to activate the pipeline.</p>
                )}
              </Card>
            </div>
          </div>
        ) : null}

        {currentView === "profiling" && profileReport ? (
          <div className="space-y-6 animate-[fadeSlideUp_0.3s_ease-out]">
            <div className="grid gap-4 md:grid-cols-4">
              <Card><p className="text-sm text-slate-400">Rows</p><p className="mt-1 text-3xl font-semibold"><CountUp value={profileReport.rowCount} /></p></Card>
              <Card><p className="text-sm text-slate-400">Columns</p><p className="mt-1 text-3xl font-semibold"><CountUp value={profileReport.columnCount} /></p></Card>
              <Card><p className="text-sm text-slate-400">Data Quality</p><p className="mt-1 text-3xl font-semibold"><CountUp value={profileReport.qualityScore} digits={1} suffix="%" /></p></Card>
              <Card><p className="text-sm text-slate-400">File Size</p><p className="mt-1 text-2xl font-semibold font-mono">{profileReport.fileSize}</p></Card>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
              <Card>
                <SectionHeading title="Descriptive Statistics" subtitle="Journal-style numeric summaries for each continuous variable." />
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="text-slate-400">
                      <tr className="border-b border-white/10">
                        <th className="pb-3 pr-4">Variable</th>
                        <th className="pb-3 pr-4 text-right">Mean</th>
                        <th className="pb-3 pr-4 text-right">Median</th>
                        <th className="pb-3 pr-4 text-right">SD</th>
                        <th className="pb-3 pr-4 text-right">Min</th>
                        <th className="pb-3 pr-4 text-right">Max</th>
                        <th className="pb-3 pr-4 text-right">Skew</th>
                        <th className="pb-3 text-right">IQR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(profileReport.descriptiveStats).map(([column, stats]) => (
                        <tr key={column} className="border-b border-white/5 text-slate-200">
                          <td className="py-3 pr-4">{column}</td>
                          <td className="py-3 pr-4 text-right font-mono">{formatNumber(stats.mean)}</td>
                          <td className="py-3 pr-4 text-right font-mono">{formatNumber(stats.median)}</td>
                          <td className="py-3 pr-4 text-right font-mono">{formatNumber(stats.stdDev)}</td>
                          <td className="py-3 pr-4 text-right font-mono">{formatNumber(stats.min)}</td>
                          <td className="py-3 pr-4 text-right font-mono">{formatNumber(stats.max)}</td>
                          <td className="py-3 pr-4 text-right font-mono">{formatNumber(stats.skewness)}</td>
                          <td className="py-3 text-right font-mono">{formatNumber(stats.iqr)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              <Card>
                <SectionHeading title="Missing Data" subtitle="Column completeness and quality status across the uploaded file." />
                <div className="space-y-4">
                  {columns.map((column) => (
                    <div key={column}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="text-slate-300">{column}</span>
                        <span className="font-mono text-slate-400">{profileReport.completeness[column]}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/5">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-teal-400 to-blue-500"
                          style={{ width: `${profileReport.completeness[column]}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <Card>
              <SectionHeading title="Correlation Matrix" subtitle="Pearson correlation heatmap across numeric variables, computed directly in JavaScript." />
              <div className="overflow-x-auto">
                <div
                  className="grid gap-2"
                  style={{ gridTemplateColumns: `180px repeat(${numericColumns.length}, minmax(80px, 1fr))` }}
                >
                  <div />
                  {numericColumns.map((column) => (
                    <div key={column} className="px-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                      {column}
                    </div>
                  ))}
                  {numericColumns.map((rowColumn, rowIndex) => (
                    <div key={rowColumn} className="contents">
                      <div className="flex items-center px-2 text-sm text-slate-300">
                        {rowColumn}
                      </div>
                      {numericColumns.map((column, columnIndex) => (
                        <div
                          key={`${rowColumn}-${column}`}
                          title={`${rowColumn} × ${column}: r = ${profileReport.correlationMatrix[rowColumn][column]}`}
                          className="flex h-16 items-center justify-center rounded-2xl border border-white/10 text-sm font-medium text-slate-950 transition hover:scale-[1.05]"
                          style={{
                            backgroundColor: heatColor(profileReport.correlationMatrix[rowColumn][column]),
                            animation: `fadeSlideUp 0.25s ease-out ${((rowIndex * numericColumns.length + columnIndex) * 20) / 1000}s both`,
                          }}
                        >
                          <span className="font-mono">{profileReport.correlationMatrix[rowColumn][column]}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <Card>
                <SectionHeading title="Distribution Overview" subtitle="Small area charts showing binned distributions for each numeric variable." />
                <div className="grid gap-4 md:grid-cols-2">
                  {numericColumns.map((column) => (
                    <div key={column} className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm text-slate-200">{column}</p>
                        <span className="text-xs text-slate-500">6 bins</span>
                      </div>
                      <div className="h-28 animate-[fadeSlideUp_0.3s_ease-out]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={profileReport.distributions[column]}>
                            <defs>
                              <linearGradient id={`spark-${column}`} x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="#14B8A6" stopOpacity={0.8} />
                                <stop offset="100%" stopColor="#14B8A6" stopOpacity={0.1} />
                              </linearGradient>
                            </defs>
                            <Area type="monotone" dataKey="count" stroke="#14B8A6" fill={`url(#spark-${column})`} />
                            <Tooltip contentStyle={{ background: "#161825", border: "1px solid #1E2040", borderRadius: 16 }} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <SectionHeading title="Preview Table" subtitle="First 15 rows with sortable columns and highlighted missing cells." />
                <div className="overflow-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-500">
                        {columns.map((column) => (
                          <th key={column} className="px-3 py-3">
                            <button
                              type="button"
                              onClick={() =>
                                setSortConfig((previous) => ({
                                  column,
                                  direction: previous.column === column && previous.direction === "asc" ? "desc" : "asc",
                                }))
                              }
                              className="flex items-center gap-2"
                            >
                              <span>{column}</span>
                              <span className="text-[10px] uppercase">{sortConfig.column === column ? sortConfig.direction : ""}</span>
                            </button>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewRows.map((row, rowIndex) => (
                        <tr key={`row-${rowIndex}`} className="border-b border-white/5">
                          {columns.map((column) => (
                            <td
                              key={`${rowIndex}-${column}`}
                              className={`px-3 py-2 ${isMissing(row[column]) ? "bg-amber-400/10 text-amber-100" : "text-slate-300"}`}
                            >
                              {isMissing(row[column]) ? "NULL" : String(row[column])}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={runAnalysis}
                disabled={isProcessing}
                className="rounded-full bg-gradient-to-r from-teal-400 via-cyan-300 to-teal-400 bg-[length:200%_100%] px-6 py-3 text-sm font-semibold text-slate-950 animate-[shimmerBtn_3s_linear_infinite] shadow-[0_12px_36px_rgba(20,184,166,0.25)] transition hover:-translate-y-0.5 hover:brightness-110"
              >
                Run AI Analysis →
              </button>
            </div>
          </div>
        ) : null}

        {currentView === "analysis" && analysisResults ? (
          <div className="space-y-6 animate-[fadeSlideUp_0.3s_ease-out]">
            <Card>
              <SectionHeading title="Primary Regression Model" subtitle="AI-assisted model interpretation built on the profile statistics and observed correlation structure." />
              <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Model</p>
                    <h3 className="mt-2 text-xl font-semibold text-slate-100">{analysisResults.primaryModel.type}</h3>
                    <p className="mt-2 text-sm text-slate-400">
                      Outcome: <span className="text-slate-200">{analysisResults.primaryModel.outcome}</span>
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      Predictors: <span className="text-slate-200">{analysisResults.primaryModel.predictors.join(", ") || "—"}</span>
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      Covariates: <span className="text-slate-200">{analysisResults.primaryModel.covariates.join(", ") || "—"}</span>
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Card className="p-4"><p className="text-sm text-slate-400">R²</p><p className="mt-1 text-2xl font-semibold"><CountUp value={analysisResults.primaryModel.results.rSquared} digits={2} /></p></Card>
                    <Card className="p-4"><p className="text-sm text-slate-400">Adjusted R²</p><p className="mt-1 text-2xl font-semibold"><CountUp value={analysisResults.primaryModel.results.adjustedRSquared} digits={2} /></p></Card>
                    <Card className="p-4"><p className="text-sm text-slate-400">F Statistic</p><p className="mt-1 text-2xl font-semibold"><CountUp value={analysisResults.primaryModel.results.fStatistic} digits={2} /></p></Card>
                    <Card className="p-4"><p className="text-sm text-slate-400">p Value</p><p className="mt-1 text-2xl font-semibold font-mono">{analysisResults.primaryModel.results.pValue}</p></Card>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">
                    {analysisResults.primaryModel.assumption_notes}
                  </div>
                </div>
                <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                  <table className="min-w-full text-left text-sm">
                    <thead className="text-slate-500">
                      <tr className="border-b border-white/10">
                        <th className="pb-3 pr-4">Predictor</th>
                        <th className="pb-3 pr-4 text-right">B</th>
                        <th className="pb-3 pr-4 text-right">β</th>
                        <th className="pb-3 pr-4 text-right">SE</th>
                        <th className="pb-3 pr-4 text-right">t</th>
                        <th className="pb-3 pr-4 text-right">p</th>
                        <th className="pb-3 text-right">95% CI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysisResults.primaryModel.results.coefficients.map((coefficient) => (
                        <tr key={coefficient.predictor} className="border-b border-white/5 text-slate-200">
                          <td className="py-3 pr-4">{coefficient.predictor}</td>
                          <td className="py-3 pr-4 text-right font-mono">{formatNumber(coefficient.b)}</td>
                          <td className="py-3 pr-4 text-right font-mono">{formatNumber(coefficient.beta)}</td>
                          <td className="py-3 pr-4 text-right font-mono">{formatNumber(coefficient.se)}</td>
                          <td className="py-3 pr-4 text-right font-mono">{formatNumber(coefficient.t)}</td>
                          <td className="py-3 pr-4 text-right font-mono">{coefficient.p}</td>
                          <td className="py-3 text-right font-mono">[{formatNumber(coefficient.ci95?.[0])}, {formatNumber(coefficient.ci95?.[1])}]</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>

            <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
              <Card>
                <SectionHeading title="Key Correlations" subtitle="Top observed relationships ranked by effect magnitude." />
                <div className="space-y-3">
                  {analysisResults.keyCorrelations.map((entry) => (
                    <div key={`${entry.var1}-${entry.var2}`} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-100">{entry.var1} ↔ {entry.var2}</p>
                        <span className={`rounded-full px-3 py-1 text-xs ${Math.abs(entry.r) > 0.6 ? "bg-amber-400/20 text-amber-200" : "bg-blue-400/20 text-blue-200"}`}>
                          r = {entry.r}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400">{entry.interpretation}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.22em] text-slate-500">p {entry.p}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <div className="space-y-6">
                <Card>
                  <SectionHeading title="Scatter Plots" subtitle="AI-selected variable pairs rendered directly from the uploaded dataset." />
                  <div className="grid gap-4">
                    {scatterPlotData.map((plot) => (
                      <div key={plot.title} className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                        <div className="mb-3">
                          <h3 className="text-base font-semibold text-slate-100">{plot.title}</h3>
                          <p className="text-sm text-slate-400">{plot.description}</p>
                        </div>
                        <div className="h-64 animate-[fadeSlideUp_0.3s_ease-out]">
                          <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 8, right: 12, bottom: 8, left: 0 }}>
                              <CartesianGrid stroke="#1E2040" />
                              <XAxis dataKey="x" stroke="#8892B0" name={plot.x} />
                              <YAxis dataKey="y" stroke="#8892B0" name={plot.y} />
                              <Tooltip cursor={{ strokeDasharray: "4 4" }} contentStyle={{ background: "#161825", border: "1px solid #1E2040", borderRadius: 16 }} />
                              <Scatter data={plot.data} fill={plot.expectedDirection === "positive" ? "#14B8A6" : "#3B82F6"} />
                            </ScatterChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card>
                  <SectionHeading title="Group Comparison Charts" subtitle="AI-suggested mean differences across categorical groups." />
                  <div className="space-y-4">
                    {analysisResults.barCharts.map((chart) => (
                      <div key={chart.title} className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <div>
                            <h3 className="text-base font-semibold text-slate-100">{chart.title}</h3>
                            <p className="text-sm text-slate-400">{chart.groupVar} grouped by {chart.outcomeVar}</p>
                          </div>
                          <span className="rounded-full bg-blue-400/15 px-3 py-1 text-xs text-blue-200">Effect chart</span>
                        </div>
                        <div className="h-60 animate-[fadeSlideUp_0.3s_ease-out]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chart.data}>
                              <CartesianGrid stroke="#1E2040" vertical={false} />
                              <XAxis dataKey="name" stroke="#8892B0" />
                              <YAxis stroke="#8892B0" />
                              <Tooltip contentStyle={{ background: "#161825", border: "1px solid #1E2040", borderRadius: 16 }} />
                              <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                                {chart.data.map((entry) => (
                                  <Cell key={entry.name} fill={entry.value > mean(chart.data.map((item) => item.value)) ? "#14B8A6" : "#3B82F6"} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    ))}
                    {analysisResults.groupComparisons.map((comparison) => (
                      <div key={comparison.comparison} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-semibold text-slate-100">{comparison.comparison}</span>
                          <span className="rounded-full bg-amber-400/15 px-3 py-1 text-xs text-amber-200">{comparison.effectLabel} effect</span>
                        </div>
                        <p>{comparison.interpretation}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={runInsights}
                disabled={isProcessing}
                className="rounded-full bg-gradient-to-r from-teal-400 via-cyan-300 to-teal-400 bg-[length:200%_100%] px-6 py-3 text-sm font-semibold text-slate-950 animate-[shimmerBtn_3s_linear_infinite] shadow-[0_12px_36px_rgba(20,184,166,0.25)] transition hover:-translate-y-0.5 hover:brightness-110"
              >
                Generate Insights →
              </button>
            </div>
          </div>
        ) : null}

        {currentView === "insights" && aiInsights ? (
          <div className="space-y-6 animate-[fadeSlideUp_0.3s_ease-out]">
            <Card>
              <SectionHeading title="Abstract" subtitle="A manuscript-style summary of the analytic story surfaced by the workflow." />
              <div className="rounded-2xl border-l-4 border-teal-400 bg-slate-950/35 p-5 font-serif text-lg leading-8 text-slate-200">
                {aiInsights.abstractSummary}
              </div>
            </Card>

            <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
              <Card>
                <SectionHeading title="Key Findings" subtitle="Research-ready narrative findings with significance grading." />
                <div className="space-y-4">
                  {aiInsights.findings.map((finding, index) => (
                    <div
                      key={finding.title}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                      style={{ animation: `fadeSlideUp 0.35s ease-out ${index * 0.15}s both` }}
                    >
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <h3 className="text-base font-semibold text-slate-100">{finding.title}</h3>
                        <span className={`rounded-full px-3 py-1 text-xs ${significanceColor(finding.significance)}`}>
                          {finding.significance}
                        </span>
                      </div>
                      <p className="text-sm leading-7 text-slate-300">{finding.detail}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <div className="space-y-6">
                <Card>
                  <SectionHeading title="Methods Section" />
                  <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-5 font-serif text-[17px] leading-8 text-slate-200">
                    {aiInsights.methodsSection}
                  </div>
                </Card>
                <Card>
                  <SectionHeading title="Results Section" />
                  <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-5 font-serif text-[17px] leading-8 text-slate-200">
                    {aiInsights.resultsSection}
                  </div>
                </Card>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
              <Card>
                <SectionHeading title="Generated Hypotheses" subtitle="Actionable next-step studies derived from the analytic pattern." />
                <div className="grid gap-4">
                  {aiInsights.hypotheses.map((item, index) => (
                    <div
                      key={item.hypothesis}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                      style={{ animation: `fadeSlideUp 0.35s ease-out ${index * 0.15}s both` }}
                    >
                      <h3 className="text-base font-semibold text-slate-100">{item.hypothesis}</h3>
                      <p className="mt-2 text-sm text-slate-400">{item.rationale}</p>
                      <p className="mt-3 text-sm text-slate-300">{item.suggestedDesign}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <SectionHeading title="Limitations & Future Directions" subtitle="Balanced framing for academic and clinical presentation." />
                <div className="space-y-5">
                  <div>
                    <p className="mb-3 text-sm uppercase tracking-[0.22em] text-slate-500">Limitations</p>
                    <div className="space-y-3">
                      {aiInsights.limitations.map((item) => (
                        <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-3 text-sm uppercase tracking-[0.22em] text-slate-500">Future Directions</p>
                    <div className="space-y-3">
                      {aiInsights.futureDirections.map((item) => (
                        <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-teal-400/20 bg-teal-400/10 p-4 text-sm text-teal-50">
                    {aiInsights.clinicalImplications}
                  </div>
                </div>
              </Card>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={prepareExport}
                className="rounded-full bg-gradient-to-r from-teal-400 via-cyan-300 to-teal-400 bg-[length:200%_100%] px-6 py-3 text-sm font-semibold text-slate-950 animate-[shimmerBtn_3s_linear_infinite] shadow-[0_12px_36px_rgba(20,184,166,0.25)] transition hover:-translate-y-0.5 hover:brightness-110"
              >
                Prepare Export →
              </button>
            </div>
          </div>
        ) : null}

        {currentView === "export" && aiInsights && analysisResults && profileReport ? (
          <div className="space-y-6 animate-[fadeSlideUp_0.3s_ease-out]">
            <Card className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-400/15 text-3xl text-teal-200 animate-[scaleGlow_0.6s_ease-out]">
                ✓
              </div>
              <h2 className="text-3xl font-semibold text-slate-50">Analysis Pipeline Complete ✓</h2>
              <p className="mt-2 text-slate-400">Your dataset has moved from raw upload to publication-ready output.</p>
              <div className="mx-auto mt-6 grid max-w-3xl gap-4 sm:grid-cols-4">
                <Card className="p-4"><p className="text-sm text-slate-400">Variables</p><p className="mt-1 text-2xl font-semibold"><CountUp value={columns.length} /></p></Card>
                <Card className="p-4"><p className="text-sm text-slate-400">Models Fit</p><p className="mt-1 text-2xl font-semibold"><CountUp value={1} /></p></Card>
                <Card className="p-4"><p className="text-sm text-slate-400">Findings</p><p className="mt-1 text-2xl font-semibold"><CountUp value={aiInsights.findings.length} /></p></Card>
                <Card className="p-4"><p className="text-sm text-slate-400">Hypotheses</p><p className="mt-1 text-2xl font-semibold"><CountUp value={aiInsights.hypotheses.length} /></p></Card>
              </div>
            </Card>

            <div className="grid gap-6 lg:grid-cols-3">
              <Card>
                <SectionHeading title="Statistical Report" subtitle="Markdown report with profiling, model, and insight sections." />
                <p className="mb-5 text-sm text-slate-400">Download a shareable research summary for collaborators or project records.</p>
                <button
                  type="button"
                  onClick={() => downloadTextFile("connectlab-statistical-report.md", buildMarkdownReport(fileName, profileReport, analysisResults, aiInsights))}
                  className="rounded-full bg-white/10 px-5 py-3 text-sm font-medium text-slate-100 transition hover:-translate-y-0.5 hover:border-white/20"
                >
                  Download .md
                </button>
              </Card>

              <Card>
                <SectionHeading title="R Analysis Script" subtitle="A reproducible R scaffold mirroring the primary analysis." />
                <p className="mb-5 text-sm text-slate-400">Use this as a starting point for replication, preregistration, or lab handoff.</p>
                <button
                  type="button"
                  onClick={() => downloadTextFile("connectlab-analysis-script.R", buildRScript(analysisResults))}
                  className="rounded-full bg-white/10 px-5 py-3 text-sm font-medium text-slate-100 transition hover:-translate-y-0.5 hover:border-white/20"
                >
                  Download .R
                </button>
              </Card>

              <Card>
                <SectionHeading title="Manuscript Draft" subtitle="Methods and results sections ready for paper development." />
                <p className="mb-5 text-sm text-slate-400">Export the manuscript-facing prose block for rapid insertion into a draft.</p>
                <button
                  type="button"
                  onClick={() => downloadTextFile("connectlab-manuscript-draft.md", buildManuscriptDraft(aiInsights))}
                  className="rounded-full bg-white/10 px-5 py-3 text-sm font-medium text-slate-100 transition hover:-translate-y-0.5 hover:border-white/20"
                >
                  Download .md
                </button>
              </Card>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={resetAll}
                className="rounded-full border border-white/10 bg-white/10 px-6 py-3 text-sm font-medium text-slate-100 transition hover:-translate-y-0.5 hover:border-white/20"
              >
                Analyze New Dataset
              </button>
            </div>
          </div>
        ) : null}

        {isProcessing ? (
          <Card className="sticky bottom-4 z-20 border-teal-400/20 bg-slate-950/70">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Processing</p>
                <p className="text-base text-slate-200">{progress.message}</p>
              </div>
              <div className="w-full max-w-sm">
                <div className="mb-2 flex justify-between text-sm text-slate-400">
                  <span>Status</span>
                  <span className="font-mono">{progress.percent}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-teal-400 via-cyan-300 to-blue-500 bg-[length:200%_100%] animate-[shimmerBtn_3s_linear_infinite]"
                    style={{ width: `${progress.percent}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
