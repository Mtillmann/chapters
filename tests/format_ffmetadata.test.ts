import {FFMetadata} from "../src/Formats/FFMetadata";
import {WebVTT} from "../src/Formats/WebVTT";
import {readFileSync} from "fs";
import {sep} from "path";


describe('FFMetadata Format Handler', () => {
    it('accepts no arguments', () => {
        expect(() => {
            FFMetadata.create();
        }).not.toThrow(TypeError);
    });

    it('fails on malformed input', () => {
        expect(() => {
            FFMetadata.create('asdf');
        }).toThrow(Error);
    });

    const content = readFileSync(module.path + sep + 'samples' + sep + 'FFMetadata.txt', 'utf-8');

    it('parses well-formed input', () => {
        expect(() => {
            FFMetadata.create(content);
        }).not.toThrow(Error);
    });

    const instance = FFMetadata.create(content);

    it('has the correct number of chapters from content', () => {
        expect(instance.chapters.length).toEqual(5);
    });

    it('has the correct title from content', () => {
        expect(instance.meta.title).toEqual('this is a episode title!');
    });

    it('has parsed the timestamps correctly', () => {
        expect(instance.chapters[0].startTime).toBe(6.202)
    });

    it('has parsed the chapter titles correctly', () => {
        expect(instance.chapters[0].title).toBe('Chapter 1 of 5')
    });

    it('exports to correct format',() => {
        expect(instance.toString().slice(0,12)).toEqual(';FFMETADATA1');
    });

    it('export includes correct timestamp',() => {
        expect(instance.toString()).toContain('658241');
    });

    it('can import previously generated export',() => {
        expect(FFMetadata.create(instance.toString()).chapters[3].endTime).toEqual(542.001);
    });

    it('can convert into other format', () => {
        expect(instance.to(WebVTT)).toBeInstanceOf(WebVTT)
    });

});
