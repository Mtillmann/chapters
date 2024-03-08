
import {readFileSync} from "fs";
import {sep} from "path";
import {MatroskaXML} from "../src/Formats/MatroskaXML";
import {MKVMergeSimple} from "../src/Formats/MKVMergeSimple";


describe('MatroskaXML Format Handler', () => {
    it('accepts no arguments', () => {
        expect(() => {
            MatroskaXML.create();
        }).not.toThrow(TypeError);
    });

    

    it('fails on malformed input', () => {
        expect(() => {
            MatroskaXML.create('asdf');
        }).toThrow(Error);
    });

    const content = readFileSync(module.path + sep + 'samples' + sep + 'matroska.xml', 'utf-8');

    it('parses well-formed input', () => {
        expect(() => {
            MatroskaXML.create(content);
        }).not.toThrow(Error);
    });

    const instance = MatroskaXML.create(content);

    it('has the correct number of chapters from content', () => {
        expect(instance.chapters.length).toEqual(5);
    });


    it('has parsed the timestamps correctly', () => {
        expect(instance.chapters[0].startTime).toBe(6.202)
    });

    it('has parsed the chapter titles correctly', () => {
        expect(instance.chapters[0].title).toBe('Chapter 1 of 5')
    });

    it('exports to correct format', () => {
        expect(instance.toString().slice(0, 5)).toEqual('<?xml');
    });

    it('export includes correct timestamp', () => {
        expect(instance.toString()).toContain('376882000000');
    });

    it('can import previously generated export', () => {
        expect(MatroskaXML.create(instance.toString()).chapters[3].endTime!.toFixed(3)).toEqual(542.001 .toFixed(3));
    });

    it('can convert into other format', () => {
        expect(instance.to(MKVMergeSimple)).toBeInstanceOf(MKVMergeSimple)
    });


    it('will apply the pretty print option', () => {
        expect(instance.toString(true)).not.toEqual(instance.toString());
    });


});
