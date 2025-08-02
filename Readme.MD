# Byte DatePicker

A lightweight, customizable React datepicker component.

## Installation

```bash
npm install byte-datepicker
```

## Usage

### Basic Usage

```tsx
import ByteDatePicker from "byte-datepicker";
import "byte-datepicker/styles.css"; // Don't forget to import styles!

function App() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  return (
    <ByteDatePicker
      value={selectedDate}
      onChange={setSelectedDate}
      placeholder="Select a date"
    />
  );
}
```

### With Days Selection

```tsx
import ByteDatePicker from "byte-datepicker";
import "byte-datepicker/styles.css";

function App() {
  return (
    <ByteDatePicker
      includeDays={true}
      placeholder="Select date with day"
      onChange={(date) => console.log(date)}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `Date` | `undefined` | The selected date |
| `onChange` | `(date: Date) => void` | `undefined` | Callback when date is selected |
| `placeholder` | `string` | `"Select Date"` | Placeholder text |
| `disabled` | `boolean` | `false` | Whether the picker is disabled |
| `includeDays` | `boolean` | `false` | Whether to show day selection |

## Styling

**Important:** You must import the CSS file for the component to display correctly:

```tsx
import "byte-datepicker/styles.css";
```

### Custom Styling

You can override the default styles by targeting the CSS classes:

```css
/* Override primary color */
.month-button.selected,
.day-cell.selected,
.year-button.current {
  background-color: your-color !important;
}

/* Override border color */
.datepicker-input:focus-within {
  border-color: your-color !important;
}
```

## License

MIT