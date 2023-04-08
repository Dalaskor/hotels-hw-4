import { Column, DataType, Model, Table } from 'sequelize-typescript';

// Интерфейс с атрибутами, которые требуются для создания записи в БД
interface UserCreationAttrs {
    email: string;
    password: string;
}

/**
 * Модель пользователя
 */
@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttrs> {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    email: string;

    @Column({ type: DataType.STRING, allowNull: false })
    password: string;
}
