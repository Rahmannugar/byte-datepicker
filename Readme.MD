# Byte DatePicker

A lightweight, elegant, and highly customizable React datepicker component with support for both month/year and full date selection.

[![npm version](https://badge.fury.io/js/byte-datepicker.svg)](https://badge.fury.io/js/byte-datepicker)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🎬 Demo

![Byte DatePicker Demo](https://raw.githubusercontent.com/Rahmannugar/byte-datepicker/main/docs/demo.gif)

## ✨ Features

- 🎯 **Lightweight** - Minimal dependencies, small bundle size
- 🎨 **Highly Customizable** - Easy to style and theme
- 📱 **Responsive** - Works great on mobile and desktop
- ♿ **Accessible** - Built with accessibility in mind
- 🗓️ **Flexible** - Month/year picker or full date picker modes
- ⚡ **Modern** - Built with TypeScript and modern React patterns
- 🎭 **Beautiful UI** - Clean, modern interface with smooth animations
- 🧩 **Custom Input Support** - Use your own input/button with full control
- 🗓️ **Display Formatting** - Easily control how the date is displayed

## 🚀 Installation

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
import ByteDatePicker from "byte-datepicker";
import "byte-datepicker/styles.css"; // Don't forget to import styles!

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
          className="border border-purple-600 rounded-lg px-4 py-2 text-lg focus:ring-2 focus:ring-purple-400"
        />
      )}
    </ByteDatePicker>
  );
}
```

- `hideInput` hides the default input.
- Use the `children` render prop to provide your own input or button.
- `formattedValue` is automatically formatted using `formatString` (e.g., `"dd-mm-yyyy"`, `"yyyy/mm/dd"`, etc.).

### Custom Display Formatting

You can control how the date is displayed in the input (default or custom) using the `formatString` prop:

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
```

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
      minDate="2020-01-01" // or new Date(2020, 0, 1) which returns Jan 1, 2020
      maxDate="2030-12-31" // or new Date(2030, 11, 31) which returns Dec 31, 2030
      placeholder="Pick a date within range"
      includeDays={true}
    />
  );
}
```

- Dates outside the range will be disabled in the picker.

### Year Only Picker

For scenarios where you only want users to select a year (e.g., graduation year, manufacturing year):

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
    />
  );
}
```

- Set `yearOnly={true}` to show only the year selection grid.
- The selected value will be a `Date` object with January 1st of the selected year.

## 📋 Props

| Prop           | Type                           | Default         | Description                                           |
| -------------- | ------------------------------ | --------------- | ----------------------------------------------------- |
| `value`        | `Date \| string \| null`       | `null`          | The currently selected date                           |
| `onChange`     | `(date: Date \| null) => void` | `undefined`     | Callback function called when a date is selected      |
| `placeholder`  | `string`                       | `"Select Date"` | Placeholder text shown when no date is selected       |
| `disabled`     | `boolean`                      | `false`         | Whether the datepicker is disabled                    |
| `includeDays`  | `boolean`                      | `false`         | Whether to show day selection (full date picker mode) |
| `minDate`      | `Date \| string`               | `undefined`     | Minimum selectable date                               |
| `maxDate`      | `Date \| string`               | `undefined`     | Maximum selectable date                               |
| `formatString` | `string`                       | `undefined`     | Controls how the date is displayed                    |
| `hideInput`    | `boolean`                      | `false`         | Hide the default input and use custom input           |
| `required`     | `boolean`                      | `false`         | Makes the field required for form validation          |
| `name`         | `string`                       | `undefined`     | Input name for form submission                        |
| `onBlur`       | `() => void`                   | `undefined`     | Called when the input loses focus                     |
| `error`        | `boolean`                      | `false`         | Whether the field has a validation error              |
| `className`    | `string`                       | `""`            | Custom class for the container                        |
| `children`     | `(props) => React.ReactNode`   | `undefined`     | Render prop for custom input                          |
| `yearOnly`     | `boolean`                      | `false`         | Show only year selection grid                         |

### `className` Prop

You can use the `className` prop to add your own custom CSS class to the outer container of the datepicker.  
This is useful for applying custom styles, layout.

Note: It doesn't integrate with CSS frameworks like Tailwind.

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

**Tip:**  
Combine `className` with your own styles for spacing, alignment, or other customizations.

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

**⚠️ Note:**

- Short or ambiguous formats like `"jun 25"` or `"25/1/2019"` may not work reliably in all browsers.
- For best results, use ISO strings (`"YYYY-MM-DD"`), full month names with year (`"June 2025"`), or `Date` objects.

## 🎨 Styling

**Important:** You must import the CSS file for the component to display correctly:

```tsx
import "byte-datepicker/styles.css";
```

### Custom Styling

The component uses CSS classes that you can easily override. Here are the main classes:

```css
.datepicker-container {
}
.datepicker-input {
}
.datepicker-input:hover {
}
.datepicker-input:focus-within {
}
.datepicker-input.disabled {
}
.datepicker-dropdown {
}
.datepicker-overlay {
}
.month-button {
}
.month-button.selected {
}
.month-button.current {
}
.day-cell {
}
.day-cell.selected {
}
.year-button {
}
.year-button.current {
}
```

#### Using Tailwind CSS or Custom CSS

- For the input: Use `hideInput` and provide your own input/button with any Tailwind or custom classes.
- For the calendar/dropdown: Override the provided CSS classes in your global stylesheet.

### Theme Customization

Override the primary color:

```css
.month-button.selected,
.day-cell.selected,
.year-button.current,
.month-year-button,
.year-range-title {
  background-color: #your-color !important;
}

.datepicker-input:focus-within {
  border-color: #your-color !important;
  box-shadow: 0 0 0 3px rgba(your-rgb-values, 0.1) !important;
}
```

### Dark Mode Support

```css
[data-theme="dark"] .datepicker-input {
  background-color: #1f2937;
  border-color: #374151;
  color: #f9fafb;
}

[data-theme="dark"] .datepicker-dropdown {
  background-color: #1f2937;
  border-color: #374151;
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

## 🚀 Development

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

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- Built with ❤️ by [Rahman Nugar](https://github.com/Rahmannugar)
- Inspired by the need for a simple, customizable React datepicker
