#!/usr/bin/env node

const { prompt } = require('inquirer');
const Spinner = require('cli-spinner').Spinner;

const { runOrCreateAVD, run, creation } = require('./questions');
const { getAvdList, runAvd, getTargetList, createAvd } = require('./helpers');

prompt(runOrCreateAVD).then(({ runOrCreate }) => {
  if (runOrCreate === 'run') {
    prompt([run.avdList(getAvdList()), run.confirmRun]).then(
      ({ avdName, canRun }) => {
        if (canRun) {
          const spinner = new Spinner('Running');
          spinner.setSpinnerString(18);
          spinner.start();

          runAvd(avdName);

          spinner.stop();
        } else {
          process.exit(0);
        }
      }
    );
  } else if (runOrCreate === 'create') {
    prompt([
      creation.targetVersion(getTargetList()),
      creation.avdName,
      creation.confirmCreation
    ]).then(({ targetVersion, newAvdName, canCreate }) => {
      if (canCreate) {
        createAvd(newAvdName, targetVersion);
      } else {
        process.exit(0);
      }
    });
  }
});
