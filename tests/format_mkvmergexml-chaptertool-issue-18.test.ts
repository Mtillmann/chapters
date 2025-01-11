
import {readFileSync} from "fs";
import {sep} from "path";
import {MKVMergeXML} from "../src/Formats/MKVMergeXML";

describe('MKVMergeXML Format Handler --- chaptertool issue #18', () => {
    
    
    const content = readFileSync(module.path + sep + 'samples' + sep + 'mkvmerge-chaptertool-issue-18.xml', 'utf-8');

    it('parses well-formed input', () => {
        expect(() => {
            MKVMergeXML.create(content);
        }).not.toThrow(Error);
    });

    const instance = MKVMergeXML.create(content);
    
    it('has the correct number of chapters from content', () => {
        expect(instance.chapters.length).toEqual(10);
    });

    it('has parsed the timestamps correctly', () => {
        expect(instance.chapters[1].startTime).toBe(600.516)
    });


    it('has parsed the chapter titles correctly', () => {
        expect(instance.chapters[1].title).toBe('Chapter 02')
    });
});
