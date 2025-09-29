import { render, screen } from 'expo-router/testing-library';
import SpotDetailsScreen from './[id]';

describe('MySpots - Details', () => {
  it('renders placeholder', () => {
    render(<SpotDetailsScreen />);
    expect(screen.getByText('Spot Details - Coming Soon')).toBeTruthy();
  })
});
