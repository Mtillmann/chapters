import { ChaptersJson } from "../src/Formats/ChaptersJson";
import { WebVTT } from "../src/Formats/WebVTT";
import { Youtube } from "../src/Formats/Youtube";
import { FFMetadata } from "../src/Formats/FFMetadata";
import { MatroskaXML } from "../src/Formats/MatroskaXML";
import { MKVMergeXML } from "../src/Formats/MKVMergeXML";
import { MKVMergeSimple } from "../src/Formats/MKVMergeSimple";
import { PySceneDetect } from "../src/Formats/PySceneDetect";
import { AppleChapters } from "../src/Formats/AppleChapters";
import { ShutterEDL } from "../src/Formats/ShutterEDL";
import { VorbisComment } from "../src/Formats/VorbisComment";
import { PodloveSimpleChapters } from "../src/Formats/PodloveSimpleChapters";
import { MP4Chaps } from "../src/Formats/MP4Chaps";
import { PodloveJson } from "../src/Formats/PodloveJson";
import { AppleHLS } from "../src/Formats/AppleHLS";
import { Scenecut } from "../src/Formats/Scenecut";
import { readFileSync } from "fs";
import { sep } from "path";

describe('conversions from one format to any other', () => {
    const formats = [
        ChaptersJson, WebVTT, Youtube, FFMetadata, 
        MatroskaXML, MKVMergeXML, MKVMergeSimple, 
        PySceneDetect, AppleChapters, ShutterEDL, 
        VorbisComment, PodloveSimpleChapters, MP4Chaps,
        PodloveJson, AppleHLS, Scenecut
    ];

    const content = readFileSync(module.path + sep + 'samples' + sep + 'chapters.json', 'utf-8');

    const initial = ChaptersJson.create(content);

    
    formats.forEach(fromFormat => {
        const from = initial.to(fromFormat);
        formats.forEach(toFormat => {
            const to = from.to(toFormat);
            it(`yields equal chapter count from ${fromFormat.name} to ${toFormat.name}`, () => {
                expect(from.chapters.length).toEqual(to.chapters.length);
            })

            it(`has same startTimes from ${fromFormat.name} to ${toFormat.name}`, () => {
                expect(from.chapters[0].startTime_hr).toEqual(to.chapters[0].startTime_hr);
            })
        })
    })

});