#!/usr/bin/env node

const { program } = require("commander");
const inquirer = require("inquirer");
const fs = require("fs-extra");
const path = require("path");

// Setup commander
program
  .version("1.0.0")
  .description("Find and delete node_modules folders")
  .argument("<path>", "Path to scan for node_modules")
  .parse(process.argv);

// Get the path from arguments
const scanPath = program.args[0];

async function findNodeModules(dir) {
  let nodeModulesPaths = [];

  try {
    const items = await fs.readdir(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = await fs.stat(fullPath);

      if (stat.isDirectory()) {
        if (item === "node_modules") {
          nodeModulesPaths.push(fullPath);
        } else {
          // Recursively search in subdirectories
          const subDirResults = await findNodeModules(fullPath);
          nodeModulesPaths = [...nodeModulesPaths, ...subDirResults];
        }
      }
    }
  } catch (err) {
    console.error(`Error reading directory ${dir}:`, err.message);
  }

  return nodeModulesPaths;
}

async function main() {
  try {
    console.log("Scanning for node_modules folders...");
    const nodeModulesPaths = await findNodeModules(scanPath);

    if (nodeModulesPaths.length === 0) {
      console.log("No node_modules folders found.");
      return;
    }

    const { selectedPaths } = await inquirer.default.prompt([
      {
        type: "checkbox",
        name: "selectedPaths",
        message: "Select node_modules folders to delete:",
        choices: nodeModulesPaths.map((path) => ({
          name: path,
          value: path,
        })),
      },
    ]);

    if (selectedPaths.length === 0) {
      console.log("No folders selected for deletion.");
      return;
    }

    const { confirm } = await inquirer.default.prompt([
      {
        type: "confirm",
        name: "confirm",
        message: `Are you sure you want to delete ${selectedPaths.length} node_modules folder(s)?`,
        default: false,
      },
    ]);

    if (confirm) {
      for (const pathToDelete of selectedPaths) {
        try {
          await fs.remove(pathToDelete);
          console.log(`✓ Deleted: ${pathToDelete}`);
        } catch (err) {
          console.error(`✗ Error deleting ${pathToDelete}:`, err.message);
        }
      }
      console.log("Deletion complete!");
    } else {
      console.log("Operation cancelled.");
    }
  } catch (err) {
    console.error("An error occurred:", err.message);
    process.exit(1);
  }
}

main();
