import { render, screen } from '@testing-library/react-native';
import SpotDetailsScreen from './[id]';

describe('MySpots - Details', () => {
  it('renders placeholder', () => {
    render(<SpotDetailsScreen />);
    expect(screen.getByText('Spot Details - Coming Soon')).toBeTruthy();
  })
});
