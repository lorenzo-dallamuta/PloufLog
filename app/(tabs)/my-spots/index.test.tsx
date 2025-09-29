import { render, screen } from 'expo-router/testing-library';

// mock the return values of the store selectors, used in the UI components
jest.mock('@/src/store/useDiveSiteStore', () => ({
  useDiveSiteList: jest.fn(),
  useDiveSiteIsLoading: jest.fn(),
  useDiveSiteActions: jest.fn(),
}));

import type { ComponentProps } from 'react';

// mock the react-native FlatList component to override the initialNumToRender prop value
jest.mock('react-native', () => {
  const React = require('react');
  const ActualRN = jest.requireActual('react-native');
  // extract the actual FlatList property before creating the new property of the same name to avoid circular dependencies
  const { FlatList: ActualRNFlatList } = ActualRN;

  // define a new property instead of trying to assign to the FlatList getter
  Object.defineProperty(ActualRN, 'FlatList', {
    value: (props: ComponentProps<typeof ActualRNFlatList>) => 
      <ActualRNFlatList {...props} initialNumToRender={props.data?.length} />,
    // let the FlatList property be assigned, deleted and redefined so that Jest can reset the mocks as needed
    writable: true,
    configurable: true,
  });

  return ActualRN;
});

import { useDiveSiteList, useDiveSiteIsLoading, useDiveSiteActions } from '@/src/store/useDiveSiteStore';
import SpotListScreen from '@/app/(tabs)/my-spots/index';

import { getRandomArrayElements } from '@/src/utils/getRandomArrayElements';
import redSeaMock from "@/mocks/diveSites/redSea"

// Define mock data for testing, with sub-sampling for speed
// ( if you're trying snapshot testing and they fail, this is why )
const mockDiveSites: DiveSite[] = getRandomArrayElements(redSeaMock.result.elements, 40);

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

  describe('the populated state', () => {
    beforeEach(() => {
      // Set the mock implementations
      (useDiveSiteList as jest.Mock).mockReturnValue(mockDiveSites);
      (useDiveSiteIsLoading as jest.Mock).mockReturnValue(false);
      (useDiveSiteActions as jest.Mock).mockReturnValue({ loadDiveSites: jest.fn() });
    });

    it('should display a list of elements', () => {
      render(<SpotListScreen />);
      expect(screen.getAllByTestId('dive-spot-item')).toBeTruthy;
    });

    it('should display a list of elements of the expected length', () => {
      render(<SpotListScreen />);
      expect(screen.getByRole('list')).toHaveProp("data", mockDiveSites);
      expect(screen.getAllByTestId('dive-spot-item')).toHaveLength(mockDiveSites.length);
    });

    it('should display a list container that has the expected accessibility attributes', () => {
      render(<SpotListScreen />);
      const list = screen.getByRole('list');
      expect(list).toBeTruthy();
      expect(list).toHaveProp('accessibilityLabel', `My dive spots, ${mockDiveSites.length} items`);
    });
  });
});
