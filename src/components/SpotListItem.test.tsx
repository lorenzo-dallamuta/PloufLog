import { render, screen } from '@testing-library/react-native';
import SpotListItem from '@/src/components/SpotListItem';

describe('MySpots - SpotListItem', () => {
  it('renders placeholder', () => {
    render(<SpotListItem />);
    expect(screen.getByText('Spot List Item - Coming Soon')).toBeTruthy();
  })
});
