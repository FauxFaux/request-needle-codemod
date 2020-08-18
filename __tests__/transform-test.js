'use strict';

jest.autoMockOff();
const defineTest = require('jscodeshift/dist/testUtils').defineTest;

describe('request to needle', () => {
  defineTest(
    __dirname,
    'transform',
    null,
    'typescript',
    { parser: 'ts' },
    { parser: 'ts' },
  );
});
