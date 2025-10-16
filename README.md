make new



# Toothalie - Dental Clinic Website

This is the frontend for Toothalie, a modern and responsive dental clinic website built with React, TypeScript, and Vite.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v18 or later)
- npm

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/your_username/your_project_name.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```

### Running the Application

To run the app in development mode, run the following command:

```sh
npm run dev
```

This will start the development server at `http://localhost:5173`.

## Available Scripts

In the project directory, you can run:

- `npm run dev`: Runs the app in the development mode.
- `npm run build`: Builds the app for production to the `dist` folder.
- `npm run lint`: Lints the code using ESLint.
- `npm run preview`: Serves the production build locally.

## Project Structure

The project structure is as follows:

```
.
├── public/
│   ├── fonts/
│   └── vite.svg
├── src/
│   ├── API/
│   │   ├── LoginAuth.ts
│   │   └── RegisterAuth.ts
│   ├── assets/
│   ├── Classes/
│   │   └── UserLogin.ts
│   ├── components/
│   │   ├── sections/
│   │   ├── shadcnblocks/
│   │   └── ui/
│   ├── config/
│   │   └── site.ts
│   ├── hooks/
│   │   └── use-mobile.ts
│   ├── lib/
│   │   └── utils.ts
│   ├── Pages/
│   │   ├── Auth/
│   │   ├── LandinPageSection/
│   │   └── Panes/
│   └── TestUser/
├── .gitignore
├── index.html
├── package.json
├── README.md
└── vite.config.ts
```

### File Descriptions

- **`public/`**: Contains static assets that are not processed by Vite, such as fonts and images.
- **`src/`**: Contains the main source code of the application.
- **`src/API/`**: Contains functions for making API calls to the backend.
- **`src/assets/`**: Contains images and other assets used in the application.
- **`src/Classes/`**: Contains class definitions.
- **`src/components/`**: Contains reusable React components.
- **`src/config/`**: Contains configuration files.
- **`src/hooks/`**: Contains custom React hooks.
- **`src/lib/`**: Contains utility functions.
- **`src/Pages/`**: Contains the main pages of the application.
- **`index.html`**: The main HTML file of the application.
- **`package.json`**: Contains the project's dependencies and scripts.
- **`vite.config.ts`**: The configuration file for Vite.

## Dependencies

The main dependencies of the project are:

- **React**: A JavaScript library for building user interfaces.
- **TypeScript**: A typed superset of JavaScript.
- **Vite**: A fast build tool for modern web projects.
- **React Router**: For routing and navigation.
- **Tailwind CSS**: A utility-first CSS framework.
- **Shadcn/ui**: A collection of reusable UI components.
