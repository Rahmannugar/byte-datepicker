# ByteDatePicker v2

Byte Datepicker V2 is live.

The new version includes a complete architectural refactor, a brand new design system, and improved developer experience.

## What's New in v2

The old design is gone. v2.0.0 features a premium glossy theme with:

- **Consistent Blue Palette**: Professional sapphire/cobalt accents.
- **Glassmorphism**: Modern backdrop blur on overlays.
- **Improved Typography**: Clean, modern sans-serif stack.

### 🌑 Native Dark Mode

v2 now supports dark mode out of the box with zero extra CSS.

- Use the `theme` prop to toggle between `light`, `dark`, or `system` (follows user OS settings).
- Fully variable-based styling for easy overrides.

### Improved Selection Management

- **One-Click Clear**: Added a `clearable` prop to quickly reset the date.
- **Smart Hooks**: Core logic is now extracted into `useDatePicker`, allowing for easier integration.

### Notes

- **Updates**: Updated to latest React version.
- **Improved Architecture**: Refactored to micromodules to prevent logic coupling in mega-components.
- **Zero Dependencies(except React)**: Still zero external runtime dependencies outside of React

---

# Byte DatePicker

A lightweight, elegant, and highly customizable React datepicker component with support for both month/year and full date selection.

[![npm version](https://img.shields.io/npm/v/byte-datepicker.svg?style=flat-square)](https://www.npmjs.com/package/byte-datepicker)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🎬 Demo

![Byte DatePicker Demo](https://raw.githubusercontent.com/Rahmannugar/byte-datepicker/main/docs/demo.gif)

## ✨ Features

- **Lightweight** - Minimal dependencies, small bundle size
- **Highly Customizable** - Easy to style and theme
- **Responsive** - Works great on mobile and desktop
- **Accessible** - Built with accessibility in mind
- **Flexible** - Month/year picker or full date picker modes
- **Modern** - Built with TypeScript and modern React patterns
- **Beautiful UI** - Clean, modern interface with smooth animations
- **Custom Input Support** - Use your own input/button with full control
- **Display Formatting** - Easily control how the date is displayed with flexible format tokens

## Installation

```bash
npm install byte-datepicker
```

```bash
yarn add byte-datepicker
```

```bash
pnpm add byte-datepicker
```

## 📖 Usage

### Basic Usage

```tsx
import React, { useState } from "react";
import ByteDatePicker, { DatePickerProps } from "byte-datepicker";
import "byte-datepicker/styles.css";

function App() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <div>
      <ByteDatePicker
        value={selectedDate}
        onChange={setSelectedDate}
        placeholder="Select a date"
      />
    </div>
  );
}
```

### Month/Year Picker (Default)

Perfect for date of birth, expiry dates, or when you only need month and year:

![Month Year Picker Demo](https://raw.githubusercontent.com/Rahmannugar/byte-datepicker/main/docs/month-year-demo.gif)

```tsx
import ByteDatePicker from "byte-datepicker";
import "byte-datepicker/styles.css";

function MonthYearPicker() {
  const [date, setDate] = useState<Date | null>(null);

  return (
    <ByteDatePicker
      value={date}
      onChange={setDate}
      placeholder="Select month and year"
      // includeDays={false} is the default
    />
  );
}
```

### Full Date Picker with Days

For complete date selection including days:

![Full Date Picker Demo](https://raw.githubusercontent.com/Rahmannugar/byte-datepicker/main/docs/full-date-demo.gif)

```tsx
import ByteDatePicker from "byte-datepicker";
import "byte-datepicker/styles.css";

function FullDatePicker() {
  const [date, setDate] = useState<Date | null>(null);

  return (
    <ByteDatePicker
      value={date}
      onChange={setDate}
      includeDays={true}
      placeholder="Select complete date"
    />
  );
}
```

### Custom Input (Hide Default Input)

You can use your own input or button to trigger the datepicker and fully control its styling (e.g., with Tailwind CSS):

```tsx
import React, { useState } from "react";
import ByteDatePicker from "byte-datepicker";
import "byte-datepicker/styles.css";

function CustomInputExample() {
  const [date, setDate] = useState<Date | null>(null);

  return (
    <ByteDatePicker
      value={date}
      onChange={setDate}
      hideInput
      formatString="dd-mm-yyyy" // Controls display format for formattedValue
    >
      {({ open, formattedValue }) => (
        <input
          readOnly
          value={formattedValue}
          placeholder="Pick a date"
          onClick={open}
          className="border border-blue-600 rounded-lg px-4 py-2 text-lg focus:ring-2 focus:ring-blue-400"
        />
      )}
    </ByteDatePicker>
  );
}
```

- `hideInput` hides the default input.
- Use the `children` render prop to provide your own input or button.
- `formattedValue` is automatically formatted using `formatString`.

### Custom Display Formatting

You can control how the date is displayed in the input (default or custom) using the `formatString` prop.  
**Supported tokens (case-insensitive):**

- `dd` – day (e.g., `05`)
- `mm` – numeric month (e.g., `08`)
- `mmm` – short month name (e.g., `Aug`)
- `month` – full month name (e.g., `August`)
- `yyyy` – year (e.g., `2025`)

**Examples:**

```tsx
<ByteDatePicker
  value={date}
  onChange={setDate}
  formatString="yyyy/mm/dd" // e.g., 2025/08/14
/>
<ByteDatePicker
  value={date}
  onChange={setDate}
  formatString="dd-mm-yyyy" // e.g., 14-08-2025
/>
<ByteDatePicker
  value={date}
  onChange={setDate}
  formatString="mmm yyyy" // e.g., Aug 2025
/>
<ByteDatePicker
  value={date}
  onChange={setDate}
  formatString="month yyyy" // e.g., August 2025
/>
```

> **Note:** Format tokens are case-insensitive (`mmm`, `MMM`, `mm`, `MM`, etc. all work).

### Controlled Component

```tsx
function ControlledExample() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const handleDateChange = (date: Date | null) => {
    console.log("Selected date:", date);
    setSelectedDate(date);
  };

  return (
    <ByteDatePicker
      value={selectedDate}
      onChange={handleDateChange}
      placeholder="Pick a date"
    />
  );
}
```

### Min/Max Date

You can restrict the selectable date range using the `minDate` and `maxDate` props.  
You can pass either a `Date` object or a string in `"YYYY-MM-DD"` or `"YYYY/MM/DD"` format:

```tsx
import ByteDatePicker from "byte-datepicker";
import "byte-datepicker/styles.css";

function LimitedRangePicker() {
  const [date, setDate] = useState<Date | null>(null);

  return (
    <ByteDatePicker
      value={date}
      onChange={setDate}
      minDate="2020-01-01" // or new Date(2020, 0, 1)
      maxDate="2030-12-31" // or new Date(2030, 11, 31)
      placeholder="Pick a date within range"
      includeDays={true}
    />
  );
}
```

- Dates outside the range will be disabled in the picker.

### Clearable Selection

You can add a clear button to the input by setting the `clearable` prop to `true`:

```tsx
<ByteDatePicker
  value={date}
  onChange={setDate}
  clearable={true}
  placeholder="Select a date"
/>
```

### Year Only Picker

For scenarios where you only want users to select a year (e.g., graduation year, manufacturing year):

![Year Only Picker](https://raw.githubusercontent.com/Rahmannugar/byte-datepicker/main/docs/year-selection.png)

```tsx
import ByteDatePicker from "byte-datepicker";
import "byte-datepicker/styles.css";

function YearOnlyPicker() {
  const [year, setYear] = useState<Date | null>(null);

  return (
    <ByteDatePicker
      value={year}
      onChange={setYear}
      yearOnly={true}
      placeholder="Select year"
      formatString="yyyy" // Only show year in input
    />
  );
}
```

- Set `yearOnly={true}` to show only the year selection grid.
- The selected value will be a `Date` object with January 1st of the selected year.

## 📋 Props

| Prop           | Type                            | Default         | Description                                           |
| -------------- | ------------------------------- | --------------- | ----------------------------------------------------- |
| `value`        | `Date \| string \| null`        | `null`          | The currently selected date                           |
| `onChange`     | `(date: Date \| null) => void`  | `undefined`     | Callback function called when a date is selected      |
| `placeholder`  | `string`                        | `"Select Date"` | Placeholder text shown when no date is selected       |
| `disabled`     | `boolean`                       | `false`         | Whether the datepicker is disabled                    |
| `includeDays`  | `boolean`                       | `false`         | Whether to show day selection (full date picker mode) |
| `minDate`      | `Date \| string`                | `undefined`     | Minimum selectable date                               |
| `maxDate`      | `Date \| string`                | `undefined`     | Maximum selectable date                               |
| `formatString` | `string`                        | `undefined`     | Controls how the date is displayed (see tokens above) |
| `hideInput`    | `boolean`                       | `false`         | Hide the default input and use custom input           |
| `required`     | `boolean`                       | `false`         | Makes the field required for form validation          |
| `name`         | `string`                        | `undefined`     | Input name for form submission                        |
| `onBlur`       | `() => void`                    | `undefined`     | Called when the input loses focus                     |
| `error`        | `boolean`                       | `false`         | Whether the field has a validation error              |
| `className`    | `string`                        | `""`            | Custom class for the container                        |
| `theme`        | `'light' \| 'dark' \| 'system'` | `'light'`       | Toggles the UI theme                                  |
| `clearable`    | `boolean`                       | `false`         | Shows a clear button in the input                     |
| `children`     | `(props) => React.ReactNode`    | `undefined`     | Render prop for custom input (includes `clear`)       |
| `yearOnly`     | `boolean`                       | `false`         | Show only year selection grid                         |

### `className` Prop

You can use the `className` prop to add your own custom CSS class to the outer container of the datepicker.  
This is useful for applying custom styles, layout.

**Example:**

```tsx
<ByteDatePicker
  value={date}
  onChange={setDate}
  className="my-datepicker-custom-class"
  placeholder="Pick a date"
/>
```

This will render:

```html
<div class="datepicker-container my-datepicker-custom-class">...</div>
```

You can then target `.my-datepicker-custom-class` in your CSS to style the datepicker container as needed.

## 🗓️ Accepted Date Formats

You can pass a `Date` object, an ISO string (`"YYYY-MM-DD"`), or a date string that JavaScript's `Date` constructor can parse to the `value`, `minDate`, and `maxDate` props.

**Examples of accepted values:**

```tsx
<ByteDatePicker value={new Date()} onChange={setDate} />
<ByteDatePicker value="2025-08-16" onChange={setDate} /> // ISO string
<ByteDatePicker value="June 2025" onChange={setDate} />  // Month and year
<ByteDatePicker value="2025" onChange={setDate} />       // Year only (Jan 1)
<ByteDatePicker value="2013-01-01" onChange={setDate} /> // ISO string
<ByteDatePicker value="25 Jan 2019" onChange={setDate} />// Day, month, year
```

**Note:**

- Short or ambiguous formats like `"jun 25"` or `"25/1/2019"` may not work reliably in all browsers.
- For best results, use ISO strings (`"YYYY-MM-DD"`), full month names with year (`"June 2025"`), or `Date` objects.

## Styling

**Important:** You must import the CSS file for the component to display correctly:

```tsx
import "byte-datepicker/styles.css";
```

### Custom Styling

The component uses CSS classes that you can easily override. Here are the main classes:

```css
.byte-datepicker-container {
}
.byte-input {
}
.byte-input:hover {
}
.byte-input.disabled {
}
.byte-dropdown {
}
.byte-overlay {
}
.byte-cell {
}
.byte-cell.selected {
}
.byte-cell.today {
}
.byte-cell-lg {
}
```

#### Using Tailwind CSS or Custom CSS

- For the input: Use `hideInput` and provide your own input/button with any Tailwind or custom classes.
- For the calendar/dropdown: Override the provided CSS classes in your global stylesheet.

### Theme Customization

ByteDatePicker v2 is built with CSS variables, making it easy to create custom themes or override specific styles.

#### Using the `theme` prop

The easiest way to toggle between light and dark modes is via the `theme` prop:

- `<ByteDatePicker theme="light" />` (Default)
- `<ByteDatePicker theme="dark" />` - Forces dark mode.
- `<ByteDatePicker theme="system" />` - Automatically follows user OS preference.

#### Global Variable Overrides

You can override colors, radii, and fonts globally in your CSS:

```css
:root {
  --byte-primary: #2563eb; /* Primary brand color */
  --byte-radius-lg: 12px; /* Container corners */
  --byte-font: "Inter", sans-serif;
}

/* Custom dark mode overrides */
.byte-dark {
  --byte-bg: #1e293b;
  --byte-dropdown-bg: #0f172a;
}
```

## 🌟 Examples

### Integration with Forms

```tsx
import { useForm, Controller } from "react-hook-form";
import ByteDatePicker from "byte-datepicker";
import "byte-datepicker/styles.css";

function FormExample() {
  const { control, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit(console.log)}>
      <Controller
        name="birthDate"
        control={control}
        render={({ field: { onChange, value } }) => (
          <ByteDatePicker
            value={value}
            onChange={onChange}
            placeholder="Select birth month/year"
          />
        )}
      />

      <Controller
        name="appointmentDate"
        control={control}
        render={({ field: { onChange, value } }) => (
          <ByteDatePicker
            value={value}
            onChange={onChange}
            includeDays={true}
            placeholder="Select appointment date"
          />
        )}
      />
    </form>
  );
}
```

### Multiple Date Pickers

```tsx
function MultiplePickers() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  return (
    <div className="flex gap-4">
      <ByteDatePicker
        value={startDate}
        onChange={setStartDate}
        placeholder="Start date"
        includeDays={true}
      />
      <ByteDatePicker
        value={endDate}
        onChange={setEndDate}
        placeholder="End date"
        includeDays={true}
      />
    </div>
  );
}
```

### Form Validation Examples

#### Simple Form Validation

```tsx
function SimpleFormExample() {
  const [date, setDate] = useState<Date | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      alert("Please select a date");
      return;
    }
    // Form submission logic here
    console.log("Submitting date:", date);
  };

  return (
    <form onSubmit={handleSubmit}>
      <ByteDatePicker value={date} onChange={setDate} required name="date" />
      <button type="submit">Submit</button>
    </form>
  );
}
```

#### Form Validation with props

```tsx
function FormExample() {
  const [date, setDate] = useState<Date | null>(null);
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      setError(true);
      return;
    }
    // Form submission logic
  };

  return (
    <form onSubmit={handleSubmit}>
      <ByteDatePicker
        value={date}
        onChange={(newDate) => {
          setDate(newDate);
          setError(false);
        }}
        required
        name="date"
        error={error}
        onBlur={() => setError(!date)}
      />
      {error && <span style={{ color: "red" }}>Date is required</span>}
      <button type="submit">Submit</button>
    </form>
  );
}
```

The datepicker supports:

- Native HTML form validation
- Custom validation state
- Form library integration (React Hook Form, Formik)
- Required field indication
- Error state styling

## Development

Want to contribute? Great! Here's how to get started:

```bash
# Clone the repository
git clone https://github.com/Rahmannugar/byte-datepicker.git

# Navigate to the project directory
cd byte-datepicker

# Install dependencies
npm install

# Start development server
npm run dev

# Build the project
npm run build
```

## 📦 Bundle Size

Byte DatePicker is designed to be lightweight:

- **Unpacked Size**: <100KB (includes all build files, types, and source maps)
- **Minified**: The actual component code is much smaller when bundled
- **Zero runtime dependencies** (except React peer dependencies)
- **Tree-shakeable**: Modern bundlers will only include what you use

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the project
2. Create your feature branch (`git switch -c feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Acknowledgments

- Built with ❤️ by [Rahman Nugar](https://github.com/Rahmannugar)
- Inspired by the need for a simple, customizable React datepicker
