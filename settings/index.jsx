function hoursToTime(hours) {
  
  function leftPad(n) {
    return n < 10 ? '0' + n : n;
  }
  
  let h = Math.floor(hours);
  let m = hours % 1 * 60;
  
  return `${leftPad(h)}:${leftPad(m)}`;
}

function HelloWorld(props) {
  
  return (
    <Page>
    
      <Section
        title={<Text bold align="center">Working hours</Text>}>
    
        <Toggle
          settingsKey="showWorkingHours"
          label="Show working hours"
        />
    
        <Select
          label={`Working days`}
          settingsKey="workingDays"
          multiple
          options={[
            { name: "Monday", value: 1 },
            { name: "Tuesday", value: 2 },
            { name: "Wednesday", value: 3 },
            { name: "Thursday", value: 4 },
            { name: "Friday", value: 5 },
            { name: "Saturday", value: 6 },
            { name: "Sunday", value: 7 },
          ]}
        />

        <Slider
          label="Start time"
          settingsKey="workingStartTime"
          min="0"
          max="24"
          step="0.5"
        />
        <Text>{hoursToTime(props.settings.workingStartTime)}</Text>
            
        <Slider
          label="End time"
          settingsKey="workingEndTime"
          min="0"
          max="24"
          step="0.5"
        />
        <Text>{hoursToTime(props.settings.workingEndTime)}</Text>

      </Section>

    </Page>
  );
}

registerSettingsPage(HelloWorld);
