import { Column, DataType, Model, Table } from 'sequelize-typescript';

// Интерфейс с атрибутами, которые требуются для создания записи в БД
interface ProfileCreationAttrs {
    name: string;
    surname: string;
    middlename: string;
    user_id: number;
}

/**
 * Модель профиля пользователя
 */
@Table({ tableName: 'profiles' })
export class Profile extends Model<Profile, ProfileCreationAttrs> {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @Column({ type: DataType.STRING, allowNull: true, defaultValue: '' })
    name: string;

    @Column({ type: DataType.STRING, allowNull: true, defaultValue: '' })
    surname: string;

    @Column({ type: DataType.STRING, allowNull: true, defaultValue: '' })
    middlename: string;

    @Column({
        type: DataType.INTEGER,
        unique: true,
    })
    user_id: number;
}
