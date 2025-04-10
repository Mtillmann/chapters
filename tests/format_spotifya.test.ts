
import {readFileSync} from "fs";
import {sep} from "path";
import {SpotifyA} from "../src/Formats/SpotifyA";
import {FFMetadata} from "../src/Formats/FFMetadata";


describe('SpotifyA Format Handler', () => {
    it('accepts no arguments', () => {
        expect(() => {
            SpotifyA.create();
        }).not.toThrow(TypeError);
    });


    it('fails on malformed input', () => {
        expect(() => {
            SpotifyA.create('asdf');
        }).toThrow(Error);
    });

    const content = readFileSync(module.path + sep + 'samples' + sep + 'spotifya-chapters.txt', 'utf-8');

    it('parses well-formed input', () => {
        expect(() => {
            SpotifyA.create(content);
        }).not.toThrow(Error);
    });

    const instance = SpotifyA.create(content);

    it('has the correct number of chapters from content', () => {
        expect(instance.chapters.length).toEqual(15);
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
        expect(instance.toString()).toContain('01:44');
    });

    it('can import previously generated export',() => {
        expect(Math.floor(SpotifyA.create(instance.toString()).chapters[3].startTime)).toEqual(150);
    });

    it('can convert into other format', () => {
        expect(instance.to(FFMetadata)).toBeInstanceOf(FFMetadata)
    });

});
