const puppeteer = require("puppeteer");
require("dotenv").config();

const scrapeLogic = async (req, res) => {
  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });

  try {

    const page = await browser.newPage();
    const req_html = req.query.html
    console.log('request html is: ', req_html);

    await page.setContent(req_html ?? 'damn');

    const pdfBuffer = await page.pdf();

    await page.close();
    await browser.close();

    res.contentType('application/pdf')
    res.send(pdfBuffer)
  } catch (error) {
    console.log('error is: ', error.message)
  }

  return;
};

module.exports = { scrapeLogic };
