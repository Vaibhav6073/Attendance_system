# UI/UX Wireframes - Attendance Management System

This document outlines the wireframe designs for both desktop and mobile views of the Attendance Management System.

## Design Principles

- **Modern & Professional**: Clean, corporate dashboard aesthetic
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile
- **Accessibility**: WCAG 2.1 compliant with proper contrast ratios
- **Dark/Light Mode**: Full theme switching support
- **Intuitive Navigation**: Role-based sidebar with clear visual hierarchy

## Color Palette

### Light Mode
- **Primary**: #2563eb (Blue 600)
- **Secondary**: #64748b (Slate 500)
- **Success**: #059669 (Emerald 600)
- **Warning**: #d97706 (Amber 600)
- **Error**: #dc2626 (Red 600)
- **Background**: #f8fafc (Slate 50)
- **Surface**: #ffffff (White)
- **Text Primary**: #0f172a (Slate 900)
- **Text Secondary**: #64748b (Slate 500)

### Dark Mode
- **Primary**: #3b82f6 (Blue 500)
- **Secondary**: #94a3b8 (Slate 400)
- **Success**: #10b981 (Emerald 500)
- **Warning**: #f59e0b (Amber 500)
- **Error**: #ef4444 (Red 500)
- **Background**: #0f172a (Slate 900)
- **Surface**: #1e293b (Slate 800)
- **Text Primary**: #f1f5f9 (Slate 100)
- **Text Secondary**: #94a3b8 (Slate 400)

## Screen Layouts

### 1. Login Page

#### Desktop (1920x1080)
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    [LOGO] Attendance System                 │
│                                                             │
│                  ┌─────────────────────┐                   │
│                  │                     │                   │
│                  │   Sign in to your   │                   │
│                  │      account        │                   │
│                  │                     │                   │
│                  │  [Email Input]      │                   │
│                  │  [Password Input]   │                   │
│                  │                     │                   │
│                  │   [Sign In Button]  │                   │
│                  │                     │                   │
│                  │  Demo Credentials:  │                   │
│                  │  [Admin] [Teacher]  │                   │
│                  │     [Student]       │                   │
│                  │                     │                   │
│                  │  Don't have account?│                   │
│                  │     [Sign up]       │                   │
│                  └─────────────────────┘                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Mobile (375x812)
```
┌─────────────────┐
│                 │
│   [LOGO]        │
│ Attendance      │
│   System        │
│                 │
│ ┌─────────────┐ │
│ │Sign in to   │ │
│ │your account │ │
│ │             │ │
│ │[Email]      │ │
│ │[Password]   │ │
│ │             │ │
│ │[Sign In]    │ │
│ │             │ │
│ │Demo:        │ │
│ │[Admin]      │ │
│ │[Teacher]    │ │
│ │[Student]    │ │
│ │             │ │
│ │[Sign up]    │ │
│ └─────────────┘ │
│                 │
└─────────────────┘
```

### 2. Admin Dashboard

