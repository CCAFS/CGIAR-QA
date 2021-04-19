import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from "typeorm";
import { Length, IsNotEmpty } from "class-validator";

import { QAEvaluations } from "../entity/Evaluations"
import { QACommentsReplies } from "../entity/CommentsReplies"
import { QATagType } from "../entity/TagType"
import { QAUsers } from "../entity/User"
import { QAComments } from "../entity/Comments"

import { QACycle } from "./Cycles";

@Entity()
export class QATags {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => QAUsers, user => user.tags)
    user: QAUsers;

    @ManyToOne(type => QATagType, tagType => tagType.tags)
    tagType: QATagType;

    @ManyToOne(type => QAComments, comment => comment.tags)
    comment: QAComments;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;
} 