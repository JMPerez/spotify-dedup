const puppeteer = require('puppeteer-core');
const fetch = require("node-fetch");
const chrome = require('chrome-aws-lambda');

class SpotifyAppStats {
  constructor() {
    this.browser = null;
    this.accessToken = null;
  }

  async init() {
    console.log('Init');
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
    this.browser = await puppeteer.launch(options);
  }

  async login(username, password) {
    console.log('Login');
    const page = await this.browser.newPage();
    await new Promise(async (resolve, reject) => {
      console.log('Go to applications');

      await page.goto("https://developer.spotify.com/dashboard/applications");
      const [popup] = await Promise.all([
        new Promise((resolve) => page.once("popup", resolve)),
        page.click('button[class="btn btn-sm btn-primary"]'),
      ]);

      await popup.waitFor("#login-username");
      await popup.focus("#login-username");
      await popup.keyboard.type(username);

      await popup.waitFor("#login-password");
      await popup.focus("#login-password");
      await popup.keyboard.type(password);
      console.log('Click on login');

      await popup.click('button[id="login-button"]');

      popup.on("close", async (popup) => {
        if (
          page.url() === "https://developer.spotify.com/dashboard/tos-accept"
        ) {
          await page.click("input[ng-model=acceptTOS]");
          await page.click("input[type=submit]");
        }
        this.accessToken = await page.evaluate(() => {
          return localStorage.getItem("_sp_self_prov_accessToken");
        });
        if (this.accessToken) {
          resolve();
        } else {
          reject();
        }
      });
    });
  }

  async getStats(applicationId) {
    console.log('Get Stats')
    return await fetch(`https://api.spotify.com/v1/appstats/${applicationId}`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:78.0) Gecko/20100101 Firefox/78.0",
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.5",
        Authorization: `Bearer ${this.accessToken}`,
      },
      method: "GET",
    }).then((res) => res.json());
  }

  async destroy() {
    await this.browser.close();
  }
}

module.exports = SpotifyAppStats;
