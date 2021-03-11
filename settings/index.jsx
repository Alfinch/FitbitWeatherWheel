function hoursToTime(hours) {
  
  function leftPad(n) {
    return n < 10 ? '0' + n : n;
  }
  
  let h = Math.floor(hours);
  let m = hours % 1 * 60;
  
  return `${leftPad(h)}:${leftPad(m)}`;
}

function HelloWorld(props) {
  
  let workingHoursSection = (
    <Section>

      <Select
        label={`Working days`}
        settingsKey="workingDays"
        multiple
        options={[
          { name: "Monday", value: 0 },
          { name: "Tuesday", value: 1 },
          { name: "Wednesday", value: 2 },
          { name: "Thursday", value: 3 },
          { name: "Friday", value: 4 },
          { name: "Saturday", value: 5 },
          { name: "Sunday", value: 6 },
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
  );

  return (
    <Page>
    
      <Section
        title={<Text bold align="center">General</Text>}>
    
        <Select
          label={`Theme`}
          settingsKey="colorScheme"
          options={[
            { name: "Punchy", value: 0 },
            { name: "Monochrome", value: 1 },
            { name: "Primary", value: 2 }
          ]}
        />

      </Section>
    
      <Section
        title={<Text bold align="center">Working hours</Text>}>
    
        <Toggle
          settingsKey="showWorkingHours"
          label="Show working hours"
        />
    
        {props.settings.showWorkingHours === "true" && workingHoursSection}

      </Section>

    </Page>
  );
}

registerSettingsPage(HelloWorld);
