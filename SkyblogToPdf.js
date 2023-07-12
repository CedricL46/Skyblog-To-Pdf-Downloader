const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

const generatePDFs = async (baseUrl, numberOfPages) => {
    // Launch a new browser instance
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--start-maximized']
    });

    // Loop over the number of pages
    for (let i = 1; i <= numberOfPages; i++) {
        // Create a new browser page
        const page = await browser.newPage();

        // Navigate to the URL for the current iteration
        await page.goto(`${baseUrl}${i}.html`, { waitUntil: 'networkidle2' });

        // Try to handle the cookie consent
        try {
            // Wait for the cookie consent button to appear
            await page.waitForSelector('button[data-privacy-accept]', { timeout: 5000 });

            // Click the cookie consent button
            await page.click('button[data-privacy-accept]');
        } catch (error) {
            // If the cookie consent button doesn't appear, log a message and continue
            console.log('No cookie consent found. Pursuing...');
        }

        // Set the path for the current PDF
        const pdfPath = `pdf/page${i}.pdf`;

        // Generate the PDF for the current page
        await page.pdf({ path: pdfPath, format: 'A4', printBackground: true });
    }

    // Close the browser instance
    await browser.close();
}

const mergePDFs = async () => {
    // Create a new PDF document
    const mergedPdf = await PDFDocument.create();

    // Set the path for the directory containing the PDFs
    const pdfDir = './pdf';

    // Read all files in the pdf directory
    const files = fs.readdirSync(pdfDir);

    // Filter the list of files to only include PDFs
    const pdfFiles = files.filter(file => path.extname(file).toLowerCase() === '.pdf');

    // Loop over the PDF files
    for (const pdfFile of pdfFiles) {
        // Set the path for the current PDF file
        const pdfPath = path.join(pdfDir, pdfFile);

        // Read the bytes of the current PDF file
        const pdfBytes = fs.readFileSync(pdfPath);

        // Load the PDF document from the bytes
        const pdfDoc = await PDFDocument.load(pdfBytes);

        // Get the indices of all pages in the current PDF document
        const pageIndices = Array.from({ length: pdfDoc.getPageCount() }, (_, i) => i);

        // Copy the pages from the current PDF document to the new one
        const copiedPages = await mergedPdf.copyPages(pdfDoc, pageIndices);

        // Add the copied pages to the new PDF document
        for (const copiedPage of copiedPages) {
            mergedPdf.addPage(copiedPage);
        }

        // Optionally ; uncomment to remove the individual PDF
        //fs.unlinkSync(pdfPath);
    }

    // Save the new PDF document to bytes
    const mergedPdfFile = await mergedPdf.save();

    // Write the bytes to a file
    fs.writeFileSync('pdf/pages_merged.pdf', mergedPdfFile);
}

// The second command line argument will be the base URL.
const baseUrl = process.argv[2];

// The third command line argument will be the number of pages.
const numberOfPages = process.argv[3];

// Generate the PDFs and then merge them
generatePDFs(baseUrl, numberOfPages).then(mergePDFs);
