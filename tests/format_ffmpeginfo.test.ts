
import {readFileSync} from "fs";
import {sep} from "path";
import {FFMetadata} from "../src/Formats/FFMetadata";
import {FFMpegInfo} from "../src/Formats/FFMpegInfo";


describe('ffmpeginfo Format Handler', () => {
    it('accepts no arguments', () => {
        expect(() => {
            FFMpegInfo.create();
        }).not.toThrow(TypeError);
    });

    it('fails on malformed input', () => {
        expect(() => {
            FFMpegInfo.create('asdf');
        }).toThrow(Error);
    });

    const content = readFileSync(module.path + sep + 'samples' + sep + 'ffmpeginfo.txt', 'utf-8');

    it('parses well-formed input', () => {
        expect(() => {
            FFMpegInfo.create(content);
        }).not.toThrow(Error);
    });

    const instance = FFMpegInfo.create(content);

    it('has the correct number of chapters from content', () => {
        expect(instance.chapters.length).toEqual(71);
    });

    it('has parsed the timestamps correctly', () => {
        expect(instance.chapters[0].startTime).toBe(6.202)
    });

    it('has parsed the chapter titles correctly', () => {
        instance.rebuildChapterTitles();
        expect(instance.chapters[0].title).toBe('Chapter 1 of 71')
    });

    it('does not export at all',() => {
        expect(() => {
            instance.toString()
        }).toThrow(Error);
    });

    it('can convert into other format', () => {
        expect(instance.to(FFMetadata)).toBeInstanceOf(FFMetadata)
    });

});
