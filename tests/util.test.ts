import { hash, timestampToSeconds, escapeRegExpCharacters } from "../src/util";

describe('timestampToSeconds', () => {
    it('converts timestamp with hours, minutes, seconds, and milliseconds to seconds', () => {
        const timestamp = '01:30:45.500';
        const result = timestampToSeconds(timestamp);
        expect(result).toBe(5445.5);
    });

    it('converts timestamp with minutes, seconds, and milliseconds to seconds', () => {
        const timestamp = '12:34.567';
        const result = timestampToSeconds(timestamp);
        expect(result).toBe(754.567);
    });

    it('converts timestamp with seconds and milliseconds to seconds', () => {
        const timestamp = '59.999';
        const result = timestampToSeconds(timestamp);
        expect(result).toBe(59.999);
    });

    it('converts timestamp with minutes and seconds to seconds', () => {
        const timestamp = '05:30';
        const result = timestampToSeconds(timestamp);
        expect(result).toBe(330);
    });

    it('converts timestamp with seconds to seconds', () => {
        const timestamp = '45';
        const result = timestampToSeconds(timestamp);
        expect(result).toBe(45);
    });

    it('converts timestamp with milliseconds to seconds', () => {
        const timestamp = '0.123';
        const result = timestampToSeconds(timestamp);
        expect(result).toBe(0.123);
    });

    it('converts timestamp with hours, minutes, seconds, and milliseconds to fixed string seconds', () => {
        const timestamp = '01:30:45.500';
        const result = timestampToSeconds(timestamp, true);
        expect(result).toBe(5445.500);
    });

    it('converts timestamp with minutes, seconds, and milliseconds to fixed string seconds', () => {
        const timestamp = '12:34.567';
        const result = timestampToSeconds(timestamp, true);
        expect(result).toBe(754.567);
    });

    it('converts timestamp with seconds and milliseconds to fixed string seconds', () => {
        const timestamp = '59.999';
        const result = timestampToSeconds(timestamp, true);
        expect(result).toBe(59.999);
    });

    it('converts timestamp with minutes and seconds to fixed string seconds', () => {
        const timestamp = '05:30';
        const result = timestampToSeconds(timestamp, true);
        expect(result).toBe(330.000);
    });

    it('converts timestamp with seconds to fixed string seconds', () => {
        const timestamp = '46';
        const result = timestampToSeconds(timestamp, true);
        expect(result).toBe(46.000);
    });

    it('converts timestamp with milliseconds to fixed string seconds', () => {
        const timestamp = '0.123';
        const result = timestampToSeconds(timestamp, true);
        expect(result).toBe(0.123);
    });
});

describe('hash', () => {

    it('generates a random hash string', () => {
        const result = hash();
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
    });

    it('hashes are unique', () => {
        expect(hash()).not.toBe(hash());
    });
});

describe('escapeRegExpCharacters', () => {
    it('escapes special characters in the input string', () => {
        const input = 'Hello [World]';
        const expected = 'Hello\\ \\[World\\]';
        const result = escapeRegExpCharacters(input);
        expect(result).toBe(expected);
    });

    it('does not escape non-special characters in the input string', () => {
        const input = 'Hello World';
        const expected = 'Hello\\ World';
        const result = escapeRegExpCharacters(input);
        expect(result).toBe(expected);
    });

    it('escapes all special characters in the input string', () => {
        const input = '-[\\]{}()*+?.,\\^$|# ';
        const expected = '\\-\\[\\\\\\]\\{\\}\\(\\)\\*\\+\\?\\.\\,\\\\\\^\\$\\|\\#\\ ';
        const result = escapeRegExpCharacters(input);
        expect(result).toBe(expected);
    });
});

import { enforceMilliseconds } from "../src/util";

describe('enforceMilliseconds', () => {
    it('returns the number with 3 decimal places', () => {
        const seconds = 10.123456;
        const result = enforceMilliseconds(seconds);
        expect(result).toBe(10.123);
    });

    it('returns the number with 3 decimal places when the number already has 3 decimal places', () => {
        const seconds = 5.678;
        const result = enforceMilliseconds(seconds);
        expect(result).toBe(5.678);
    });

    it('returns the number with 3 decimal places when the number has less than 3 decimal places', () => {
        const seconds = 7.89;
        const result = enforceMilliseconds(seconds);
        expect(result).toBe(7.890);
    });

    it('returns the number with 3 decimal places when the number is an integer', () => {
        const seconds = 15;
        const result = enforceMilliseconds(seconds);
        expect(result).toBe(15.000);
    });
});

