#!/usr/bin/env node

const { exec } = require('child_process');
const inquirer = require('inquirer');
const Spinner = require('cli-spinner').Spinner;

const ANDROID_SDK = process.env.ANDROID_SDK;
const isWin = process.platform === 'win32';

if (!ANDROID_SDK) {
  console.error(
    'Please, before start you need to add the path to you Android SDK in the Environment Variables.\n You can check how to do this in this link: https://docs.expo.io/versions/v31.0.0/workflow/android-studio-emulator.html'
  );
}

let emuExePath = '';
if (isWin) {
  emuExePath = `${ANDROID_SDK}\\emulator\\emulator.exe`;
} else {
  emuExePath = `.\\${ANDROID_SDK}\\emulator\\emulator`;
}
const listAvdsCMD = `${emuExePath} -list-avds`;
exec(listAvdsCMD, (err, stdout) => {
  if (err) {
    console.error(
      `For some reason the command "${listAvdsCMD}" couldnt be executed`
    );
    return;
  }

  const avaliablesAVDS = stdout.split('\r\n');
  avaliablesAVDS.pop();

  inquirer
    .prompt([
      {
        type: 'list',
        name: 'emulator',
        message: 'What emulator do you want to run',
        choices: [...avaliablesAVDS]
      },
      {
        type: 'confirm',
        name: 'canRun',
        message: 'Are you sure?',
        default: false
      }
    ])
    .then((answers) => {
      const { emulator, canRun } = answers;

      if (canRun) {
        const spinner = new Spinner(
          'Running (You can CTRL + C to exit this process. The emulator will keep running)'
        );
        spinner.setSpinnerString(18);
        spinner.start();
        const runEmuCMD = `${emuExePath} -avd ${emulator}`;
        exec(runEmuCMD, (err, stdout, stderr) => {
          if (err) {
            console.error(
              `For some reason the command "${runEmuCMD}" couldnt be executed`
            );
            return;
          }

          if (stderr) {
            console.error(stderr);
            return;
          }

          spinner.stop();
        });
      }
    });
});
