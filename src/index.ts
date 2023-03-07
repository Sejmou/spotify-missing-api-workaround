import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import chrome from 'selenium-webdriver/chrome';
import { Builder } from 'selenium-webdriver';
import getSongCredits from './song-credits';
import { login } from './login';
import { checkIfLoggedIn, getElementWithAttributeAndValue } from './utils';
import path from 'path';

const screen = {
  width: 1920,
  height: 1080,
};

type BrowserOpenBehavior = 'headless' | 'minimized' | 'normal'; // minimized option is useful if you want to see what's going on but not have browser open across whole screen every time server restarts lol
const browserOpenBehavior: BrowserOpenBehavior =
  'minimized' as BrowserOpenBehavior; // "widening" type so that I don't get errors in if statements below lol

const options = new chrome.Options().windowSize(screen);
if (browserOpenBehavior === 'headless') {
  options.headless();
}

const userDataDir = path.join(__dirname, '..', 'chrome-user-data');
options.addArguments(`user-data-dir=${userDataDir}`);

export const driver = new Builder()
  .forBrowser('chrome')
  .setChromeOptions(options)
  .build();

if (browserOpenBehavior === 'minimized') {
  driver.manage().window().minimize();
}

let initialized = false;
export function isInitialized() {
  return initialized;
}

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8888;

app.get('/', (req: Request, res: Response) => {
  getSongCredits(req, res);
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  init();
});

async function init() {
  await driver.get('https://open.spotify.com/');
  const loggedIn = await checkIfLoggedIn();

  console.log(loggedIn ? 'logged in' : 'not logged in');
  if (!loggedIn) {
    await login();
    console.log('logged in successfully');
  }
}
