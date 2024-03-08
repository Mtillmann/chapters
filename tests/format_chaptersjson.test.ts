import {ChaptersJson} from "../src/Formats/ChaptersJson";
import {readFileSync} from "fs";
import {sep} from "path";
import {Youtube} from "../src/Formats/Youtube";

describe('ChaptersJson/Base Format Handler', () => {
    it('accepts no arguments', () => {
        expect(() => {
            ChaptersJson.create();
        }).not.toThrow(TypeError);
    });

    it('fails on malformed input', () => {
        expect(() => {
            ChaptersJson.create('asdf');
        }).toThrow(Error);
    });

    const content = readFileSync(module.path + sep + 'samples' + sep + 'chapters.json', 'utf-8');

    it('parses well-formed input', () => {
        expect(() => {
            ChaptersJson.create(content);
        }).not.toThrow(Error);
    });

    const instance = ChaptersJson.create(content);

    it('has the correct number of chapters from content', () => {
        expect(instance.chapters.length).toEqual(26);
    });

    it('has the correct title from content', () => {
        expect(instance.meta.title).toEqual('this is a episode title!');
    });

    it('has parsed the timestamps correctly', () => {
        expect(instance.chapters[0].startTime).toBe(6.202)
    });

    it('has parsed the chapter titles correctly', () => {
        expect(instance.chapters[0].title).toBe('Chapter 1 of 26')
    });

    it('exports to correct format',() => {
        expect(instance.toString().slice(0,1)).toEqual('{');
    });

    it('export includes correct timestamp',() => {
        expect(instance.toString()).toContain('658.242');
    });

    it('can import previously generated export',() => {
        expect(ChaptersJson.create(instance.toString()).chapters[3].endTime).toEqual(542.001);
    });

    it('can convert into other format', () => {
        expect(instance.to(Youtube)).toBeInstanceOf(Youtube)
    });

    it('fails when version is missing', () => {
        expect(() => {
            ChaptersJson.create(content.replace('version', 'missing'))
        }).toThrow(Error);
    });

    it('expands first chapter to 0', () => {
        const instance = ChaptersJson.create(content);
        instance.chapters[0].startTime = 122;
        instance.expandFirstToStart()
        expect(instance.chapters[0].startTime).toBe(0);
    });

    it('adds a chapter', () => {
        const instance = ChaptersJson.create(content);
        instance.add({
            startTime: 0,
            endTime: 1,
            title: 'new chapter'
        });
        expect(instance.chapters.length).toBe(27);
    });

    it('removes a chapter', () => {
        const instance = ChaptersJson.create(content);
        instance.remove(10);
        expect(instance.chapters.length).toBe(25);
    });

    it('applies img uri prefix', () => {
        const instance = ChaptersJson.create(content);
        instance.applyImgUri('https://example.com/');
        expect(instance.chapters[0].img).toBe('https://example.com/chapter_001.jpg');
    });

    
    it('parses absolute img uris', () => {
        const instance = ChaptersJson.create(content.replace('chapter_001.jpg', 'https://example.com/chapter_001.jpg'));
        
    
        expect(instance.chapters[0].img_type).toBe('absolute');
    });

    it('adds hashes to duplicate img uri', () => {
        const instance = ChaptersJson.create(content);
        instance.chapters[0].img_filename = 'chapter_001.jpg';
        instance.chapters[1].img_filename = 'chapter_001.jpg';
        instance.chapters[0].img_type = 'blob';
        instance.chapters[1].img_type = 'blob';
        instance.ensureUniqueFilenames();
        expect(instance.chapters[1].img_filename).not.toBe('chapter_001.jpg');
    });

    it('finds chapter index by time', () => {
        const instance = ChaptersJson.create(content);
        expect(instance.chapterIndexFromTime(250)).toBe(2);
    });

    it('finds chapter index by start time', () => {
        const instance = ChaptersJson.create(content);
        expect(instance.chapterIndexFromStartTime(231.002)).toBe(2);
    });

    it('can update chapter start times', () => {
        const instance = ChaptersJson.create(content);
        instance.updateChapterStartTime(1,'02:15');
        expect(instance.chapters[1].startTime).toBe(135);
    });

    it('cannot update chapter start times with existing time', () => {
        const instance = ChaptersJson.create(content);
        instance.updateChapterStartTime(1,'02:15');
        expect(instance.updateChapterStartTime(1,'02:15')).toBe('timeInUse');
    });

    it('will expand the duration when a chapter\'s startTime exceeds the duration', () => {
        const instance = ChaptersJson.create(content);
        instance.updateChapterStartTime(1,'122:15');
        expect(instance.duration).toBe(7335);
    });

    it('will expand the duration when a chapter\'s startTime exceeds the duration', () => {
        const instance = ChaptersJson.create(content);
        instance.updateChapterStartTime(1,7335);
        expect(instance.duration).toBe(7335);
    });

    it('will insert chapters a zero index', () => {
        const instance = ChaptersJson.create(content);
        instance.addChapterAt(0, {
            title: "inserted chapter",
        });
        expect(instance.chapters[0].title).toBe("inserted chapter");
    });

    it('will insert chapters at zero index', () => {
        const instance = ChaptersJson.create(content);
        instance.addChapterAt(0, {
            title: "inserted chapter",
        });
        expect(instance.chapters[0].title).toBe("inserted chapter");
        expect(instance.chapters.length).toBe(27);
    });


    it('will insert chapters at index outside bounds', () => {
        const instance = ChaptersJson.create(content);
        instance.addChapterAt(99, {
            title: "inserted chapter",
        });
        expect(instance.chapters.at(-1)!.title).toBe("inserted chapter");
        expect(instance.chapters.length).toBe(27);
    });

    it('will insert chapters at specified index', () => {
        const instance = ChaptersJson.create(content);
        instance.addChapterAt(4, {
            title: "inserted chapter",
        });
        expect(instance.chapters[4].title).toBe("inserted chapter");
        expect(instance.chapters.length).toBe(27);
    });

    it('will insert NEW chapters at specified index', () => {
        const instance = ChaptersJson.create(content);
        instance.addChapterAt(4);
        expect(instance.chapters.length).toBe(27);
    });

    it('will discard given startTime of chapters at specified index', () => {
        const instance = ChaptersJson.create(content);
        instance.addChapterAt(4, {
            startTime: 444,
        });
        expect(instance.chapters[4].startTime).not.toBe(444);
    });

    it('will add chapter at given time in seconds', () => {
        const instance = ChaptersJson.create(content);
        instance.addChapterAtTime(444);
        expect(instance.chapters[4].startTime).toBe(444);
    });

    it('will add chapter at given time in seconds', () => {
        const instance = ChaptersJson.create(content);
        instance.addChapterAtTime('7:24');
        expect(instance.chapters[4].startTime).toBe(444);
    });

    it('will NOT add chapter at given time twice', () => {
        const instance = ChaptersJson.create(content);
        instance.addChapterAtTime('7:24')
        expect(instance.addChapterAtTime('7:24')).toBe(false);
    });

    it('detects content', () => {
        const instance = new ChaptersJson();
        expect(instance.detect(content)).toBe(true);
    })

    it('returns false when it detects malformed content', () => {
        const instance = new ChaptersJson();
        expect(instance.detect(content.replace(":",""))).toBe(false);
    })

    it('throws when detected content doesn\'t pass', () => {
        const instance = new ChaptersJson();
        expect(instance.detect(content.replace("version","x"))).toBe(false);
    })

    it('will apply the pretty print option', () => {
        expect(instance.toString(true)).not.toEqual(instance.toString());
    });

    it('will write endTimes when requested', () => {
        const instance = ChaptersJson.create(content);
        
        expect(instance.toString(true, {writeEndTimes : false})).not.toContain('endTime');
        expect(instance.toString(true, {writeEndTimes : true})).toContain('endTime');
    });

    it('will write tocs', () => {
        const instance = ChaptersJson.create(content);
        instance.chapters[0].toc = false;        
        expect(instance.toString().includes('"toc":false')).toBeTruthy();
    });

    it('will write redundant truthy tocs', () => {

        const instance = ChaptersJson.create(content);
        instance.chapters[0].toc = true;        
        expect(instance.toString(false, {writeRedundantToc : true}).includes('"toc":true')).toBeTruthy();
    });


    it('applies img uri prefix from option', () => {
        const instance = ChaptersJson.create(content);
        
        const imagePrefix = 'https://example.com/';
        instance.chapters[0].img_type = 'relative';

        expect(instance.toString(false, {imagePrefix}).includes(imagePrefix)).toBeTruthy();
    });

});
