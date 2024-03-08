
import {readFileSync} from "fs";
import {sep} from "path";
import {MKVMergeXML} from "../src/Formats/MKVMergeXML";
import {MKVMergeSimple} from "../src/Formats/MKVMergeSimple";


describe('MKVMergeXML Format Handler', () => {
    it('accepts no arguments', () => {
        expect(() => {
            MKVMergeXML.create();
        }).not.toThrow(TypeError);
    });


    it('fails on malformed input', () => {
        expect(() => {
            MKVMergeXML.create('asdf');
        }).toThrow(Error);
    });

    const content = readFileSync(module.path + sep + 'samples' + sep + 'mkvmerge.xml', 'utf-8');

    it('parses well-formed input', () => {
        expect(() => {
            MKVMergeXML.create(content);
        }).not.toThrow(Error);
    });

    const instance = MKVMergeXML.create(content);

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
        expect(instance.toString()).toContain('00:02:11.762');
    });

    it('can import previously generated export', () => {
        expect(MKVMergeXML.create(instance.toString()).chapters[3].endTime).toEqual(542.001);
    });

    it('can convert into other format', () => {
        expect(instance.to(MKVMergeSimple)).toBeInstanceOf(MKVMergeSimple)
    });

});
