import { driver } from '.';
import { By, until } from 'selenium-webdriver';
import inquirer from 'inquirer';

const emailPrompt = [
  {
    type: 'input',
    name: 'email',
    message: 'Please enter your Spotify email address:',
  },
];

const passwordPrompt = [
  {
    type: 'password',
    name: 'password',
    message: 'Please enter your Spotify password:',
  },
];

export async function login() {
  const email = await inquirer
    .prompt(emailPrompt)
    .then(answers => answers.email);
  const password = await inquirer
    .prompt(passwordPrompt)
    .then(answers => answers.password);
  const loginButton = await driver.findElement(
    By.xpath("//*[@data-testid='login-button']")
  );
  await loginButton.click();
  const emailInput = await driver.wait(
    until.elementLocated(By.id('login-username'))
  );
  await emailInput.sendKeys(email);
  const passwordInput = await driver.wait(
    until.elementLocated(By.id('login-password'))
  );
  await passwordInput.sendKeys(password);

  await driver.wait(until.elementLocated(By.id('login-button'))).click();
  await driver.wait(until.titleContains('Player'));
}
