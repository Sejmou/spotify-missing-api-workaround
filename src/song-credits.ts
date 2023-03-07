import {
  waitForElementWithAttributeAndValue,
  getSpotifyTrackLink,
  waitForElementWithId,
  getElementContainingTextCaseInsensitive,
  waitForElementContainingTextCaseInsensitive,
  getElementWithClassName,
  getElementsContainingTextCaseInsensitive,
} from './utils';
import type { Request, Response } from 'express';
import { driver } from '.';
import { until } from 'selenium-webdriver';

export default async function handleRequest(req: Request, res: Response) {
  const query = req.query;
  if (query.id) {
    const id = query.id as string;
    const link = getSpotifyTrackLink(id);
    await driver.get(link);
    const moreInfoButton = await waitForElementWithAttributeAndValue(
      'data-testid',
      'more-button'
    );
    moreInfoButton.click();
    const contextMenu = await waitForElementWithId('context-menu');
    const credits = await getElementContainingTextCaseInsensitive(
      'span',
      'credits',
      contextMenu
    );

    await driver.wait(until.elementIsEnabled(credits));
    credits.click();

    await waitForElementContainingTextCaseInsensitive('h1', 'credits');
    const performers = await getSpanTextOfDivContainingParagraphContaingText(
      'performed by'
    );
    const writers = await getSpanTextOfDivContainingParagraphContaingText(
      'written by'
    );
    const producers = await getSpanTextOfDivContainingParagraphContaingText(
      'produced by'
    );
    const modal = await getElementWithClassName('GenericModal');

    const producedByContainer = await getElementContainingTextCaseInsensitive(
      'p',
      'produced by'
    );
    const contentDiv = await producedByContainer.findElement({
      xpath: '../..',
    });
    const sourceElements = await getElementsContainingTextCaseInsensitive(
      'p',
      'source',
      contentDiv
    ); // don't really understand why this returns more than one element
    const elementTexts = await Promise.all(
      sourceElements.map(el => el.getText())
    );
    const source = elementTexts
      .find(text => text.startsWith('Source:'))
      ?.replace('Source:', '')
      .trim();

    const title = await modal.findElement({ tagName: 'h2' }).getText();

    res.send({ id, title, performers, writers, producers, source });
  } else {
    res.send('Missing id');
  }
}

async function getSpanTextOfDivContainingParagraphContaingText(text: string) {
  const paragraph = await getElementContainingTextCaseInsensitive('p', text);
  const parent = await paragraph.findElement({ xpath: '..' });
  return Promise.all(
    (await parent.findElements({ tagName: 'span' })).map(span => span.getText())
  );
}
