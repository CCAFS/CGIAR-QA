import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne } from "typeorm";
import { IsNotEmpty, Length } from "class-validator";

import { QARoles } from "../entity/Roles";

import { StatusGeneralHandler } from "../_helpers/StatusGeneralHandler"
// import { QARoles } from "@entity/Roles";

// import { StatusGeneralHandler } from "@helpers/StatusGeneralHandler"

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

    @Column({default:''})
    @Length(0, 200)
    anual_report_guideline: string;

    @Column({default:''})
    @Length(0, 200)
    assessors_guideline: string;
    
    @Column({default:''})
    @Length(0, 200)
    innovations_guideline: string;
    
    @Column({default:''})
    @Length(0, 200)
    partnerships_guideline: string;
    
    @Column({default:''})
    @Length(0, 200)
    capdev_guideline: string;
    
    @Column({default:''})
    @Length(0, 200)
    peer_review_paper_guideline: string;
    
    @Column({default:''})
    @Length(0, 200)
    policies_guideline: string;
    
    @Column({default:''})
    @Length(0, 200)
    almetrics_guideline: string;
    
    @Column({default:''})
    @Length(0, 200)
    uptake_guideline: string;
    
    @Column({default:''})
    @Length(0, 200)
    oicr_guideline: string;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

}