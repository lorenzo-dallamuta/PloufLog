import { render, screen } from 'expo-router/testing-library';
import AddSpotScreen from '../../../../app/(tabs)/my-spots/add';

describe('MySpots - Add', () => {
  it('renders placeholder', () => {
    render(<AddSpotScreen />);
    expect(screen.getByText('Add Spot - Coming Soon')).toBeTruthy();
  })
});
