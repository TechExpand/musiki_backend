import { Table, Model, Column, DataType, HasOne, BelongsToMany, HasMany, AllowNull, Unique, Default, Index, BelongsTo, ForeignKey, PrimaryKey } from 'sequelize-typescript';
import Sequelize from 'sequelize/types/sequelize';
import { v4 as uuidv4 } from 'uuid';
import { Users } from './Users';

export enum UserStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    SUSPENDED = 'SUSPENDED',
}



export enum UserState {
    STEP_ONE = 'STEP_ONE',
    STEP_TWO = 'STEP_TWO',
    VERIFIED = 'VERIFIED',
}



@Table({ timestamps: true, tableName: 'artist' })
export class Artist extends Model {


    @PrimaryKey
    @Default(uuidv4)
    @Column(DataType.UUID)
    id!: string;

    // @Index({ name: 'email-index', type: 'UNIQUE', unique: true })
    // @AllowNull(false)
    // @Column(DataType.STRING)
    // email!: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    artistName!: string;


    @AllowNull(false)
    @Column(DataType.TEXT)
    country!: string;


    @AllowNull(false)
    @Column(DataType.STRING)
    avatar!: string;



    @AllowNull(false)
    @Column(DataType.STRING)
    about!: string;


    @Default(0)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    views!: number;


    @Default(UserState.STEP_TWO)
    @Column(DataType.ENUM(UserState.STEP_ONE, UserState.STEP_TWO, UserState.VERIFIED))
    status!: UserState


    @ForeignKey(() => Users)
    @AllowNull(false)
    @Column(DataType.UUID)
    userId!: string;

    // @HasMany(() => UserTokens, { onDelete: 'CASCADE' })
    // wallets!: UserTokens[];
}
