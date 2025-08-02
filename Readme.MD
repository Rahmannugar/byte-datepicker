# Byte DatePicker

A lightweight, elegant, and highly customizable React datepicker component with support for both month/year and full date selection.

[![npm version](https://badge.fury.io/js/byte-datepicker.svg)](https://badge.fury.io/js/byte-datepicker)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🎯 **Lightweight** - Minimal dependencies, small bundle size
- 🎨 **Highly Customizable** - Easy to style and theme
- 📱 **Responsive** - Works great on mobile and desktop
- ♿ **Accessible** - Built with accessibility in mind
- 🗓️ **Flexible** - Month/year picker or full date picker modes
- ⚡ **Modern** - Built with TypeScript and modern React patterns
- 🎭 **Beautiful UI** - Clean, modern interface with smooth animations

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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

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
  const [date, setDate] = useState<Date>();

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
  const [date, setDate] = useState<Date>();

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

### Disabled State

```tsx
<ByteDatePicker
  disabled={true}
  placeholder="This picker is disabled"
/>
```

### Controlled Component

```tsx
function ControlledExample() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleDateChange = (date: Date) => {
    console.log('Selected date:', date);
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

## 📋 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `Date \| undefined` | `undefined` | The currently selected date |
| `onChange` | `(date: Date) => void` | `undefined` | Callback function called when a date is selected |
| `placeholder` | `string` | `"Select Date"` | Placeholder text shown when no date is selected |
| `disabled` | `boolean` | `false` | Whether the datepicker is disabled |
| `includeDays` | `boolean` | `false` | Whether to show day selection (full date picker mode) |

## 🎨 Styling

**Important:** You must import the CSS file for the component to display correctly:

```tsx
import "byte-datepicker/styles.css";
```

### Custom Styling

The component uses CSS classes that you can easily override. Here are the main classes:

```css
/* Main container */
.datepicker-container { }

/* Input field */
.datepicker-input { }
.datepicker-input:hover { }
.datepicker-input:focus-within { }
.datepicker-input.disabled { }

/* Dropdown */
.datepicker-dropdown { }
.datepicker-overlay { }

/* Buttons */
.month-button { }
.month-button.selected { }
.month-button.current { }
.day-cell { }
.day-cell.selected { }
.year-button { }
.year-button.current { }
```

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
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

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

- **Minified**: ~12KB
- **Minified + Gzipped**: ~4KB
- **Zero dependencies** (except React peer dependencies)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ by [Rahman Nugar](https://github.com/Rahmannugar)
- Inspired by the need for a simple, customizable React datepicker

## 🔗 Links

- [GitHub Repository](https://github.com/Rahmannugar/byte-datepicker)
- [npm Package](https://www.npmjs.com/package/byte-datepicker)
- [Issues](https://github.com/Rahmannugar/byte-datepicker/issues)
- [Pull Requests](https://github.com/Rahmannugar/byte-datepicker/pulls)

---

**Star ⭐ the repo if you find it useful!**