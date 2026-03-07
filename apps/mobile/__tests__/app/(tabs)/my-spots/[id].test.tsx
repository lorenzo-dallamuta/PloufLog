import { render, screen } from 'expo-router/testing-library';
import SpotDetailsScreen from '../../../../app/(tabs)/my-spots/[id]';

describe('MySpots - Details', () => {
  it('renders placeholder', () => {
    render(<SpotDetailsScreen />);
    expect(screen.getByText('Spot Details - Coming Soon')).toBeTruthy();
  })
});
