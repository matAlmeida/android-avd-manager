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

// const ANDROID_SDK = process.env.ANDROID_SDK;
// console.log(ANDROID_SDK);
// const isWin = process.platform === 'win32';

// if (!ANDROID_SDK) {
//   console.error(
//     'Please, before start you need to add the path to you Android SDK in the Environment Variables.\n You can check how to do this in this link: https://docs.expo.io/versions/v31.0.0/workflow/android-studio-emulator.html'
//   );
// }

// let emuExePath = '';
// let lineBreaker = '';
// if (isWin) {
//   emuExePath = `${ANDROID_SDK}\\emulator\\emulator.exe`;
//   lineBreaker = '\r\n';
// } else {
//   emuExePath = `${ANDROID_SDK}/emulator/emulator`;
//   lineBreaker = '\n';
// }
// const listAvdsCMD = `${emuExePath} -list-avds`;

// exec(listAvdsCMD, (err, stdout) => {
//   if (err) {
//     console.error(
//       `For some reason the command "${listAvdsCMD}" couldnt be executed`
//     );
//     return;
//   }

//   const avaliablesAVDS = stdout.split(lineBreaker);
//   avaliablesAVDS.pop();

//   inquirer
//     .prompt([
//       {
//         type: 'list',
//         name: 'emulator',
//         message: 'What emulator do you want to run',
//         choices: [...avaliablesAVDS]
//       },
//       {
//         type: 'confirm',
//         name: 'canRun',
//         message: 'Are you sure?',
//         default: false
//       }
//     ])
//     .then((answers) => {
//       const { emulator, canRun } = answers;

//       if (canRun) {
//         const spinner = new Spinner(
//           'Running (You can CTRL + C to exit this process. The emulator will keep running)'
//         );
//         spinner.setSpinnerString(18);
//         spinner.start();
//         const runEmuCMD = `${emuExePath} -avd ${emulator}`;
//         exec(runEmuCMD, (err, stdout, stderr) => {
//           if (err) {
//             console.error(
//               `For some reason the command "${runEmuCMD}" couldnt be executed`
//             );
//             return;
//           }

//           if (stderr) {
//             console.error(stderr);
//             return;
//           }

//           spinner.stop();
//         });
//       }
//     });
// });
