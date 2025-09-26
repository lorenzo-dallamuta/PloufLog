import { render, screen } from '@testing-library/react-native';
import SpotListItem from '@/src/components/SpotListItem';

import { getRandomArrayElements } from '@/src/utils/getRandomArrayElements';
import redSeaMock from "@/mocks/diveSites/redSea"
import { getCountryName } from '../utils/getCountryName';
// Define mock data for testing, with sub-sampling for speed
// ( if you're trying snapshot testing and they fail, this is why )
const mockDiveSite: DiveSite = getRandomArrayElements(redSeaMock.result.elements, 1)[0];


describe('MySpots - SpotListItem', () => {
  it('displays the dive site name', () => {
    render(<SpotListItem item={mockDiveSite}/>);
    expect(screen.getByText(mockDiveSite.data.properties.name)).toBeTruthy();
  });

  it('displays the dive site location', () => {
    render(<SpotListItem item={mockDiveSite}/>);
    expect(screen.getByText(getCountryName(mockDiveSite.data.properties.country_iso3))).toBeTruthy();
  });

  it('displays the dive average rating', () => {
    render(<SpotListItem item={mockDiveSite}/>);
    const rating = mockDiveSite.data.properties.averageRating;
    const starElement = screen.getByText(`${rating}⭐`)
    expect(starElement).toBeVisible();
    expect(starElement).toHaveProp('accessibilityLabel', `Rating: ${rating} out of 5 stars`);
  });

  // NOTE: this is an advanced feature that I still haven't planned properly
  //       it might be I'll place a different emoji based on the number of species
  //       it might be I'll keep track of the users favourite wildlife ids
  //       etc.
  // it('displays an indication of the dive site wildlife presence', () => {
  //   render(<SpotListItem item={mockDiveSite}/>);
  //   expect(screen.getByText(mockDiveSite.data.properties.wildlife)).toBeTruthy();
  // });
});
