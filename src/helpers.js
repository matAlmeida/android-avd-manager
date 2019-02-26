const { execSync } = require('child_process');
const { existsSync } = require('fs');

function getAndroidPath() {
  const ANDROID_SDK = process.env.ANDROID_SDK;
  const errorMsg = `
  Please, before start you need to add the path to you Android SDK in the Environment Variables.
  You can check how to do this in this link:
  \thttps://docs.expo.io/versions/v31.0.0/workflow/android-studio-emulator.html
  `;

  const folderExist = existsSync(ANDROID_SDK);

  if (!ANDROID_SDK || !folderExist) {
    console.error(errorMsg);
    process.exit(1);
  }

  return ANDROID_SDK;
}

function getEmulatorPath() {
  const ANDROID_SDK = getAndroidPath();
  const isWin = process.platform === 'win32';

  if (isWin) {
    return {
      path: `${ANDROID_SDK}\\emulator\\emulator.exe`
    };
  } else {
    return {
      path: `${ANDROID_SDK}/emulator/emulator`
    };
  }
}

function getAvdManagerPath() {
  const ANDROID_SDK = getAndroidPath();
  const isWin = process.platform === 'win32';

  if (isWin) {
    return {
      path: `${ANDROID_SDK}\\tools\\bin\\avdmanager.exe`
    };
  } else {
    return {
      path: `${ANDROID_SDK}/tools/bin/avdmanager`
    };
  }
}

function getAvdList() {
  const emulator = getEmulatorPath();
  const listAvdsCmd = `${emulator.path} -list-avds`;

  try {
    const avdRegEx = /(.+)/g;

    return execSync(listAvdsCmd)
      .toString()
      .match(avdRegEx);
  } catch (error) {
    console.error(`
    Unable to get AVDs list for the following reason:

    ${error}
    `);
    process.exit(1);
  }
}

function getTargetList() {
  const avdManager = getAvdManagerPath();
  const listTargetsCmd = `${avdManager.path} list target`;

  try {
    const targetRegEx = /(\w+-\d+)/g;

    return execSync(listTargetsCmd)
      .toString()
      .match(targetRegEx);
  } catch (error) {
    console.error(`
      Unable to get Android Target Version for the following reason:

      ${error}
      `);
    process.exit(1);
  }
}

function createAvd(avdName, targetVersion) {
  const avdManager = getAvdManagerPath();
  const createAvdCmd = `${
    avdManager.path
  } create avd --force --name ${avdName} --abi google_apis/x86_64 --package 'system-images;${targetVersion};google_apis;x86_64'`;

  try {
    execSync(createAvdCmd);
  } catch (error) {
    console.error(`
      Unable to create the AVD for the following reason:

      ${error}
      `);
    process.exit(1);
  }
}

function runAvd(avdName) {
  const emulator = getEmulatorPath();
  const runEmulatorCmd = `${emulator.path} -avd ${avdName}`;

  try {
    execSync(runEmulatorCmd);
  } catch (error) {
    console.error(`
      Unable to run the ${avdName} AVD for the following reason:

      ${error}
      `);
    process.exit(1);
  }
}

module.exports = {
  getAvdList,
  getTargetList,
  createAvd,
  runAvd
};
