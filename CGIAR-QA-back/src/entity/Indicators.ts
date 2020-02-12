import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Unique } from "typeorm";
import { Length, IsNotEmpty } from "class-validator";

@Entity()
@Unique(["name", "view_name"])
export class QAIndicators {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Length(4, 200)
    @IsNotEmpty({ message: 'The name is required' })
    name: string;

    @Column()
    @Length(4, 200)
    description: string;

    @Column()
    @Length(4, 200)
    @IsNotEmpty({ message: 'The view name is required' })
    view_name: string;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

}