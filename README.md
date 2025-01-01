# Delete Node Modules

A command-line tool to find and selectively delete `node_modules` folders in a specified directory and its subdirectories. Useful for freeing up disk space by removing unused node_modules folders.

## Features

- 🔍 Recursively scans directories for `node_modules` folders
- ✅ Interactive selection of folders to delete using checkboxes
- 🔒 Double confirmation prompt before deletion for safety
- ⚡ Asynchronous file operations for better performance
- 🛡️ Robust error handling with clear feedback

## Usage

1. Make the file executable: `chmod +x index.js`
2. Link the package locally: `npm link`
3. Run the command: `node-modules-cleaner <path>`

Example: `node-modules-cleaner ./`