#### Desktop Layout
```
┌─────────────────────────────────────────────────────────────┐
│ ┌─────────────┐ ┌─────────────────────────────────────────┐ │
│ │             │ │ [☰] Dashboard    [🔔] [🌙] [👤] Admin │ │
│ │ Attendance  │ └─────────────────────────────────────────┘ │
│ │             │                                             │
│ │ [🏠] Dashboard │ Welcome back, Admin! Here's overview    │
│ │ [👥] Students  │                                         │
│ │ [📱] QR Scanner│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐        │
│ │ [📊] Reports   │ │ 150 │ │ 142 │ │  8  │ │94.7%│        │
│ │ [🔔] Notifications│Total │Present│Absent│Rate │        │
│ │                │ └─────┘ └─────┘ └─────┘ └─────┘        │
│ │ ┌───────────┐  │                                         │
│ │ │   Theme   │  │ ┌─────────────────────────────────────┐ │
│ │ │ [🌙] Dark │  │ │     Weekly Attendance Trend         │ │
│ │ └───────────┘  │ │                                     │ │
│ │                │ │  [Bar Chart showing daily trends]   │ │
│ │ [🚪] Logout    │ │                                     │ │
│ └─────────────────┘ └─────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

#### Mobile Layout
```
┌─────────────────┐
│ [☰] Dashboard   │
│         [🔔][👤]│
├─────────────────┤
│Welcome Admin!   │
│                 │
│┌───┐┌───┐┌───┐ │
││150││142││ 8 │ │
││Tot││Pre││Abs│ │
│└───┘└───┘└───┘ │
│                 │
│┌───────────────┐│
││   94.7%       ││
││ Attendance    ││
││    Rate       ││
│└───────────────┘│
│                 │
│┌───────────────┐│
││  Weekly Trend ││
││               ││
││ [Mini Chart]  ││
│└───────────────┘│
└─────────────────┘
```

### 3. QR Code Scanner Page

#### Desktop Layout
```
┌─────────────────────────────────────────────────────────────┐
│ [Sidebar] │ QR Code Scanner                               │
│           │                                               │
│           │ Scan student QR codes to mark attendance     │
│           │                                               │
│           │        ┌─────────────────────┐               │
│           │        │                     │               │
│           │        │    [📷] Camera      │               │
│           │        │                     │               │
│           │        │  Click to start     │               │
│           │        │     scanning        │               │
│           │        │                     │               │
│           │        │ [Start Scanning]    │               │
│           │        └─────────────────────┘               │
│           │                                               │
│           │ OR when scanning:                            │
│           │                                               │
│           │        ┌─────────────────────┐               │
│           │        │                     │               │
│           │        │ [Live Camera Feed]  │               │
│           │        │                     │               │
│           │        │ [QR Overlay Frame]  │               │
│           │        │                     │               │
│           │        │ [Stop Scanning]     │               │
│           │        └─────────────────────┘               │
└─────────────────────────────────────────────────────────────┘
```

#### Mobile Layout
```
┌─────────────────┐
│ [☰] QR Scanner  │
├─────────────────┤
│Scan QR codes to │
│mark attendance  │
│                 │
│┌───────────────┐│
││               ││
││   [📷]        ││
││               ││
││ Click to start││
││   scanning    ││
││               ││
││[Start Scan]   ││
│└───────────────┘│
│                 │
│ When scanning:  │
│┌───────────────┐│
││               ││
││ [Live Camera] ││
││               ││
││ [QR Frame]    ││
││               ││
││ [Stop]        ││
│└───────────────┘│
└─────────────────┘
```

### 4. Student Dashboard

#### Desktop Layout
```
┌─────────────────────────────────────────────────────────────┐
│ [Sidebar] │ My Dashboard                                  │
│           │                                               │
│           │ Welcome back, Alice! Your attendance overview │
│           │                                               │
│           │ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐              │
│           │ │ 30  │ │ 28  │ │  1  │ │93.3%│              │
│           │ │Total│ │Present│Late │ │Rate │              │
│           │ └─────┘ └─────┘ └─────┘ └─────┘              │
│           │                                               │
│           │ ┌─────────────────────────────────────────┐   │
│           │ │           Quick Actions                 │   │
│           │ │                                         │   │
│           │ │ ┌─────────────┐ ┌─────────────────────┐ │   │
│           │ │ │ [📱] View   │ │ [📅] View          │ │   │
│           │ │ │  My QR Code │ │   Attendance       │ │   │
│           │ │ │             │ │                    │ │   │
│           │ │ │Generate QR  │ │Check history       │ │   │
│           │ │ │for attendance│ │                   │ │   │
│           │ │ └─────────────┘ └─────────────────────┘ │   │
│           │ └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

#### Mobile Layout
```
┌─────────────────┐
│ [☰] Dashboard   │
├─────────────────┤
│Welcome Alice!   │
│                 │
│┌───┐┌───┐┌───┐ │
││30 ││28 ││ 1 │ │
││Tot││Pre││Lat│ │
│└───┘└───┘└───┘ │
│                 │
│┌───────────────┐│
││    93.3%      ││
││ Attendance    ││
│└───────────────┘│
│                 │
│Quick Actions:   │
│┌───────────────┐│
││ [📱] My QR    ││
││   Code        ││
│└───────────────┘│
│┌───────────────┐│
││ [📅] View     ││
││ Attendance    ││
│└───────────────┘│
└─────────────────┘
```

### 5. Student QR Code Page

