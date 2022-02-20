function hoursToTime(hours) {
  
  function leftPad(n) {
    return n < 10 ? '0' + n : n;
  }
  
  let h = Math.floor(hours);
  let m = hours % 1 * 60;
  
  return `${leftPad(h)}:${leftPad(m)}`;
}

function getTemperatureValuesDescriptor(temperatureValues) {

  let selected = JSON.parse(temperatureValues).selected[0];

  switch (selected) {
    case 0:
      return `Maximum temperature for the next 24 hours is shown in the top left corner.
              Minimum temperature for the next 24 hours is shown in the top right corner.`;
    case 1:
      return `Median temperature for the next 24 hours is shown in the top left corner.
              Temperature range for the next 24 hours (expressed as ±°C relative to the median) is shown in the top right corner.`;
  }
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
  
  let chartValuesSection = (
    <Section>

      <Select
        label={`Temperature values`}
        settingsKey="temperatureValues"
        options={[
          { name: "Max and min", value: 0 },
          { name: "Median and range", value: 1 }
        ]}
      />
      <Text italic>{getTemperatureValuesDescriptor(props.settings.temperatureValues)}</Text>

      {/* <Select
        label={`Precipitation values`}
        settingsKey="precipitationValues"
        options={[
          { name: "Total volume and probability", value: 0 },
          { name: "Median and range", value: 1 }
        ]}
      /> */}
      
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
            { name: "Coral", value: 4 },
          ]}
        />
    
        <Select
          label={`Hour markers`}
          settingsKey="hourMarkers"
          options={[
            { name: "None", value: 0 },
            { name: "Short", value: 1 },
            { name: "Long", value: 2 },
            { name: "Dots", value: 3 }
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

      </Section>
    
      <Section
        title={<Text bold align="center">Chart values</Text>}>

        <Toggle
          settingsKey="showChartValues"
          label="Show chart values"
        />
        <Text italic>If enabled, additional temperature and rain values will be shown in the corners of the display.</Text>

        {props.settings.showChartValues === "true" && chartValuesSection}

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
    
    <Section
      title={<Text bold align="center">Debug</Text>}>
  
      <Toggle
        settingsKey="debugToggle"
        label="Enable debug data"
      />
      <Text italic>If enabled, tapping the watch face will toggle debug information.</Text>

    </Section>

    </Page>
  );
}

registerSettingsPage(settings);
