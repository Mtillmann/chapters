
import { readFileSync } from "fs";
import { sep } from "path";
import { AppleChapters } from "../src/Formats/AppleChapters";
import { WebVTT } from "../src/Formats/WebVTT";


describe('AppleChapters Format Handler', () => {
    it('accepts no arguments', () => {
        expect(() => {
            AppleChapters.create();
        }).not.toThrow(TypeError);
    });


    it('fails on malformed input', () => {
        expect(() => {
            AppleChapters.create('asdf');
        }).toThrow(Error);
    });

    const content = readFileSync(module.path + sep + 'samples' + sep + 'applechapters.xml', 'utf-8');


    it('parses well-formed input', () => {
        expect(() => {
            AppleChapters.create(content);
        }).not.toThrow(Error);
    });

    const instance = AppleChapters.create(content);

    it('has the correct number of chapters from content', () => {
        expect(instance.chapters.length).toEqual(4);
    });


    it('has parsed the timestamps correctly', () => {
        expect(instance.chapters[0].startTime).toBe(39.706)
    });

    it('has parsed the chapter titles correctly', () => {
        expect(instance.chapters[0].title).toBe('chapter-1')
    });

    it('exports to correct format', () => {
        expect(instance.toString().slice(0, 5)).toEqual('<?xml');
    });

    it('export includes correct timestamp', () => {
        expect(instance.toString()).toContain('39.706');
    });

    it('can import previously generated export', () => {
        expect(AppleChapters.create(instance.toString()).chapters[3].endTime!.toFixed(3)).toEqual(168.311 .toFixed(3));
    });

    it('will apply the pretty print option', () => {
        expect(instance.toString(true)).not.toEqual(instance.toString());
    });

    it('applies the text-attr option', () => {
        expect(instance.toString(false, { acUseTextAttr: true })).toContain('text="chapter-4"');
    });

    it('can convert into other format', () => {
        expect(instance.to(WebVTT)).toBeInstanceOf(WebVTT)
    });

    it('picks up text from text-attr', () => {
        expect(instance.chapters[3].title).toEqual('chapter-4');
    });

});
