
import { readFileSync } from "fs";
import { sep } from "path";
import { ShutterEDL } from "../src/Formats/ShutterEDL";
import { Youtube } from "../src/Formats/Youtube";


describe('ShutterEDL Format Handler', () => {
    it('accepts no arguments', () => {
        expect(() => {
            ShutterEDL.create();
        }).not.toThrow(TypeError);
    });


    it('fails on malformed input', () => {
        expect(() => {
            ShutterEDL.create('asdf');
        }).toThrow(Error);
    });

    const content = readFileSync(module.path + sep + 'samples' + sep + 'shutter.edl', 'utf-8');

    it('parses well-formed input', () => {
        expect(() => {
            ShutterEDL.create(content);
        }).not.toThrow(Error);
    });

    const instance = ShutterEDL.create(content);

    it('has the correct number of chapters from content', () => {
        expect(instance.chapters.length).toEqual(5);
    });

    it('has parsed the timestamps correctly', () => {
        expect(instance.chapters[0].startTime).toBe(0)
    });

    it('has parsed the chapter titles correctly', () => {
        expect(instance.chapters[1].title).toBe('BigBuckBunny_320x180_cut.mp4')
    });

    it('exports to correct format', () => {
        expect(instance.toString().slice(0, 6)).toEqual('TITLE:');
    });

    it('export includes correct timestamp', () => {
        expect(instance.toString()).toContain('00:00:47:17');
    });

    it('can import previously generated export', () => {
        expect(ShutterEDL.create(instance.toString()).chapters[3].startTime).toEqual(23.01);
    });

    it('can convert into other format', () => {
        expect(instance.to(Youtube)).toBeInstanceOf(Youtube)
    });

});
