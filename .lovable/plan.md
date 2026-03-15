

# RFI Generator App - Request for Inspection

## Overview
A web app to create, manage, and export RFI (Request for Inspection) documents matching your existing Excel format exactly. Two-page document with auto-generated inspection numbers and PDF export.

---

## Pages & Features

### 1. RFI Dashboard (Home)
- List of all saved RFIs with inspection number, date, location, and status
- "Create New RFI" button
- Search/filter by inspection number or date
- Quick actions: View, Edit, Export PDF

### 2. RFI Form (Create/Edit) — Two-Step Form

**Step 1 — RFI Request Page (Page 1 of document)**
- **Fixed/pre-filled fields** (not editable): Project name, Contractor, Contract No, Client, Form number (PMD-2021-FRM-108)
- **Auto-generated**: Inspection No (IR-1937, IR-1938, etc. — incrementing from 1937)
- **Editable fields**:
  - Ref. Drawing, Work Site, Location, Date, Time
  - "Arrange Inspection for" — up to 5 line items
  - Weather condition
  - Pre-Inspection Contractor name, designation, date
  - "Received by Client" name, designation, date
  - Comments (URBANCO USE ONLY)
  - Client & Contractor Representative signatures section

**Step 2 — Checklist Page (Page 2 of document)**
- Project, Client, Contractor, Contract No, Inspection #, Date, Time, Location auto-filled from Step 1
- Checklist table with pre-defined cladding inspection items:
  - Each row: Work description | ✓/✗/NA dropdown | Comments field
- "Comments on completed works" text area
- Contractor & Client representative names, designations

### 3. PDF Export
- Generates a PDF matching the exact Excel layout — header with HDC logo/info, tables, formatting
- Two-page PDF: Page 1 = RFI Request, Page 2 = Checklist
- Download button available from form and dashboard

---

## Backend (Supabase / Lovable Cloud)
- **RFI table**: stores all form data, auto-incrementing IR number
- **Checklist results table**: stores ✓/✗/NA and comments per inspection item
- Track the next available inspection number automatically

## Tech
- React multi-step form with validation
- jsPDF + jsPDF-AutoTable for PDF generation matching Excel layout
- Supabase for data persistence

