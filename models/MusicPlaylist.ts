import { Table, Model, Column, DataType, AllowNull, ForeignKey, Default, PrimaryKey, HasMany, BelongsTo } from 'sequelize-typescript';
import Sequelize from 'sequelize/types/sequelize';
import { v4 as uuidv4 } from 'uuid';
import { Artist } from './Artist';
import { Playlist } from './Playlist';
import { Music } from './Music';


@Table({ timestamps: true, tableName: 'musicplaylist' })
export class MusicPlaylist extends Model {
    @PrimaryKey
    @Default(uuidv4)
    @Column(DataType.UUID)
    id!: string;

    @ForeignKey(() => Playlist)
    @AllowNull(false)
    @Column(DataType.UUID)
    playlistId!: string;


    @ForeignKey(() => Music)
    @AllowNull(false)
    @Column(DataType.UUID)
    musicId!: string;


    @BelongsTo(() => Music, { onDelete: 'CASCADE' })
    music!: Music;
}



