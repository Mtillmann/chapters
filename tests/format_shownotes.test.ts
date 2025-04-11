
import {readFileSync} from "fs";
import {sep} from "path";
import {ShowNotes} from "../src/Formats/ShowNotes";
import {FFMetadata} from "../src/Formats/FFMetadata";


describe('ShowNotes Format Handler', () => {
    it('accepts no arguments', () => {
        expect(() => {
            ShowNotes.create();
        }).not.toThrow(TypeError);
    });


    it('fails on malformed input', () => {
        expect(() => {
            ShowNotes.create('asdf');
        }).toThrow(Error);
    });

    const content = readFileSync(module.path + sep + 'samples' + sep + 'shownotes-chapters.txt', 'utf-8');

    it('parses well-formed input', () => {
        expect(() => {
            ShowNotes.create(content);
        }).not.toThrow(Error);
    });

    const instance = ShowNotes.create(content);

    it('has the correct number of chapters from content', () => {
        expect(instance.chapters.length).toEqual(6);
    });

    it('has parsed the timestamps correctly', () => {
        expect(instance.chapters[0].startTime).toBe(0)
    });

    it('has parsed the chapter titles correctly', () => {
        expect(instance.chapters[0].title).toBe('Welcome to the show')
    });

    it('exports to correct format',() => {
        expect(instance.toString().slice(0,7)).toEqual('(00:00)');
    });

    console.log(instance.toString());

    it('export includes correct timestamp',() => {
        expect(instance.toString()).toContain('(03:45)');
    });

    it('can import previously generated export',() => {
        expect(Math.floor(ShowNotes.create(instance.toString()).chapters[3].startTime)).toEqual(135);
    });

    it('can convert into other format', () => {
        expect(instance.to(FFMetadata)).toBeInstanceOf(FFMetadata)
    });

});
