import { Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Length, IsEmpty, IsEmail, IsNotEmpty } from "class-validator";
import * as bcrypt from "bcryptjs";

import { RolesHandler } from "../_helpers/RolesHandler";

@Entity()
@Unique(["name", "email"])
export class QAUser {
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column()
    @Length(4, 20)
    username: string;

    @Column()
    @Length(4, 20)
    @IsNotEmpty({ message: 'The name is required' })
    name: string;

    @Column()
    @IsNotEmpty({ message: 'The email is required' })
    @IsEmail({}, { message: 'Incorrect email' })
    email: string;


    @Column()
    @Length(4, 100)
    password: string;

    @Column({
        type: "enum",
        enum: RolesHandler,
        default: RolesHandler.guest
    })
    role: RolesHandler

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    @Column("simple-array", { nullable: true })
    indicators: string[];

    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8);
    }

    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
        try {
            return bcrypt.compareSync(unencryptedPassword, this.password);
        } catch (error) {
            console.log(error)
            return false;
        }
    }
}