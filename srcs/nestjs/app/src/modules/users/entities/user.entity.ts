import { Exclude } from "class-transformer";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'users' })
export class User {

    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({ unique: true })
    @Exclude()
    email: string;

    @Column({ unique: true })
    displayName: string;

}