import { formatBytes } from "../src/util";

describe('formatBytes', () => {
    it('returns formatted bytes with default options', () => {
        const bytes = 1024;
        const result = formatBytes(bytes);
        expect(result).toBe('1.02 kB');
    });

    it('returns formatted bytes with specified decimals', () => {
        const bytes = 1024;
        const decimals = 3;
        const result = formatBytes(bytes, decimals);
        expect(result).toBe('1.024 kB');
    });

    it('returns formatted bytes with specified format', () => {
        const bytes = 1024;
        const format = 'KiB';
        const result = formatBytes(bytes, undefined, format);
        expect(result).toBe('1.00 KiB');
    });

    it('returns formatted bytes with specified decimals and format', () => {
        const bytes = 1024;
        const decimals = 3;
        const format = 'KiB';
        const result = formatBytes(bytes, decimals, format);
        expect(result).toBe('1.000 KiB');
    });

    it('returns "0 B" for zero bytes', () => {
        const bytes = 0;
        const result = formatBytes(bytes);
        expect(result).toBe('0 B');
    });

    it('returns formatted bytes for large numbers', () => {
        const bytes = 1234567890;
        const result = formatBytes(bytes);
        expect(result).toBe('1.23 gB');
    });
}); 
import { Int } from "../src/util";

describe('Int', () => {
    it('returns the parsed integer value of a number string', () => {
        const value = '42';
        const result = Int(value);
        expect(result).toBe(42);
    });

    it('returns the parsed integer value of a number string with leading zeros', () => {
        const value = '007';
        const result = Int(value);
        expect(result).toBe(7);
    });

    it('returns the parsed integer value of a negative number string', () => {
        const value = '-10';
        const result = Int(value);
        expect(result).toBe(-10);
    });

    it('returns the default value when the input is undefined', () => {
        const value = undefined;
        const defaultValue = 5;
        const result = Int(value, defaultValue);
        expect(result).toBe(defaultValue);
    });

    it('returns the default value when the input is null', () => {
        const value = null;
        const defaultValue = 5;
        const result = Int(value, defaultValue);
        expect(result).toBe(defaultValue);
    });

    it('returns the default value when the input is NaN', () => {
        const value = 'abc';
        const defaultValue = 5;
        const result = Int(value, defaultValue);
        expect(result).toBe(defaultValue);
    });

    it('returns the default value when the input is an empty string', () => {
        const value = '';
        const defaultValue = 5;
        const result = Int(value, defaultValue);
        expect(result).toBe(defaultValue);
    });

    it('returns the default value when the input is a non-numeric string', () => {
        const value = 'hello';
        const defaultValue = 5;
        const result = Int(value, defaultValue);
        expect(result).toBe(defaultValue);
    });
}); 
import { Float } from "../src/util";

describe('Float', () => {
    it('returns the parsed float value of a number string', () => {
        const value = '3.14';
        const result = Float(value);
        expect(result).toBe(3.14);
    });

    it('returns the parsed float value of a number', () => {
        const value = 42;
        const result = Float(value);
        expect(result).toBe(42);
    });

    it('returns the default value when the input is undefined', () => {
        const value = undefined;
        const defaultValue = 10;
        const result = Float(value, defaultValue);
        expect(result).toBe(defaultValue);
    });

    it('returns the default value when the input is null', () => {
        const value = null;
        const defaultValue = 10;
        const result = Float(value, defaultValue);
        expect(result).toBe(defaultValue);
    });

    it('returns the default value when the input is NaN', () => {
        const value = NaN;
        const defaultValue = 10;
        const result = Float(value, defaultValue);
        expect(result).toBe(defaultValue);
    });

    it('returns the default value when the input is not a valid number string', () => {
        const value = 'abc';
        const defaultValue = 10;
        const result = Float(value, defaultValue);
        expect(result).toBe(defaultValue);
    });
}); 
import { Ints } from "../src/util";

