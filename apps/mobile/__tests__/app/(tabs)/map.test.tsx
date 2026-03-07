import { render, screen } from 'expo-router/testing-library';
import MapScreen from '../../../app/(tabs)/map';

describe('Map', () => {
  it('renders placeholder', () => {
    render(<MapScreen />);
    expect(screen.getByText('Map - Coming Soon')).toBeTruthy();
  })
});
