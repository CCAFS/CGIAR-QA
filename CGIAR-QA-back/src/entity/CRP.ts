import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Unique } from "typeorm";
import { Length } from "class-validator";

@Entity()
@Unique(["crp_id"])
export class QACrp {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    @Column()
    @Length(2, 50)
    name: string;

    @Column({ nullable: true })
    @Length(2, 20)
    crp_id: string;

    @Column()
    @Length(2, 20)
    acronym: string;

    @Column()
    is_marlo: boolean;
}
