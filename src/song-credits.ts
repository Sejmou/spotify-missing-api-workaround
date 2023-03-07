import {
  waitForElementWithAttributeAndValue,
  getSpotifyTrackLink,
  waitUntilInitialized,
} from './utils';
import type { Request, Response } from 'express';
import { driver } from '.';

export default async function handleRequest(req: Request, res: Response) {
  await waitUntilInitialized();
  const query = req.query;
  if (query.id) {
    const link = getSpotifyTrackLink(query.id as string);
    await driver.get(link);
    const moreInfoButton = await waitForElementWithAttributeAndValue(
      'data-testid',
      'more-info-button'
    );
    await moreInfoButton.click();
  } else {
    res.send('Missing id');
  }
}