#### Desktop Layout
```
┌─────────────────────────────────────────────────────────────┐
│ [Sidebar] │ My QR Code                                    │
│           │                                               │
│           │ Show this QR code to mark your attendance     │
│           │                                               │
│           │           ┌─────────────────┐                 │
│           │           │                 │                 │
│           │           │                 │                 │
│           │           │   [QR CODE]     │                 │
│           │           │                 │                 │
│           │           │                 │                 │
│           │           └─────────────────┘                 │
│           │                                               │
│           │         Expires at: 2:35 PM                  │
│           │                                               │
│           │         [Refresh QR Code]                     │
│           │                                               │
│           │ ┌─────────────────────────────────────────┐   │
│           │ │ • QR codes expire after 5 minutes      │   │
│           │ │ • Show this to your teacher             │   │
│           │ │ • Refresh if code has expired           │   │
│           │ └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

#### Mobile Layout
```
┌─────────────────┐
│ [☰] My QR Code  │
├─────────────────┤
│Show this QR to  │
│mark attendance  │
│                 │
│ ┌─────────────┐ │
│ │             │ │
│ │             │ │
│ │  [QR CODE]  │ │
│ │             │ │
│ │             │ │
│ └─────────────┘ │
│                 │
│Expires: 2:35 PM │
│                 │
│┌───────────────┐│
││ Refresh QR    ││
│└───────────────┘│
│                 │
│Tips:            │
│• Expires in 5min│
│• Show to teacher│
│• Refresh if exp │
└─────────────────┘
```

### 6. Reports Page

#### Desktop Layout
```
┌─────────────────────────────────────────────────────────────┐
│ [Sidebar] │ Reports & Analytics                           │
│           │                                               │
│           │ ┌─────────────────────────────────────────┐   │
│           │ │ Generate Attendance Report              │   │
│           │ │                                         │   │
│           │ │ Start Date: [Date Picker]               │   │
│           │ │ End Date:   [Date Picker]               │   │
│           │ │ Class:      [Dropdown]                  │   │
│           │ │ Format:     [PDF] [Excel] [CSV]         │   │
│           │ │                                         │   │
│           │ │           [Generate Report]             │   │
│           │ └─────────────────────────────────────────┘   │
│           │                                               │
│           │ ┌─────────────────────────────────────────┐   │
│           │ │        Class-wise Summary               │   │
│           │ │                                         │   │
│           │ │ [Pie Chart showing attendance by class] │   │
│           │ └─────────────────────────────────────────┘   │
│           │                                               │
│           │ ┌─────────────────────────────────────────┐   │
│           │ │      Low Attendance Alerts              │   │
│           │ │                                         │   │
│           │ │ Students with < 75% attendance:         │   │
│           │ │ • John Doe (65%)                        │   │
│           │ │ • Jane Smith (70%)                      │   │
│           │ └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 7. Notifications Page

#### Desktop Layout
```
┌─────────────────────────────────────────────────────────────┐
│ [Sidebar] │ Notifications                                 │
│           │                                               │
│           │ ┌─────────────────────────────────────────┐   │
│           │ │ 🔴 Low Attendance Alert                 │   │
│           │ │ 5 students have attendance below 75%    │   │
│           │ │ 2 hours ago                             │   │
│           │ └─────────────────────────────────────────┘   │
│           │                                               │
│           │ ┌─────────────────────────────────────────┐   │
│           │ │ 🟡 Daily Report Ready                   │   │
│           │ │ Today's attendance report is available  │   │
│           │ │ 1 day ago                               │   │
│           │ └─────────────────────────────────────────┘   │
│           │                                               │
│           │ ┌─────────────────────────────────────────┐   │
│           │ │ 🟢 System Update                        │   │
│           │ │ New features added to QR scanner       │   │
│           │ │ 3 days ago                              │   │
│           │ └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Component Library

### Buttons
- **Primary**: Blue background, white text, rounded corners
- **Secondary**: Gray background, white text
- **Success**: Green background, white text
- **Danger**: Red background, white text
- **Ghost**: Transparent background, colored border

### Cards
- **Default**: White background, subtle shadow, rounded corners
- **Elevated**: Larger shadow for emphasis
- **Interactive**: Hover effects with slight elevation

### Forms
- **Input Fields**: Rounded borders, focus states with blue accent
- **Dropdowns**: Consistent styling with inputs
- **Checkboxes/Radio**: Custom styled with brand colors

### Navigation
- **Sidebar**: Fixed left sidebar with collapsible mobile version
- **Breadcrumbs**: For deep navigation paths
- **Tabs**: For content organization

### Data Display
- **Tables**: Striped rows, sortable headers, pagination
- **Charts**: Chart.js integration with theme colors
- **Stats Cards**: Large numbers with icons and descriptions

## Responsive Breakpoints

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px - 1440px
- **Large Desktop**: 1440px+

## Accessibility Features

- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Proper ARIA labels and roles
- **Color Contrast**: WCAG AA compliant ratios
- **Focus Indicators**: Clear focus states for all interactive elements
- **Alternative Text**: Images and icons have descriptive alt text

## Animation Guidelines

- **Transitions**: 150ms ease-in-out for most interactions
- **Loading States**: Skeleton screens and spinners
- **Micro-interactions**: Subtle hover and click feedback
- **Page Transitions**: Smooth navigation between routes