
import { TOKEN_SECRET, createRandomRef, errorResponse, handleResponse, randomId, saltRounds, successResponse, validateEmail } from "../helpers/utility";
import { Request, Response } from 'express';
const cloudinary = require("cloudinary").v2;
import { Sequelize } from "sequelize-typescript";
import { Artist } from "../models/Artist";
import { Music } from "../models/Music";
import { arrayBufferToBase64, base64ToFile, uploadCloud } from "../helpers/upload";
import { Playlist } from "../models/Playlist";
import { MusicPlaylist } from "../models/MusicPlaylist";
const path = require('path');
const NodeID3 = require('node-id3')
const ffprobe = require('ffprobe');
const ffprobeStatic = require('ffprobe-static');






export const createPlaylist = async (req: Request, res: Response) => {
    const { name } = req.body;
    const file = req.file
    if (file) {
        const result = await uploadCloud(file.path.replace(/ /g, "_"));
        const createPlaylist = await Playlist.create({
            name, url: result.secure_url
        })
        return successResponse(res, "Successful", createPlaylist)
    } else {
        return errorResponse(res, "Failed")
    }
}






export const addSongtoPlaylist = async (req: Request, res: Response) => {
    const { playlistId, musicId } = req.body;
    const checkExist = await MusicPlaylist.findOne({ where: { musicId, playlistId } })
    if (checkExist) return errorResponse(res, "Music already exist in playlist")
    const createMusicPlaylist = await MusicPlaylist.create({
        playlistId, musicId
    })
    return successResponse(res, "Successful", createMusicPlaylist)
}



export const fetchPlaylist = async (req: Request, res: Response) => {
    const playlist = await Playlist.findAll()
    return successResponse(res, "Successful", playlist)
}


export const fetchPlaylistMusic = async (req: Request, res: Response) => {
    const { id } = req.query
    const music = await MusicPlaylist.findAll({
        where: {
            playlistId: id
        },
        include: [{ model: Music }]
    })
    return successResponse(res, "Successful", music)
}

