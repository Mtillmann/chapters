
import { readFileSync } from "fs";
import { sep } from "path";
import { ShutterEDL } from "../src/Formats/ShutterEDL";
import { Audible } from "../src/Formats/Audible";


describe('Audible Format Handler', () => {
    it('accepts no arguments', () => {
        expect(() => {
            Audible.create();
        }).not.toThrow(TypeError);
    });


    it('fails on malformed input', () => {
        expect(() => {
            Audible.create('asdf');
        }).toThrow(Error);
    });

    const content = readFileSync(module.path + sep + 'samples' + sep + 'audible.json', 'utf-8');

    it('parses well-formed input', () => {
        expect(() => {
            Audible.create(content);
        }).not.toThrow(Error);
    });

    const instance = Audible.create(content);

    it('has the correct number of chapters from content', () => {
        expect(instance.chapters.length).toEqual(11);
    });

    it('has parsed the timestamps correctly', () => {
        expect(instance.chapters[1].startTime).toBe(15154)
    });

    it('has parsed the chapter titles correctly', () => {
        expect(instance.chapters[0].title).toBe('Opening Credits')
    });

    it('exports to correct format', () => {
        expect(instance.toString()).toContain('start_offset_ms":');
    });

    it('export includes correct timestamp', () => {
        expect(instance.toString()).toContain('35368164');
    });

    it('can import previously generated export', () => {
        expect(Audible.create(instance.toString()).chapters[2].startTime).toEqual(3466042);
    });

    it('can convert into other format', () => {
        expect(instance.to(ShutterEDL)).toBeInstanceOf(ShutterEDL)
    });

    it('will apply the pretty print option', () => {
        expect(instance.toString(true)).not.toEqual(instance.toString());
    });

    it('fails on empty input array', () => {
        expect(() => {
            (new Audible).from(JSON.stringify([]));
        }).toThrow(Error);
    });
});
