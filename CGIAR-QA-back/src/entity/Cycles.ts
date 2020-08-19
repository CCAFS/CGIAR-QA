import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { IsNotEmpty } from "class-validator";

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

    // @OneToMany(type => QAComments, comment => comment.cycle)
    // comments: QAComments

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;
}