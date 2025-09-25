import { render, screen } from '@testing-library/react-native';
import SpotListScreen from '@/app/(tabs)/my-spots/index';

describe('MySpots - List', () => {
  beforeEach(() => {
    // Clear all mocks before each test, this is necessary as DI doesn't cover all mocking needs
    jest.clearAllMocks();
  });

  describe('loading state', () => {
    beforeEach(() => {
      // mock the return values of store selectors, used in the UI components
      jest.mock('@/src/store/useDiveSiteStore', () => ({
        useDiveSiteIsLoading: () => true,
        useDiveSiteActions: () => ({ loadDiveSites: jest.fn() }),
      }));
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
});
