import { Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Length, IsNotEmpty } from "class-validator";
@Entity()
export class QARoles {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Length(4, 50)
    @IsNotEmpty({ message: 'Description is required' })
    description: string;


    @Column()
    @Length(4, 10)
    @IsNotEmpty({ message: 'Acronym is required' })
    acronym: string;

    @Column()
    is_active: boolean;

}
