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

describe('detection of input strings', () => {
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
        const from = initial.to(fromFormat).toString();

        formats.forEach(toFormat => {

            if (toFormat.name === fromFormat.name) {
                it(`accepts output of ${fromFormat.name} given to ${toFormat.name}`, () => {

                    expect(() => {
                        toFormat.create(from);
                    }).not.toThrow(Error);
                });
            } else {
                it(`fails detection of ${fromFormat.name} output given to ${toFormat.name}`, () => {
                    expect(() => {
                        toFormat.create(from);
                    }).toThrow(Error);
                });
            }
        })
    })

});