import { readFileSync } from "fs";
import { sep } from "path";
import { PodloveJson } from "../src/Formats/PodloveJson";
import { Podigee } from "../src/Formats/Podigee";


describe('Podigee Format Handler', () => {
    it('accepts no arguments', () => {
        expect(() => {
            Podigee.create();
        }).not.toThrow(TypeError);
    });


    it('fails on malformed input', () => {
        expect(() => {
            Podigee.create('asdf');
        }).toThrow(Error);
    });

    const content = readFileSync(module.path + sep + 'samples' + sep + 'podigee.json', 'utf-8');

    it('parses well-formed input', () => {
        expect(() => {
            Podigee.create(content);
        }).not.toThrow(Error);
    });

    const instance = Podigee.create(content);

    it('has the correct number of chapters from content', () => {
        expect(instance.chapters.length).toEqual(5);
    });

    it('has parsed the timestamps correctly', () => {
        expect(instance.chapters[1].startTime).toBe(112)
    });

    it('has parsed the chapter titles correctly', () => {
        expect(instance.chapters[0].title).toBe('Einleitung')
    });

    it('exports to correct format', () => {
        expect(instance.toString()).toContain('start_time":"');
    });

    it('export includes correct timestamp', () => {
        expect(instance.toString()).toContain('00:01:52');
    });

    it('can import previously generated export', () => {
        expect(Podigee.create(instance.toString()).chapters[2].startTime).toEqual(316);
    });

    it('can convert into other format', () => {
        expect(instance.to(PodloveJson)).toBeInstanceOf(PodloveJson)
    });

    it('will apply the pretty print option', () => {
        expect(instance.toString(true)).not.toEqual(instance.toString());
    });

    it('fails on empty input array', () => {
        expect(() => {
            (new Podigee).from(JSON.stringify([]));
        }).toThrow(Error);
    });
});
