
import { readFileSync } from "fs";
import { sep } from "path";
import { ChaptersJson } from "../src/Formats/ChaptersJson";
import { AppleHLS } from "../src/Formats/AppleHLS";


describe('AppleHLS Format Handler', () => {
    it('accepts no arguments', () => {
        expect(() => {
            AppleHLS.create();
        }).not.toThrow(TypeError);
    });


    it('fails on malformed input', () => {
        expect(() => {
            AppleHLS.create('asdf');
        }).toThrow(Error);
    });

    it('fails on empty input array', () => {
        expect(() => {
            (new AppleHLS).from(JSON.stringify([]));
        }).toThrow(Error);
    });

    const content = readFileSync(module.path + sep + 'samples' + sep + 'applehls.json', 'utf-8');

    it('parses well-formed input', () => {
        expect(() => {
            AppleHLS.create(content);
        }).not.toThrow(Error);
    });

    const instance = AppleHLS.create(content);

    it('has the correct number of chapters from content', () => {
        expect(instance.chapters.length).toEqual(4);
    });

    it('has parsed the timestamps correctly', () => {
        expect(instance.chapters[1].startTime).toBe(500.1)
    });

    it('has parsed the chapter titles correctly', () => {
        expect(instance.chapters[0].title).toBe('birth')
    });

    it('exports to correct format', () => {
        expect(instance.toString()).toContain('start-time":');
    });

    it('export includes correct timestamp', () => {
        expect(instance.toString()).toContain('1200.2');
    });

    it('can import previously generated export', () => {
        expect(AppleHLS.create(instance.toString()).chapters[2].startTime).toEqual(1200.2);
    });

    it('can convert into other format', () => {
        expect(instance.to(ChaptersJson)).toBeInstanceOf(ChaptersJson)
    });

    it('will apply the pretty print option', () => {
        expect(instance.toString(true)).not.toEqual(instance.toString());
    });

    it('will fallback to default title', () => {
        const newInstance = AppleHLS.create(instance.toString());
        expect(newInstance.chapters[3].title).toContain('Chapter 4');
    });
});
