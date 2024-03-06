/* eslint-disable no-console */
import { readFile } from 'fs/promises';
import { globby } from 'globby';

interface RunTimes {
  [key: string]: number;
}
interface TestResult {
  [key: string]: RunTimes;
}

const getRuntimes = (csv: string): RunTimes => {
  const lines = csv.split('\n');
  const runtimes: RunTimes = {};
  for (const line of lines) {
    const [testName, timeTaken] = line.split(',');
    if (testName && timeTaken) {
      runtimes[testName] = Number(timeTaken);
    }
  }
  return runtimes;
};

const readStats = async (path: string): Promise<TestResult> => {
  const files = await globby(path);
  const contents = await Promise.all(
    files.map(async (file) => [file, await readFile(file, 'utf-8')])
  );
  const sizes = contents.map(([file, content]) => [file.split('/').pop(), getRuntimes(content)]);
  return Object.fromEntries(sizes);
};

const percentChangeThreshold = 5;
const percentageDifference = (
  oldValue: number,
  newValue: number
): { change: string; crossedThreshold: boolean } => {
  const difference = Math.abs(newValue - oldValue);
  const avg = (newValue + oldValue) / 2;
  const percentage = (difference / avg) * 100;
  const roundedPercentage = percentage.toFixed(2); // Round to two decimal places
  if (roundedPercentage === '0.00') {
    return { change: '0.00%', crossedThreshold: false };
  }
  const sign = newValue > oldValue ? '+' : '-';
  return {
    change: `${sign}${roundedPercentage}%`,
    crossedThreshold: percentage > percentChangeThreshold,
  };
};

const main = async () => {
  const base = process.argv[2] || './cypress/snapshots';
  const oldStats = await readStats(`${base}/runtimes/base/**/*.csv`);
  const newStats = await readStats(`${base}/runtimes/head/**/*.csv`);
  const fullData: string[][] = [];
  const changed: string[][] = [];
  let oldRuntimeSum = 0;
  let newRuntimeSum = 0;
  let testCount = 0;
  for (const [fileName, runtimes] of Object.entries(newStats)) {
    const oldStat = oldStats[fileName];
    if (!oldStat) {
      continue;
    }
    for (const [testName, timeTaken] of Object.entries(runtimes)) {
      const oldTimeTaken = oldStat[testName];
      if (!oldTimeTaken) {
        continue;
      }
      oldRuntimeSum += oldTimeTaken;
      newRuntimeSum += timeTaken;
      testCount++;
      const delta = timeTaken - oldTimeTaken;

      const { change, crossedThreshold } = percentageDifference(oldTimeTaken, timeTaken);
      const out = [
        fileName,
        testName.replace('#', ''),
        `${oldTimeTaken}/${timeTaken}`,
        `${delta.toString()}ms ${change}`,
      ];
      if (crossedThreshold && Math.abs(delta) > 25) {
        changed.push(out);
      }
      fullData.push(out);
    }
  }
  const oldAverage = oldRuntimeSum / testCount;
  const newAverage = newRuntimeSum / testCount;
  const { change, crossedThreshold } = percentageDifference(oldAverage, newAverage);

  const headers = ['File', 'Test', 'Time Old/New', 'Change (%)'];
  console.log(`## Runtime Changes
Old runtime average: ${oldAverage.toFixed(2)}ms
New runtime average: ${newAverage.toFixed(2)}ms
Change: ${change} ${crossedThreshold ? '⚠️' : ''}
  `);
  console.log(`
  <details>
  <summary>Changed tests</summary>
  ${htmlTable([headers, ...changed])}
</details>
`);
  console.log(`
  <details>
  <summary>Full Data</summary>
  ${htmlTable([headers, ...fullData])}
</details>
`);
};

const htmlTable = (data: string[][]): string => {
  let table = `<table border='1' style="border-collapse: collapse">`;

  // Generate table header
  table += `<tr>
    ${data
      .shift()!
      .map((header) => `<th>${header}</th>`)
      .join('')}
    </tr>`;

  // Generate table rows
  for (const row of data) {
    table += `<tr>
    ${row.map((cell) => `<td>${cell}</td>`).join('')}
    </tr>`;
  }

  table += '</table>';
  return table;
};

void main().catch((e) => console.error(e));
