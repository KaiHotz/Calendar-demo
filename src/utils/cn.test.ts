import { describe, expect, it } from 'vitest';

import { cn } from './cn';

describe('cn utility function', () => {
    it('should return empty string for no arguments', () => {
        const result = cn();
        expect(result).toBe('');
    });

    it('should handle single string class', () => {
        const result = cn('text-red-500');
        expect(result).toBe('text-red-500');
    });

    it('should handle multiple string classes', () => {
        const result = cn('text-red-500', 'bg-blue-100', 'p-4');
        expect(result).toBe('text-red-500 bg-blue-100 p-4');
    });

    it('should handle conditional classes with boolean values', () => {
        const isVisible = true;
        const isHidden = false;
        const result = cn('base-class', isVisible && 'conditional-class', isHidden && 'hidden-class');
        expect(result).toBe('base-class conditional-class');
    });

    it('should handle object notation for conditional classes', () => {
        const result = cn({
            'text-red-500': true,
            'text-blue-500': false,
            'bg-gray-100': true,
        });
        expect(result).toBe('text-red-500 bg-gray-100');
    });

    it('should handle array of classes', () => {
        const result = cn(['class1', 'class2', 'class3']);
        expect(result).toBe('class1 class2 class3');
    });

    it('should handle mixed types of inputs', () => {
        const result = cn(
            'base-class',
            { 'conditional-class': true, 'hidden-class': false },
            ['array-class1', 'array-class2'],
            undefined,
            null,
            'final-class',
        );
        expect(result).toBe('base-class conditional-class array-class1 array-class2 final-class');
    });

    it('should handle Tailwind CSS conflicts and merge them correctly', () => {
        const result = cn('px-2 py-1 px-3');
        // twMerge should resolve conflicts, keeping the last px value
        expect(result).toBe('py-1 px-3');
    });

    it('should merge conflicting Tailwind classes properly', () => {
        const result = cn('text-sm text-lg font-bold');
        // Should keep the last text size class
        expect(result).toBe('text-lg font-bold');
    });

    it('should handle complex Tailwind merge scenarios', () => {
        const result = cn('bg-red-500 text-white p-4', 'bg-blue-500 text-black', 'hover:bg-green-500');
        // Should merge background and text colors, keep padding and hover
        expect(result).toBe('p-4 bg-blue-500 text-black hover:bg-green-500');
    });

    it('should handle empty strings and whitespace', () => {
        const result = cn('', '  ', 'valid-class', '', 'another-class');
        expect(result).toBe('valid-class another-class');
    });

    it('should handle nested arrays and objects', () => {
        const result = cn(['base', { 'conditional': true }, ['nested-array1', 'nested-array2']]);
        expect(result).toBe('base conditional nested-array1 nested-array2');
    });

    it('should handle responsive and state variant classes', () => {
        const result = cn('text-base sm:text-lg md:text-xl', 'hover:text-blue-500 focus:text-red-500', 'dark:text-white');
        expect(result).toBe('text-base sm:text-lg md:text-xl hover:text-blue-500 focus:text-red-500 dark:text-white');
    });

    it('should handle conflicting padding classes', () => {
        const result = cn('px-2 py-1 px-3');
        // twMerge should resolve conflicts, keeping the last px value
        expect(result).toBe('py-1 px-3');
    });
});
