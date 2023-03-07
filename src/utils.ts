import { By, until } from 'selenium-webdriver';
import { driver, isInitialized } from '.';

export interface TypedRequestBody<T> extends Express.Request {
  body: T;
}

export function getFromEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export function getSpotifyTrackLink(id: string) {
  return `https://open.spotify.com/track/${id}`;
}

export async function waitForElementWithAttributeAndValue(
  attribute: string,
  value: string
) {
  return await driver.wait(
    until.elementLocated(By.xpath(`//*[@${attribute}='${value}']`))
  );
}

export async function getElementWithAttributeAndValue(
  attribute: string,
  value: string
) {
  return await driver.findElement(By.xpath(`//*[@${attribute}='${value}']`));
}

export async function waitForElementWithId(id: string) {
  return await driver.wait(until.elementLocated(By.id(id))).click();
}

export async function waitUntilInitialized() {
  await driver.wait(isInitialized);
}

export async function isLoggedIn() {
  const loginButton = await waitForElementWithAttributeAndValue(
    'data-testid',
    'login-button'
  );
  const buttonText = await loginButton.getText();
  console.log('buttonText', buttonText);
  return buttonText.trim().toLowerCase() !== 'log in';
}
