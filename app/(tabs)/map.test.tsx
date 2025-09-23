import { render, screen } from '@testing-library/react-native';
import MapScreen from './map';

describe('Map', () => {
  it('renders placeholder', () => {
    render(<MapScreen />);
    expect(screen.getByText('Map - Coming Soon')).toBeTruthy();
  })
});
