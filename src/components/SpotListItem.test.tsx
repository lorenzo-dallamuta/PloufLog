import { fireEvent, render, renderRouter, screen } from 'expo-router/testing-library';
import { View } from '@/src/components/Themed';
import SpotListItem from '@/src/components/SpotListItem';
import { getCountryName } from '@/src/utils/getCountryName';

import { getRandomArrayElements } from '@/src/utils/getRandomArrayElements';
import redSeaMock from "@/mocks/diveSites/redSea"
// Define mock data for testing, with sub-sampling for speed
// ( if you're trying snapshot testing and they fail, this is why )
const mockDiveSite: DiveSite = getRandomArrayElements(redSeaMock.result.elements, 1)[0];

describe('MySpots - SpotListItem', () => {
  it('displays the dive site name', () => {
    render(<SpotListItem item={mockDiveSite} />);
    expect(screen.getByText(mockDiveSite.data.properties.name)).toBeTruthy();
  });

  it('displays the dive site location', () => {
    render(<SpotListItem item={mockDiveSite} />);
    const countryName = getCountryName(mockDiveSite.data.properties.country_iso3);
    expect(screen.getByText(countryName)).toBeTruthy();
  });

  it('displays the dive average rating', () => {
    render(<SpotListItem item={mockDiveSite} />);
    const rating = mockDiveSite.data.properties.averageRating;
    const starElement = screen.getByText(`${rating}⭐`)
    expect(starElement).toBeVisible();
    expect(starElement).toHaveProp(
      'accessibilityLabel', 
      `Rating: ${rating} out of 5 stars`
    );
  });

  // NOTE: this is an advanced feature that I still haven't planned properly
  //       it might be I'll place a different emoji based on the number of species
  //       it might be I'll keep track of the users favourite wildlife ids and give feedback on their presence
  //       etc.
  // it('displays an indication of the dive site wildlife presence', () => {
  //   render(<SpotListItem item={mockDiveSite}/>);
  //   expect(screen.getByText(mockDiveSite.data.properties.wildlife)).toBeTruthy();
  // });

  it('renders the intended accessibility attributes', () => {
    render(<SpotListItem item={mockDiveSite} />);
    const component = screen.getByRole('button');
    expect(component).toBeVisible();
    expect(component).toHaveProp('accessibilityRole', 'button');
    expect(component).toHaveProp(
      'accessibilityLabel',
      `${mockDiveSite.data.properties.name}, tap to view details.`
    );
  });

  it('navigates when interacted with a tap', () => {
    renderRouter({
      index: jest.fn(() => <SpotListItem item={mockDiveSite} />),
      '(tabs)/my-spots/[id]': jest.fn(() => <View />)
    });
    
    fireEvent.press(screen.getByRole('button'));
    
    expect(screen).toHavePathname(`/my-spots/${mockDiveSite.data.properties.id}`);
  });

  // this test will be implemented with Storybook actions or Playwright
  // it('toggles a delete button if swiped', () => {});
});
