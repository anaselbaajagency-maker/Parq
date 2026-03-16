#!/usr/bin/env node

import { execSync } from 'node:child_process';

function runCommand(command) {
    try {
        return execSync(command, {
            encoding: 'utf8',
            stdio: ['ignore', 'pipe', 'pipe'],
        });
    } catch (error) {
        if (typeof error?.stdout === 'string') {
            return error.stdout;
        }

        return '';
    }
}

function normalizeFilePath(filePath) {
    const cwdPrefix = `${process.cwd()}/`;
    if (filePath.startsWith(cwdPrefix)) {
        return filePath.slice(cwdPrefix.length);
    }

    return filePath;
}

const lintJsonRaw = runCommand('eslint src --format json || true').trim();
const lintResults = lintJsonRaw ? JSON.parse(lintJsonRaw) : [];

let warningCount = 0;
let errorCount = 0;
let explicitAnyCount = 0;

const explicitAnyByFile = new Map();
const warningByRule = new Map();

for (const result of lintResults) {
    warningCount += result.warningCount || 0;
    errorCount += result.errorCount || 0;

    const filePath = normalizeFilePath(result.filePath || '');
    const messages = result.messages || [];

    for (const message of messages) {
        const ruleId = message.ruleId || 'unknown';

        if (message.severity === 1) {
            warningByRule.set(ruleId, (warningByRule.get(ruleId) || 0) + 1);
        }

        if (ruleId === '@typescript-eslint/no-explicit-any') {
            explicitAnyCount += 1;
            explicitAnyByFile.set(filePath, (explicitAnyByFile.get(filePath) || 0) + 1);
        }
    }
}

console.log('Frontend Quality Report');
console.log(`- Explicit "any" occurrences (ESLint): ${explicitAnyCount}`);
console.log(`- ESLint warnings: ${warningCount}`);
console.log(`- ESLint errors: ${errorCount}`);

if (explicitAnyCount > 0) {
    console.log('- Top files with "any":');
    const topFiles = [...explicitAnyByFile.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    for (const [file, count] of topFiles) {
        console.log(`  - ${file}: ${count}`);
    }
}

if (warningCount > 0) {
    console.log('- Top ESLint warning rules:');
    const topRules = [...warningByRule.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    for (const [ruleId, count] of topRules) {
        console.log(`  - ${ruleId}: ${count}`);
    }
}

if (errorCount > 0) {
    process.exitCode = 1;
}
