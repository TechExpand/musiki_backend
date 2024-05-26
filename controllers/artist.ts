
import { TOKEN_SECRET, createRandomRef, errorResponse, handleResponse, randomId, saltRounds, successResponse, validateEmail } from "../helpers/utility";
import { Request, Response } from 'express';
const cloudinary = require("cloudinary").v2;
import { Sequelize } from "sequelize-typescript";
import { Artist } from "../models/Artist";
import { uploadCloud } from "../helpers/upload";
import { Music } from "../models/Music";
import { MusicAlbum } from "../models/Albulm";



export const createArtist = async (req: Request, res: Response) => {
    const { artistName, country, about } = req.body;
    const { id } = req.user;
    const file = req.file
    const artist = await Artist.findOne({ where: { userId: id } })
    if (artist) return errorResponse(res, "Artist already exist")
    if (file) {
        const result = await uploadCloud(file.path.replace(/ /g, "_"));
        const createArtist = await Artist.create({ artistName, country, avatar: result.secure_url, about, userId: id })
        return successResponse(res, "Successful", createArtist)
    } else {
        const createArtist = await Artist.create({ artistName, country, avatar: "", about, userId: id })
        return successResponse(res, "Successful", createArtist)
    }
}




export const fetchArtist = async (req: Request, res: Response) => {
    const { id } = req.user;
    const artist = await Artist.findOne({ where: { userId: id } })
    if (!artist) return errorResponse(res, "Artist doesn't exist")
    return successResponse(res, "Successful", artist)
}



export const fetchArtistMusic = async (req: Request, res: Response) => {
    const { id } = req.user;
    const artist = await Artist.findOne({ where: { userId: id } })
    if (!artist) return errorResponse(res, "Artist doesn't exist")
    const music = await Music.findAll({ where: { artistId: artist?.id } })
    return successResponse(res, "Successful", music)
}




export const fetchArtistMusicById = async (req: Request, res: Response) => {
    const { id } = req.query;
    const artist = await Artist.findOne({ where: { userId: id } })
    if (!artist) return errorResponse(res, "Artist doesn't exist")
    const music = await Music.findAll({ where: { artistId: artist?.id } })
    return successResponse(res, "Successful", music)
}



export const createAlbum = async (req: Request, res: Response) => {
    const { musicId, artistId } = req.body;
    const checkExist = await MusicAlbum.findOne({ where: { musicId, artistId } })
    if (checkExist) return errorResponse(res, "Music already exist in album")
    const createMusicPlaylist = await MusicAlbum.create({
        musicId, artistId,
    })
    return successResponse(res, "Successful", createMusicPlaylist)
}
