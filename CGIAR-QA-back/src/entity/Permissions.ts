import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Length, IsNotEmpty } from "class-validator";

@Entity()
export class QAPermissions {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Length(3, 50)
    description: string;


    @Column()
    @Length(3, 50)
    @IsNotEmpty({ message: 'Permission is required' })
    permission: string;


    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;


}
