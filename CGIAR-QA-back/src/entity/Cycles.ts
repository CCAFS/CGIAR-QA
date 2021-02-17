import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { IsNotEmpty } from "class-validator";
import { QAComments } from "./Comments";

@Entity()
export class QACycle {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsNotEmpty({ message: 'End date is required.' })
    end_date: Date;

    @Column()
    @IsNotEmpty({ message: 'Start date is required.' })
    start_date: Date;

    @Column({ nullable: true })
    cycle_stage: string;
    
    @Column({ nullable: true })
    cycle_name: string;

    @OneToMany(type => QAComments, comment => comment.cycle)
    comments: QAComments

    @Column( "decimal", { precision: 10, scale: 0 })
    phase_year: number;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;
}