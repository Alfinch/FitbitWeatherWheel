function hoursToTime(hours) {
  
  function leftPad(n) {
    return n < 10 ? '0' + n : n;
  }
  
  let h = Math.floor(hours);
  let m = hours % 1 * 60;
  
  return `${leftPad(h)}:${leftPad(m)}`;
}

function settings(props) {
  
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
            { name: "Grayscale", value: 1 },
            { name: "Primary", value: 2 },
            { name: "Monochrome", value: 3 },
          ]}
        />
    
        <Select
          label={`Hour markers`}
          settingsKey="hourMarkers"
          options={[
            { name: "None", value: 0 },
            { name: "Short", value: 1 },
            { name: "Long", value: 2 }
          ]}
        />

        <Select
          label={`Secondary display (top)`}
          settingsKey="secondaryA"
          options={[
            { name: "Hide", value: 0 },
            { name: "Temperature", value: 1 },
            { name: "Weather", value: 2 },
            { name: "Date", value: 3 }
          ]}
        />
    
        <Select
          label={`Secondary display (bottom)`}
          settingsKey="secondaryB"
          options={[
            { name: "Hide", value: 0 },
            { name: "Temperature", value: 1 },
            { name: "Weather", value: 2 },
            { name: "Date", value: 3 }
          ]}
        />

        <Toggle
          settingsKey="showChartValues"
          label="Show key chart values"
        />
        <Text italic>If enabled, minimum and maximum temperature and total rain volume for the next 24 hours will be shown in the corners.</Text>

      </Section>
    
      <Section
        title={<Text bold align="center">Working hours</Text>}>
    
        <Toggle
          settingsKey="showWorkingHours"
          label="Show working hours"
        />
        <Text italic>If enabled, the background of the graph will be a different color (depending on the theme) during working hours.</Text>

        {props.settings.showWorkingHours === "true" && workingHoursSection}

      </Section>

    </Page>
  );
}

registerSettingsPage(settings);
