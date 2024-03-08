
import { readFileSync } from "fs";
import { sep } from "path";
import { AppleHLS } from "../src/Formats/AppleHLS";
import { Scenecut } from "../src/Formats/Scenecut";


describe('Scenecut Format Handler', () => {
    it('accepts no arguments', () => {
        expect(() => {
            Scenecut.create();
        }).not.toThrow(TypeError);
    });


    it('fails on malformed input', () => {
        expect(() => {
            Scenecut.create('asdf');
        }).toThrow(Error);
    });

    it('fails on empty array', () => {
        expect(() => {
            Scenecut.create('[]');
        }).toThrow(Error);
    });

    it('fails on empty non-array structure', () => {
        expect(() => {
            Scenecut.create('{}');
        }).toThrow(Error);
    });

    const content = readFileSync(module.path + sep + 'samples' + sep + 'scenecut.json', 'utf-8');

    it('fails when pts_time is missing from one item', () => {
        expect(() => {
            Scenecut.create(content.replace('pts_time', 'asdf'));
        }).toThrow(Error);
    });

    

    it('parses well-formed input', () => {
        expect(() => {
            Scenecut.create(content);
        }).not.toThrow(Error);
    });

    const instance = Scenecut.create(content);

    it('has the correct number of chapters from content', () => {
        expect(instance.chapters.length).toEqual(3);
    });

    it('has parsed the timestamps correctly', () => {
        expect(instance.chapters[1].startTime).toBe(5.3)
    });

    it('exports to correct format', () => {
        expect(instance.toString()).toContain('pts_time":');
    });

    it('export includes correct timestamp', () => {
        expect(instance.toString()).toContain('14.06');
    });

    it('can import previously generated export', () => {
        expect(Scenecut.create(instance.toString()).chapters[2].startTime).toEqual(14.06);
    });

    it('can convert into other format', () => {
        expect(instance.to(AppleHLS)).toBeInstanceOf(AppleHLS)
    });

    it('will apply the pretty print option', () => {
        expect(instance.toString(true)).not.toEqual(instance.toString());
    });

    it('fails on empty input array', () => {
        expect(() => {
            (new Scenecut).from(JSON.stringify([]));
        }).toThrow(Error);
    });

    it('applies the framerate export option', () => {
        const instance = Scenecut.create(content);
        expect(instance.toString(false, { frameRate: 60 })).toContain('frame":318');
    });

    it('applies the ptsScale export option', () => {
        const instance = Scenecut.create(content);
        expect(instance.toString(false, { ptsScale: 1001 })).toContain('422422.000');
    });

    it('applies the score export option', () => {
        const instance = Scenecut.create(content);
        const parsed = JSON.parse(instance.toString(false, { score: 0.9 }));
        expect(parsed[0].score).toBe(0.9);
    });
});
