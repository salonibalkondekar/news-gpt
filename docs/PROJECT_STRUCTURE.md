# GPT-News Project Structure

## Overview
This project has been organized with a clean separation of concerns and proper file structure.

## Directory Structure

```
news-gpt/
├── src/                    # Source code
│   ├── css/               # Stylesheets
│   │   └── styles.css     # Main application styles
│   └── js/                # JavaScript modules
│       ├── app.js         # Main application logic
│       └── config.js      # Configuration module (not used in current version)
├── assets/                # Static assets
│   └── favicon.svg        # Application favicon
├── docs/                  # Documentation
│   ├── README.md          # Project documentation
│   ├── SETUP.md           # Setup instructions
│   └── DEPLOYMENT.md      # Deployment guide
├── node_modules/          # Dependencies (generated)
├── .env.example           # Environment variables template
├── .gitignore            # Git ignore rules
├── config.js             # Configuration file (contains API keys)
├── index.html            # Main HTML file
├── index-old.html        # Backup of original file
├── LICENSE               # License file
└── package.json          # Node.js project configuration
```

## File Descriptions

### Core Files
- **index.html**: Clean HTML structure with external CSS/JS links
- **src/css/styles.css**: All application styles (extracted from HTML)
- **src/js/app.js**: Main application logic (extracted from HTML)
- **config.js**: Configuration file with API keys and settings

### Configuration
- **.env.example**: Template for environment variables
- **config.js**: Actual configuration (should not be committed with real API keys)

### Documentation
- **docs/README.md**: Project documentation
- **docs/SETUP.md**: Setup and installation guide
- **docs/DEPLOYMENT.md**: Deployment instructions

### Development
- **package.json**: Dependencies and scripts
- **node_modules/**: Installed dependencies

## Benefits of This Structure

1. **Separation of Concerns**: CSS, JavaScript, and HTML are in separate files
2. **Maintainability**: Easier to find and modify specific parts of the code
3. **Scalability**: Easy to add new modules or components
4. **Security**: Configuration is separated and can be ignored in version control
5. **Documentation**: All docs are organized in a dedicated folder

## Development Workflow

1. HTML structure is in `index.html`
2. Styles are in `src/css/styles.css`
3. Application logic is in `src/js/app.js`
4. Configuration is in `config.js` (keep private)
5. Documentation is in the `docs/` folder

This structure follows modern web development best practices and makes the project much easier to maintain and extend.
