# Client Records Management Application

A React-based web application for managing client records with features like JSON file uploads, duplicate detection, pagination, searching, and CRUD operations.

## Features

- **JSON File Upload**: Upload client records from JSON files
- **Duplicate Detection**: Automatically remove records with duplicate email addresses
- **Data Merging**: Merge data from multiple file uploads
- **Pagination**: Navigate through client records with pagination
- **Search Functionality**: Search for records by ID, Name, or Email
- **CRUD Operations**: Add, edit, and delete client records
- **Email Validation**: Ensure each email address is unique
- **Responsive Design**: Mobile-friendly interface
- **Theme Customization**: 5 color themes to choose from
- **Dark/Light Mode**: Toggle between dark and light mode

## Technologies Used

- React 18
- TypeScript
- Vite
- Material UI
- React Router
- Font Awesome
- ESLint & Prettier

## Getting Started

### Prerequisites

- Node.js v14 or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Uploading JSON Files

1. Click on the "Upload JSON File" button
2. Select a JSON file from your computer
3. The application will automatically process the file and display the records

### Managing Records

- **Add a new client**: Click the "Add Client" button
- **Edit a client**: Click the edit icon on any record
- **Delete a client**: Click the delete icon on any record
- **Search for clients**: Use the search bar to find specific records
- **Sort records**: Click on column headers to sort in ascending or descending order
- **Change theme**: Use the theme selector in the header

## Sample JSON Format

```json
[
  {
    "id": "c1",
    "name": "John Doe",
    "email": "john.doe@example.com",
  }
]
```

## License

This project is licensed under the MIT License.
