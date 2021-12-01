import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { IsNotEmpty } from "class-validator";
import { QAComments } from "./Comments";

@Entity()
export class QABatch {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsNotEmpty({ message: 'Submission date is required.' })
    submission_date: Date;

    @Column()
    @IsNotEmpty({ message: 'Assessors start date is required.' })
    assessors_start_date: Date;

    @Column()
    @IsNotEmpty({ message: 'Assessors end date is required.' })
    assessors_end_date: Date;
    
    @Column()
    @IsNotEmpty({ message: 'Programs start date is required.' })
    programs_start_date: Date;

    @Column()
    @IsNotEmpty({ message: 'Programs end date is required.' })
    programs_end_date: Date;
    
    @Column({ nullable: true })
    batch_name: string;

    @Column( "decimal", { precision: 10, scale: 0 })
    phase_year: number;

}