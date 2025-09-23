import { render, screen } from '@testing-library/react-native';
import SpotListScreen from './index';

describe('MySpots - List', () => {
  it('renders placeholder', () => {
    render(<SpotListScreen />);
    expect(screen.getByText('My Spots List - Coming Soon')).toBeTruthy();
  })
});
