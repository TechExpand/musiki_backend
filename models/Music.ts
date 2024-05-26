import { Table, Model, Column, DataType, AllowNull, ForeignKey, Default, PrimaryKey } from 'sequelize-typescript';
import Sequelize from 'sequelize/types/sequelize';
import { v4 as uuidv4 } from 'uuid';
import { Artist } from './Artist';


@Table({ timestamps: true, tableName: 'music' })
export class Music extends Model {

    @PrimaryKey
    @Default(uuidv4)
    @Column(DataType.UUID)
    id!: string;

    // @Index({ name: 'email-index', type: 'UNIQUE', unique: true })
    @AllowNull(true)
    @Column(DataType.STRING)
    genre!: string;


    @AllowNull(true)
    @Column(DataType.STRING)
    artist!: string;




    @AllowNull(true)
    @Column(DataType.TEXT)
    imageBuffer!: string;


    @AllowNull(true)
    @Column(DataType.STRING)
    title!: string;


    @AllowNull(true)
    @Column(DataType.STRING)
    url!: string;



    @AllowNull(true)
    @Column(DataType.STRING)
    trackNumber!: string;


    @AllowNull(true)
    @Column(DataType.STRING)
    year!: string;


    @AllowNull(true)
    @Column(DataType.STRING)
    length!: string;



    @AllowNull(true)
    @Column(DataType.STRING)
    comment!: string;



    @AllowNull(true)
    @Column(DataType.STRING)
    composer!: string;



    @AllowNull(true)
    @Column(DataType.STRING)
    album!: string;


    @Default(0)
    @AllowNull(true)
    @Column(DataType.INTEGER)
    views!: number;



    @ForeignKey(() => Artist)
    @AllowNull(false)
    @Column(DataType.UUID)
    artistId!: string;
}

