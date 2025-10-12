import { afterEach, expect } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import '@testing-library/jest-dom';
import 'regenerator-runtime/runtime';

expect.extend(matchers);

afterEach(() => {
    cleanup();
});
