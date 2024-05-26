import { Table, Model, Column, DataType, AllowNull, ForeignKey, Default, PrimaryKey } from 'sequelize-typescript';
import Sequelize from 'sequelize/types/sequelize';
import { v4 as uuidv4 } from 'uuid';
import { Music } from './Music';
import { Users } from './Users';


@Table({ timestamps: true, tableName: 'recent' })
export class Recent extends Model {
    @PrimaryKey
    @Default(uuidv4)
    @Column(DataType.UUID)
    id!: string;


    @AllowNull(true)
    @ForeignKey(() => Users)
    @Column(DataType.UUID)
    userId!: string;


    @AllowNull(true)
    @Column(DataType.STRING)
    phoneId!: string;


    @ForeignKey(() => Music)
    @AllowNull(true)
    @Column(DataType.UUID)
    musicId!: string;


}