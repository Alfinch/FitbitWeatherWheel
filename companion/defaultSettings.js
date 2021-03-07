import { settingsStorage } from "settings";

function setDefaultSetting(key, value) {
  let valueNotSet = settingsStorage.getItem(key) == null;
  if (valueNotSet) settingsStorage.setItem(key, JSON.stringify(value));
}

function defaultSettings() {
  
  setDefaultSetting('showWorkingHours', false);
  setDefaultSetting('workingDays', {
    'selected': [0,1,2,3,4],
    'values': [
      { name: 'Monday', value: 1 },
      { name: 'Tuesday', value: 2 },
      { name: 'Wednesday', value: 3 },
      { name: 'Thursday', value: 4 },
      { name: 'Friday', value: 5 }
    ]
  });
  setDefaultSetting('workingStartTime', 9);
  setDefaultSetting('workingEndTime', 15);
}

export default defaultSettings;