
import {readFileSync} from "fs";
import {sep} from "path";
import {PodcastPage} from "../src/Formats/PodcastPage";
import {FFMetadata} from "../src/Formats/FFMetadata";


describe('PodcastPage Format Handler', () => {
    it('accepts no arguments', () => {
        expect(() => {
            PodcastPage.create();
        }).not.toThrow(TypeError);
    });


    it('fails on malformed input', () => {
        expect(() => {
            PodcastPage.create('asdf');
        }).toThrow(Error);
    });

    const content = readFileSync(module.path + sep + 'samples' + sep + 'podcastpage-chapters.txt', 'utf-8');

    it('parses well-formed input', () => {
        expect(() => {
            PodcastPage.create(content);
        }).not.toThrow(Error);
    });

    const instance = PodcastPage.create(content);

    it('has the correct number of chapters from content', () => {
        expect(instance.chapters.length).toEqual(5);
    });

    it('has parsed the timestamps correctly', () => {
        expect(instance.chapters[0].startTime).toBe(0)
    });

    it('has parsed the chapter titles correctly', () => {
        expect(instance.chapters[0].title).toBe('Chapter 1')
    });

    it('exports to correct format',() => {
        expect(instance.toString().slice(0,7)).toEqual('(00:00)');
    });

    it('export includes correct timestamp',() => {
        expect(instance.toString()).toContain('01:01:30');
    });

    it('can import previously generated export',() => {
        expect(Math.floor(PodcastPage.create(instance.toString()).chapters[3].startTime)).toEqual(90);
    });

    it('can convert into other format', () => {
        expect(instance.to(FFMetadata)).toBeInstanceOf(FFMetadata)
    });

});
