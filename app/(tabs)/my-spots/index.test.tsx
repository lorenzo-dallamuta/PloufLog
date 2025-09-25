import { isInaccessible, render, screen } from '@testing-library/react-native';
import SpotListScreen from '@/app/(tabs)/my-spots/index';

// mock the return values of the store selectors, used in the UI components
jest.mock('@/src/store/useDiveSiteStore', () => ({
  useDiveSiteList: jest.fn(),
  useDiveSiteIsLoading: jest.fn(),
  useDiveSiteActions: jest.fn(),
}));

import { useDiveSiteList, useDiveSiteIsLoading, useDiveSiteActions } from '@/src/store/useDiveSiteStore';


describe('MySpots - List', () => {
  beforeEach(() => {
    // Clear all mocks before each test, this is necessary as DI doesn't cover all mocking needs
    jest.clearAllMocks();
  });

  describe('loading state', () => {
    beforeEach(() => {
      // Set the mock implementations
      (useDiveSiteIsLoading as jest.Mock).mockReturnValue(true);
      (useDiveSiteActions as jest.Mock).mockReturnValue({ loadDiveSites: jest.fn() });
    });

    it('should display a loading indicator', () => {
      render(<SpotListScreen />);
      expect(screen.getByRole('progressbar')).toBeTruthy;
      expect(screen.getByAccessibilityHint('loading-spinner')).toBeTruthy();
    });

    it('should display a loading indicator that is completely visible', () => {
      render(<SpotListScreen />);
      expect(screen.getByRole('progressbar')).toBeVisible();
      expect(screen.getByAccessibilityHint('loading-spinner')).toBeVisible();
    });
  });

  describe('the empty state', () => {
    beforeEach(() => {
      // Set the mock implementations
      (useDiveSiteList as jest.Mock).mockReturnValue([]);
      (useDiveSiteIsLoading as jest.Mock).mockReturnValue(false);
      (useDiveSiteActions as jest.Mock).mockReturnValue({ loadDiveSites: jest.fn() });
    });

    it('should display a no results notice', () => {
      render(<SpotListScreen />);
      expect(screen.getByTestId('empty-list')).toBeTruthy;
    });

    it('should display a no results notice that is completely visible', () => {
      render(<SpotListScreen />);
      expect(screen.getByTestId('empty-list')).toBeVisible();
    });

    it('should display a no results notice that has the expected text', () => {
      render(<SpotListScreen />);
      expect(screen.getByTestId('empty-list')).toHaveTextContent('Add a dive spot to see it in your list');
    });

    it('should display a no results notice that has the expected accessibility attributes', () => {
      render(<SpotListScreen />);
      const emptyElement = screen.getByTestId('empty-list');
      expect(emptyElement).toHaveProp('accessible', true);
      expect(emptyElement).toHaveProp('accessibilityRole', 'text');
      expect(emptyElement).toHaveProp('accessibilityLabel', 'No dive spots');
    });
  });
});
