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
      { name: 'Monday', value: 0 },
      { name: 'Tuesday', value: 1 },
      { name: 'Wednesday', value: 2 },
      { name: 'Thursday', value: 3 },
      { name: 'Friday', value: 4 }
    ]
  });
  setDefaultSetting('workingStartTime', 9);
  setDefaultSetting('workingEndTime', 17);
}

export default defaultSettings;