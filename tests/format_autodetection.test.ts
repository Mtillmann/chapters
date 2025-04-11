import { ChaptersJson } from "../src/Formats/ChaptersJson";
import { WebVTT } from "../src/Formats/WebVTT";
import { Youtube } from "../src/Formats/Youtube";
import { FFMetadata } from "../src/Formats/FFMetadata";
import { MatroskaXML } from "../src/Formats/MatroskaXML";
import { MKVMergeXML } from "../src/Formats/MKVMergeXML";
import { MKVMergeSimple } from "../src/Formats/MKVMergeSimple";
import { readFileSync } from "fs";
import { sep } from "path";
import { FFMpegInfo } from "../src/Formats/FFMpegInfo";
import { AutoFormat } from "../src/Formats/AutoFormat";
import { AppleChapters } from "../src/Formats/AppleChapters";
import { MP4Chaps } from "../src/Formats/MP4Chaps";
import { PodloveSimpleChapters } from "../src/Formats/PodloveSimpleChapters";
import { PySceneDetect } from "../src/Formats/PySceneDetect";
import { ShutterEDL } from "../src/Formats/ShutterEDL";
import { VorbisComment } from "../src/Formats/VorbisComment";
import { PodloveJson } from "../src/Formats/PodloveJson";
import { Scenecut } from "../src/Formats/Scenecut";
import { AppleHLS } from "../src/Formats/AppleHLS";
import { Audible } from "../src/Formats/Audible";
import { Podigee } from "../src/Formats/Podigee";
import { TransistorFM } from "../src/Formats/TransistorFM";
import { PodigeeText } from "../src/Formats/PodigeeText";
import { SpotifyA } from "../src/Formats/SpotifyA";
import { SpotifyB } from "../src/Formats/SpotifyB";
import { ShowNotes } from "../src/Formats/ShowNotes";
import { PodcastPage } from "../src/Formats/PodcastPage";

describe('autodetection of sample files', () => {

    const filesAndKeysAndHandlers = [
        ['applechapters.xml', 'applechapters', AppleChapters],
        ['applehls.json', 'applehls', AppleHLS],
        ['audible.json', 'audible', Audible],
        ['chapters.json', 'chaptersjson', ChaptersJson],
        ['FFMetadata.txt', 'ffmetadata', FFMetadata],
        ['ffmpeginfo.txt', 'ffmpeginfo', FFMpegInfo],
        ['matroska.xml', 'matroskaxml', MatroskaXML],
        ['mkvmerge.simple.txt', 'mkvmergesimple', MKVMergeSimple],
        ['mkvmerge.xml', 'mkvmergexml', MKVMergeXML],
        ['mp4chaps.txt', 'mp4chaps', MP4Chaps],
        ['podcastpage-chapters.txt', 'podcastpage', PodcastPage],
        ['podigee.json' , 'podigee', Podigee],
        ['podigeetext-chapters.txt', 'podigeetext', PodigeeText],
        ['podlove-simple-chapters.xml', 'psc', PodloveSimpleChapters],
        ['podlove.json', 'podlovejson', PodloveJson],
        ['pyscenedetect.csv', 'pyscenedetect', PySceneDetect],
        ['scenecut.json', 'scenecut', Scenecut],
        ['shutter.edl', 'shutteredl', ShutterEDL],
        ['shownotes-chapters.txt', 'shownotes', ShowNotes],
        ['spotifya-chapters.txt', 'spotifya', SpotifyA],
        ['spotifyb-chapters.txt', 'spotifyb', SpotifyB],
        //not tested here because of false positives for PodigeeText
        //['transistorfm-chapters.txt', 'transistorfm', TransistorFM],
        ['vorbiscomment.txt', 'vorbiscomment', VorbisComment],
        ['webvtt.txt', 'webvtt', WebVTT],
        ['youtube-chapters.txt', 'youtube', Youtube],        
    ];

    
    it('fails to detect on empty input', () => {
        expect(() => {
            AutoFormat.detect('');
        }).toThrow(Error);
    });

    it('rejects on invalid class key', () => {
        expect(() => {
            AutoFormat.as('asdf', 'asdf');
        }).toThrow(Error);
    });
    
    it('throws when class is not in spec', () => {
        expect(() => {
            AutoFormat.as(class{}, '');
        }).toThrow(Error);
    });


    filesAndKeysAndHandlers.forEach(item => {
        // @ts-ignore
        const [file, key, className]:[
            string,
            string,
            any
        ] = item;
        const content = readFileSync(module.path + sep + 'samples' + sep + file, 'utf-8');

        it(`${className.name} parses ${file}`, () => {
            expect(() => {
                className.create(content)
            }).not.toThrow(Error);
        });

        it(`detects ${file} and yields correct instance`, () => {
            expect(AutoFormat.from(content)).toBeInstanceOf(className);
        });

        it(`detects ${file} and yields correct class`, () => {
            expect(AutoFormat.detect(content, 'class')).toBe(className);
        });

        it(`detects ${file} and yields correct key`, () => {
            expect(AutoFormat.detect(content, 'key')).toBe(key);
        });

        it(`will yield correct instance from key`, () => {
            expect(AutoFormat.as(key, content)).toBeInstanceOf(className);
        });

        it(`will yield correct instance from class`, () => {
            expect(AutoFormat.as(className, content)).toBeInstanceOf(className);
        });

        
        filesAndKeysAndHandlers.forEach(item => {
            
            

            const className2:any = item[2];

            if(['transistorfm', 'podigeetext'].includes(String(item[1])) && ['transistorfm', 'podigeetext'].includes(key)) {
                // Skip this test for these two formats because they are too similar
                return;
            }
            if (className2 === className) {
                return;
            }

            it(`${className2.name} rejects ${file}`, () => {
                expect(() => {
                    className2.create(content)
                }).toThrow(Error);
            });

            


        })

    });

});