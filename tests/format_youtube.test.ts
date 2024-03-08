
import {readFileSync} from "fs";
import {sep} from "path";
import {Youtube} from "../src/Formats/Youtube";
import {FFMetadata} from "../src/Formats/FFMetadata";


describe('Youtube Format Handler', () => {
    it('accepts no arguments', () => {
        expect(() => {
            Youtube.create();
        }).not.toThrow(TypeError);
    });


    it('fails on malformed input', () => {
        expect(() => {
            Youtube.create('asdf');
        }).toThrow(Error);
    });

    const content = readFileSync(module.path + sep + 'samples' + sep + 'youtube-chapters.txt', 'utf-8');

    it('parses well-formed input', () => {
        expect(() => {
            Youtube.create(content);
        }).not.toThrow(Error);
    });

    const instance = Youtube.create(content);

    it('has the correct number of chapters from content', () => {
        expect(instance.chapters.length).toEqual(5);
    });

    it('has parsed the timestamps correctly', () => {
        expect(instance.chapters[0].startTime).toBe(0)
    });

    it('has parsed the chapter titles correctly', () => {
        expect(instance.chapters[0].title).toBe('Chapter 1 of 5')
    });

    it('exports to correct format',() => {
        expect(instance.toString().slice(0,5)).toEqual('00:00');
    });

    it('export includes correct timestamp',() => {
        expect(instance.toString()).toContain('06:16');
    });

    it('can import previously generated export',() => {
        expect(Math.floor(Youtube.create(instance.toString()).chapters[3].startTime)).toEqual(376);
    });

    it('can convert into other format', () => {
        expect(instance.to(FFMetadata)).toBeInstanceOf(FFMetadata)
    });

});
