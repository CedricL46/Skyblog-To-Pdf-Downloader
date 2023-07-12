# Skyblog to PDF Downloader

This project downloads and merges PDFs of skyblog pages from a given base URL. It's implemented in Node.js using Puppeteer for web scraping and the pdf-lib library for PDF manipulation.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Prerequisites

To run this script, you need Node.js and npm installed on your machine. If you don't have Node.js and npm installed, you can download and install them from the official Node.js website.

## Installing

Clone this repository to your local machine:

    git clone https://github.com/your-github-username/your-repository-name.git

Open a terminal in the project directory and install the required npm packages:

    npm install

## Usage

To use this script, you need to provide the base URL and the number of pages you want to download as command-line arguments:

    node SkyblogToPdf.js <base_url> <number_of_pages>

For example, for a skyblog with 65 pages names YOUR_SKYBLOG:

    node main.js https://YOUR_SKYBLOG.skyrock.com/ 65

This will download PDFs of the webpages from https://YOUR_SKYBLOG.skyrock.com/1.html to https://YOUR_SKYBLOG.skyrock.com/65.html, and then merge all these PDFs into a single PDF file named merged.pdf.

### Important Notes if you want to use it for other websites

This script handles cookie consent pop-ups by clicking on a button with the attribute data-privacy-accept. If the website you want to download PDFs from has a different mechanism for cookie consent, you might need to modify this part of the script.

The script assumes that the pages you want to download are accessible via URLs formed by appending a number to the base URL. If the URLs for the pages are formed differently, you might need to modify the part of the script that constructs the URLs.

The script might not work properly if a webpage has dynamic content that takes a long time to load. You might need to add additional waiting mechanisms in this case.
