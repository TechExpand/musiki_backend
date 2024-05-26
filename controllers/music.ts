
import { TOKEN_SECRET, createRandomRef, errorResponse, handleResponse, randomId, saltRounds, successResponse, validateEmail } from "../helpers/utility";
import { Request, Response } from 'express';
const cloudinary = require("cloudinary").v2;
import { Sequelize } from "sequelize-typescript";
import { Artist } from "../models/Artist";
import { Music } from "../models/Music";
import { arrayBufferToBase64, base64ToFile, uploadCloud } from "../helpers/upload";
const path = require('path');
const NodeID3 = require('node-id3')
const ffprobe = require('ffprobe');
const ffprobeStatic = require('ffprobe-static');


export const checkMusicInfo = async (req: Request, res: Response) => {
    const file = req.file;
    if (file) {
        try {
            const getTimestamp = await ffprobe(file.path.replace(/ /g, "_"), { path: ffprobeStatic.path })
            const durationSeconds = getTimestamp.streams[0].duration;
            // Convert the duration to minutes and seconds
            const minutes = Math.floor(durationSeconds / 60);
            const seconds = Math.floor(durationSeconds % 60);
            const getTags = await NodeID3.read(file.path.replace(/ /g, "_"))

            const arrayBuffer = new Uint8Array(getTags.image.imageBuffer).buffer;
            const base64String = arrayBufferToBase64(arrayBuffer);

            const resultbase = await base64ToFile(base64String, `./image/${randomId(5)}.jpg`);

            const data = {
                genre: getTags.genre ? getTags.genre : "",
                trackNumber: getTags.trackNumber ? getTags.trackNumber : "",
                year: getTags.year ? getTags.year : "",
                title: getTags.title ? getTags.title : "",
                artist: getTags.artist ? getTags.artist : "",
                performerInfo: getTags.performerInfo ? getTags.performerInfo.toString() : "",
                album: getTags.album ? getTags.album : "",
                // url: result.secure_url ? result.secure_url : "",
                length: `${minutes}:${seconds}` ?? "",
                imageBuffer: resultbase.secure_url ? resultbase.secure_url : "",
                comment: getTags.comment ? getTags.comment.text.toString() : "",
                composer: getTags.composer ? getTags.composer.toString() : "",
            }
            return successResponse(res, "Successful", data)
        } catch (error) {
            console.error(error);
            return errorResponse(res, "Failed", error)
        }
    } else {
        return errorResponse(res, "Failed")
    }

}




export const createMusic = async (req: Request, res: Response) => {
    const { genre, imageBuffer, title, trackNumber, year, length, comment, composer, album, artist } = req.body;
    const { id } = req.user;
    const file = req.file
    if (file) {
        const findArtist = await Artist.findOne({ where: { userId: id } })
        if (!findArtist) return errorResponse(res, "Artist not found")
        const result = await uploadCloud(file.path.replace(/ /g, "_"));
        const createMusic = await Music.create({
            genre, imageBuffer, artist, title, url: result.secure_url, trackNumber, year, length, comment, composer, album, artistId: findArtist.id
        })
        return successResponse(res, "Successful", createMusic)
    } else {
        return errorResponse(res, "Failed")
    }
}
