import { Table, Model, Column, DataType, AllowNull, Default, PrimaryKey } from 'sequelize-typescript';
import Sequelize from 'sequelize/types/sequelize';
import { v4 as uuidv4 } from 'uuid';


@Table({ timestamps: true, tableName: 'playlist' })
export class Playlist extends Model {


    @PrimaryKey
    @Default(uuidv4)
    @Column(DataType.UUID)
    id!: string;

    // @Index({ name: 'email-index', type: 'UNIQUE', unique: true })
    @AllowNull(false)
    @Column(DataType.STRING)
    name!: string;


    @AllowNull(false)
    @Column(DataType.STRING)
    url!: string;

    @Default(0)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    views!: number;


}