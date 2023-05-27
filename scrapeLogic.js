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
    const req_url = req.query.url
    const req_html = req.query.html
    const default_value = `<html>
    <head>
      <title>Hriaptui</title>
      <style>
        .text-center {
          text-align: center;
        }
      </style>
    </head>
    <body style="padding-top: 20vh">
      <h1 class="text-center">GENERATE PDF DEMO</h1>
      <div class="text-center">
        SYNTAX https://pdf-api-ks20.onrender.com/scrape?html=YOUR_HTML_STRING_HERE
      </div>
      <div class="text-center">
        <a href="http://https://pdf-api-ks20.onrender.com/scrape?html=&lt;html>&lt;body>&lt;h1 style='text-align:center'>THIS IS A DEMO&lt;/h1>&lt;/body>&lt;/html>">demo</a>
      </div>
    </body>
  </html>
  `
    console.log('request html is: ', req_html);
    if (req_html)
      await page.setContent(req_html);
    else if (req_url)
      await page.goto(req_url ?? 'damn', {
        waitUntil: 'domcontentloaded'
      });
    else
      await page.setContent(default_value);
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
