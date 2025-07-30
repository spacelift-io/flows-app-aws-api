#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';

interface RGB {
  r: number;
  g: number;
  b: number;
}

function hexToRgb(hex: string): RGB | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function getLighterColor(color1: string, color2: string): string {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return color1;
  
  // Calculate luminance using relative luminance formula
  const luminance1 = 0.299 * rgb1.r + 0.587 * rgb1.g + 0.114 * rgb1.b;
  const luminance2 = 0.299 * rgb2.r + 0.587 * rgb2.g + 0.114 * rgb2.b;
  
  return luminance1 > luminance2 ? color1 : color2;
}

function processIcon(inputPath: string, outputPath: string): void {
  try {
    const svgContent = fs.readFileSync(inputPath, 'utf-8');
    
    // Extract gradient colors from linearGradient
    const gradientMatch = svgContent.match(/<linearGradient[^>]*>(.*?)<\/linearGradient>/s);
    if (!gradientMatch) {
      console.error('No gradient found in SVG');
      return;
    }
    
    const gradientContent = gradientMatch[1];
    const stopMatches = gradientContent.match(/stop-color="([^"]+)"/g);
    
    if (!stopMatches || stopMatches.length < 2) {
      console.error('Not enough gradient stops found');
      return;
    }
    
    const color1 = stopMatches[0].match(/stop-color="([^"]+)"/)![1];
    const color2 = stopMatches[1].match(/stop-color="([^"]+)"/)![1];
    
    const lighterColor = getLighterColor(color1, color2);
    
    // Remove gradient definition
    let modifiedSvg = svgContent.replace(/<defs>.*?<\/defs>/s, '');
    
    // Remove gradient background rectangle
    modifiedSvg = modifiedSvg.replace(/<g[^>]*fill="url\(#[^)]+\)"[^>]*>.*?<rect[^>]*><\/rect>.*?<\/g>/s, '');
    
    // Change white drawing color to lighter gradient color
    modifiedSvg = modifiedSvg.replace(/fill="#FFFFFF"/g, `fill="${lighterColor}"`);
    
    // Adjust viewBox to remove margins and maximize icon
    const transformMatch = modifiedSvg.match(/transform="translate\(([^,]+),\s*([^)]+)\)"/);
    const viewBoxMatch = modifiedSvg.match(/viewBox="([^"]+)"/);
    
    if (viewBoxMatch) {
      const viewBox = viewBoxMatch[1].split(' ').map(Number);
      const [origX, origY, origWidth, origHeight] = viewBox;
      
      if (transformMatch) {
        // Icons with translate transform (like S3) - scale content and adjust viewBox
        const translateX = parseFloat(transformMatch[1]);
        const translateY = parseFloat(transformMatch[2]);
        
        // Calculate scale factor to fill viewport (remove margins)
        const contentSize = origWidth - (translateX * 2);
        const scale = origWidth / contentSize;
        
        // Apply scale transform to compensate for removing translate
        modifiedSvg = modifiedSvg.replace(/transform="translate\([^"]+\)"/g, `transform="scale(${scale})"`);
      } else {
        // Icons without transform (like CloudFormation) - assume common margin and crop it
        const margin = 8; // Most AWS icons have 8px margin
        const newX = origX + margin;
        const newY = origY + margin;
        const newWidth = origWidth - (margin * 2);
        const newHeight = origHeight - (margin * 2);
        
        modifiedSvg = modifiedSvg.replace(/viewBox="[^"]+"/g, `viewBox="${newX} ${newY} ${newWidth} ${newHeight}"`);
      }
    }
    
    // Clean up any extra whitespace
    modifiedSvg = modifiedSvg.replace(/\n\s*\n/g, '\n');
    
    fs.writeFileSync(outputPath, modifiedSvg);
    console.log(`Processed icon saved to: ${outputPath}`);
    console.log(`Drawing color: ${lighterColor}`);
    
  } catch (error) {
    console.error('Error processing icon:', error instanceof Error ? error.message : error);
  }
}

function main(): void {
  const inputPath = process.argv[2];
  
  if (!inputPath) {
    console.error('Usage: npx tsx process-icon.ts <input-svg-path>');
    process.exit(1);
  }
  
  if (!fs.existsSync(inputPath)) {
    console.error(`File not found: ${inputPath}`);
    process.exit(1);
  }
  
  // Read the SVG to extract gradient colors for output filename
  const svgContent = fs.readFileSync(inputPath, 'utf-8');
  const gradientMatch = svgContent.match(/<linearGradient[^>]*>(.*?)<\/linearGradient>/s);
  
  if (!gradientMatch) {
    console.error('No gradient found in SVG');
    process.exit(1);
  }
  
  const gradientContent = gradientMatch[1];
  const stopMatches = gradientContent.match(/stop-color="([^"]+)"/g);
  
  if (!stopMatches || stopMatches.length < 2) {
    console.error('Not enough gradient stops found');
    process.exit(1);
  }
  
  const color1 = stopMatches[0].match(/stop-color="([^"]+)"/)![1];
  const color2 = stopMatches[1].match(/stop-color="([^"]+)"/)![1];
  const lighterColor = getLighterColor(color1, color2);
  
  // Generate output filename
  const parsedPath = path.parse(inputPath);
  const hexColor = lighterColor.replace('#', '');
  const outputPath = path.join(parsedPath.dir, `${parsedPath.name}-${hexColor}${parsedPath.ext}`);
  
  processIcon(inputPath, outputPath);
}

if (require.main === module) {
  main();
}