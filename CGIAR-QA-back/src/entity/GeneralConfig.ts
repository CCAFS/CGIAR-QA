import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne } from "typeorm";
import { IsNotEmpty } from "class-validator";

import { QARoles } from "@entity/Roles";

import { StatusGeneralHandler } from "@helpers/StatusGeneralHandler"

@Entity()
export class QAGeneralConfiguration {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsNotEmpty({ message: 'End date is required.' })
    end_date: Date;

    @Column()
    @IsNotEmpty({ message: 'Start date is required.' })
    start_date: Date;

    @OneToOne(type => QARoles)
    @JoinColumn()
    role: QARoles;

    @Column({
        type: "enum",
        enum: StatusGeneralHandler,
        default: StatusGeneralHandler.Open
    })
    status: StatusGeneralHandler;

    @Column("simple-json")
    reporting_guidelines: { indicator: string, pdf_url: string };

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

}