describe('Ints', () => {
    it('returns an array of integers when given an array of values', () => {
        const values = [1, 2, 3, 4, 5];
        const result = Ints(values);
        expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it('returns an array of integers with default value when given an array of values with non-integer elements', () => {
        const values = [1, 2, '3', 4.5, '5'];
        const result = Ints(values);
        expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it('returns an empty array when given an empty array', () => {
        const values: unknown[] = [];
        const result = Ints(values);
        expect(result).toEqual([]);
    });

    it('returns an array of integers with default value when given an empty array', () => {
        const values: unknown[] = [];
        const defaultValue = 10;
        const result = Ints(values, defaultValue);
        expect(result).toEqual([]);
    });
}); 
import { Floats } from "../src/util";

describe('Floats', () => {
    it('returns an array of floats with default value', () => {
        const value = [1, 2, 3, 4, 5];
        const result = Floats(value);
        expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it('returns an array of floats with specified default value', () => {
        const value = [1, null, undefined, '2', 3.14];
        const defaultValue = 0;
        const result = Floats(value, defaultValue);
        expect(result).toEqual([1, 0, 0, 2, 3.14]);
    });

    it('returns an empty array when the input array is empty', () => {
        const value: unknown[] = [];
        const result = Floats(value);
        expect(result).toEqual([]);
    });
}); 
import { indenter } from "../src/util";

describe('indenter', () => {
    it('returns an input string when depth is 0', () => {
        const indent = indenter();
        const depth = 0;
        const string = 'Hello';
        const result = indent(depth, string);
        expect(result).toBe(string);
    });

    it('returns the string indented with the specified number of spaces per depth', () => {
        const indent = indenter(4);
        const depth = 2;
        const string = 'World';
        const result = indent(depth, string);
        expect(result).toBe('        World');
    });

    it('returns the string indented with the default number of spaces per depth', () => {
        const indent = indenter();
        const depth = 3;
        const string = 'Copilot';
        const result = indent(depth, string);
        expect(result).toBe('      Copilot');
    });
}); 

import { stringToLines } from "../src/util";

describe('stringToLines', () => {
    it('splits a string into an array of lines', () => {
        const input = "Hello\nWorld\n\nThis is a test\n";
        const expected = ["Hello", "World", "This is a test"];
        const result = stringToLines(input);
        expect(result).toEqual(expected);
    });

    it('trims leading and trailing whitespace from each line', () => {
        const input = "  Line 1  \n  Line 2  \n";
        const expected = ["Line 1", "Line 2"];
        const result = stringToLines(input);
        expect(result).toEqual(expected);
    });

    it('ignores empty lines', () => {
        const input = "Line 1\n\nLine 2\n\nLine 3";
        const expected = ["Line 1", "Line 2", "Line 3"];
        const result = stringToLines(input);
        expect(result).toEqual(expected);
    });

    it('returns an empty array for an empty string', () => {
        const input = "";
        const expected: string[] = [];
        const result = stringToLines(input);
        expect(result).toEqual(expected);
    });
});

import { secondsToNPT } from "../src/util";

describe('secondsToNPT', () => {
    it('returns "0" for 0 seconds', () => {
        const seconds = 0;
        const result = secondsToNPT(seconds);
        expect(result).toBe('0');
    });

    it('returns the NPT format for seconds with hours, minutes, and seconds', () => {
        const seconds = 5445.5;
        const result = secondsToNPT(seconds);
        expect(result).toBe('1:30:45.500');
    });

    it('returns the NPT format for seconds with minutes, and seconds', () => {
        const seconds = 754.567;
        const result = secondsToNPT(seconds);
        expect(result).toBe('12:34.567');
    });

    it('returns the NPT format for seconds with seconds and milliseconds', () => {
        const seconds = 59.999;
        const result = secondsToNPT(seconds);
        expect(result).toBe('59.999');
    });

    it('returns the NPT format for seconds with minutes and seconds', () => {
        const seconds = 330;
        const result = secondsToNPT(seconds);
        expect(result).toBe('5:30');
    });

    it('returns the NPT format for seconds with seconds', () => {
        const seconds = 45;
        const result = secondsToNPT(seconds);
        expect(result).toBe('45');
    });


});

import { NPTToSeconds } from "../src/util";

describe('NPTToSeconds', () => {
    it('converts NPT string to seconds', () => {
        const npt = '01:30:45.500';
        const result = NPTToSeconds(npt);
        expect(result).toBe(5445.5);
    });

    it('converts NPT string without milliseconds to seconds', () => {
        const npt = '12:34:56';
        const result = NPTToSeconds(npt);
        expect(result).toBe(45296);
    });

    it('converts NPT string with milliseconds but without hours to seconds', () => {
        const npt = '00:01.234';
        const result = NPTToSeconds(npt);
        expect(result).toBe(1.234);
    });

    it('converts NPT string with only minutes and seconds to seconds', () => {
        const npt = '05:30';
        const result = NPTToSeconds(npt);
        expect(result).toBe(330);
    });

    it('converts NPT string with only seconds to seconds', () => {
        const npt = '45';
        const result = NPTToSeconds(npt);
        expect(result).toBe(45);
    });

    it('converts NPT string with only milliseconds to seconds', () => {
        const npt = '0.123';
        const result = NPTToSeconds(npt);
        expect(result).toBe(0.123);
    });

    it('converts NPT string with leading zeros to seconds', () => {
        const npt = '00:00:01.001';
        const result = NPTToSeconds(npt);
        expect(result).toBe(1.001);
    });

    it('converts NPT string with large values to seconds', () => {
        const npt = '100:200:300.400';
        const result = NPTToSeconds(npt);
        expect(result).toBe(372300.4);
    });
});

import { secondsToTimestamp } from "../src/util";

describe('secondsToTimestamp', () => {
    it('converts seconds to timestamp without milliseconds', () => {
        const seconds = 3600;
        const result = secondsToTimestamp(seconds);
        expect(result).toBe('01:00:00');
    });

    it('converts seconds to timestamp with milliseconds', () => {
        const seconds = 3661.123;
        const result = secondsToTimestamp(seconds, { milliseconds: true });
        expect(result).toBe('01:01:01.123');
    });

    it('converts seconds to timestamp without hours', () => {
        const seconds = 120;
        const result = secondsToTimestamp(seconds, { hours: false });
        expect(result).toBe('02:00');
    });

    it('converts seconds to timestamp with hours and milliseconds', () => {
        const seconds = 7201.456;
        const result = secondsToTimestamp(seconds, { milliseconds: true });
        expect(result).toBe('02:00:01.456');
    });

    it('converts seconds to timestamp with hours and without milliseconds', () => {
        const seconds = 7201.789;
        const result = secondsToTimestamp(seconds, { milliseconds: false });
        expect(result).toBe('02:00:01');
    });
});

import { zeroPad } from "../src/util";

describe('zeroPad', () => {
    it('pads a number with leading zeros', () => {
        const num = 42;
        const result = zeroPad(num);
        expect(result).toBe('042');
    });

    it('pads a number with specified length', () => {
        const num = 7;
        const len = 5;
        const result = zeroPad(num, len);
        expect(result).toBe('00007');
    });

    it('pads a string with leading zeros', () => {
        const num = '123';
        const result = zeroPad(num);
        expect(result).toBe('123');
    });

    it('pads a string with specified length', () => {
        const num = '5';
        const len = 2;
        const result = zeroPad(num, len);
        expect(result).toBe('05');
    });
});
import { toSeconds } from "../src/util";

describe('toSeconds', () => {
    it('returns the input number when given a number', () => {
        const input = 10;
        const result = toSeconds(input);
        expect(result).toBe(input);
    });

    it('returns the converted seconds when given a timestamp string', () => {
        const input = '01:30:45.500';
        const result = toSeconds(input);
        expect(result).toBe(5445.5);
    });

    it('returns the converted seconds when given a small timestamp', () => {
        const input = '7:24';
        const result = toSeconds(input);
        expect(result).toBe(444);
    });



    it('returns the converted seconds when given a string representation of a number', () => {
        const input = '5.678';
        const result = toSeconds(input);
        expect(result).toBe(5.678);
    });
});