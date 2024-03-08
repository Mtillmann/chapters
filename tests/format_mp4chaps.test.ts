
import { readFileSync } from "fs";
import { sep } from "path";
import { MP4Chaps } from "../src/Formats/MP4Chaps";
import { PodloveSimpleChapters } from "../src/Formats/PodloveSimpleChapters";
import { ChaptersJson } from "../src/Formats/ChaptersJson";


describe('MP4Chaps Format Handler', () => {

    const content = readFileSync(module.path + sep + 'samples' + sep + 'mp4chaps.txt', 'utf-8');

    it('accepts no arguments', () => {
        expect(() => {
            MP4Chaps.create();
        }).not.toThrow(TypeError);
    });


    it('fails on malformed input', () => {
        expect(() => {
            MP4Chaps.create('asdf');
        }).toThrow(Error);
    });

    it('parses well-formed input', () => {
        expect(() => {
            MP4Chaps.create(content);
        }).not.toThrow(Error);
    });



    const instance = MP4Chaps.create(content);

    it('keeps URLs intact', () => {
        expect(instance.to(ChaptersJson).toString()).toContain('https');
    });


    it('has the correct number of chapters from content', () => {
        expect(instance.chapters.length).toEqual(5);
    });

    it('has parsed the timestamps correctly', () => {
        expect(instance.chapters[0].startTime).toBe(0)
    });

    it('has parsed the chapter titles correctly', () => {
        expect(instance.chapters[0].title).toBe('Chapter 1')
    });

    it('exports to correct format', () => {
        expect(instance.toString().slice(0, 5)).toEqual('00:00');
    });

    it('export includes correct timestamp', () => {
        expect(instance.toString()).toContain('00:11:46.612');
    });

    it('can import previously generated export', () => {
        expect(MP4Chaps.create(instance.toString()).chapters[3].startTime).toEqual(2482.67);
    });

    it('can convert into other format', () => {
        expect(instance.to(PodloveSimpleChapters)).toBeInstanceOf(PodloveSimpleChapters)
    });

});
