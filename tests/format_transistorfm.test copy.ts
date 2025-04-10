
import {readFileSync} from "fs";
import {sep} from "path";
import {TransistorFM} from "../src/Formats/TransistorFM";
import {FFMetadata} from "../src/Formats/FFMetadata";


describe('TransistorFM Format Handler', () => {
    it('accepts no arguments', () => {
        expect(() => {
            TransistorFM.create();
        }).not.toThrow(TypeError);
    });


    it('fails on malformed input', () => {
        expect(() => {
            TransistorFM.create('asdf');
        }).toThrow(Error);
    });

    const content = readFileSync(module.path + sep + 'samples' + sep + 'transistorfm-chapters.txt', 'utf-8');

    it('parses well-formed input', () => {
        expect(() => {
            TransistorFM.create(content);
        }).not.toThrow(Error);
    });

    const instance = TransistorFM.create(content);

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
        expect(instance.toString().slice(0,5)).toEqual('00:00');
    });

    console.log(instance.toString());

    it('export includes correct timestamp',() => {
        expect(instance.toString()).toContain('01:01:30');
    });

    it('can import previously generated export',() => {
        expect(Math.floor(TransistorFM.create(instance.toString()).chapters[3].startTime)).toEqual(90);
    });

    it('can convert into other format', () => {
        expect(instance.to(FFMetadata)).toBeInstanceOf(FFMetadata)
    });

});
