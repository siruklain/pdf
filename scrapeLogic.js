const puppeteer = require("puppeteer");
require("dotenv").config();

const scrapeLogic = async (res, req) => {
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
    if (req.query?.url)
      page.goto(req.query.url)
    else if (req.query.html)
      page.setContent(req.query.html)
    else
      await page.setContent('test')

    // await page.goto("https://developer.chrome.com/");

    const pdf = await page.pdf({
      path: "output.pdf",
      format: "A4",
      printBackground: true,
      encoding: "base64"
    });

    res.set({
      // 'Content-Disposition': 'attachment; filename="output.pdf"',
      "Content-Type": "application/pdf",
      "Content-Length": pdf.length
    });


    res.send(pdf);
    // Set screen size
    // await page.setViewport({ width: 1080, height: 1024 });

    // // Type into search box
    // await page.type(".search-box__input", "automate beyond recorder");

    // // Wait and click on first result
    // const searchResultSelector = ".search-box__link";
    // await page.waitForSelector(searchResultSelector);
    // await page.click(searchResultSelector);

    // // Locate the full title with a unique string
    // const textSelector = await page.waitForSelector(
    //   "text/Customize and automate"
    // );
    // const fullTitle = await textSelector.evaluate((el) => el.textContent);

    // // Print the full title
    // const logStatement = `The title of this blog post is ${fullTitle}`;
    console.log(logStatement);
    res.send(logStatement);
  } catch (e) {
    console.error(e);
    res.send(`Something went wrong while running Puppeteer: ${e}`);
  } finally {
    await browser.close();
  }
};

module.exports = { scrapeLogic };
