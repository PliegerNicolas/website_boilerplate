import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { RegistrationProvider } from "../models/enums/registration-provider.enum";
import { Exclude } from "class-transformer";

@Entity({ name: 'registration_methods' })
export class RegistrationMethod {

    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @OneToOne(() => User, (user) => user.registrationMethod, { onDelete: 'CASCADE' })
    user: User;
    
    @Column({ type: 'enum', enum: RegistrationProvider })
    provider: RegistrationProvider;

    // Password, unique id, ....
    @Exclude()
    @Column({ unique: true })
    identifier: string;

}