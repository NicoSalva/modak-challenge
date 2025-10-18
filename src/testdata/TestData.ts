// src/testdata/TestData.ts
export interface TestData {
  searchTerms: {
    valid: string[];
    invalid: string[];
  };
  expectedResults: {
    minProducts: number;
    expectedKeywords: string[];
  };
  timeouts: {
    navigation: number;
    element: number;
    assertion: number;
  };
}

export const testData: TestData = {
  searchTerms: {
    valid: ['instax mini', 'fujifilm instax', 'polaroid camera'],
    invalid: ['', '   ', 'nonexistentproduct12345']
  },
  expectedResults: {
    minProducts: 2,
    expectedKeywords: ['search', 'wholesale', 'instax']
  },
  timeouts: {
    navigation: 30000,
    element: 15000,
    assertion: 10000
  }
};
