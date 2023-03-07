import { By, until, WebElement } from 'selenium-webdriver';
import { driver } from '.';

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
  return await driver.wait(until.elementLocated(By.id(id)));
}

export async function getElementWithId(id: string) {
  return await driver.findElement(By.id(id));
}

export async function waitForElementContainingTextCaseInsensitive(
  tagName: string,
  text: string
) {
  return await driver.wait(
    until.elementLocated(
      By.xpath(
        `//${tagName}[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${text}')]`
      )
    )
  );
}

export async function getElementContainingTextCaseInsensitive(
  tagName: string,
  text: string,
  parent?: WebElement
) {
  const element = parent || driver;
  return await element.findElement(
    By.xpath(
      `//${tagName}[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${text}')]`
    )
  );
}

export async function getElementsContainingTextCaseInsensitive(
  tagName: string,
  text: string,
  parent?: WebElement
) {
  const element = parent || driver;
  return await element.findElements(
    By.xpath(
      `//${tagName}[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${text}')]`
    )
  );
}

export async function getElementWithClassName(className: string) {
  return await driver.findElement(By.className(className));
}

export async function checkIfLoggedIn() {
  return getElementWithAttributeAndValue('data-testid', 'login-button')
    .then(el => el.getText())
    .then(text => text.trim().toLowerCase() !== 'log in')
    .then(() => false)
    .catch(() => true);
}
