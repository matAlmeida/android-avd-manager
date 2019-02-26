export const runOrCreate = {
  type: 'list',
  name: 'runOrCreate',
  message: 'Run a existent AVD or Create a new one?',
  choices: ['Run a AVD', 'Create new AVD']
};

export const creation = {
  avdName: {
    type: 'input',
    name: 'newAvdName',
    message: 'Give your new AVD a name'
  },
  targetVersion: (targetList) => ({
    type: 'list',
    name: 'targetVersion',
    message: 'What Android version you want your AVD to be?',
    choices: [...targetList]
  }),
  confirmCreation: {
    type: 'confirm',
    name: 'canCreate',
    message: 'Are you sure?',
    default: false
  }
};

export const run = {
  avdList: (list) => ({
    type: 'list',
    name: 'avdName',
    message: 'What emulator you want to run?',
    choices: [...list]
  }),

  confirmRun: {
    type: 'confirm',
    name: 'canRun',
    message: 'Are you sure?',
    default: false
  }
};
