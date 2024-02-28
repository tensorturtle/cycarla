#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

function startNextApp() {
    try {
        // Set the working directory to the directory where this script is located
        process.chdir(path.dirname(__filename));
        console.log('Building the Next.js application...');
        execSync('next dev', { stdio: 'inherit' });
    } catch (error) {
        console.error('Failed to start the Next.js application:', error);
        process.exit(1);
    }
}

startNextApp();
