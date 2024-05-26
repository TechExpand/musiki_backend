import { Table, Model, Column, DataType, AllowNull, ForeignKey, Default, PrimaryKey } from 'sequelize-typescript';
import Sequelize from 'sequelize/types/sequelize';
import { v4 as uuidv4 } from 'uuid';
import { Artist } from './Artist';
import { Playlist } from './Playlist';
import { Music } from './Music';


@Table({ timestamps: true, tableName: 'musicalbum' })
export class MusicAlbum extends Model {
    @PrimaryKey
    @Default(uuidv4)
    @Column(DataType.UUID)
    id!: string;


    @ForeignKey(() => Music)
    @AllowNull(false)
    @Column(DataType.UUID)
    musicId!: string;


    @ForeignKey(() => Artist)
    @AllowNull(false)
    @Column(DataType.UUID)
    artistId!: string;


    @Default(0)
    @AllowNull(true)
    @Column(DataType.INTEGER)
    views!: number;
}

