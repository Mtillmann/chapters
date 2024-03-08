
import { readFileSync } from "fs";
import { sep } from "path";
import { ShutterEDL } from "../src/Formats/ShutterEDL";
import { PodloveJson } from "../src/Formats/PodloveJson";


describe('PodloveJson Format Handler', () => {
    it('accepts no arguments', () => {
        expect(() => {
            PodloveJson.create();
        }).not.toThrow(TypeError);
    });


    it('fails on malformed input', () => {
        expect(() => {
            PodloveJson.create('asdf');
        }).toThrow(Error);
    });

    const content = readFileSync(module.path + sep + 'samples' + sep + 'podlove.json', 'utf-8');

    it('parses well-formed input', () => {
        expect(() => {
            PodloveJson.create(content);
        }).not.toThrow(Error);
    });

    const instance = PodloveJson.create(content);

    it('has the correct number of chapters from content', () => {
        expect(instance.chapters.length).toEqual(3);
    });

    it('has parsed the timestamps correctly', () => {
        expect(instance.chapters[1].startTime).toBe(754)
    });

    it('has parsed the chapter titles correctly', () => {
        expect(instance.chapters[0].title).toBe('Intro')
    });

    it('exports to correct format', () => {
        expect(instance.toString()).toContain('start":"');
    });

    it('export includes correct timestamp', () => {
        expect(instance.toString()).toContain('00:12:34.000');
    });

    it('can import previously generated export', () => {
        expect(PodloveJson.create(instance.toString()).chapters[2].startTime).toEqual(3723);
    });

    it('can convert into other format', () => {
        expect(instance.to(ShutterEDL)).toBeInstanceOf(ShutterEDL)
    });

    it('will apply the pretty print option', () => {
        expect(instance.toString(true)).not.toEqual(instance.toString());
    });

    it('fails on empty input array', () => {
        expect(() => {
            (new PodloveJson).from(JSON.stringify([]));
        }).toThrow(Error);
    });
});
