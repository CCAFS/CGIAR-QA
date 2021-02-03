import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { Length, IsNotEmpty } from "class-validator";

import { QAEvaluations } from "../entity/Evaluations"
import { QACommentsReplies } from "../entity/CommentsReplies"
import { QAIndicatorsMeta } from "../entity/IndicatorsMeta"
import { QAUsers } from "../entity/User"
import { QACycle } from "./Cycles";
import { QATags } from "./Tags";

@Entity()
export class QAComments {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => QAEvaluations, evaluation => evaluation.comments)
    evaluation: QAEvaluations;

    @ManyToOne(type => QAIndicatorsMeta, meta => meta.comments, { nullable: true })
    meta: QAIndicatorsMeta;

    @ManyToOne(type => QAUsers, user => user.comments)
    user: QAUsers;
    
    @ManyToOne(type => QACycle, cycle => cycle.comments)
    cycle: QAUsers;

    @OneToMany(type => QACommentsReplies, comment => comment.user)
    replies: QACommentsReplies;

    // @ManyToMany(() => QATags)
    // @JoinTable({
    //     name: "qa_comment_tags", // table name for the junction table of this relation
    //     joinColumn: {
    //         name: "qa_comment",
    //         referencedColumnName: "id"
    //     },
    //     inverseJoinColumn: {
    //         name: "qa_tag",
    //         referencedColumnName: "id"
    //     }
    // })
    // tags: QATags[];

    @OneToMany(type => QATags, tag => tag.comment)
    tags: QATags[];

    @Column({
        nullable: true
    })
    approved: boolean;

    @Column({
        nullable: true
    })
    approved_no_comment: boolean;

    @Column({
        nullable: true
    })
    crp_approved: boolean;

    @Column({
        default: true
    })
    is_visible: boolean;

    @Column({
        default: false
    })
    is_deleted: boolean;

    @Column({ nullable: true, type: 'longtext' })
    // @IsNotEmpty({ message: 'Permission is required' })
    detail: string;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;
} 