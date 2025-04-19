/**
 * This script identifies old sidebar and navbar components that should be removed
 * now that we've implemented a unified navigation system.
 * 
 * Run with: node scripts/cleanup-old-navigation.js
 */
const fs = require('fs');
const path = require('path');

// List of files to be removed
const filesToRemove = [
  'modules/patient-pages/PatientSidebar.tsx',
  'modules/doctor-pages/SideBar.tsx',
  'modules/doctor-pages/TopNavBar.tsx'
];

// Function to check if a file exists
function fileExists(filePath) {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    return fs.existsSync(fullPath);
  } catch (error) {
    console.error(`Error checking if file exists: ${filePath}`, error);
    return false;
  }
}

// Function to remove a file
function removeFile(filePath) {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    fs.unlinkSync(fullPath);
    console.log(`✅ Removed: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`❌ Error removing file: ${filePath}`, error);
    return false;
  }
}

// Main function
function cleanup() {
  console.log('Starting cleanup of old navigation components...');
  
  let filesRemoved = 0;
  
  for (const file of filesToRemove) {
    if (fileExists(file)) {
      if (removeFile(file)) {
        filesRemoved++;
      }
    } else {
      console.log(`⚠️ File not found: ${file}`);
    }
  }
  
  console.log(`Cleanup complete. Removed ${filesRemoved}/${filesToRemove.length} files.`);
  console.log('Note: You may need to update imports in files that referenced these components.');
}

cleanup();
