import type { Page } from 'puppeteer-core';
import chrome from 'chrome-aws-lambda';
const username = process.env.SPOTIFY_USERNAME;
const password = process.env.SPOTIFY_PASSWORD;
const applicationId = process.env.SPOTIFY_APP_ID;

export default async function data() {
  const options = process.env.AWS_REGION
    ? {
      args: chrome.args,
      executablePath: await chrome.executablePath,
      headless: chrome.headless
    }
    : {
      args: [],
      executablePath:
        process.platform === 'win32'
          ? 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
          : process.platform === 'linux'
            ? '/usr/bin/google-chrome'
            : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    };
  const browser = await chrome.puppeteer.launch(options);
  const page = await browser.newPage();

  const accessToken = await new Promise(async (resolve, reject) => {
    console.log('Go to applications');

    await page.goto("https://developer.spotify.com/dashboard/applications");

    console.log('Click!');
    let array = await Promise.all([
      new Promise((resolve) => page.once("popup", resolve)),
      page.click('button[class="btn btn-sm btn-primary"]'),
    ]);

    const popup = array[0] as Page;
    await popup.waitForSelector("#login-username");
    await popup.focus("#login-username");
    await popup.keyboard.type(username);

    await popup.waitForSelector("#login-password");
    await popup.focus("#login-password");
    await popup.keyboard.type(password);

    await popup.waitForSelector('button[id="login-button"]');
    popup.on("close", async () => {
      console.log('popup closed')
      if (
        page.url() === "https://developer.spotify.com/dashboard/tos-accept"
      ) {
        await page.click("input[ng-model=acceptTOS]");
        await page.click("input[type=submit]");
      }
      let accessToken = await page.evaluate(() => {
        return localStorage.getItem("_sp_self_prov_accessToken");
      });
      if (accessToken) {
        console.log(accessToken);
        resolve(accessToken);
      } else {
        reject();
      }
    });

    await popup.click('button[id="login-button"]');
    await popup.click('button[id="login-button"]');


  });

  const result = fetch(`https://api.spotify.com/v1/appstats/${applicationId}`, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:78.0) Gecko/20100101 Firefox/78.0",
      Accept: "application/json, text/plain, */*",
      "Accept-Language": "en-US,en;q=0.5",
      Authorization: `Bearer ${accessToken}`,
    },
    method: "GET",
  }).then((res) => res.json());

  return result;
}