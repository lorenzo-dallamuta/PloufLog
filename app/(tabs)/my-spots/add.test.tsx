import { render, screen } from '@testing-library/react-native';
import AddSpotScreen from './add';

describe('MySpots - Add', () => {
  it('renders placeholder', () => {
    render(<AddSpotScreen />);
    expect(screen.getByText('Add Spot - Coming Soon')).toBeTruthy();
  })
});
